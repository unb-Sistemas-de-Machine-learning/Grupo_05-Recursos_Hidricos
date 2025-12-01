# Como rodar (DEV)

# 1) Criar e ativar venv
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/Mac:
# source .venv/bin/activate

# 2) Instalar deps
pip install -r requirements.txt

# 3) Copiar .env.example -> .env e (opcional) ajustar variáveis
# No Windows PowerShell:
copy .env.example .env
# No Linux/Mac:
# cp .env.example .env

# 4) Inicializar banco e seed do admin
# Opção A (recomendado): usar comandos CLI
python app.py init-db
python app.py seed-admin
# (ou configure ADMIN_EMAIL/ADMIN_PASSWORD no .env antes do seed-admin)

# 4.a) Seed de estações validadas e ingest
# Depois de identificar as estações válidas (ex.: `backend/valid_stations_df.json`), você pode popular
# e testar o ingest com os novos comandos CLI adicionados:
# - `flask seed-valid-stations --file backend/valid_stations_df.json` — faz upsert em `stations`.
# - `flask hidro-ingest-valid --days 7` — executa ingest (últimos 7 dias) para as estações do JSON.

# 5) Rodar servidor
python app.py
# Vai subir em http://localhost:3001

# ROTAS
# POST /auth/register  {name, email, password}
# POST /auth/login     {email, password}
# POST /auth/refresh   (usa refresh token no Authorization: Bearer <refresh>)
# GET  /me             (Authorization: Bearer <access>)
# GET  /admin/metrics  (Authorization: Bearer <access> com role=admin)

# Dica de CORS:
# Em DEV, deixe CORS_ORIGINS=* no .env
# Em PROD, defina para seu domínio (ex.: https://seu-dominio.com)
