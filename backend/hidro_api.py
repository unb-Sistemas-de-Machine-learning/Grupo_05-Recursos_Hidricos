# -*- coding: utf-8 -*-
"""
Cliente resiliente da API HidroWebService (ANA) v1.

Destaques:
- OAuth:
    1) GET /EstacoesTelemetricas/OAUth/v1 (headers: Identificador, Senha)
    2) fallback: GET /EstacoesTelemetricas/OAUth/v1 (query: ?Identificador=&Senha=)
    3) fallback: GET /EstacoesTelemetricas/OAUth/v1/Autenticar (query) ou POST (json)
- Define ambos headers de token após autenticar:
    Authorization: Bearer <token>
    tokenautenticacao: <token>
- "Safe join" de BASE_URL + rota (não duplica /EstacoesTelemetricas).
- Inventário por UF com tentativas de chaves (UF, UF_Estacao, CodigoUF, etc.)
  e com fallback para o código IBGE da UF (ex.: DF=53) em CodigoUF.
- Séries (cota, vazão, chuva) enviam ambos nomes da estação.
"""

import os
import time
from typing import Dict, Any, Optional, List
import requests
from dotenv import load_dotenv

load_dotenv()

# =================== Config (.env) ===================
BASE_URL = os.getenv("HIDRO_BASE_URL", "https://www.ana.gov.br/hidrowebservice").rstrip("/")
HIDRO_IDENTIFICADOR = (os.getenv("HIDRO_IDENTIFICADOR", "") or os.getenv("HIDRO_IDENT", "")).strip()
HIDRO_SENHA         = (os.getenv("HIDRO_SENHA", "") or os.getenv("HIDRO_PASS", "")).strip()
HIDRO_UA            = os.getenv("HIDRO_UA", "AguaPrev/1.0 (+https://aguaprev.local)").strip()

# Rotas (não inclua /EstacoesTelemetricas no BASE_URL; o cliente faz join)
_PREFIX = "/EstacoesTelemetricas"
_PREFIX_L = _PREFIX.lower()

ROUTE_AUTH_BASE         = f"{_PREFIX}/OAUth/v1"                # GET (headers) / (query)
ROUTE_AUTH_AUTENTICAR   = f"{_PREFIX}/OAUth/v1/Autenticar"     # GET/POST (fallback)
ROUTE_INVENTARIO        = f"{_PREFIX}/HidroInventarioEstacoes/v1"
ROUTE_SERIE_COTA        = f"{_PREFIX}/HidroSerieCotas/v1"
ROUTE_SERIE_VAZAO       = f"{_PREFIX}/HidroSerieVazao/v1"
ROUTE_SERIE_CHUVA       = f"{_PREFIX}/HidroSerieChuva/v1"

DEFAULT_TIMEOUT = (15, 60)  # (connect, read)
TOKEN_TTL_SEC   = 14 * 60   # 14 min (token costuma ~15 min)

# IBGE codes por UF (fallback para CodigoUF)
UF_IBGE = {
    "AC": "12","AL":"27","AP":"16","AM":"13","BA":"29","CE":"23","DF":"53","ES":"32","GO":"52","MA":"21",
    "MT":"51","MS":"50","MG":"31","PA":"15","PB":"25","PR":"41","PE":"26","PI":"22","RJ":"33","RN":"24",
    "RO":"11","RR":"14","RS":"43","SC":"42","SE":"28","SP":"35","TO":"17"
}

def _safe_text(r: requests.Response) -> str:
    try:
        return r.text
    except Exception:
        return "<no text>"

def _safe_json(r: requests.Response) -> Any:
    try:
        return r.json()
    except Exception:
        return {"raw": _safe_text(r)}


class HidroClient:
    def __init__(self):
        if not HIDRO_IDENTIFICADOR or not HIDRO_SENHA:
            raise RuntimeError("Defina HIDRO_IDENTIFICADOR e HIDRO_SENHA no .env")

        self.base_url = BASE_URL
        self.s = requests.Session()
        self.s.headers.update({
            "Accept": "application/json",
            "User-Agent": HIDRO_UA,
        })
        self.token: Optional[str] = None
        self.token_epoch = 0.0

        # Expor rotas
        self.route_invent = ROUTE_INVENTARIO
        self.route_cotas  = ROUTE_SERIE_COTA
        self.route_vazao  = ROUTE_SERIE_VAZAO
        self.route_chuva  = ROUTE_SERIE_CHUVA

    # --------------- URL-safe join ---------------
    def _url(self, route: str) -> str:
        base = self.base_url.rstrip("/")
        r = "/" + (route or "").lstrip("/")
        # evita duplicar /EstacoesTelemetricas se já vier no BASE_URL
        if base.lower().endswith(_PREFIX_L) and r.lower().startswith(_PREFIX_L + "/"):
            r = r[len(_PREFIX):]
        return base + r

    # --------------- Token helpers ---------------
    @staticmethod
    def _extract_token(js: Any) -> Optional[str]:
        """
        Token pode vir em 'items.tokenautenticacao' (forma mais comum),
        ou com variações de capitalização; cobre os casos.
        """
        if not isinstance(js, dict):
            return None
        items = js.get("items")
        if isinstance(items, dict):
            for k in ("tokenautenticacao","tokenAutenticacao","TokenAutenticacao","access_token","token"):
                v = items.get(k)
                if isinstance(v, str) and v.strip():
                    return v.strip()
        # fallback direto na raiz
        for k in ("tokenautenticacao","tokenAutenticacao","TokenAutenticacao","access_token","token"):
            v = js.get(k)
            if isinstance(v, str) and v.strip():
                return v.strip()
        # última tentativa: normaliza para lower
        low = {str(k).lower(): v for k, v in js.items()}
        for k in ("tokenautenticacao","access_token","token"):
            v = low.get(k)
            if isinstance(v, str) and v.strip():
                return v.strip()
        return None

    def _has_valid_token(self) -> bool:
        return bool(self.token) and (time.time() - self.token_epoch) < TOKEN_TTL_SEC

    # --------------- OAuth ---------------
    def _auth(self):
        if self._has_valid_token():
            return

        # 1) GET com HEADERS no endpoint base
        url = self._url(ROUTE_AUTH_BASE)
        r = self.s.get(url, headers={"Identificador": HIDRO_IDENTIFICADOR, "Senha": HIDRO_SENHA}, timeout=DEFAULT_TIMEOUT)
        tok = None
        if r.status_code == 200:
            tok = self._extract_token(_safe_json(r))

        # 2) GET com QUERY
        if not tok:
            r = self.s.get(url, params={"Identificador": HIDRO_IDENTIFICADOR, "Senha": HIDRO_SENHA}, timeout=DEFAULT_TIMEOUT)
            if r.status_code == 200:
                tok = self._extract_token(_safe_json(r))

        # 3) GET /Autenticar com QUERY
        if not tok:
            url_auth = self._url(ROUTE_AUTH_AUTENTICAR)
            r = self.s.get(url_auth, params={"Identificador": HIDRO_IDENTIFICADOR, "Senha": HIDRO_SENHA}, timeout=DEFAULT_TIMEOUT)
            if r.status_code == 200:
                tok = self._extract_token(_safe_json(r))

        # 4) POST /Autenticar com JSON (último fallback)
        if not tok:
            r = self.s.post(url_auth, json={"Identificador": HIDRO_IDENTIFICADOR, "Senha": HIDRO_SENHA},
                            headers={"Content-Type": "application/json; charset=utf-8", **self.s.headers},
                            timeout=DEFAULT_TIMEOUT)
            if r.status_code == 200:
                tok = self._extract_token(_safe_json(r))

        if not tok:
            raise requests.HTTPError(f"Falha OAuth. status={r.status_code} url={r.url} body={_safe_text(r)}", response=r)

        # Guarda token e define headers exigidos
        self.token = tok
        self.token_epoch = time.time()
        self.s.headers.update({
            "Authorization": f"Bearer {self.token}",
            "tokenautenticacao": self.token,
        })

    # --------------- GET genérico ---------------
    def get(self, route: str, params: Dict[str, Any]) -> requests.Response:
        self._auth()
        p = dict(params or {})
        p["_"] = str(int(time.time() * 1000))  # anti-cache básico
        url = self._url(route)
        r = self.s.get(url, params=p, timeout=DEFAULT_TIMEOUT)
        if r.status_code >= 400:
            raise requests.HTTPError(f"{r.status_code} for {url} | body: {_safe_text(r)}", response=r)
        return r

    # --------------- Domínio ---------------
    def inventario_por_uf(self, uf: str) -> Dict[str, Any]:
        """
        Inventário por UF.
        A API, em algumas implantações, só aceita uma grafia específica.
        Incluímos tentativas + fallback para CodigoUF=IBGE (DF=53).
        """
        uf = (uf or "").strip().upper()
        if not uf:
            raise ValueError("UF vazio")

        candidates: List[Dict[str, Any]] = [
            {"UF": uf}, {"Uf": uf}, {"uf": uf},
            {"UF_Estacao": uf}, {"Uf_Estacao": uf}, {"uf_estacao": uf},
            {"UFEstacao": uf},
        ]
        # fallback com código IBGE
        ibge = UF_IBGE.get(uf)
        if ibge:
            candidates += [{"CodigoUF": ibge}, {"codigoUF": ibge}, {"codigoUf": ibge}]

        last_err = None
        for q in candidates:
            try:
                r = self.get(ROUTE_INVENTARIO, params=q)
                js = _safe_json(r)
                # aceita quando items existe (mesmo que vazio)
                if isinstance(js, dict) and ("items" in js):
                    return js
            except requests.HTTPError as e:
                last_err = e
                if e.response is not None and e.response.status_code == 406:
                    # tenta próxima variante
                    continue
                raise
        if last_err:
            raise last_err
        return {"items": []}

    def serie_cota(self, codigo_estacao: str, data_inicio: str, data_fim: str) -> Dict[str, Any]:
        return self._serie_generic(ROUTE_SERIE_COTA, codigo_estacao, data_inicio, data_fim)

    def serie_vazao(self, codigo_estacao: str, data_inicio: str, data_fim: str) -> Dict[str, Any]:
        return self._serie_generic(ROUTE_SERIE_VAZAO, codigo_estacao, data_inicio, data_fim)

    def serie_chuva(self, codigo_estacao: str, data_inicio: str, data_fim: str) -> Dict[str, Any]:
        return self._serie_generic(ROUTE_SERIE_CHUVA, codigo_estacao, data_inicio, data_fim)

    def _serie_generic(self, route: str, codigo_estacao: str, data_inicio: str, data_fim: str) -> Dict[str, Any]:
        """
        Envia os dois nomes de parâmetro para maximizar compatibilidade:
          - CodigoEstacao
          - CodigoDaEstacao
        """
        cod = str(codigo_estacao).strip()
        params = {# backend/hidro_api.py
import os
import time
from typing import Dict, Any, Optional, Tuple
import requests

# ===== Config base =====
BASE_URL = os.getenv("HIDRO_BASE_URL", "https://www.ana.gov.br/hidrowebservice").rstrip("/")
ROUTE_AUTH = "/EstacoesTelemetricas/OAUth/v1"
ROUTE_INVENTARIO = "/EstacoesTelemetricas/HidroInventarioEstacoes/v1"
ROUTE_SERIE_COTAS = "/EstacoesTelemetricas/HidroSerieCotas/v1"
ROUTE_SERIE_VAZAO = "/EstacoesTelemetricas/HidroSerieVazao/v1"
ROUTE_SERIE_CHUVA = "/EstacoesTelemetricas/HidroSerieChuva/v1"

IBGE_UF = {
    "AC": "12","AL": "27","AM": "13","AP": "16","BA": "29","CE": "23","DF": "53",
    "ES": "32","GO": "52","MA": "21","MG": "31","MS": "50","MT": "51","PA": "15",
    "PB": "25","PE": "26","PI": "22","PR": "41","RJ": "33","RN": "24","RO": "11",
    "RR": "14","RS": "43","SC": "42","SE": "28","SP": "35","TO": "17",
}

def _u(path: str) -> str:
    path = path.strip()
    if not path.startswith("/"):
        path = "/" + path
    return BASE_URL + path

def _safe_text(r: requests.Response) -> str:
    try:
        return r.text or ""
    except Exception:
        return ""

class HidroClient:
    """
    Client oficial para o HidroWebservice da ANA.

    Fluxo:
      1) GET /EstacoesTelemetricas/OAUth/v1 com headers:
         Identificador: <cpf/cnpj>
         Senha: <senha>
      2) Ler items.tokenautenticacao
      3) Nas demais rotas, enviar header: tokenautenticacao: <token>
    """

    def __init__(self,
                 identificador: Optional[str] = None,
                 senha: Optional[str] = None,
                 timeout: int = 40) -> None:
        self.identificador = identificador or os.getenv("HIDRO_IDENTIFICADOR", "").strip()
        self.senha = senha or os.getenv("HIDRO_SENHA", "").strip()
        self.timeout = timeout
        self.s = requests.Session()
        self._token: Optional[str] = None
        self._token_exp_epoch: float = 0.0
        self.debug = (os.getenv("LOG_HIDRO", "0").strip() == "1")

        # cabeçalhos default
        self.s.headers.update({
            "Accept": "application/json",
            "User-Agent": "AguaPrev-HidroClient/1.0 (+github.com/aguaprev)"
        })

    # ---------- Auth ----------
    def _auth(self) -> None:
        now = time.time()
        if self._token and now < self._token_exp_epoch:
            return

        if not self.identificador or not self.senha:
            raise RuntimeError("Defina HIDRO_IDENTIFICADOR e HIDRO_SENHA no seu .env")

        url = _u(ROUTE_AUTH)
        headers = {
            # conforme manual/Swagger: headers, não query
            "Identificador": self.identificador,
            "Senha": self.senha,
            # alguns ambientes são chatos com CORS/accept
            "Accept": "application/json",
        }
        if self.debug:
            print(f"[HIDRO AUTH] GET {url}")

        r = self.s.get(url, headers=headers, timeout=self.timeout)
        r.raise_for_status()
        js = r.json() if r.headers.get("content-type","").lower().startswith("application/json") else {}
        items = js.get("items") or {}

        token = items.get("tokenautenticacao") or items.get("tokenAutenticacao") or items.get("token")
        if not token:
            raise RuntimeError(f"Token não retornado. Resposta: {js}")

        self._token = token
        # Validade declarada costuma ser 15 min — guardamos 13 min p/ margem
        self._token_exp_epoch = now + (13 * 60)

        # anexamos nas próximas chamadas
        self.s.headers["tokenautenticacao"] = token
        self.s.headers["TokenAutenticacao"] = token  # variação, por segurança

        if self.debug:
            print("[HIDRO AUTH] token OK (expira em ~13 min)")

    # ---------- Request ----------
    def get(self, path: str, params: Optional[Dict[str, Any]] = None) -> requests.Response:
        self._auth()
        url = _u(path)

        q = dict(params or {})
        # normalização só onde faz sentido
        if path == ROUTE_INVENTARIO:
            # o Swagger pede exatamente 'UF' (lista AC..TO).
            # mantemos sinônimos por robustez
            uf = q.pop("UF", None) or q.pop("uf", None) or q.pop("UnidadeFederativa", None) \
                 or q.pop("unidadeFederativa", None) or q.pop("UF_Estacao", None)
            if uf:
                q["UF"] = str(uf).strip().upper()

            # também aceitamos alternativas para os outros filtros:
            cod_est = q.pop("CodigoEstacao", None) or q.pop("codigoestacao", None) \
                      or q.pop("Codigo_Estacao", None)
            if cod_est:
                q["CodigoEstacao"] = str(cod_est).strip()

            cod_bacia = q.pop("CodigoBacia", None) or q.pop("codigoBacia", None) \
                        or q.pop("Codigo_Bacia", None)
            if cod_bacia:
                q["CodigoBacia"] = str(cod_bacia).strip()

            # datas caso queira filtrar atualização
            if "DataAtualizacaoInicio" in q:
                q["DataAtualizacaoInicio"] = str(q["DataAtualizacaoInicio"]).strip()
            if "DataAtualizacaoFim" in q:
                q["DataAtualizacaoFim"] = str(q["DataAtualizacaoFim"]).strip()

        if self.debug:
            # Mostra a URL final (com query) sem vazar token
            try:
                prep = requests.Request("GET", url, params=q, headers={"Accept":"application/json"}).prepare()
                print(f"[HIDRO GET] {prep.url}")
            except Exception:
                print(f"[HIDRO GET] {url} ? {q}")

        r = self.s.get(url, params=q, timeout=self.timeout)
        if r.status_code >= 400:
            raise requests.HTTPError(f"{r.status_code} for {url} | body: {_safe_text(r)}", response=r)
        return r

    # ---------- Helpers de alto nível ----------
    def inventario_por_uf(self, uf: str) -> Dict[str, Any]:
        """
        Lista estações pela UF.
        """
        uf = (uf or "").strip().upper()
        if not uf or uf not in IBGE_UF:
            raise ValueError("UF inválida. Ex.: DF, GO, MG, ...")

        r = self.get(ROUTE_INVENTARIO, params={"UF": uf})
        return r.json()

    def series(self,
               codigo_estacao: str,
               inicio: str,
               fim: str,
               quais: Tuple[str, ...] = ("cota", "vazao", "chuva")) -> Dict[str, Any]:
        """
        Baixa séries (cota/vazao/chuva) no período (máx 366 dias por requisição).
        Data no formato yyyy-MM-dd.
        """
        codigo_estacao = str(codigo_estacao).strip()
        if not codigo_estacao:
            raise ValueError("Informe o código da estação")

        rotas = {
            "cota": ROUTE_SERIE_COTAS,
            "vazao": ROUTE_SERIE_VAZAO,
            "chuva": ROUTE_SERIE_CHUVA,
        }
        out: Dict[str, Any] = {}
        for key in quais:
            key = key.lower().strip()
            if key not in rotas:
                continue
            r = self.get(rotas[key], params={
                "CodigoEstacao": codigo_estacao,
                "DataInicio": inicio,
                "DataFim": fim,
            })
            out[key] = r.json()
        return out

            "CodigoEstacao": cod,
            "CodigoDaEstacao": cod,
            "DataInicio": data_inicio,
            "DataFim": data_fim,
        }
        r = self.get(route, params=params)
        return _safe_json(r)
