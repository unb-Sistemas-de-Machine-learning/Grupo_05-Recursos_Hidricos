# ÁguaPrev | Backend

## 📄 Visão Geral

O backend da aplicação ÁguaPrev é construído em Python utilizando o framework **Flask**, oferecendo uma API RESTful para monitoramento e previsão da situação hídrica do Distrito Federal. A arquitetura foca na modularidade, separando a lógica de negócio, autenticação e acesso a dados.

Ele é responsável por:
*   Gerenciar autenticação de usuários (JWT).
*   Manter perfis de usuário, incluindo avatares.
*   Expor dados de estações de monitoramento e séries temporais (cota, vazão, chuva).
*   Permitir a ingestão de dados de fontes externas (como a API da ANA) através de comandos CLI.

## 🛠️ Principais Tecnologias
As principais ferramentas e bibliotecas empregadas são:

-   **Flask:** Microframework web para a construção de APIs em Python.
-   **Flask-Cors:** Gerenciamento de Cross-Origin Resource Sharing (CORS) para permitir comunicação com o frontend.
-   **Flask-JWT-Extended:** Suporte para JSON Web Tokens (JWT) para autenticação segura.
-   **SQLite:** Banco de dados leve e embarcado para persistência de dados.
-   **python-dotenv:** Gerenciamento de variáveis de ambiente.
-   **requests:** Biblioteca para fazer requisições HTTP a APIs externas (ex: ANA).

## 📁 Estrutura de Pastas (simplificada)

```
📁 backend/
├── app.py                # Entrada principal da API, rotas, configuração
├── auth.py               # Blueprint para autenticação (login, registro)
├── db.py                 # Conexão com banco de dados SQLite
├── models.sql            # Script SQL de criação de tabelas
├── hidro_api.py          # Cliente para a API HidroWeb da ANA
├── hidro_ingest.py       # Lógica de ingestão de dados da ANA para o DB
├── .env.example          # Exemplo de variáveis de ambiente
├── requirements.txt      # Dependências Python
├── uploads/              # Pasta para arquivos enviados (ex: avatares)
└── __pycache__/          # Cache de módulos Python
```

## 🌐 Rotas da Aplicação

### Autenticação e Usuários

| Rota | Método | Descrição | Parâmetros de Requisição (JSON/Form) | Resposta (JSON) | Notas |
| :--- | :----- | :-------- | :----------------------------------- | :-------------- | :---- |
| `/auth/register` | `POST` | Registra um novo usuário. | `email`, `password`, `name` | `{ "message": "Usuário criado", "access_token": "...", "refresh_token": "..." }` | Cria usuário e retorna tokens JWT. |
| `/auth/login` | `POST` | Realiza o login do usuário. | `email`, `password` | `{ "message": "Login realizado", "access_token": "...", "refresh_token": "..." }` | Retorna tokens JWT. |
| `/auth/refresh` | `POST` | Renova os tokens de acesso e refresh. | (Necessita `refresh_token` no header ou body, dependendo da configuração JWT) | `{ "access_token": "...", "refresh_token": "..." }` | Exige um refresh token válido. |
| `/auth/logout` | `POST` | Invalida o token de acesso (blacklist). | (Nenhum) | `{ "message": "Access token revoked" }` | Exige token de acesso. |
| `/me` | `GET` | Retorna os dados do usuário autenticado. | (Nenhum) | `{ "user": { "id", "email", "name", "role", "avatar", ... } }` | Exige token de acesso. |
| `/users/me/avatar-select` | `POST` | Define um avatar pré-selecionado (SVG). | `{"id": "tone01"}` | `{ "message": "Avatar definido", "user": {...} }` | Exige token de acesso. |
| `/users/me/avatar-upload` | `POST` | Faz upload de uma imagem como avatar. | `file` (multipart/form-data) | `{ "message": "Avatar atualizado", "user": {...} }` | Exige token de acesso. |
| `/users/me/password-change` | `POST` | Altera a senha do usuário. | `current_password`, `new_password` | `{ "message": "Senha atualizada com sucesso" }` | Exige token de acesso. |
| `/users/me/profile` | `POST` | Atualiza dados do perfil (nome, função, etc.). | `name`, `role`, `organization`, `phone`, `lang`, `dark_mode`, `avatar` (opcional) | `{ "message": "Perfil atualizado", "user": {...} }` | Exige token de acesso. |
| `/meta/funcoes` | `GET` | Retorna uma lista de funções/cargos para seleção. | (Nenhum) | `{ "items": [{"id": "pesquisador", "label": "Pesquisador(a)"}, ...] }` | Pública. |

### Monitoramento e Dados

| Rota | Método | Descrição | Parâmetros de Requisição (Query/Form) | Resposta (JSON) | Notas |
| :--- | :----- | :-------- | :------------------------------------ | :-------------- | :---- |
| `/health` | `GET` | Verifica a saúde da API. | (Nenhum) | `{ "status": "ok" }` | Pública. |
| `/avatars` | `GET` | Lista as opções de avatares SVG disponíveis. | (Nenhum) | `{ "items": [ { "id", "label", "url" }, ... ] }` | Pública. |
| `/avatars/svg/<avatar_id>.svg` | `GET` | Retorna um avatar SVG específico. | `<avatar_id>` (no path) | Imagem SVG | Pública. |
| `/uploads/avatars/<filename>` | `GET` | Serve arquivos de avatar enviados. | `<filename>` (no path) | Imagem (PNG, JPG, etc.) | Pública. |
| `/api/inventario` | `GET` | Retorna o inventário de estações de monitoramento. | `uf` (opcional), `q` (busca por nome/município, opcional), `limit` (opcional) | `{ "items": [ { "codigoestacao", "estacao_nome", ... } ], "count": N }` | Pública. Filtra por UF ou termo de busca. |
| `/api/series/ultima` | `GET` | Retorna a última medição de uma série específica de uma estação. | `estacao`, `tipo` (`cota`, `vazao`, `chuva`) | `{ "item": { "codigoestacao", "data_hora_medicao", "valor", "qualidade" } }` | Exige `estacao` e `tipo`. |
| `/api/series/janela` | `GET` | Retorna séries de medições em uma janela de tempo. | `estacao`, `tipo` (`cota`, `vazao`, `chuva`), `de` (data/hora início), `ate` (data/hora fim), `limit` (opcional) | `{ "items": [ {...} ], "count": N }` | Exige `estacao`, `tipo`, `de`, `ate`. |

### Rotas de Administração (Exigem `role: "admin"`)

| Rota | Método | Descrição | Parâmetros de Requisição (JSON) | Resposta (JSON) | Notas |
| :--- | :----- | :-------- | :------------------------------ | :-------------- | :---- |
| `/admin/metrics` | `GET` | Retorna métricas de administração. | (Nenhum) | `{ "total_users": N }` | Exige token de acesso com `role: "admin"`. |

## 🚀 Comandos CLI para Ingestão de Dados

O backend também oferece comandos via linha de comando (Flask CLI) para gerenciar o banco de dados e a ingestão de dados da ANA.

| Comando | Descrição | Opções |
| :------ | :-------- | :----- |
| `flask init-db` | Inicializa o banco de dados criando as tabelas. | - |
| `flask seed-admin` | Cria ou atualiza o usuário administrador padrão. | - |
| `flask hidro-inventory` | Coleta e salva o inventário de estações da ANA. | `--ufs` (filtrar por UF), `--sleep` (intervalo entre requisições) |
| `flask hidro-list-uf` | Lista estações de uma UF específica. | `--uf` (obrigatório), `--limit` |
| `flask hidro-ingest` | Ingestão de séries de dados para estações específicas. | `--stations` (códigos das estações), `--from`, `--to` (período), `--series` (`cota`, `vazao`, `chuva`), `--sleep` |
| `flask hidro-check` | Verifica a contagem de registros nas tabelas de dados hídricos. | - |
| `flask seed-valid-stations` | Carrega estações de um JSON de estações válidas. | `--file` (caminho para o JSON) |
| `flask hidro-ingest-valid` | Ingestão de séries de dados para estações de um JSON de estações válidas para um período. | `--days` (dias atrás), `--series`, `--file`, `--sleep` |