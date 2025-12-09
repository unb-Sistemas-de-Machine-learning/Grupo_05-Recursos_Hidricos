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

*   **Modelo escolhido é coerente com o problema e os dados:** O documento não especifica modelos concretos, mas propõe tipos (classificação/regressão para chuva, híbrido para nível). A escolha futura deverá ser justificada, provavelmente com base nos dados preparados e nas métricas definidas.
*   **Comparação com baseline(s) simples:** Implícito nos requisitos de métricas e na análise de resultados.
*   **Justificativa clara da escolha:** Os requisitos sugerem que a escolha será fundamentada em desempenho (RMSE, MAE, ROC-AUC) e considerações operacionais (incerteza, alertas).

## 2.4 Análise de Resultados e Erros

*   **Interpretação dos resultados obtidos:** Os requisitos de **Monitoramento & Re-treino (RF-ML-12)** e **Observabilidade ML (RNF-ML-09)** destacam a necessidade de dashboards de métricas (MAE/RMSE, ROC, PSI), alertas e logs de inferência. Isso permite uma análise contínua dos resultados.
*   **Identificação de principais erros/limitações:** Os **Riscos e Mitigação** listados (Descoberto sem série estruturada, SINISA anual, Evaporação) já indicam um reconhecimento das limitações e desafios de dados. A **Explicabilidade (RF-ML-13)** via SHAP/feature importance também auxiliará na compreensão de erros.
*   **Discussão de possíveis melhorias futuras:** O roadmap de ML (RF-MLs) é, em si, uma discussão de melhorias contínuas.

## Conclusão da Análise de ML

Embora o código atual do backend (`app.py`) atue principalmente como um servidor de API para dados já processados e coletados, o projeto ÁguaPrev possui uma visão de Machine Learning muito bem definida e detalhada no documento de Engenharia de Dados. Os scripts de ingestão (`hidro_api.py`, `hidro_ingest.py`) são componentes essenciais para a fase de preparação de dados que alimentará futuros modelos de ML, conforme os requisitos estabelecidos.

Portanto, o sistema não é *apenas* ETL e visualização; ele está construindo a infraestrutura para incorporar modelos de ML para previsão, que são o objetivo principal do subsistema de ML do projeto.