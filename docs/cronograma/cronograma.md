Este cronograma organiza as atividades do projeto entre 10/09 e 20/10 (parcial), com foco nas entregas exigidas: Produto, Arquitetura/Engenharia de Dados e MVP.

A execução é dividida em etapas com responsáveis e revisores definidos para cada tarefa.

#### Etapa 1 – Planejamento e Descoberta

Período: 10/09 a 22/09  
Entrega: Visão do Produto (AguaPrev), backlog inicial de US, catálogo de dados preliminar.

- Semana 1 (10/09 a 15/09)

  - Tarefas:
    - Visão do Produto – Diagrama de Ishikawa 8D (problema, causas, hipóteses)
      - Responsável: Gabriel | Revisor: Hugo
    - Levantamento de fontes de dados e catálogo preliminar
      - Responsável: Gabriel | Revisor: Hugo
    - Rascunho de requisitos de produto (funcionais e não funcionais) – brainstorming + Miro
      - Responsável: Gabriel | Revisor: Gustavo
  - Entregáveis:
    - Diagrama de Ishikawa documentado
    - Lista de datasets e dicionário de dados preliminar
    - Rascunho de RF/RNF

- Semana 2 (16/09 a 22/09)
  - Tarefas:
    - Histórias de Usuário (Como [persona], eu quero [ação], para [benefício]) + critérios de aceitação
      - Responsável: Gabriel | Revisor: Hugo
    - Priorização (MoSCoW) e priorização inicial das US
      - Responsável: Hugo | Revisor: Gustavo
    - Planejamento do MVP (seleção das US do MVP e incrementos)
      - Responsável: Gustavo | Revisor: Gabriel
  - Entregáveis:
    - US com critérios de aceitação
    - Matriz MoSCoW
    - MVP definido (US do MVP vs incrementos)

#### Etapa 2 – Requisitos e Arquitetura de Dados

Período: 23/09 a 06/10  
Entrega: Requisitos do Produto e de ML na GitPage, desenho de arquitetura e plano de dados.

- Semana 3 (23/09 a 29/09)

  - Tarefas:
    - Requisitos do Produto na GitPage (RF/RNF) revisados e organizados
      - Responsável: Gabriel | Revisor: Hugo
    - Requisitos de ML (RF/RNF dos modelos), métricas de sucesso e ML Canvas
      - Responsável: Hugo | Revisor: Gustavo
    - Desenho da arquitetura de dados (coleta, armazenamento, orquestração; status de automação PowerBI/INMET e script para nível de reserva)
      - Responsável: Gustavo | Revisor: Gabriel
  - Entregáveis:
    - Página de requisitos do produto publicada
    - ML Canvas preenchido + métricas (ex.: MAE, RMSE, MAPE para 1h/1d)
    - Diagrama de arquitetura e responsabilidades

- Semana 4 (30/09 a 06/10)
  - Tarefas:
    - Mapeamento de dados detalhado (tabela para o modelo), referenciando o catálogo
      - Responsável: Gustavo | Revisor: Hugo
    - Plano de rotulagem (horizontes: 1h, 1d; como gerar labels) e balanceamento (nível de reserva)
      - Responsável: Hugo | Revisor: Gabriel
    - Políticas de amostragem (se aplicável) e divisão treino/teste (INMET)
      - Responsável: Gabriel | Revisor: Gustavo
  - Entregáveis:
    - Tabela de mapeamento de dados
    - Documento de rotulagem e balanceamento
    - Estratégia de amostragem e split

#### Etapa 3 – Integração, MVP e Revisões

Período: 14/10 a 20/10  
Entrega: MVP definido e planejado, cronograma parcial, publicação na GitPage.

- Semana 5 (14/10 a 19/10)

  - Tarefas:
    - Revisão do ML Canvas com métricas alinhadas ao MVP
      - Responsável: Hugo | Revisor: Gabriel
    - Priorização final das US (MVP e incremento)
      - Responsável: Gabriel | Revisor: Gustavo
    - Planejamento mínimo de entregas (marcos do MVP, sprints)
      - Responsável: Gustavo | Revisor: Hugo
    - Consolidar GitPage: Requisitos do Produto, Requisitos de ML, US, Priorização, Mapeamento de Dados
      - Responsável: Todos (owner: Gabriel)
  - Entregáveis:
    - Documento do MVP com US selecionadas e incrementos
    - Cronograma publicado
    - GitPage consolidada

- Entrega Parcial 1 (20/10)
  - Tarefas:
    - Revisão geral e checklist de critérios da avaliação
      - Responsáveis: Todos
    - Apresentação interna e ajustes finais
      - Responsável: Hugo (apresentação) | Revisores: Gabriel e Gustavo
  - Entregáveis:
    - Pacote provisório publicado na GitPage
    - Apresentação pronta

#### Cronograma Planejado (Tabela)

| Tarefa                                                   | Responsável(is) | Revisor(es)      | Início | Fim   |
| -------------------------------------------------------- | --------------- | ---------------- | ------ | ----- |
| Visão do Produto – AguaPrev                              | Hugo            | Gabriel          | 10/09  | 15/09 |
| Catálogo de dados                                        | Gustavo         | Hugo             | 10/09  | 22/09 |
| Requisitos do Produto (RF/RNF) – GitPage                 | Gabriel         | Hugo             | 23/09  | 29/09 |
| Requisitos de ML + métricas + ML Canvas                  | Hugo            | Gustavo          | 23/09  | 29/09 |
| Arquitetura de Dados (coleta/armazenamento/orquestração) | Gustavo         | Gabriel          | 23/09  | 29/09 |
| Histórias de Usuário + critérios de aceitação            | Gabriel         | Hugo             | 16/09  | 22/09 |
| Priorização (MoSCoW)                                     | Hugo            | Gustavo          | 16/09  | 22/09 |
| Definição do MVP                                         | Gustavo         | Gabriel          | 16/09  | 22/09 |
| Mapeamento de Dados (tabela para o modelo)               | Gustavo         | Hugo             | 30/09  | 06/10 |
| Plano de Rotulagem e Balanceamento                       | Hugo            | Gabriel          | 30/09  | 06/10 |
| Amostragem e split treino/teste (INMET)                  | Gabriel         | Gustavo          | 30/09  | 06/10 |
| Revisão ML Canvas + métricas do MVP                      | Hugo            | Gabriel          | 14/10  | 19/10 |
| Priorização e plano de entregas                          | Gabriel         | Gustavo          | 14/10  | 19/10 |
| Consolidar GitPage (todas as seções)                     | Todos           | —                | 14/10  | 19/10 |
| Revisão e apresentação parcial                           | Hugo            | Gabriel, Gustavo | 20/10  | 20/10 |
