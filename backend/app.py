# app.py — versão estável + correções de avatar, senha e função (dropdown)
import os
from pathlib import Path
import datetime as dt
from datetime import timedelta
from typing import Dict, Any

from flask import Flask, jsonify, request, Response, url_for, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, jwt_required, get_jwt, get_jwt_identity
)
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

from db import init_db, close_db, get_db, create_or_update_admin
from auth import auth_bp

# ---- Integrações ANA (opcionais para não travar a API) ----
_ENABLE_ANA = True
_hidro_ok = False
try:
    if _ENABLE_ANA:
        from hidro_api import HidroClient  # type: ignore
        import hidro_ingest as hin         # type: ignore
        import click                       # type: ignore
        _hidro_ok = True
except Exception:
    _hidro_ok = False


# ====== Paleta inclusiva de tons (12 opções) ======
AVATAR_TONES = [
    ("tone01", "Tom 01", "#F9E0D1"),
    ("tone02", "Tom 02", "#F1C9A9"),
    ("tone03", "Tom 03", "#E5B28E"),
    ("tone04", "Tom 04", "#D49A78"),
    ("tone05", "Tom 05", "#C4835F"),
    ("tone06", "Tom 06", "#B06E4C"),
    ("tone07", "Tom 07", "#985B3E"),
    ("tone08", "Tom 08", "#804935"),
    ("tone09", "Tom 09", "#6B3C2C"),
    ("tone10", "Tom 10", "#573126"),
    ("tone11", "Tom 11", "#452720"),
    ("tone12", "Tom 12", "#351E1A"),
]
AVATAR_TONES_MAP = {t[0]: t for t in AVATAR_TONES}


def svg_avatar_hex(hex_color: str) -> str:
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160" role="img" aria-label="Avatar">
  <defs><clipPath id="r"><rect x="0" y="0" width="160" height="160" rx="24" ry="24"/></clipPath></defs>
  <g clip-path="url(#r)">
    <rect width="160" height="160" fill="#0A5C67" opacity=".08"/>
    <circle cx="80" cy="60" r="34" fill="{hex_color}"/>
    <rect x="30" y="95" width="100" height="60" rx="30" fill="{hex_color}"/>
    <circle cx="80" cy="60" r="34" fill="none" stroke="rgba(0,0,0,.12)"/>
    <rect x="30" y="95" width="100" height="60" rx="30" fill="none" stroke="rgba(0,0,0,.12)"/>
  </g>
</svg>"""


def create_app():
    load_dotenv()
    app = Flask(__name__)

    # ===== Config =====
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev-jwt-secret")
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]
    app.config["JWT_HEADER_NAME"] = "Authorization"
    app.config["JWT_HEADER_TYPE"] = "Bearer"
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(
        seconds=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", "3600"))
    )
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(
        seconds=int(os.getenv("JWT_REFRESH_TOKEN_EXPIRES", "2592000"))
    )

    # uploads locais
    backend_root = Path(app.root_path)
    upload_dir = backend_root / "uploads" / "avatars"
    upload_dir.mkdir(parents=True, exist_ok=True)
    app.config["UPLOAD_FOLDER"] = str(upload_dir)
    app.config["MAX_CONTENT_LENGTH"] = int(os.getenv("MAX_AVATAR_MB", "5")) * 1024 * 1024

    ALLOWED_AVATAR_EXT = {"png", "jpg", "jpeg", "webp", "gif"}
    def _allowed_avatar(filename: str) -> bool:
        return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_AVATAR_EXT

    # ===== CORS =====
    origins = os.getenv("CORS_ORIGINS", "*")
    CORS(app, resources={r"/*": {"origins": origins, "supports_credentials": False}})

    # ===== DB lifecycle =====
    app.teardown_appcontext(close_db)

    # ===== JWT =====
    jwt = JWTManager(app)

    @jwt.unauthorized_loader
    def _unauthorized(msg):
        return jsonify({"error": "unauthorized", "message": msg}), 401

    @jwt.invalid_token_loader
    def _invalid_token(msg):
        return jsonify({"error": "invalid_token", "message": msg}), 422

    @jwt.expired_token_loader
    def _expired(jwt_header, jwt_payload):
        return jsonify({"error": "token_expired"}), 401

    @jwt.revoked_token_loader
    def _revoked(jwt_header, jwt_payload):
        return jsonify({"error": "token_revoked"}), 401

    @jwt.needs_fresh_token_loader
    def _fresh_required(jwt_header, jwt_payload):
        return jsonify({"error": "fresh_token_required"}), 401

    # ===== Blueprints =====
    app.register_blueprint(auth_bp)

    # ===== Helpers =====
    def _jwt_user_id() -> int:
        identity = get_jwt_identity()
        return int(identity)  # lança exceção se não for número

    def _column_exists(table: str, column: str) -> bool:
        db = get_db()
        try:
            cur = db.execute(f"PRAGMA table_info({table})")
            cols = [r["name"] for r in cur.fetchall()]
            return column in cols
        except Exception:
            return False

    # ===== Health =====
    @app.get("/health")
    def health():
        return jsonify({"status": "ok"}), 200

    # ===== Avatares (paleta SVG) =====
    @app.get("/avatars")
    def list_avatars():
        items = [
            {
                "id": i,
                "label": lbl,
                "url": url_for("avatar_svg", avatar_id=i, _external=True),
            }
            for (i, lbl, _hex) in AVATAR_TONES
        ]
        return jsonify({"items": items}), 200

    @app.get("/avatars/svg/<avatar_id>.svg")
    def avatar_svg(avatar_id: str):
        tone = AVATAR_TONES_MAP.get(avatar_id)
        if not tone:
            return jsonify({"error": "avatar não encontrado"}), 404
        _id, _label, hex_color = tone
        svg = svg_avatar_hex(hex_color)
        return Response(svg, mimetype="image/svg+xml")

    # ===== Arquivos de avatar enviados (imagens reais) =====
    @app.get("/uploads/avatars/<path:filename>")
    def serve_avatar_file(filename: str):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename, as_attachment=False)

    # ===== Perfil =====
    @app.get("/me")
    @jwt_required()
    def me():
        try:
            user_id = _jwt_user_id()
        except Exception:
            return jsonify({"error": "invalid_token"}), 422

        db = get_db()
        row = db.execute("SELECT * FROM users WHERE id=?", (user_id,)).fetchone()
        if not row:
            return jsonify({"error": "Usuário não encontrado"}), 404

        return jsonify({
            "user": {
                "id": row["id"],
                "email": row["email"],
                "name": row["name"],
                "role": row["role"],
                "avatar": row["avatar"],
                "created_at": row["created_at"],
                "updated_at": row["updated_at"],
            }
        }), 200

    @app.post("/users/me/avatar-select")
    @jwt_required()
    def select_avatar():
        data = request.get_json(silent=True) or {}
        avatar_id = (data.get("id") or "").strip()
        if avatar_id not in AVATAR_TONES_MAP:
            return jsonify({"error": "avatar inválido"}), 400

        try:
            user_id = _jwt_user_id()
        except Exception:
            return jsonify({"error": "invalid_token"}), 422

        avatar_url_abs = url_for("avatar_svg", avatar_id=avatar_id, _external=True)

        db = get_db()
        db.execute("UPDATE users SET avatar = ? WHERE id = ?", (avatar_url_abs, user_id))
        db.commit()

        row = db.execute("""
            SELECT id, name, email, role, avatar, created_at, updated_at
            FROM users WHERE id = ?
        """, (user_id,)).fetchone()
        return jsonify({"message": "Avatar definido", "user": dict(row)}), 200

    @app.post("/users/me/avatar-upload")
    @jwt_required()
    def avatar_upload():
        if "file" not in request.files:
            return jsonify({"error": "arquivo ausente (campo 'file')"}), 400
        f = request.files["file"]
        if not f or not f.filename:
            return jsonify({"error": "arquivo inválido"}), 400
        if not _allowed_avatar(f.filename):
            return jsonify({"error": "extensão não permitida"}), 400

        try:
            user_id = _jwt_user_id()
        except Exception:
            return jsonify({"error": "invalid_token"}), 422

        fn = secure_filename(f"{user_id}_{f.filename}")
        dst = Path(app.config["UPLOAD_FOLDER"]) / fn
        f.save(dst)

        public_url = url_for("serve_avatar_file", filename=fn, _external=True)

        db = get_db()
        db.execute("UPDATE users SET avatar = ? WHERE id = ?", (public_url, user_id))
        db.commit()

        row = db.execute(
            "SELECT id, name, email, role, avatar, created_at, updated_at FROM users WHERE id=?",
            (user_id,),
        ).fetchone()
        return jsonify({"message": "Avatar atualizado", "user": dict(row)}), 200

    @app.post("/users/me/password-change")
    @jwt_required()
    def password_change():
        data = request.get_json(silent=True) or {}
        current_password = (data.get("current_password") or "").strip()
        new_password = (data.get("new_password") or "").strip()

        if len(new_password) < 8:
            return jsonify({"error": "Nova senha deve ter ao menos 8 caracteres"}), 400

        try:
            user_id = _jwt_user_id()
        except Exception:
            return jsonify({"error": "invalid_token"}), 422

        db = get_db()
        row = db.execute("SELECT id, password_hash FROM users WHERE id=?", (user_id,)).fetchone()
        if not row:
            return jsonify({"error": "Usuário não encontrado"}), 404

        if not row["password_hash"]:
            return jsonify({"error": "Conta sem senha definida"}), 400

        if not check_password_hash(row["password_hash"], current_password):
            return jsonify({"error": "Senha atual incorreta"}), 400

        new_hash = generate_password_hash(new_password)
        db.execute("UPDATE users SET password_hash=?, updated_at=CURRENT_TIMESTAMP WHERE id=?", (new_hash, user_id))
        db.commit()
        return jsonify({"message": "Senha atualizada com sucesso"}), 200

    @app.post("/users/me/profile")
    @jwt_required()
    def update_profile():
        """
        Atualiza campos básicos do perfil. Só atualiza colunas que EXISTEM na tabela 'users'.
        Campos aceitos no JSON: name, role, organization, phone, lang, dark_mode, avatar (opcional).
        """
        payload: Dict[str, Any] = request.get_json(silent=True) or {}

        try:
            user_id = _jwt_user_id()
        except Exception:
            return jsonify({"error": "invalid_token"}), 422

        allowed = {}
        mapping = {
            "name": "name",
            "role": "role",
            "organization": "organization",
            "phone": "phone",
            "lang": "lang",
            "dark_mode": "dark_mode",
            "avatar": "avatar",
        }
        # copia somente o que existir na tabela
        for k_in, col in mapping.items():
            if k_in in payload and _column_exists("users", col):
                allowed[col] = payload[k_in]

        if not allowed:
            return jsonify({"message": "Nada para atualizar"}), 200

        sets = ", ".join([f"{col}=?" for col in allowed.keys()])
        values = list(allowed.values())
        values.append(user_id)

        db = get_db()
        db.execute(f"UPDATE users SET {sets}, updated_at=CURRENT_TIMESTAMP WHERE id=?", tuple(values))
        db.commit()

        row = db.execute("""
            SELECT id, name, email, role, avatar, created_at, updated_at
              FROM users WHERE id=?
        """, (user_id,)).fetchone()
        return jsonify({"message": "Perfil atualizado", "user": dict(row)}), 200

    # ===== Metadados (para dropdown de "Função") =====
    @app.get("/meta/funcoes")
    def meta_funcoes():
        items = [
            {"id": "pesquisador", "label": "Pesquisador(a)"},
            {"id": "engenheiro",  "label": "Engenheiro(a)"},
            {"id": "tecnico",     "label": "Técnico(a)"},
            {"id": "gestor",      "label": "Gestor(a)"},
            {"id": "estudante",   "label": "Estudante"},
            {"id": "outro",       "label": "Outro"},
        ]
        return jsonify({"items": items}), 200

    # ===== Role helper / admin sample =====
    def role_required(role):
        def wrapper(fn):
            from functools import wraps
            @wraps(fn)
            def inner(*args, **kwargs):
                claims = get_jwt()
                if claims.get("role") != role:
                    return jsonify({"error": "Acesso negado"}), 403
                return fn(*args, **kwargs)
            return inner
        return wrapper

    @app.get("/admin/metrics")
    @jwt_required()
    @role_required("admin")
    def admin_metrics():
        db = get_db()
        total_users = db.execute("SELECT COUNT(*) AS c FROM users").fetchone()["c"]
        return jsonify({"total_users": total_users}), 200

    # ===================== ENDPOINTS (inventário + séries) =====================
    @app.get("/api/inventario")
    def api_inventario():
        uf = (request.args.get("uf") or "").strip().upper()
        q = (request.args.get("q") or "").strip()
        try:
            limit = int(request.args.get("limit", "50"))
        except Exception:
            limit = 50
        limit = max(1, min(limit, 1000))

        db = get_db()
        sql = """
        SELECT codigoestacao, estacao_nome, uf, municipio, latitude, longitude,
               tipo_estacao, operadora, responsavel, data_atualizacao
        FROM stations
        """
        params = []
        where = []
        if uf:
            where.append("uf = ?")
            params.append(uf)
        if q:
            where.append("(estacao_nome LIKE ? OR municipio LIKE ?)")
            params.extend([f"%{q}%", f"%{q}%"])
        if where:
            sql += " WHERE " + " AND ".join(where)
        sql += " ORDER BY estacao_nome LIMIT ?"
        params.append(limit)

        rows = db.execute(sql, tuple(params)).fetchall()
        return jsonify({"items": [dict(r) for r in rows], "count": len(rows)}), 200

    @app.get("/api/series/ultima")
    def api_series_ultima():
        estacao = (request.args.get("estacao") or "").strip()
        tipo = (request.args.get("tipo") or "").strip().lower()
        if not estacao or tipo not in ("cota", "vazao", "chuva"):
            return jsonify({"error": "parâmetros: estacao, tipo (cota|vazao|chuva)"}), 400
        table = f"series_{tipo}"
        db = get_db()
        row = db.execute(
            f"""
            SELECT codigoestacao, data_hora_medicao, valor, qualidade
            FROM {table}
            WHERE codigoestacao=?
            ORDER BY data_hora_medicao DESC
            LIMIT 1
        """,
            (estacao,),
        ).fetchone()
        return jsonify({"item": (dict(row) if row else None)}), 200

    @app.get("/api/series/janela")
    def api_series_janela():
        estacao = (request.args.get("estacao") or "").strip()
        tipo = (request.args.get("tipo") or "").strip().lower()
        de = (request.args.get("de") or "").strip()
        ate = (request.args.get("ate") or "").strip()
        try:
            limit = int(request.args.get("limit", "5000"))
        except Exception:
            limit = 5000
        limit = max(1, min(limit, 50000))
        if not estacao or tipo not in ("cota", "vazao", "chuva") or not de or not ate:
            return jsonify(
                {"error": "parâmetros: estacao, tipo (cota|vazao|chuva), de, ate"}
            ), 400

        table = f"series_{tipo}"
        db = get_db()
        rows = db.execute(
            f"""
            SELECT codigoestacao, data_hora_medicao, valor, qualidade
            FROM {table}
            WHERE codigoestacao=? AND data_hora_medicao BETWEEN ? AND ?
            ORDER BY data_hora_medicao
            LIMIT ?
        """,
            (estacao, de, ate, limit),
        ).fetchall()
        return jsonify({"items": [dict(r) for r in rows], "count": len(rows)}), 200

    # ===================== CLI =====================
    @app.cli.command("init-db")
    def _init_db_cmd():
        init_db()
        print("✔ Banco inicializado")

    @app.cli.command("seed-admin")
    def _seed_admin_cmd():
        email = os.getenv("ADMIN_EMAIL", "admin@admin.com")
        name = os.getenv("ADMIN_NAME", "Admin")
        pwd = os.getenv("ADMIN_PASSWORD", "Admin123!")
        pwd_hash = generate_password_hash(pwd)
        create_or_update_admin(email, name, pwd_hash)
        print(f"✔ Admin pronto: {email}")

    if _hidro_ok:
        @app.cli.command("hidro-inventory")
        @click.option("--ufs", multiple=True, help="Lista de UFs (ex.: DF GO MG). Se vazio, varre todas.")
        @click.option("--sleep", default=float(os.getenv("HIDRO_INGEST_SLEEP", "0.4")), show_default=True, type=float)
        def _hidro_inventory_cmd(ufs, sleep):
            hin.init_db()
            client = HidroClient()
            with hin.open_db() as conn:
                ulist = list(ufs) if ufs else None
                hin.harvest_inventory(client, conn, ufs=ulist, sleep=sleep)
            print("✔ Inventário concluído.")

        @app.cli.command("hidro-list-uf")
        @click.option("--uf", required=True, help="Sigla da UF (ex.: DF)")
        @click.option("--limit", default=20, show_default=True, type=int)
        def _hidro_list_uf_cmd(uf, limit):
            client = HidroClient()
            js = client.inventario_por_uf(uf.strip().upper())
            items = js.get("items") or []
            print(f"UF {uf.upper()} — {len(items)} estação(ões) (mostrando até {limit}):")
            for i in items[: max(1, min(limit, 1000))]:
                cod = (
                    i.get("codigoestacao")
                    or i.get("Codigo_Estacao")
                    or i.get("CodigoEstacao")
                )
                nome = (i.get("Estacao_Nome") or i.get("nome") or "")
                print(str(cod).strip(), "-", nome)

        @app.cli.command("hidro-ingest")
        @click.option("--stations", multiple=True, required=True, help="Ex.: 15400000 15400001")
        @click.option("--from", "from_date", required=True)
        @click.option("--to", "to_date", required=True)
        @click.option("--series", "series", multiple=True, type=click.Choice(["cota","vazao","chuva"]),
                      help="Repita: --series cota --series vazao --series chuva")
        @click.option("--sleep", default=float(os.getenv("HIDRO_INGEST_SLEEP", "0.4")), show_default=True, type=float)
        def _hidro_ingest_cmd(stations, from_date, to_date, series, sleep):
            hin.init_db()
            client = HidroClient()
            if not series or len(series) == 0:
                series = ("cota", "vazao", "chuva")
            with hin.open_db() as conn:
                for cod in stations:
                    print(f">> Estação {cod}:")
                    if "cota" in series:
                        print("   - Cotas …")
                        hin.harvest_series_period(client, conn, "HidroSerieCotas", client.route_cotas, "series_cota",
                                                  cod, hin.parse_date(from_date), hin.parse_date(to_date), sleep=sleep)
                    if "vazao" in series:
                        print("   - Vazão …")
                        hin.harvest_series_period(client, conn, "HidroSerieVazao", client.route_vazao, "series_vazao",
                                                  cod, hin.parse_date(from_date), hin.parse_date(to_date), sleep=sleep)
                    if "chuva" in series:
                        print("   - Chuva …")
                        hin.harvest_series_period(client, conn, "HidroSerieChuva", client.route_chuva, "series_chuva",
                                                  cod, hin.parse_date(from_date), hin.parse_date(to_date), sleep=sleep)
            print("✔ Ingest concluído.")

        @app.cli.command("hidro-check")
        def _hidro_check_cmd():
            with hin.open_db() as conn:
                cur = conn.cursor()
                def count(t):
                    try:
                        return cur.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0]
                    except Exception as e:
                        return f"(tabela ausente) {e}"
                print("stations     =", count("stations"))
                print("series_cota  =", count("series_cota"))
                print("series_vazao =", count("series_vazao"))
                print("series_chuva =", count("series_chuva"))
                print("harvest_log  =", count("harvest_log"))

        @app.cli.command("seed-valid-stations")
        @click.option("--file", "json_file", default="backend/valid_stations_df.json", show_default=True,
                      help="Caminho para o JSON com estações válidas")
        def _seed_valid_cmd(json_file):
            """Seed (upsert) das estações listadas em um JSON para a tabela stations."""
            hin.init_db()
            client = HidroClient()
            with hin.open_db() as conn:
                try:
                    hin.seed_valid_stations(conn, json_file)
                except FileNotFoundError:
                    print(f"Arquivo não encontrado: {json_file}")

        @app.cli.command("hidro-ingest-valid")
        @click.option("--days", default=7, show_default=True, type=int, help="Número de dias atrás para buscar (ex.: 7)")
        @click.option("--series", "series", multiple=True, type=click.Choice(["cota","vazao","chuva"]),
                      help="Series a buscar. Se omitido, busca cota, vazao e chuva")
        @click.option("--file", "json_file", default="backend/valid_stations_df.json", show_default=True,
                      help="JSON com as estações válidas")
        @click.option("--sleep", default=float(os.getenv("HIDRO_INGEST_SLEEP", "0.4")), show_default=True, type=float)
        def _hidro_ingest_valid_cmd(days, series, json_file, sleep):
            hin.init_db()
            client = HidroClient()
            # load codes from json
            try:
                codes = [s.get('codigo') or s.get('codigoestacao') for s in __import__('json').load(open(json_file, 'r', encoding='utf-8'))]
                codes = [c for c in codes if c]
            except Exception as e:
                print(f"Falha ao ler JSON {json_file}: {e}")
                return

            if not series or len(series) == 0:
                series = ("cota", "vazao", "chuva")

            end = dt.date.today()
            start = end - dt.timedelta(days=max(1, days))

            with hin.open_db() as conn:
                for cod in codes:
                    print(f">> Estação {cod}:")
                    if "cota" in series:
                        print("   - Cotas …")
                        hin.harvest_series_period(client, conn, "HidroSerieCotas", client.route_cotas, "series_cota",
                                                  cod, start, end, sleep=sleep)
                    if "vazao" in series:
                        print("   - Vazão …")
                        hin.harvest_series_period(client, conn, "HidroSerieVazao", client.route_vazao, "series_vazao",
                                                  cod, start, end, sleep=sleep)
                    if "chuva" in series:
                        print("   - Chuva …")
                        hin.harvest_series_period(client, conn, "HidroSerieChuva", client.route_chuva, "series_chuva",
                                                  cod, start, end, sleep=sleep)
            print("✔ Ingest (valid stations) concluído.")

    return app


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        init_db()
    port = int(os.getenv("PORT", "3001"))
    app.run(host="0.0.0.0", port=port, debug=True)
