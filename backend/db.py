# db.py
import os
import sqlite3
from flask import g, current_app

def get_db():
    if 'db' not in g:
        path = os.getenv('DATABASE_PATH', 'app.db')
        conn = sqlite3.connect(path, check_same_thread=False)
        conn.row_factory = sqlite3.Row
        g.db = conn
    return g.db

def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()

def init_db():
    db = get_db()
    with current_app.open_resource('models.sql', mode='r') as f:
        db.executescript(f.read())
    db.commit()

def get_user_by_email(email: str):
    db = get_db()
    row = db.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    return row

def create_or_update_admin(email: str, name: str, password_hash: str):
    db = get_db()
    cur = db.execute('SELECT id FROM users WHERE email=?', (email,))
    row = cur.fetchone()
    if row:
        db.execute('UPDATE users SET name=?, password_hash=?, role=? WHERE email=?',
                   (name, password_hash, 'admin', email))
    else:
        db.execute('INSERT INTO users (email, name, password_hash, role) VALUES (?,?,?,?)',
                   (email, name, password_hash, 'admin'))
    db.commit()
