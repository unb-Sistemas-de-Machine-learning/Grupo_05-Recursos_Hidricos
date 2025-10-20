### MUST

#### H-001 — Ingestão automática de dados

- História: Como Técnico Operacional, eu quero que a plataforma ingira automaticamente os dados do INMET e da telemetria para manter o repositório atualizado e confiável.
- Critérios de Aceitação (AC):
  - INMET e telemetria são ingeridos automaticamente segundo a cadência esperada.
  - Logs de ingestão registrados e pesquisáveis.
  - Alertas acionados quando não há ingestão por > 1 hora.
- Prioridade: Must
- Relaciona: RF01, RF03; RF-ML-01, RF-ML-02; RNF10, RNF-ML-03

#### H-002 — Repositório histórico time-series

- História: Como Analista, eu quero consultar séries históricas com metadados para suportar análises e relatórios.
- AC:
  - Consulta por intervalo de tempo disponível.
  - Metadados exibem fonte, versão e última ingestão.
  - Backup/restore testado e documentado.
- Prioridade: Must
- Relaciona: RF03; RF-ML-02, RF-ML-14; RNF06, RNF-ML-08

#### H-003 — Validação de dados na ingestão (DQ)

- História: Como Engenheiro de Dados, eu quero regras de Data Quality na ingestão para bloquear ou sinalizar cargas com qualidade insuficiente.
- AC:
  - Regras DQ configuráveis aplicadas automaticamente.
  - Dashboard de DQ mostra taxas de missing/outliers.
  - Notificações enviadas em falhas de qualidade.
- Prioridade: Must
- Relaciona: RF04; RF-ML-03; RNF07, RNF-ML-07

#### H-004 — Previsões diárias por reservatório

- História: Como Gestor Operacional, eu quero receber previsões diárias de nível para cada reservatório (D+1, D+7, D+14, D+30) para planejar operações.
- AC:
  - Previsões geradas automaticamente diariamente.
  - Histórico de runs e versionamento das previsões disponível.
  - Previsões consumíveis via integração autenticada.
- Prioridade: Must
- Relaciona: RF05, RF08; RF-ML-08, RF-ML-11; RNF02, RNF-ML-02

#### H-005 — Dashboard público com nível e previsão

- História: Como Cidadão, eu quero visualizar nível atual e previsão simplificada no dashboard público para entender a situação hídrica.
- AC:
  - Dashboard responsivo e em PT‑BR.
  - Última atualização e horizonte da previsão exibidos.
  - Faixa de incerteza (ex.: PI90) visível com explicação simples.
- Prioridade: Must
- Relaciona: RF08, RF18; RF-ML-11, RF-ML-14; RNF01, RNF-ML-01

#### H-006 — Alertas configuráveis por gatilho (e-mail)

- História: Como Operador, eu quero configurar alertas por gatilhos (thresholds/tendências) para ser notificado sobre situações críticas.
- AC:
  - Configuração por reservatório e tipo de gatilho.
  - Envio de e‑mail em ≤ 5 minutos após gatilho.
  - Histórico de alertas disponível e pesquisável.
- Prioridade: Must
- Relaciona: RF11; RF-ML-10; RNF02, RNF-ML-02

#### H-007 — Integração autenticada para consumo (API)

- História: Como Desenvolvedor de Sistemas, eu quero uma API autenticada para consumir séries, previsões e metadados para integrar a plataforma a outros sistemas.
- AC:
  - Autenticação (token/OAuth) implementada.
  - Versionamento de API documentado.
  - Latência P95 ≤ 2 s em condições normais.
- Prioridade: Must
- Relaciona: RF12; RF-ML-11; RNF04, RNF-ML-05

#### H-008 — Logs e auditoria

- História: Como Administrador/Compliance, eu quero logs e trilhas de auditoria das ações, runs e deploys para garantir rastreabilidade.
- AC:
  - Logs retidos e pesquisáveis por 12 meses.
  - Eventos de treino, retrain e deploy registrados.
  - Export dos logs disponível (CSV/JSON).
- Prioridade: Must
- Relaciona: RF14; RNF06, RNF-ML-09

---

### SHOULD

#### H-009 — Exibir incerteza nas previsões (PI50/PI90)

- História: Como Usuário (técnico ou público), eu quero ver intervalos de incerteza (PI50/PI90) para interpretar a confiança nas previsões.
- AC:
  - PI50 e PI90 apresentados junto à previsão.
  - Relatório de calibração indicando cobertura (PI90 entre 85–95%).
- Prioridade: Should
- Relaciona: RF06; RF-ML-09; RNF-ML-08

#### H-010 — Dashboards autenticados (internos)

- História: Como Técnico, eu quero dashboards autenticados com visualizações avançadas e export para análise detalhada.
- AC:
  - Login com RBAC configurável.
  - Visualizações técnicas (timeseries, residuais, métricas) disponíveis.
  - Export CSV / PDF funcional.
- Prioridade: Should
- Relaciona: RF09; RF-ML-14; RNF04

#### H-011 — Simulações de cenários

- História: Como Planejador, eu quero simular cenários de chuva e consumo para avaliar impactos nos níveis futuros.
- AC:
  - Inserir cenários (ex.: +20% chuva, -10% consumo).
  - Simulação para horizontes D+1..D+30.
  - Resultados exportáveis e comparáveis com baseline.
- Prioridade: Should
- Relaciona: RF07; RF-ML-08; RNF03

#### H-012 — Relatórios automáticos (PDF/CSV)

- História: Como Coordenador, eu quero relatórios automáticos periódicos em PDF/CSV para comunicação com stakeholders.
- AC:
  - Geração agendada com templates customizáveis.
  - Inclusão de metadados e anexos CSV.
  - Entrega por e‑mail e armazenamento no repositório.
- Prioridade: Should
- Relaciona: RF10; RNF12; RF-ML-14

#### H-013 — Testes E2E / CI para pipelines e modelos

- História: Como Engenheiro DevOps, eu quero pipelines CI/CD e testes E2E para assegurar qualidade em deploys de infra e modelos.
- AC:
  - Pipelines automatizadas com testes unitários e de integração.
  - Testes de regressão para modelos antes do deploy.
  - Gates de promoção (staging → production).
- Prioridade: Should
- Relaciona: RF15; RNF09; RNF-ML-10

#### H-014 — Monitoramento de performance e detecção de drift

- História: Como Cientista de Dados, eu quero monitorar performance e detectar drift (dados/perf.) para acionar retrain quando necessário.
- AC:
  - Dashboards de drift (PSI, ΔMAE) disponíveis.
  - Alertas configuráveis (ex.: PSI > 0.2 ou ΔMAE > 20%).
  - Logs de eventos e ações tomadas.
- Prioridade: Should
- Relaciona: RF05; RF-ML-12; RNF-ML-09

#### H-015 — Retraining automatizado por gatilho

- História: Como Engenheiro de MLOps, eu quero re-treinar modelos automaticamente por gatilho para manter performance.
- AC:
  - Retrain acionado por gatilho ou agendamento.
  - Validação pós‑treino e deploy controlado (canary/blue-green).
  - Relatório de comparação anterior vs novo modelo.
- Prioridade: Should
- Relaciona: RF-ML-12; RNF-ML-11; RF05

---

### COULD

#### H-016 — Web‑scraping fallback para fontes públicas

- História: Como Engenheiro de Dados, eu quero um mecanismo de web‑scraping como fallback para capturar fontes públicas quando fontes primárias falham.
- AC:
  - Scraper configurável e versionado.
  - Resultados passam por regras DQ antes de serem aceitos.
  - Logs e indicador de uso de fallback.
- Prioridade: Could
- Relaciona: RF02; RF-ML-01/RF-ML-02; RNF10

#### H-017 — Chatbot público (linguagem natural)

- História: Como Usuário Público, eu quero um chatbot que responda perguntas simples sobre níveis e previsões em linguagem natural.
- AC:
  - Cobertura das principais FAQs e consultas básicas.
  - Fallback para link do dashboard quando necessário.
  - Logs de interação e métricas de satisfação.
- Prioridade: Could
- Relaciona: RF13; RF-ML-13; RNF-ML-01

#### H-018 — Exportação GIS / GeoJSON

- História: Como Analista GIS, eu quero exportar dados georreferenciados (GeoJSON) para integrar a informação em sistemas de geoprocessamento.
- AC:
  - Export GeoJSON por bacia/reservatório com metadados de projeção.
  - Opção de filtrar por período e versão de dados.
  - Documentação do schema disponível.
- Prioridade: Could
- Relaciona: RF16; RF-ML-14; RNF12

#### H-019 — Recomendações de racionamento (advisor)

- História: Como Gestor, eu quero recomendações operacionais (ex.: racionamento sugerido) baseadas nas previsões para suportar decisões.
- AC:
  - Recomendações com justificativa (probabilidade e PI).
  - Workflow de aprovação manual antes de execução.
  - Registro das recomendações e decisões.
- Prioridade: Could
- Relaciona: RF17; RF-ML-10, RF-ML-08; RNF08

#### H-020 — Explainability detalhada (SHAP + texto)

- História: Como Engenheiro/Analista Sênior, eu quero explicabilidade detalhada (SHAP + texto) das previsões para entender drivers e validar modelos.
- AC:
  - Sumário SHAP para cada previsão disponível.
  - Texto explicativo gerado automaticamente com as principais features.
  - Latência da explicação aceitável (≤ 2 s para amostra).
- Prioridade: Could
- Relaciona: RF06; RF-ML-13; RNF-ML-09

---

### WON'T (v1 / Roadmap)

#### H-021 — Integração SMS/WhatsApp para alertas

- História: Como Operador, eu gostaria de receber alertas por SMS/WhatsApp. (Won't na versão inicial por custos e requisitos legais)
- Prioridade: Won't
- Relaciona: RF11

#### H-022 — Tradução completa para inglês no lançamento

- História: Como Público Internacional, eu gostaria que toda a interface fosse traduzida para inglês no lançamento. (Won't na versão inicial; roadmap para EN)
- Prioridade: Won't
- Relaciona: RNF11

### Histórico de Versão

| Versão | Data       | Descrição            | Autor   | Revisor |
| :----: | ---------- | -------------------- | ------- | ------- |
| `1.0`  | 20/10/2025 | Criação do documento | Gabriel | Hugo    |
