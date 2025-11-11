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
from hidro_api import HidroClient

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
    codigo = to_str(item.get("codigoestacao") or item.get("Codigo_Estacao") or item.get("CodigoEstacao"))
    dh     = to_str(item.get("Data_Hora_Medicao") or item.get("dataHoraMedicao") or item.get("data_medicao") or item.get("DataHora"))
    if table == "series_cota":
        val  = item.get("Cota") or item.get("Cota_Adotada") or item.get("cota")
        qual = item.get("Cota_Status") or item.get("Cota_Adotada_Status") or item.get("qualidade")
    elif table == "series_vazao":
        val  = item.get("Vazao") or item.get("Vazao_Adotada") or item.get("vazao")
        qual = item.get("Vazao_Status") or item.get("Vazao_Adotada_Status") or item.get("qualidade")
    else:
        val  = item.get("Chuva") or item.get("Chuva_Adotada") or item.get("chuva") or item.get("precipitacao")
        qual = item.get("Chuva_Status") or item.get("Chuva_Adotada_Status") or item.get("qualidade")

    if not (codigo and dh):
        return

    conn.execute(f"""
        INSERT OR IGNORE INTO {table} (codigoestacao, data_hora_medicao, valor, qualidade, raw_json)
        VALUES (?, ?, ?, ?, ?)
    """, (codigo, dh, to_float(val), to_str(qual), json.dumps(item, ensure_ascii=False)))

def log_harvest(conn, rota, codigo, d1, d2, http_status, items_count, msg=""):
    conn.execute(
        "INSERT INTO harvest_log (rota, codigoestacao, data_inicio, data_fim, ts_utc, http_status, items_count, msg) VALUES (?,?,?,?,?,?,?,?)",
        (rota, codigo, d1.isoformat(), d2.isoformat(), dt_utcnow(), http_status, items_count, msg[:500])
    )
    conn.commit()

# ---------------- API wrappers ----------------
def harvest_inventory(client: HidroClient, conn, ufs: Optional[List[str]] = None, sleep: float = 0.4):
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

def harvest_series_window(client: HidroClient, conn, rota_nome: str, rota_url: str, codigo: str, d1: dt.date, d2: dt.date, table: str):
    r = client.get(rota_url, params={
        "CodigoEstacao":   codigo,
        "CodigoDaEstacao": codigo,
        "DataInicio":      d1.isoformat(),
        "DataFim":         d2.isoformat(),
    })
    js = _safe_json(r)
    items = js.get("items") or []
    for it in items:
        store_series(conn, table, it)
    conn.commit()
    log_harvest(conn, rota_nome, codigo, d1, d2, r.status_code, len(items))

def harvest_series_period(client: HidroClient, conn, rota_nome: str, rota_url: str, table: str, codigo: str, start: dt.date, end: dt.date, sleep: float = 0.4):
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
