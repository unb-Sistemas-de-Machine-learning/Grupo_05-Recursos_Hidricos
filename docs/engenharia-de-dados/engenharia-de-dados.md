# ML-CANVA, Requisitos de ML, variáveis e especificações

## Objetivo

Prever níveis dos reservatórios do DF (Descoberto e Santa Maria) e precipitação (curto e médio prazo) para apoiar decisões e informar a sociedade. Horizontes: diário/semanal/mensal (nível) e 1h/6h/24h (chuva).

## ML CANVA

<iframe width="768" height="496" src="https://miro.com/app/live-embed/uXjVJJuUkZ0=/?focusWidget=3458764644976172989&embedMode=view_only_without_ui&embedId=872430688640" frameborder="0" scrolling="no" allow="fullscreen; clipboard-read; clipboard-write" allowfullscreen></iframe>

## Requisitos de ML (Essenciais)

Requisitos funcionais específicos do subsistema de ML: ingestão para modelos, pipelines de features, treino, inferência, incerteza e alertas.

| ID       | Requisito                     | Descrição                                                                                   | Prioridade | Métrica / Critério de Aceitação (resumo)                    |
| -------- | ----------------------------- | ------------------------------------------------------------------------------------------- | ---------: | ----------------------------------------------------------- |
| RF-ML-01 | Ingestão INMET                | Coletar dados hora a hora de precipitação, temperatura, umidade, pressão, vento e radiação. |       Must | Cobertura ≥95% horas; atraso <15 min; logs.                 |
| RF-ML-02 | Ingestão Níveis               | Ingerir telemetria de nível (LAI/Power BI) e consolidar diário.                             |       Must | Carga diária ≥99%; validações físicas.                      |
| RF-ML-03 | Padronização e Limpeza        | Unidades, timezone; remoção de sentinelas/outliers; validações DQ.                          |       Must | Schemas validados; 0 sentinelas em serving.                 |
| RF-ML-04 | Engenharia de Atributos       | Lags, janelas móveis, acumulados (3h..30d), codificação cíclica; reproducibilidade.         |       Must | Feature build reproducível; execução <10 min.               |
| RF-ML-05 | Estimativa de Evaporação      | Cálculo Penman‑Monteith ou proxy com INMET.                                                 |     Should | Cobertura ≥90% dias; sem valores negativos.                 |
| RF-ML-06 | Chuva (classificação)         | Modelo binário para ocorrência de chuva (1h/6h/24h).                                        |       Must | ROC‑AUC(1h) ≥0.80; CSI ≥0.40 em eventos relevantes.         |
| RF-ML-07 | Chuva (regressão)             | Previsão de volume (mm) para 1h/6h/24h.                                                     |     Should | RMSE24h <5 mm; MAE24h <3 mm (meta).                         |
| RF-ML-08 | Nível (híbrido)               | Modelo de nível: balanço hídrico + ML sobre resíduos para D+1/7/14/30.                      |       Must | MAE D+1 <0.10m; D+7 <0.30m; D+14 <0.50m.                    |
| RF-ML-09 | Incerteza                     | Calcular intervalos de predição (PI50/PI90) e calibração.                                   |       Must | PI90 cobertura 85–95%.                                      |
| RF-ML-10 | Alertas Operacionais (ML)     | Scores e regras para gerar alertas probabilísticos e tendências.                            |       Must | Antecedência ≥14 dias quando aplicável; taxa de FP ≤ 1/mês. |
| RF-ML-11 | Disponibilização de previsões | Expor previsões, metadados e PIs via API para consumo autenticado.                          |       Must | Latência P95 ≤2s; versionamento de modelos.                 |
| RF-ML-12 | Monitoramento & Re-treino     | Métricas on‑line, detecção de drift (dados/perf.) e pipelines de re‑treino.                 |       Must | PSI>0.2 ou ΔMAE>20% → trigger; logs e histórico de retrain. |
| RF-ML-13 | Explicabilidade               | SHAP/feature importance e justificativa do alerta.                                          |     Should | Disponível via API/painel; geração <2s para amostra.        |
| RF-ML-14 | Feature Store e Pipelines     | Feature store versionada e pipelines reproducíveis para treino/serving.                     |       Must | Features versionadas; snapshots para treino.                |

### Requisitos Não‑Funcionais

#### Objetivo

Definir requisitos não‑funcionais específicos do subsistema ML: reprodutibilidade, governança de modelos, observabilidade ML, latência de inferência, throughput, segurança de dados para treino e inferência, gestão de versões e políticas de retrain.

#### RNF-ML (Lista detalhada)

| ID        | Categoria                       | Requisito                                                                  | Meta / Critério de Aceitação                                                                  |
| --------- | ------------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| RNF-ML-01 | Disponibilidade                 | Serviços de inferência e pipelines ML devem ter SLA alto.                  | SLA serviços ML ≥ 99.5% mensal; monitoramento de jobs; alerts.                                |
| RNF-ML-02 | Desempenho                      | Latência e tempo de construção de features devem atender SLAs.             | P95 inferência ≤ 2 s; feature build batch < 10 min para janelas diárias; throughput definido. |
| RNF-ML-03 | Freshness                       | Features e dados de entrada atualizados conforme necessidade do modelo.    | Chuva: hourly; Nível: daily — garantido por pipelines; metricas de freshnes.                  |
| RNF-ML-04 | Escalabilidade                  | Suporte a aumento do número de estações, reservatórios e volume histórico. | Escalar horizontalmente ≥5× volume; testes de carga para training/inference.                  |
| RNF-ML-05 | Segurança                       | Proteção de dados de treino/inferência e controle de acesso a modelos.     | Criptografia dados sensíveis; RBAC para model registry; logs de acesso a modelos.             |
| RNF-ML-06 | Conformidade                    | Garantir privacidade e compliance nos datasets usados para treino.         | PII removido/anonimizado; aprovações de dataset; retenção e auditoria.                        |
| RNF-ML-07 | Qualidade de Dados              | Validações rigorosas antes de usar dados em treino/serving.                | Regras DQ aplicadas; quórum de validação; bloqueio automático em caso de quebra de esquema.   |
| RNF-ML-08 | Reprodutibilidade               | Experimentos e runs devem ser reprodutíveis.                               | Versionamento dataset/features/model; seeds definidos; artefatos armazenados.                 |
| RNF-ML-09 | Observabilidade ML              | Métricas de performance, confiança e drift expostas.                       | Dashboards de MAE/RMSE, ROC, PSI; alertas para thresholds.                                    |
| RNF-ML-10 | MLOps / CI-CD                   | Pipelines para treino, validação e deployment automatizados.               | Pipelines automatizados com testes (unit/integration/regression); aprovações para deploy.     |
| RNF-ML-11 | Re-treinamento                  | Estratégias, frequência e gatilhos de retrain definidos.                   | Retrain mensal (chuva) e trimestral/por drift (nível) ou por gatilho; logs de retrain.        |
| RNF-ML-12 | Latência e Throughput           | Performance para servir previsões em produção.                             | Latência P95 ≤2s; suportar X requests/s (definir com base em uso); autoscaling.               |
| RNF-ML-13 | Explicabilidade e Transparência | Modelos devem fornecer mecanismos de explicação e justificativas.          | SHAP/feature importance disponível; relatórios de fairness e viés (se aplicável).             |
| RNF-ML-14 | Governança de Modelos           | Versionamento, aprovação e ciclo de vida do modelo.                        | Model registry; aprovação manual/automática; políticas de retirement e rollback.              |
| RNF-ML-15 | Testabilidade                   | Testes automatizados para modelos e pipelines.                             | Testes unitários e integração para transformações; testes de regressão de performance.        |
| RNF-ML-16 | Custo & Recursos                | Monitoring de custos e limites de recursos.                                | Budget alerts; otimização de training (spot/preemptible); quotas por projeto.                 |
| RNF-ML-17 | Documentação                    | Documentação técnica e de modelos disponível.                              | Artefatos de model card; descrição de features; OpenAPI para endpoints.                       |
| RNF-ML-18 | Backup & Recovery               | Recuperação de artefatos de treino e modelos.                              | Artefatos armazenados com backup; RTO/RPO definidos; testes periódicos.                       |

#### Métricas e Thresholds recomendados

- PSI threshold para drift: 0.1 alerta; 0.2 ação (retrain).
- ΔMAE threshold: 10% alerta; 20% ação.
- Cobertura de teste de integração: >80% para transforms críticos.
- Latência inferência (P95) ≤ 2s; Throughput conforme expectativa de consumidores.

#### Observabilidade e Monitoramento ML

- Métricas por modelo: MAE/RMSE, ROC‑AUC, calibration (PI coverage), uptime, latência.
- Métricas de dados: missing rate, distribution shifts (PSI/KL), feature nulls.
- Logs de inferência: input hashes, model version, latency, error codes (para auditoria).
- Alertas automáticos e runbook para investigação de drift / queda de performance.

#### Reprodutibilidade e Experiment Tracking

- Ferramentas sugeridas: MLflow/Weights&Biases para tracking; DVC para versionamento de dados; S3/Blob para artefatos.
- Registrar hyperparams, seeds, metrics e ambiente (docker image, libs).
- Snapshots da feature store para treino e validação.

#### Políticas de Segurança e Privacidade para ML

- Treino com dados anonimizados quando possível.
- Acesso controlado ao data lake e feature store.
- Encriptação de artefatos sensíveis e logs.
- Revisão de compliance antes de liberar modelos para produção (model card).

#### Operações e Runbooks

- Runbooks para incidentes de inferência, drift, falhas de feature pipeline e retrain.
- Playbooks para rollback de modelos (imediato) e rollout canary.
- Planos de capacidade e testes de escalonamento (training/inference).

## Riscos e mitigação

- Descoberto sem série estruturada: extrair Power BI/LAI.
- SINISA anual: servir como contexto; solicitar produção diária à CAESB.
- Evaporação: estimar com Penman-Monteith e buscar dados regionais.

### Histórico de Versão

| Versão | Data       | Descrição            | Autor   | Revisor |
| :----: | ---------- | -------------------- | ------- | ------- |
| `1.0`  | 20/10/2025 | Criação do documento | Gabriel | Hugo    |
