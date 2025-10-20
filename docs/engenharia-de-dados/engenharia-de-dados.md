# ML-CANVA, Requisitos de ML, variáveis e especificações

## Objetivo

Prever níveis dos reservatórios do DF (Descoberto e Santa Maria) e precipitação (curto e médio prazo) para apoiar decisões e informar a sociedade. Horizontes: diário/semanal/mensal (nível) e 1h/6h/24h (chuva).

## ML CANVA

<iframe width="768" height="496" src="https://miro.com/app/live-embed/uXjVJJuUkZ0=/?focusWidget=3458764644976172989&embedMode=view_only_without_ui&embedId=872430688640" frameborder="0" scrolling="no" allow="fullscreen; clipboard-read; clipboard-write" allowfullscreen></iframe>

## Requisitos de ML (Essenciais)

## Critério de Classificação de Prioridade

Método: MoSCoW (Must/Should/Could).

Regras de decisão:

1. Impacto na decisão operacional e na segurança hídrica (alto, médio, baixo).
2. Contribuição direta para as métricas-alvo do modelo (chuva e nível).
3. Dependência/crítica de dados (disponível hoje vs. lacunas) e esforço de implementação.

Mapeamento:

- Must: Alto impacto + contribuição direta + dados viáveis de curto prazo.
- Should: Alto/médio impacto, contribui indiretamente ou requer dado/impl. adicional moderado.
- Could: Valor contextual, não crítico para a 1ª versão operacional.

---

## Requisitos Funcionais de ML (Essenciais)

| ID    | Requisito                       | Descrição                                                                                                                              | Prioridade | Métrica de Aceitação                                                                                | Dependências/Notas                                                |
| ----- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| RF-01 | Ingestão INMET                  | Coletar dados hora a hora de precipitação, temperatura, umidade, pressão, vento e radiação das estações relevantes às bacias.          | Must       | Cobertura ≥ 95% das horas; atraso de ingestão < 15 min.                                             | Conectores INMET; seleção de estações por proximidade das bacias. |
| RF-02 | Ingestão Níveis                 | Ingerir telemetria de nível (LAI/Power BI) e consolidar em granularidade diária.                                                       | Must       | Sucesso de carga ≥ 99% dos dias; validações físicas sem erros críticos.                             | Santa Maria (PDF→CSV) e Descoberto (Power BI/LAI).                |
| RF-03 | Padronização e Limpeza          | Unidades (mm, °C, m, m³), timezone (UTC+local); remoção de sentinelas (-9999), nulos e outliers.                                       | Must       | 0 sentinelas em treino/serving; schemas validados; testes de qualidade aprovados.                   | Regras de validação e dicionário de dados.                        |
| RF-04 | Engenharia de Atributos         | Cálculo de lags, janelas móveis, tendência, acumulados (3h, 6h, 12h, 24h, 7d, 30d), dias secos e codificação cíclica (hora, mês, DOY). | Must       | Reprodutibilidade entre treino e serving (PSI < 0,2); execução diária < 10 min.                     | Feature store/pipeline de features.                               |
| RF-05 | Estimativa de Evaporação        | Estimar evaporação (Penman-Monteith) com INMET (temp, umidade, radiação, vento).                                                       | Should     | Cobertura ≥ 90% dos dias; sem valores negativos.                                                    | Radiação pode ter lacunas — prever imputação.                     |
| RF-06 | Modelo de Chuva (Classificação) | “Vai chover?” para 1h, 6h, 24h.                                                                                                        | Must       | ROC-AUC (1h) ≥ 0,80; CSI ≥ 0,40 para eventos > 20 mm/24h.                                           | Baselines superados; validação temporal.                          |
| RF-07 | Modelo de Chuva (Regressão)     | Volume de precipitação (mm) 1h/6h/24h.                                                                                                 | Should     | RMSE 24h < 5 mm; MAE 24h < 3 mm; PI90 calibrado (85–95%).                                           | Ensemble LSTM + XGBoost opcional.                                 |
| RF-08 | Modelo de Nível (Híbrido)       | Balanço hídrico + ML de resíduos para horizontes 1/7/14/30 dias.                                                                       | Must       | MAE: D+1 < 0,10 m; D+7 < 0,30 m; D+14 < 0,50 m; tendência correta D+30 ≥ 80%.                       | Requer chuva agregada por bacia, evaporação e demanda proxy.      |
| RF-09 | Incerteza                       | Intervalos de predição 50% e 90% para chuva e nível.                                                                                   | Must       | PI90 com cobertura 85–95% em validação; curva de calibração estável.                                | Quantile models/ensembles ou conformal prediction.                |
| RF-10 | Alertas Operacionais            | Alertas por limiar (atenção/alerta/emergência) e tendência, com antecedência configurável.                                             | Must       | Alerta emitido com ≥ 14 dias de antecedência para cruzar limiar; ≤ 1 falso-alarme/mês/reservatório. | Webhook/e-mail; histerese de gatilhos.                            |
| RF-11 | API de Previsões                | Endpoints REST: /forecast/rain, /forecast/reservoir, /scenarios, /metrics, /health.                                                    | Must       | Latência P95 ≤ 2 s; documentação OpenAPI; versionamento v1.                                         | Cache p/ horizontes padrão.                                       |
| RF-12 | Monitoramento e Re-treino       | Métricas on-line, detecção de drift (dados/performance) e re-treino automático.                                                        | Must       | PSI > 0,2 ou ΔMAE>20% dispara re-treino; logs e relatórios mensais.                                 | MLflow/observabilidade; agendador.                                |
| RF-13 | Explicabilidade                 | Importância de variáveis (SHAP/feature importance) e justificativa do alerta.                                                          | Should     | Disponível via API e painel; inferência de explicação < 2 s por previsão.                           | Cálculo amostral para lotes.                                      |
| RF-14 | Painéis                         | Painel público (dados abertos) e painel interno (avançado).                                                                            | Should     | Atualização automática (chuva: hora; nível: diária); RBAC no interno.                               | Exportação para Power BI/CSV.                                     |

---

## Requisitos Não Funcionais de ML (Essenciais)

| ID     | Categoria          | Requisito                                         | Meta/Alvo                                                        | Escopo                         | Validação                         |
| ------ | ------------------ | ------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------ | --------------------------------- |
| RNF-01 | Disponibilidade    | SLA de serviço (APIs e painéis)                   | ≥ 99,5% mensal                                                   | Previsões e UIs                | Monitor de uptime/SLA.            |
| RNF-02 | Desempenho         | Latência de inferência on-demand                  | P95 ≤ 2 s                                                        | Endpoints /forecast            | Teste de carga/APM.               |
| RNF-03 | Freshness          | Atualização operacional                           | Chuva: hora a hora; Nível: diária                                | Pipelines de produção          | SLIs de atraso.                   |
| RNF-04 | Escalabilidade     | Suporte a multiestações e múltiplos reservatórios | ≥ 5× a carga atual                                               | ETL e inferência               | Stress tests horizontais.         |
| RNF-05 | Segurança          | HTTPS/TLS, RBAC e rotação de chaves               | 100% tráfego criptografado                                       | APIs internas e painel interno | Pentest e revisão de políticas.   |
| RNF-06 | Conformidade       | LGPD e dados públicos                             | Sem PII; termos e limites de uso                                 | Painel público/API aberta      | Revisão jurídica/documental.      |
| RNF-07 | Qualidade de Dados | Contratos de esquema e validações físicas         | Quebra de esquema bloqueia carga; 0 sentinelas em serving        | Camada de dados                | Testes DQ automatizados.          |
| RNF-08 | Reprodutibilidade  | Versionamento de dados/modelos                    | Runs rastreáveis; seeds definidos                                | Treino/serving                 | Rebuild reprodutível do artefato. |
| RNF-09 | Observabilidade    | Logs, métricas e tracing                          | Dashboards + alertas de falhas/degradação                        | Serviços e modelos             | SLOs e alertas configurados.      |
| RNF-10 | MLOps              | CI/CD, orquestração e testes E2E                  | Pipelines declarativas; build verde                              | ETL, treino, deploy            | Gate de release com testes.       |
| RNF-11 | Re-treinamento     | Cadência e gatilhos                               | Chuva: mensal; Nível: trimestral ou por drift (PSI>0,2/ΔMAE>20%) | Modelos principais             | Agendador + relatório.            |
| RNF-12 | Documentação       | OpenAPI e guias de uso/limites                    | Atualizada a cada release                                        | APIs e painéis                 | Checagem em release gate.         |

---

## Metas-Chave do Produto (ligadas aos RF/RNF)

- Chuva: ROC-AUC (1h) ≥ 0,80; RMSE (24h) < 5 mm; CSI ≥ 0,40 (≥ 20 mm/24h).
- Nível: MAE D+1 < 0,10 m; D+7 < 0,30 m; D+14 < 0,50 m; tendência correta D+30 ≥ 80%.
- Alertas: antecedência média ≥ 14 dias para cruzar limiar crítico com PI90 exibido e calibrado.

## Critérios de aceitação

- Chuva: ROC-AUC > 0,80 (1h); RMSE < 5 mm (24h); CSI ≥ 0,4 para >20 mm/24h.
- Nível: MAE < 0,10 m (D+1); < 0,30 m (D+7); < 0,50 m (D+14); sinal correto ≥ 80% em D+30.
- Limiar crítico previsto com 14 dias de antecedência.

## Variáveis — Barragem (nível)

| Variável                          | Tipo             | Importância | O que faz                            |
| --------------------------------- | ---------------- | ----------- | ------------------------------------ |
| Nível do reservatório (histórico) | Numérica (m/cm)  | Crítica     | Alvo e componente autoregressiva.    |
| Precipitação na bacia             | Numérica (mm)    | Crítica     | Principal entrada (inflow).          |
| Chuva acumulada (3, 7, 30d)       | Derivada (mm)    | Crítica     | Satura solo, aumenta runoff.         |
| Dias desde última chuva           | Derivada (dias)  | Alta        | Proxy de umidade do solo.            |
| Tendência do nível (1, 7, 30d)    | Derivada (m/dia) | Alta        | Velocidade/aceleração de enchimento. |
| Consumo/retirada estimada         | Numérica (m³/d)  | Alta        | Saída do balanço hídrico.            |
| Evaporação estimada               | Derivada (mm/d)  | Alta        | Perda por superfície.                |
| Temperatura                       | Numérica (°C)    | Alta        | Evaporação/demanda.                  |
| Umidade relativa                  | Numérica (%)     | Alta        | Evaporação e ligação com chuva.      |
| Vento (velocidade)                | Numérica (m/s)   | Alta        | Aumenta evaporação.                  |
| Radiação solar                    | Numérica (kJ/m²) | Média       | Evaporação e sazonalidade.           |
| Produção ETA por manancial        | Numérica (m³/d)  | Média       | Retirada efetiva.                    |
| Perdas na distribuição            | Numérica (%)     | Média       | Ajusta consumo efetivo.              |
| População atendida                | Numérica         | Média       | Proxy de demanda.                    |
| Indicadores sazonais              | Categ/deriv.     | Alta        | Estação seca/úmida.                  |
| Eventos/regulações                | Categórica       | Baixa       | Restrições históricas.               |

## Variáveis — Previsão de chuva

| Variável                       | Tipo             | Importância | O que faz                    |
| ------------------------------ | ---------------- | ----------- | ---------------------------- |
| Precipitação (alvo)            | Numérica (mm)    | Crítica     | Probabilidade e volume.      |
| Umidade relativa               | Numérica (%)     | Crítica     | Disponibilidade de umidade.  |
| Temperatura do ar              | Numérica (°C)    | Crítica     | Convecção/estabilidade.      |
| Ponto de orvalho               | Numérica (°C)    | Crítica     | Proximidade da saturação.    |
| Pressão atmosférica            | Numérica (mB)    | Alta        | Sistemas de alta/baixa.      |
| Vento (velocidade)             | Numérica (m/s)   | Alta        | Transporte de umidade.       |
| Vento (direção)                | Numérica (graus) | Alta        | Padrões regionais.           |
| Radiação global                | Numérica (kJ/m²) | Média       | Energia para convecção.      |
| Chuva acumulada (3–24h; 7/30d) | Derivada (mm)    | Crítica     | Persistência do sistema.     |
| Tendência de umidade           | Derivada         | Alta        | Aumento/queda de umidade.    |
| Tendência de pressão           | Derivada         | Alta        | Aproximação de sistemas.     |
| DTR (amplitude térmica)        | Derivada (°C)    | Média       | Estabilidade da CLP.         |
| Codificação cíclica            | Derivada         | Alta        | Ciclo diurno e sazonalidade. |
| ENSO/MJO (opcional)            | Numérica         | Benéfica    | Padrões de grande escala.    |

## Riscos e mitigação

- Descoberto sem série estruturada: extrair Power BI/LAI.
- SINISA anual: servir como contexto; solicitar produção diária à CAESB.
- Evaporação: estimar com Penman-Monteith e buscar dados regionais.

### Histórico de Versão

| Versão | Data       | Descrição            | Autor   | Revisor |
| :----: | ---------- | -------------------- | ------- | ------- |
| `1.0`  | 20/10/2025 | Criação do documento | Gabriel | Hugo    |
