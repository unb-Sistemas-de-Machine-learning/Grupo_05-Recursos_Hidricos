# -*- coding: utf-8 -*-
"""
Ingestor HidroWeb (ANA) para SQLite (app.db):
- Cria tabelas: stations, series_cota, series_vazao, series_chuva, harvest_log.
- Salva inventário por UF (com upsert em stations).
- Salva séries de COTA/VAZAO/CHUVA em janelas de até 366 dias.
- Guarda raw_json para preservar o máximo de informação (sem ferir regras).
"""

import os
import json
import time
import sqlite3
import argparse
import datetime as dt
from typing import Dict, Any, Iterable, Tuple, Optional, List
from contextlib import closing

from dotenv import load_dotenv


load_dotenv()

DB_PATH = os.getenv("HIDRO_SQLITE_PATH", "app.db")
MAX_DAYS_PER_REQ = 366

ALL_UFS: List[str] = [
    "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
    "PA","PB","PR","PE","PI","RJ","RN","RO","RR","RS","SC","SE","SP","TO"
]

DDL = """
PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;

CREATE TABLE IF NOT EXISTS stations (
    codigoestacao TEXT PRIMARY KEY,
    estacao_nome  TEXT,
    uf            TEXT,
    municipio     TEXT,
    latitude      REAL,
    longitude     REAL,
    tipo_estacao  TEXT,
    operadora     TEXT,
    responsavel   TEXT,
    data_atualizacao TEXT
);

CREATE TABLE IF NOT EXISTS series_cota (
    codigoestacao     TEXT,
    data_hora_medicao TEXT,
    valor             REAL,
    qualidade         TEXT,
    raw_json          TEXT,
    PRIMARY KEY (codigoestacao, data_hora_medicao),
    FOREIGN KEY (codigoestacao) REFERENCES stations(codigoestacao) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS series_vazao (
    codigoestacao     TEXT,
    data_hora_medicao TEXT,
    valor             REAL,
    qualidade         TEXT,
    raw_json          TEXT,
    PRIMARY KEY (codigoestacao, data_hora_medicao),
    FOREIGN KEY (codigoestacao) REFERENCES stations(codigoestacao) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS series_chuva (
    codigoestacao     TEXT,
    data_hora_medicao TEXT,
    valor             REAL,
    qualidade         TEXT,
    raw_json          TEXT,
    PRIMARY KEY (codigoestacao, data_hora_medicao),
    FOREIGN KEY (codigoestacao) REFERENCES stations(codigoestacao) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS harvest_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rota           TEXT,
    codigoestacao  TEXT,
    data_inicio    TEXT,
    data_fim       TEXT,
    ts_utc         TEXT,
    http_status    INTEGER,
    items_count    INTEGER,
    msg            TEXT
);
"""

def open_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys=ON;")
    return conn

def init_db():
    conn = open_db()
    try:
        conn.executescript(DDL)
        conn.commit()
    finally:
        conn.close()

def to_float(x):
    try:
        return float(str(x).replace(",", "."))
    except Exception:
        return None

def to_str(x):
    return None if x is None else str(x)

def parse_date(s: str) -> dt.date:
    return dt.date.fromisoformat(s)

def chunk_period(d1: dt.date, d2: dt.date, max_days: int = MAX_DAYS_PER_REQ) -> Iterable[Tuple[dt.date, dt.date]]:
    if d2 < d1:
        d1, d2 = d2, d1
    start = d1
    while start <= d2:
        end = min(start + dt.timedelta(days=max_days - 1), d2)
        yield start, end
        start = end + dt.timedelta(days=1)

def dt_utcnow() -> str:
    return dt.datetime.utcnow().replace(microsecond=0).isoformat() + "Z"

# ---------------- Upserts ----------------
def upsert_station(conn, st: Dict[str, Any]):
    code = to_str(st.get("codigoestacao") or st.get("Codigo_Estacao") or st.get("CodigoEstacao"))
    if not code:
        return
    conn.execute("""
        INSERT INTO stations (codigoestacao, estacao_nome, uf, municipio, latitude, longitude, tipo_estacao, operadora, responsavel, data_atualizacao)
        VALUES (?,?,?,?,?,?,?,?,?,?)
        ON CONFLICT(codigoestacao) DO UPDATE SET
          estacao_nome=excluded.estacao_nome,
          uf=excluded.uf,
          municipio=excluded.municipio,
          latitude=excluded.latitude,
          longitude=excluded.longitude,
          tipo_estacao=excluded.tipo_estacao,
          operadora=excluded.operadora,
          responsavel=excluded.responsavel,
          data_atualizacao=excluded.data_atualizacao
    """, (
        code,
        to_str(st.get("Estacao_Nome") or st.get("nome")),
        to_str(st.get("UF_Estacao") or st.get("UF")),
        to_str(st.get("Municipio_Nome") or st.get("municipio")),
        to_float(st.get("Latitude")),
        to_float(st.get("Longitude")),
        to_str(st.get("Tipo_Estacao") or st.get("tipo")),
        to_str(st.get("Operadora_Sigla") or st.get("operadora")),
        to_str(st.get("Responsavel_Sigla") or st.get("responsavel")),
        to_str(st.get("Data_Ultima_Atualizacao") or st.get("dataAtualizacao")),
    ))

def store_series(conn, table: str, item: Dict[str, Any]):
    # Mapeamento de campos flexível para v1 e v2
    codigo = to_str(item.get("codigoestacao") or item.get("Codigo_Estacao") or item.get("CodigoEstacao"))
    dh     = to_str(item.get("Data_Hora_Medicao") or item.get("dataHoraMedicao") or item.get("data_medicao") or item.get("DataHora"))
    
    if table == "series_cota":
        val  = item.get("Cota") or item.get("Cota_Adotada") or item.get("cota") or item.get("Cota_Sensor")
        qual = item.get("Cota_Status") or item.get("Cota_Adotada_Status") or item.get("qualidade")
    elif table == "series_vazao":
        val  = item.get("Vazao") or item.get("Vazao_Adotada") or item.get("vazao")
        qual = item.get("Vazao_Status") or item.get("Vazao_Adotada_Status") or item.get("qualidade")
    else: # series_chuva
        val  = item.get("Chuva") or item.get("Chuva_Adotada") or item.get("chuva") or item.get("precipitacao") or item.get("Chuva_Acumulada")
        qual = item.get("Chuva_Status") or item.get("Chuva_Adotada_Status") or item.get("qualidade")

    if not (codigo and dh and val is not None):
        return

    # Use UPSERT to update existing rows on conflict (codigoestacao + data_hora_medicao)
    # This ensures we keep the most recent value/raw_json if data is refreshed.
    conn.execute(f"""
        INSERT INTO {table} (codigoestacao, data_hora_medicao, valor, qualidade, raw_json)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(codigoestacao, data_hora_medicao) DO UPDATE SET
          valor=excluded.valor,
          qualidade=excluded.qualidade,
          raw_json=excluded.raw_json
    """, (codigo, dh, to_float(val), to_str(qual), json.dumps(item, ensure_ascii=False)))

def log_harvest(conn, rota, codigo, d1, d2, http_status, items_count, msg=""):
    conn.execute(
        "INSERT INTO harvest_log (rota, codigoestacao, data_inicio, data_fim, ts_utc, http_status, items_count, msg) VALUES (?,?,?,?,?,?,?,?)",
        (rota, codigo, d1.isoformat(), d2.isoformat(), dt_utcnow(), http_status, items_count, str(msg))
    )
    conn.commit()

# ---------------- API wrappers ----------------
def harvest_inventory(client: "HidroClient", conn, ufs: Optional[List[str]] = None, sleep: float = 0.4):
    from hidro_api import HidroClient
    if ufs is None:
        env_ufs = os.getenv("HIDRO_INVENTORY_UFS", "").strip()
        if env_ufs:
            ufs = [u.strip().upper() for u in env_ufs.split(",") if u.strip()]
        else:
            ufs = ALL_UFS

    total = 0
    for uf in ufs:
        js = client.inventario_por_uf(uf)
        items = js.get("items") or []
        for st in items:
            upsert_station(conn, st)
        conn.commit()
        total += len(items)
        print(f"UF {uf}: {len(items)} estações")
        time.sleep(sleep)
    print(f"Inventário: {total} estações salvas/atualizadas.")

def harvest_series_window(client: "HidroClient", conn, rota_nome: str, rota_url: str, codigo: str, d1: dt.date, d2: dt.date, table: str):
    from hidro_api import HidroClient, _safe_json
    
    data_inicio_str = d1.isoformat()
    data_fim_str = d2.isoformat()
    items_v1 = []
    http_status = 200
    msg = "v1"

    # 1. Tenta buscar da API v1
    try:
        if table == "series_cota":
            js_v1 = client.serie_cota(codigo, data_inicio_str, data_fim_str)
        elif table == "series_vazao":
            js_v1 = client.serie_vazao(codigo, data_inicio_str, data_fim_str)
        else: # series_chuva
            js_v1 = client.serie_chuva(codigo, data_inicio_str, data_fim_str)
        
        items_v1 = js_v1.get("items") or []
    except Exception as e:
        print(f"  [AVISO] Falha na API v1 para {codigo}: {e}")
        http_status = 500 # Indica que v1 falhou
        js_v1 = {"items": []}


    # 2. Se v1 falhar ou retornar vazio, tenta o fallback para v2
    final_items = items_v1
    if not items_v1:
        msg = "v2_fallback"
        print(f"  [INFO] v1 não retornou dados para {codigo}. Tentando fallback para v2...")
        try:
            # O v2 busca por um período a partir de uma data. Vamos usar a data final da janela.
            # O range máximo do v2 é 30 dias, então ajustamos se necessário.
            delta_dias = (d2 - d1).days + 1
            range_intervalo = f"DIAS_{min(delta_dias, 30)}"

            js_v2 = client.serie_telemetrica_v2(
                codigos_estacao=[codigo],
                data_busca=d2.strftime('%Y-%m-%d'),
                range_intervalo=range_intervalo
            )
            final_items = js_v2.get("items") or []
            if "error" in js_v2:
                http_status = 500 # Indica que v2 também falhou
                msg = f"v2_fallback_error: {js_v2['error']}"

        except Exception as e:
            print(f"  [ERRO] Falha no fallback v2 para {codigo}: {e}")
            http_status = 500
            msg = f"v2_fallback_exception: {e}"


    # 3. Salva os itens obtidos (seja de v1 ou v2)
    for it in final_items:
        store_series(conn, table, it)
    conn.commit()
    log_harvest(conn, rota_nome, codigo, d1, d2, http_status, len(final_items), msg)


def harvest_series_period(client: "HidroClient", conn, rota_nome: str, rota_url: str, table: str, codigo: str, start: dt.date, end: dt.date, sleep: float = 0.4):
    for d1, d2 in chunk_period(start, end, MAX_DAYS_PER_REQ):
        harvest_series_window(client, conn, rota_nome, rota_url, codigo, d1, d2, table)
        time.sleep(sleep)

def _safe_json(r):
    try:
        return r.json()
    except Exception:
        return {"raw": _safe_text(r)}

def _safe_text(r):
    try:
        return r.text
    except Exception:
        return ""


# ---------------- Seed valid stations from JSON ----------------
def load_valid_stations_from_file(path: str) -> List[Dict[str, Any]]:
    if not os.path.exists(path):
        raise FileNotFoundError(path)
    with open(path, 'r', encoding='utf-8') as fh:
        js = json.load(fh)
    # expect a list of objects with at least 'codigo' or 'codigoestacao'
    out = []
    for o in js:
        codigo = o.get('codigo') or o.get('codigoestacao') or o.get('Codigo_Estacao')
        tipo = o.get('tipo') or o.get('tipo_estacao') or o.get('Tipo_Estacao')
        nome = o.get('nome') or o.get('estacao_nome') or o.get('Estacao_Nome') or ''
        nota = o.get('nota') or ''
        out.append({
            'codigoestacao': str(codigo).strip() if codigo is not None else '',
            'Estacao_Nome': nome,
            'Tipo_Estacao': tipo,
            'nota': nota,
            'data_atualizacao': dt_utcnow(),
        })
    return out


def seed_valid_stations(conn, json_path: str):
    """Lê o JSON de `valid_stations_df.json` e faz upsert nas stations."""
    items = load_valid_stations_from_file(json_path)
    inserted = 0
    for st in items:
        try:
            upsert_station(conn, {
                'codigoestacao': st.get('codigoestacao'),
                'Estacao_Nome': st.get('Estacao_Nome'),
                'Tipo_Estacao': st.get('Tipo_Estacao'),
                'Data_Ultima_Atualizacao': st.get('data_atualizacao')
            })
            inserted += 1
        except Exception as e:
            print(f"[WARN] falha ao seedar estação {st.get('codigoestacao')}: {e}")
    conn.commit()
    print(f"✔ Seed concluído: {inserted} estações processadas (arquivo: {json_path})")
