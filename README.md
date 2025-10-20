# 💧 ÁguaPrev

**ÁguaPrev** é uma plataforma web interativa para **monitoramento e previsão da situação hídrica do Distrito Federal**.
O sistema combina um **backend em Python** e um **frontend moderno com Vite + TailwindCSS**, oferecendo visualização de dados ambientais, gráficos e interface responsiva.
A documentação técnica é mantida em **MkDocs**.

## 🏗️ Estrutura Geral

```
.
├── backend/                  # API e lógica de negócio (Python)
│   ├── app.py                # Entrada principal da API
│   ├── auth.py               # Autenticação e controle de sessão
│   ├── db.py                 # Conexão com banco de dados
│   ├── models.sql            # Script SQL de criação de tabelas
│   ├── uploads/              # Pasta para arquivos enviados
│   ├── .env.example          # Modelo de variáveis de ambiente
│   └── requirements.txt      # Dependências Python
│
├── frontend/                 # Aplicação web (Vite + Tailwind)
│   ├── src/                  # Código-fonte principal
│   ├── public/               # Arquivos públicos
│   ├── index.html            # Página inicial
│   ├── dashboard.html        # Dashboard principal
│   ├── login.html            # Tela de login
│   ├── signup.html           # Tela de cadastro
│   ├── package.json          # Scripts npm
│   ├── tailwind.config.js    # Configuração do Tailwind
│   ├── vite.config.js        # Configuração do Vite
│   └── .env.example          # Exemplo de configuração do front
│
├── docs/                     # Documentação fonte (MkDocs)
├── site/                     # Build estático do MkDocs
├── mkdocs.yml                # Configuração da documentação
├── LICENSE
└── README.md
```

## ⚙️ Requisitos

| Tipo            | Ferramenta    | Versão Requerida     |
| --------------- | ------------- | -------------------- |
| 🐍 Backend      | Python        | ≥ 3.10               |
| 🧱 Frontend     | Node.js / npm | Node ≥ 18 / npm ≥ 9  |
| 📚 Documentação | MkDocs        | `pip install mkdocs` |

## 🚀 Como executar o projeto

A ordem **correta de execução** é:

1️⃣ **Iniciar o backend (Python)**
2️⃣ **Iniciar o frontend (Vite)**
3️⃣ (Opcional) **Rodar a documentação (MkDocs)**

### 🐍 1. Iniciar o Backend (API)

#### 📂 Entrar na pasta

```bash
cd backend
```

#### 📦 Criar ambiente virtual e instalar dependências

**Windows (PowerShell):**

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

**Linux/macOS (bash/zsh):**

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

#### ⚙️ Configurar variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Abra o `.env` e ajuste valores como:

```
PORT=5000
DB_URL=sqlite:///app.db
SECRET_KEY=sua_chave_segura_aqui
```

#### 🗃️ (Opcional) Criar o banco de dados SQLite

```bash
sqlite3 app.db < models.sql
```

#### ▶️ Rodar o servidor da API

**Windows:**

```bash
python app.py
```

**Linux/macOS:**

```bash
python3 app.py
```

O backend ficará disponível em:
👉 **[http://127.0.0.1:5000](http://127.0.0.1:5000)**

### 🧱 2. Iniciar o Frontend

#### 📂 Entrar na pasta

```bash
cd frontend
```

#### 📦 Instalar dependências

```bash
npm install
```

#### ⚙️ Configurar URL da API

Crie um arquivo `.env` na pasta `frontend` com o conteúdo:

```
VITE_API_URL=http://127.0.0.1:5000
```

> Isso garante que o front se conecte corretamente ao backend local.

#### ▶️ Rodar o servidor de desenvolvimento

**Windows / Linux / macOS:**

```bash
npm run dev
```

O frontend ficará disponível em:
👉 **[http://localhost:5173](http://localhost:5173)**

#### 🧪 Rodar build de produção (opcional)

```bash
npm run build
npm run preview
```

### 📚 3. Rodar a documentação (MkDocs)

#### 📦 Instalar MkDocs

```bash
pip install mkdocs
```

#### ▶️ Servir a documentação localmente

```bash
mkdocs serve
```

Acesse em:
👉 **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

#### 🏗️ Gerar build estático

```bash
mkdocs build
```

Os arquivos serão gerados na pasta `/site`.

## 🌍 Variáveis de Ambiente (exemplos)

### Backend (`backend/.env`)

```
PORT=5000
DB_URL=sqlite:///app.db
SECRET_KEY=agua-prev-key
```

### Frontend (`frontend/.env`)

```
VITE_API_URL=http://127.0.0.1:5000
```

## 📈 Roadmap

* [ ] Conectar dashboard a dados reais (chuvas, reservatórios — Adasa/ANA)
* [ ] Implementar gráficos e indicadores (Chart.js / ECharts)
* [ ] Autenticação completa entre backend e frontend
* [ ] Deploy em ambiente de produção (API + Front)
* [ ] Documentação expandida (MkDocs + endpoints)

## 🤝 Contribuindo

1. Crie uma branch:

   ```bash
   git checkout -b feature/nome-da-feature
   ```
2. Faça suas alterações e commit:

   ```bash
   git commit -m "feat: descrição da mudança"
   ```
3. Envie a branch:

   ```bash
   git push origin feature/nome-da-feature
   ```
4. Abra um **Pull Request** 🚀

## 🪪 Licença

Distribuído sob a **MIT License**.
Consulte o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Gustavo Martins**
Desenvolvedor & Designer de Interfaces
📍 Brasília - DF
🌐 [github.com/lxgustxl](https://github.com/lxgustxl)

> 💡 **Dica rápida**
> Se o frontend retornar “Invalid Token” ou erro de conexão:
>
> * Verifique se o **backend está rodando** antes do front.
> * Confirme se o `.env` do front tem a variável correta (`VITE_API_URL`).
> * Evite misturar **HTTP e HTTPS** (bloqueio CORS no navegador).
