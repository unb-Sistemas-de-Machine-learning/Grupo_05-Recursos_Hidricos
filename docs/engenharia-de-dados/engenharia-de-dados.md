# Engenharia de Dados e Machine Learning (ML)

## Objetivo do ML no ÁguaPrev

O principal objetivo do subsistema de Machine Learning no ÁguaPrev é **prever os níveis dos reservatórios do Distrito Federal** (como Descoberto e Santa Maria) e a **precipitação** (chuva) em diferentes horizontes de tempo. Essas previsões visam apoiar a tomada de decisões na gestão hídrica e informar a sociedade, abordando horizontes diários, semanais e mensais para níveis, e horários para precipitação.

## ML CANVA e Requisitos de ML

O projeto detalha um **ML CANVA** e uma série de **Requisitos Funcionais de ML (RF-ML)** e **Requisitos Não-Funcionais (RNF-ML)**. Esses requisitos abrangem todo o ciclo de vida de um sistema de ML, desde a ingestão e preparação de dados, engenharia de atributos, escolha e avaliação de modelos, até o monitoramento em produção, explicabilidade e governança.

Alguns requisitos chave incluem:
*   **RF-ML-01 (Ingestão INMET):** Coleta de dados horários de precipitação, temperatura, umidade, etc.
*   **RF-ML-02 (Ingestão Níveis):** Ingestão de telemetria de nível e consolidação diária.
*   **RF-ML-03 (Padronização e Limpeza):** Tratamento de unidades, timezone, remoção de outliers.
*   **RF-ML-04 (Engenharia de Atributos):** Criação de features como lags, janelas móveis, acumulados.
*   **RF-ML-06 (Chuva - classificação) e RF-ML-07 (Chuva - regressão):** Modelos para prever ocorrência e volume de chuva.
*   **RF-ML-08 (Nível - híbrido):** Modelos de nível utilizando balanço hídrico + ML.
*   **RF-ML-11 (Disponibilização de previsões):** Exposição das previsões via API.
*   **RNF-MLs:** Cobrem aspectos como Disponibilidade, Desempenho, Freshness dos dados, Escalabilidade, Segurança, Reprodutibilidade, Observabilidade e MLOps.

## 2.1 Formulação do Problema e Escolha de Métricas

*   **Problema claramente formulado:** Sim, o objetivo é prever níveis de reservatórios e precipitação para auxiliar na gestão de recursos hídricos.
*   **Métricas de avaliação:** O documento especifica métricas apropriadas para cada tipo de previsão:
    *   **Classificação de Chuva:** ROC-AUC e CSI.
    *   **Regressão de Chuva:** RMSE e MAE.
    *   **Previsão de Nível:** MAE para diferentes horizontes (D+1, D+7, etc.).
    *   **Incerteza:** Cobertura de Intervalos de Predição (PI50/PI90).
    *   **Alertas Operacionais:** Taxa de Falsos Positivos (FP).
*   **Conexão com objetivo de negócio/produto:** As previsões impactam diretamente as decisões operacionais (gestão de reservatórios) e informam a sociedade sobre a situação hídrica.

## 2.2 Preparação e Divisão dos Dados

A preparação de dados é uma etapa crucial e está diretamente ligada aos scripts de ingestão e ao backend.

*   **Tratamento básico de dados:** Os scripts `hidro_ingest.py` e `hidro_api.py` são responsáveis por extrair dados da API da ANA. A etapa de **Padronização e Limpeza (RF-ML-03)** garante que os dados sejam tratados (unidades, timezone, remoção de outliers/sentinelas) antes de serem utilizados pelos modelos.
*   **Divisão adequada em treino/validação/teste:** Embora não explicitamente detalhado na implementação atual do `app.py` (que foca na API), os **RNF-MLs** (como RNF-ML-08 Reprodutibilidade) indicam a intenção de versionar datasets e features para garantir a reprodutibilidade dos experimentos de ML.
*   **Cuidados com vazamento de dados e equilíbrio de classes:** Os requisitos de ML implicam a necessidade de validações de DQ (Data Quality) e a proteção de dados, conforme **RNF-ML-07 (Qualidade de Dados)** e **RNF-ML-05 (Segurança)**.

### Papel dos scripts `hidro_ingest.py` e `hidro_api.py`:

*   **`hidro_api.py`**: Atua como um cliente Python para a API HidroWeb da ANA, encapsulando as chamadas e a lógica para obter dados brutos de inventário de estações e séries temporais (cota, vazão, chuva). Ele é a **camada de extração (Extract)**.
*   **`hidro_ingest.py`**: Este script utiliza o `hidro_api.py` para coletar os dados e é responsável pela **transformação e carga (Transform, Load)**. Ele processa os dados brutos, aplica alguma lógica de tratamento (mesmo que básica inicialmente) e os armazena no banco de dados SQLite do projeto. Ele também contém comandos CLI (`flask hidro-inventory`, `flask hidro-ingest`, etc.) para gerenciar essa ingestão de forma programática.

Esses scripts formam a fundação da **Feature Store e Pipelines (RF-ML-14)** mencionadas nos requisitos, onde os dados brutos são transformados em features prontas para o consumo por modelos de ML.

## 2.3 Escolha e Justificativa do Modelo

*   **Modelo escolhido é coerente com o problema e os dados:** Para a previsão da cota dos reservatórios, foram implementados e avaliados dois modelos principais:
    1.  **RandomForest:** Um modelo de ensemble baseado em árvores de decisão. Foi escolhido por sua robustez, capacidade de capturar interações não-lineares entre as features e bom desempenho geral.
    2.  **SARIMA:** Um modelo estatístico clássico para séries temporais que leva em conta a sazonalidade. Serve como um baseline robusto e um ponto de comparação para o modelo de machine learning.

*   **Engenharia de Features Aplicada:** Para alimentar o modelo RandomForest, foram criadas diversas features a partir dos dados brutos de cota e chuva:
    *   **Lags:** Valores da cota em instantes passados (ex: `lag_1` para 15 min antes, `lag_4` para 1h antes, `lag_96` para 24h antes).
    *   **Deltas:** Variação da cota entre diferentes instantes (ex: `delta_15m`, `delta_1h`).
    *   **Agregações de Chuva:** Soma da precipitação em diferentes janelas de tempo (ex: `chuva_sum_1h`, `chuva_sum_24h`).

*   **Justificativa clara da escolha:** O RandomForest foi priorizado pela sua flexibilidade em incorporar diversas features exógenas (como chuva e seus derivados), o que é mais complexo em modelos SARIMA puros. A comparação entre eles permite validar a eficácia da abordagem de machine learning.

## 2.4 Análise de Resultados e Erros

*   **Interpretação dos resultados obtidos:** A performance dos modelos é monitorada principalmente pelo **Erro Absoluto (MAE)** e **Erro Absoluto Percentual (MAPE)**.
    *   Nos testes realizados, o modelo **RandomForest demonstrou uma performance excelente para horizontes de previsão curtos**, mantendo um erro absoluto percentual abaixo de 5% para previsões de até 7 dias no futuro.

*   **Identificação de principais erros/limitações:**
    *   **Degradação da Acurácia:** Após o horizonte de 7 dias, a incerteza dos dados aumenta significativamente, e a acurácia do modelo diminui, tornando as previsões menos confiáveis.
    *   **Necessidade de Re-treino:** O modelo RandomForest, por sua natureza, não extrapola tendências futuras e depende dos padrões aprendidos nos dados de treino. Por isso, para manter sua acurácia, ele **precisa ser re-treinado diariamente** com os dados mais recentes. Em contraste, o modelo SARIMA pode se adaptar melhor a tendências ao longo do tempo, mas apresenta menor acurácia geral em curtos prazos.

*   **Discussão de possíveis melhorias futuras:**
    *   **Alertas e Tendências:** Implementar um sistema de alertas que use a previsão para classificar a tendência futura da cota (subindo, descendo, estável).
    *   **Feature Engineering Avançada:** Incorporar novas features que possam capturar melhor a dinâmica do sistema hídrico. O `RELATORIO_ANALISE_BARRAGENS.pdf` contém estudos sobre features potenciais.
    *   **Automação do Re-treino:** Migrar o processo de re-treino manual para um pipeline automatizado (MLOps) que execute diariamente, gere os novos artefatos e atualize o backend sem intervenção manual.

## Conclusão da Análise de ML

O projeto ÁguaPrev evoluiu de uma plataforma de visualização de dados para um sistema completo que incorpora um pipeline de Machine Learning para previsões. O backend não apenas serve dados históricos, mas também implementa um sistema de inferência online através da rota `/prever`, utilizando modelos pré-treinados (como RandomForest) para gerar previsões de cota em tempo real.

Os scripts de ingestão (`hidro_api.py`, `hidro_ingest.py`) são a base que alimenta tanto o banco de dados histórico quanto o processo de treinamento offline, fechando o ciclo de ponta a ponta do sistema de ML, desde a coleta de dados até a entrega de previsões ao usuário final.