# auth.py
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt, get_jwt_identity
)
from db import get_db, get_user_by_email

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

def _serialize_user(row):
    return {
        "id": row["id"],
        "email": row["email"],
        "name": row["name"],
        "role": row["role"],
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
    }

@auth_bp.post('/register')
def register():
    data = request.get_json(silent=True) or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').lower().strip()
    password = data.get('password', '')

    if not name or not email or not password:
        return jsonify({"error": "name, email e password são obrigatórios"}), 400

    if get_user_by_email(email):
        return jsonify({"error": "E-mail já cadastrado"}), 409

    pwd_hash = generate_password_hash(password)
    db = get_db()
    db.execute(
        'INSERT INTO users (email, name, password_hash, role) VALUES (?,?,?,?)',
        (email, name, pwd_hash, 'user')
    )
    db.commit()

    user = get_user_by_email(email)
    claims = {"role": user["role"], "name": user["name"]}

    # IMPORTANTE: identity como STRING
    uid = str(user["id"])
    access  = create_access_token(identity=uid, additional_claims=claims)
    refresh = create_refresh_token(identity=uid, additional_claims=claims)

    return jsonify({
        "message": "Usuário registrado com sucesso",
        "user": _serialize_user(user),
        "tokens": {"access": access, "refresh": refresh}
    }), 201

@auth_bp.post('/login')
def login():
    data = request.get_json(silent=True) or {}
    email = data.get('email', '').lower().strip()
    password = data.get('password', '')

    user = get_user_by_email(email)
    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Credenciais inválidas"}), 401

    claims = {"role": user["role"], "name": user["name"]}

    # IMPORTANTE: identity como STRING
    uid = str(user["id"])
    access  = create_access_token(identity=uid, additional_claims=claims)
    refresh = create_refresh_token(identity=uid, additional_claims=claims)

    return jsonify({
        "message": "Login efetuado",
        "user": _serialize_user(user),
        "tokens": {"access": access, "refresh": refresh}
    }), 200

@auth_bp.post('/refresh')
@jwt_required(refresh=True)
def refresh():
    jwt = get_jwt()
    identity = get_jwt_identity()  # já vem string
    claims = {"role": jwt.get("role"), "name": jwt.get("name")}
    new_access = create_access_token(identity=identity, additional_claims=claims)
    return jsonify({"access": new_access}), 200
