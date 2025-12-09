# ÁguaPrev | Frontend

## 📄 Visão Geral

O frontend da aplicação ÁguaPrev é uma interface web interativa, desenvolvida para permitir o monitoramento e a visualização de dados hídricos do Distrito Federal. Construída com tecnologias modernas, oferece uma experiência de usuário intuitiva e responsiva, acessando os dados através da API RESTful fornecida pelo backend.

## 🛠️ Principais Tecnologias
As principais ferramentas e bibliotecas empregadas são:

-   **Vite:** Ferramenta de build de frontend de próxima geração, que oferece uma experiência de desenvolvimento extremamente rápida.
-   **TailwindCSS:** Framework CSS utilitário que permite construir designs personalizados de forma rápida e eficiente, sem sair do seu HTML.
-   **JavaScript/HTML/CSS:** As linguagens fundamentais para a construção de interfaces web dinâmicas e ricas.

## 📁 Estrutura de Pastas (simplificada)

```
📁 frontend/
├── public/                 # Arquivos estáticos e recursos públicos
│   └── home/               # Imagens e assets para a página inicial
├── src/                    # Código-fonte principal da aplicação
│   ├── main.js             # Ponto de entrada da aplicação JavaScript
│   ├── css/                # Estilos CSS (incluindo Tailwind)
│   ├── js/                 # Outros scripts JavaScript
│   └── partials/           # Componentes HTML reutilizáveis
├── index.html              # Página inicial (esqueleto)
├── dashboard.html          # Layout e estrutura do dashboard
├── login.html              # Página de autenticação
├── signup.html             # Página de registro de usuário
├── compare.html            # Página de comparação de dados
├── maps.html               # Página de visualização de mapas
├── profile.html            # Página de perfil do usuário
├── reports.html            # Página de relatórios
├── series.html             # Página de visualização de séries temporais
└── tailwind.config.js      # Configuração do Tailwind CSS
```

## 📱 Telas e Funcionalidades

A aplicação frontend é organizada em telas funcionais que permitem ao usuário interagir com os dados e funcionalidades do sistema.

### 1. Página de Login (`login.html`)
Esta tela permite que usuários existentes acessem o sistema.
*   **Funcionalidade:** Autenticação de usuários via email e senha.
*   **Interação:** Campo para email, campo para senha, botão "Entrar", link para "Esqueci minha senha" e link para "Criar conta".

**(IMAGEM: Captura de tela da página de Login)**

### 2. Página de Registro (`signup.html`)
Nova usuários podem criar uma conta nesta página.
*   **Funcionalidade:** Criação de novas contas de usuário.
*   **Interação:** Campos para nome, email, senha, confirmação de senha, botão "Registrar", link para "Já tenho uma conta".

**(IMAGEM: Captura de tela da página de Registro)**

### 3. Dashboard (`dashboard.html`)
A principal visão geral do sistema, apresentando um resumo dos dados hídricos.
*   **Funcionalidade:** Exibição de informações consolidadas, gráficos e indicadores chave de desempenho (KPIs) relacionados à situação hídrica.
*   **Interação:** Pode incluir filtros por período, tipo de dado ou localização, além de navegação para outras seções.

**(IMAGEM: Captura de tela do Dashboard)**

### 4. Mapas (`maps.html`)
Visualização geográfica das estações de monitoramento e dados associados.
*   **Funcionalidade:** Apresenta as estações de monitoramento em um mapa interativo, permitindo ao usuário visualizar a localização e, possivelmente, detalhes rápidos ao clicar nos marcadores.
*   **Interação:** Zoom, pan, marcadores clicáveis, camadas de informações.

**(IMAGEM: Captura de tela da página de Mapas)**

### 5. Séries Temporais (`series.html`)
Detalhes sobre as séries históricas de dados hídricos.
*   **Funcionalidade:** Exibição de gráficos e tabelas com dados de séries temporais (cota, vazão, chuva) para estações selecionadas, permitindo análise detalhada ao longo do tempo.
*   **Interação:** Seleção de estação, seleção de tipo de série, definição de período, zoom nos gráficos.

**(IMAGEM: Captura de tela da página de Séries Temporais)**

### 6. Perfil do Usuário (`profile.html`)
Permite ao usuário gerenciar suas informações e configurações.
*   **Funcionalidade:** Visualização e edição de dados do perfil (nome, email, função), alteração de senha e gerenciamento de avatar.
*   **Interação:** Campos editáveis, botões para salvar alterações, opção de upload de avatar ou seleção de avatar pré-definido.

**(IMAGEM: Captura de tela da página de Perfil do Usuário)**

### 7. Relatórios (`reports.html`)
Geração e visualização de relatórios.
*   **Funcionalidade:** Interface para criar, gerenciar e visualizar relatórios sobre os dados hídricos, possivelmente com filtros personalizados.
*   **Interação:** Seleção de parâmetros para relatório, download, visualização prévia.

**(IMAGEM: Captura de tela da página de Relatórios)**

## 🚀 Como rodar a aplicação

Para rodar o frontend, você precisará ter o Node.js e o npm instalados.

1.  **Navegue até o diretório do frontend:**
    ```bash
    cd frontend
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Configure a URL da API do backend:**
    Crie um arquivo `.env` na pasta `frontend` com o seguinte conteúdo, apontando para o seu backend:
    ```
    VITE_API_URL=http://127.0.0.1:5000
    ```
4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em `http://localhost:5173`.
