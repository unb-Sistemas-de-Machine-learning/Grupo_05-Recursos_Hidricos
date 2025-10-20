# app.py
import os
from pathlib import Path
from datetime import timedelta
from flask import Flask, jsonify, request, Response, url_for
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt
from werkzeug.security import generate_password_hash
from dotenv import load_dotenv

from db import init_db, close_db, get_db, create_or_update_admin
from auth import auth_bp

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
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-jwt-secret')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(seconds=int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', '3600')))
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(seconds=int(os.getenv('JWT_REFRESH_TOKEN_EXPIRES', '2592000')))

    # uploads locais (mantido para futuro)
    backend_root = Path(app.root_path)
    upload_dir = backend_root / "uploads" / "avatars"
    upload_dir.mkdir(parents=True, exist_ok=True)
    app.config["UPLOAD_FOLDER"] = str(upload_dir)
    app.config["MAX_CONTENT_LENGTH"] = int(os.getenv("MAX_AVATAR_MB", "5")) * 1024 * 1024

    # ===== CORS =====
    origins = os.getenv('CORS_ORIGINS', '*')
    CORS(app, resources={r"/*": {"origins": origins, "supports_credentials": False}})

    # ===== DB lifecycle =====
    app.teardown_appcontext(close_db)

    # ===== JWT =====
    jwt = JWTManager(app)

    # ---- Handlers de erro do JWT (mensagens claras) ----
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

    # ===== Health =====
    @app.get('/health')
    def health():
        return jsonify({"status": "ok"}), 200

    # ===== Avatares =====
    @app.get("/avatars")
    def list_avatars():
        items = [{
            "id": i,
            "label": lbl,
            "url": url_for("avatar_svg", avatar_id=i, _external=True)
        } for (i, lbl, _hex) in AVATAR_TONES]
        return jsonify({"items": items}), 200

    @app.get("/avatars/svg/<avatar_id>.svg")
    def avatar_svg(avatar_id: str):
        tone = AVATAR_TONES_MAP.get(avatar_id)
        if not tone:
            return jsonify({"error": "avatar não encontrado"}), 404
        _id, _label, hex_color = tone
        svg = svg_avatar_hex(hex_color)
        return Response(svg, mimetype="image/svg+xml")

    # ===== Perfil =====
    @app.get('/me')
    @jwt_required()
    def me():
        jwt_data = get_jwt()
        try:
            user_id = int(jwt_data['sub'])   # sub vem como string; converte para int
        except Exception:
            return jsonify({"error": "invalid_token"}), 422

        db = get_db()
        row = db.execute('SELECT * FROM users WHERE id=?', (user_id,)).fetchone()
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
                "updated_at": row["updated_at"]
            }
        }), 200

    # ===== Selecionar avatar =====
    @app.post("/users/me/avatar-select")
    @jwt_required()
    def select_avatar():
        data = request.get_json(silent=True) or {}
        avatar_id = (data.get("id") or "").strip()
        if avatar_id not in AVATAR_TONES_MAP:
            return jsonify({"error": "avatar inválido"}), 400

        try:
            user_id = int(get_jwt()['sub'])  # garante inteiro
        except Exception:
            return jsonify({"error": "invalid_token"}), 422

        avatar_url_abs = url_for("avatar_svg", avatar_id=avatar_id, _external=True)

        db = get_db()
        db.execute("UPDATE users SET avatar = ? WHERE id = ?", (avatar_url_abs, user_id))
        db.commit()

        row = db.execute("""
            SELECT id, name, email, role, avatar, created_at, updated_at
            FROM users WHERE id = ?""", (user_id,)).fetchone()
        return jsonify({"message": "Avatar definido", "user": dict(row)}), 200

    # ===== Role helper / admin sample =====
    def role_required(role):
        def wrapper(fn):
            from functools import wraps
            @wraps(fn)
            def inner(*args, **kwargs):
                jwt_data = get_jwt()
                if jwt_data.get('role') != role:
                    return jsonify({"error": "Acesso negado"}), 403
                return fn(*args, **kwargs)
            return inner
        return wrapper

    @app.get('/admin/metrics')
    @jwt_required()
    @role_required('admin')
    def admin_metrics():
        db = get_db()
        total_users = db.execute('SELECT COUNT(*) AS c FROM users').fetchone()['c']
        return jsonify({"total_users": total_users}), 200

    # ===== CLI =====
    @app.cli.command('init-db')
    def _init_db_cmd():
        init_db()
        print('✔ Banco inicializado')

    @app.cli.command('seed-admin')
    def _seed_admin_cmd():
        email = os.getenv('ADMIN_EMAIL', 'admin@admin.com')
        name  = os.getenv('ADMIN_NAME', 'Admin')
        pwd   = os.getenv('ADMIN_PASSWORD', 'Admin123!')
        pwd_hash = generate_password_hash(pwd)
        create_or_update_admin(email, name, pwd_hash)
        print(f'✔ Admin pronto: {email}')

    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        init_db()
    port = int(os.getenv('PORT', '3001'))
    app.run(host='0.0.0.0', port=port, debug=True)
