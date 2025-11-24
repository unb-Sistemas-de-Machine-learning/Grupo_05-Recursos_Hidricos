import os
import time
from typing import Dict, Any, Optional, Tuple, List
import requests
from dotenv import load_dotenv

load_dotenv()

# ===== Config base =====
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
ROUTE_SERIE_TELEMETRICA_V2 = f"{_PREFIX}/HidroinfoanaSerieTelemetricaDetalhada/v2"

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
        self.route_telemetria_v2 = ROUTE_SERIE_TELEMETRICA_V2
        # Debug flag (ativa logs verbosos quando setado no environment)
        self.debug = bool(os.getenv("HIDRO_DEBUG", "").strip())

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
            {"Unidade Federativa": uf}, {"UF": uf}, {"Uf": uf}, {"uf": uf},
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
        if not cod:
            raise ValueError("codigo_estacao vazio")

        # Normalize possible date-only variants (API costuma aceitar yyyy-MM-dd)
        def _date_only(s: str) -> str:
            if not s:
                return s
            return s.split("T")[0]

        d1_full = data_inicio
        d2_full = data_fim
        d1_date = _date_only(data_inicio)
        d2_date = _date_only(data_fim)

        # Candidate parameter name variants and param combinations to try
        code_names = [
            "codEstacao",
            "CodigoEstacao",
            "Codigo_Estacao",
            "CodigoDaEstacao",
            "Codigo_Da_Estacao",
            "codigoestacao",
        ]

        # Common extra params that some deployments require
        tipos_filtro = [None, "DATA_ULTIMA_ATUALIZACAO", "PERIODO"]

        last_js = None
        last_r = None

        for name in code_names:
            for tipo in tipos_filtro:
                # try both full datetime and date-only formats
                for (a, b) in ((d1_full, d2_full), (d1_date, d2_date)):
                    params = {name: cod, "dataInicio": a, "dataFim": b}
                    if tipo:
                        params["tipoFiltroData"] = tipo
                    try:
                        r = self.get(route, params=params)
                        js = _safe_json(r)
                        last_js = js
                        last_r = r
                        # Try to detect items in common keys (items, Items, itens)
                        items = None
                        if isinstance(js, dict):
                            for k in ("items", "Items", "itens", "Itens"):
                                v = js.get(k)
                                if v:
                                    items = v
                                    break
                        if items:
                            if self.debug:
                                print("[HIDRO DEBUG] success with params:", params)
                            return js
                        else:
                            if self.debug:
                                # show a short snippet to help debugging
                                body = str(js)[:400]
                                print(f"[HIDRO DEBUG] empty items for params={params} status={r.status_code} body={body}")
                    except requests.HTTPError as e:
                        last_r = getattr(e, "response", None)
                        if self.debug:
                            print(f"[HIDRO DEBUG] HTTPError for params={params}: {e}")
                        # try next variant
                        continue

        # No variant returned items — return last response parsed JSON if any
        if last_js is not None:
            if self.debug:
                print("[HIDRO DEBUG] no items found in any variant; returning last response")
            return last_js
        # final fallback
        return {"items": []}

    def serie_telemetrica_v2(self, codigos_estacao: List[str], data_busca: str, range_intervalo: str = "DIAS_30", tipo_filtro: str = "DATA_LEITURA") -> Dict[str, Any]:
        """
        Busca dados do endpoint de telemetria v2, que se mostrou mais confiável.
        """
        if not codigos_estacao:
            raise ValueError("A lista de códigos de estação não pode ser vazia.")

        # Converte a lista de códigos para uma string separada por vírgulas
        codigos_str = ",".join(str(c).strip() for c in codigos_estacao)

        params = {
            "Codigos_Estacoes": codigos_str,
            "Range Intervalo de busca": range_intervalo,
            "Tipo Filtro Data": tipo_filtro,
            "Data de Busca (yyyy-MM-dd)": data_busca,
        }

        if self.debug:
            print(f"[HIDRO DEBUG V2] Calling v2 endpoint with params: {params}")

        try:
            r = self.get(self.route_telemetria_v2, params=params)
            js = _safe_json(r)
            if self.debug:
                items_count = len(js.get("items", []))
                print(f"[HIDRO DEBUG V2] Success. Status: {r.status_code}, Items received: {items_count}")
            return js
        except requests.HTTPError as e:
            if self.debug:
                print(f"[HIDRO DEBUG V2] HTTPError for params={params}: {e}")
            # Retorna um dicionário com erro para o fallback poder tratar
            return {"items": [], "error": str(e)}