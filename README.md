# 💧 ÁguaPrev

**ÁguaPrev** é uma plataforma web interativa para **monitoramento e previsão da situação hídrica do Distrito Federal**.
O sistema combina um **backend em Python** e um **frontend moderno com Vite + TailwindCSS**, oferecendo visualização de dados ambientais, gráficos e interface responsiva.
A documentação técnica é mantida em **MkDocs**.

## 🏗️ Estrutura Geral e Arquitetura

O projeto ÁguaPrev é dividido em módulos principais:

*   **Backend (`backend/`):** API e lógica de negócio (Python com Flask).
*   **Frontend (`frontend/`):** Aplicação web (Vite + TailwindCSS).
*   **Documentação (`docs/`):** Documentação técnica gerada por MkDocs.
*   **Ingestão de Dados (`backend/hidro_ingest.py`):** Processo de coleta e tratamento de dados de fontes externas.

Para uma visão detalhada da arquitetura e do fluxo de dados do sistema, consulte:
➡️ **[Visão Detalhada da Arquitetura](docs/arquitetura/arquitetura.md)**

## 📚 Documentação Técnica Detalhada

Explore os aspectos técnicos do projeto nos seguintes documentos:

*   **[Rotas da API do Backend](docs/ajuda-e-suporte/documentacao-tecnica/backend.md)**: Detalhes sobre os endpoints da API, métodos, parâmetros e respostas.
*   **[Interface de Usuário (Frontend)](docs/ajuda-e-suporte/documentacao-tecnica/frontend.md)**: Descrição das telas principais, funcionalidades e fluxo de usuário.
*   **[Engenharia de Dados e Machine Learning](docs/engenharia-de-dados/engenharia-de-dados.md)**: Informações sobre o processo de ingestão e preparação de dados, requisitos e objetivos de Machine Learning.

## ⚙️ Requisitos

| Tipo            | Ferramenta    | Versão Requerida     |
| --------------- | ------------- | -------------------- |
| 🐍 Backend      | Python        | ≥ 3.10               |
| 🧱 Frontend     | Node.js / npm | Node ≥ 18 / npm ≥ 9  |
| 📚 Documentação | MkDocs        | `pip install mkdocs` |

## 🚀 Como executar o projeto (Passo a passo para execução local)

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

O roadmap do ÁguaPrev está focado em evoluir a plataforma para um sistema de monitoramento e previsão hídrica robusto e inteligente.

*   [ ] **Conectar dashboard a dados reais:** Implementar a integração contínua e visualização dos dados mais recentes de chuvas e reservatórios (Adasa/ANA) no dashboard.
*   [ ] **Implementar gráficos e indicadores avançados:** Utilizar bibliotecas como Chart.js ou ECharts para visualizações dinâmicas e interativas.
*   [ ] **Autenticação completa entre backend e frontend:** Finalizar a implementação e integração do sistema de autenticação JWT em todas as funcionalidades necessárias.
*   [ ] **Deploy em ambiente de produção:** Configurar e implantar a API do backend e o frontend em um ambiente de produção escalável e seguro.
*   [ ] **Desenvolvimento dos Modelos de Machine Learning:** Implementar os modelos de previsão de níveis de reservatórios e precipitação, conforme os requisitos detalhados na [documentação de Engenharia de Dados e ML](docs/engenharia-de-dados/engenharia-de-dados.md).
*   [ ] **Integração das Previsões no Frontend:** Exibir as previsões geradas pelos modelos de ML na interface do usuário (ex: dashboards e séries temporais).
*   [ ] **Documentação Expandida:** Continuar a aprimorar a documentação técnica com detalhes sobre os endpoints da API, diagramas de arquitetura atualizados e guias de uso.

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