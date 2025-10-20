<iframe width="768" height="496" src="https://miro.com/app/live-embed/uXjVJJuUkZ0=/?focusWidget=3458764644977046944&embedMode=view_only_without_ui&embedId=766862868934" frameborder="0" scrolling="no" allow="fullscreen; clipboard-read; clipboard-write" allowfullscreen></iframe>

<iframe width="768" height="496" src="https://miro.com/app/live-embed/uXjVJJuUkZ0=/?focusWidget=3458764644977280665&embedMode=view_only_without_ui&embedId=951648967999" frameborder="0" scrolling="no" allow="fullscreen; clipboard-read; clipboard-write" allowfullscreen></iframe>

<iframe width="768" height="496" src="https://miro.com/app/live-embed/uXjVJJuUkZ0=/?focusWidget=3458764644977047822&embedMode=view_only_without_ui&embedId=537154312984" frameborder="0" scrolling="no" allow="fullscreen; clipboard-read; clipboard-write" allowfullscreen></iframe>

### Requisitos Funcionais — Produto

#### Objetivo

Lista dos requisitos funcionais do produto (RF) com descrição curta, prioridade MoSCoW e critérios de aceitação resumidos.

| ID   | Requisito                 | Descrição curta                                                        | Prioridade | Critério de Aceitação (resumo)                                      |
| ---- | ------------------------- | ---------------------------------------------------------------------- | ---------: | ------------------------------------------------------------------- |
| RF01 | Ingestão múltiplas fontes | Ingestão automática de dados (APIs, CSV/Excel, e‑mail, upload manual). |       Must | Conectores configuráveis; ingestão automática; logs; retry.         |
| RF02 | Fallback público          | Integração por web‑scraping para fontes públicas como fallback.        |      Could | Scraper configurável; DQ antes de aceitar dados.                    |
| RF03 | Repositório histórico     | Repositório centralizado time‑series com versionamento e lineage.      |       Must | Consultas por intervalo; versionamento de datasets; backup/restore. |
| RF04 | Data Quality pipeline     | Pipeline de validação e qualidade de dados (faltantes, outliers).      |       Must | Regras DQ aplicadas; dashboard DQ; alertas em violação.             |
| RF05 | Motor de previsão         | Modelos que geram previsões de nível/volume (diário/semana/mês).       |       Must | Runs agendados; histórico de previsões; endpoints de consumo.       |
| RF06 | Quantificação incerteza   | Expor intervalos e probabilidades nos produtos.                        |     Should | PI50/PI90 calculados e apresentados; documentação da calibração.    |
| RF07 | Simulação cenários        | Ferramenta para simular cenários e impactos.                           |      Could | Inputs de cenário; simulações D+1..D+30; export dos resultados.     |
| RF08 | Dashboard público         | Visualização simplificada para cidadãos.                               |       Must | Interface responsiva; última atualização; PI simplificado.          |
| RF09 | Dashboard interno         | Dashboards autenticados para técnicos e gestores.                      |     Should | RBAC; visualizações técnicas; export CSV/PDF.                       |
| RF10 | Relatórios automáticos    | Geração de relatórios (PDF/Excel).                                     |     Should | Geração agendada; templates; envio por e‑mail.                      |
| RF11 | Sistema de alertas        | Alertas e notificações (e‑mail; SMS/WhatsApp futuro).                  |       Must | Gatilhos configuráveis; envio de e‑mail; histórico.                 |
| RF12 | API pública/autenticada   | API para consulta de séries, previsões e metadados.                    |       Must | Autenticação; versionamento; latência alvo.                         |
| RF13 | Chatbot público           | Atendimento via linguagem natural para perguntas públicas.             |      Could | Cobertura FAQs; fallback para dashboard; logs.                      |
| RF14 | Logs e auditoria          | Armazenamento de logs e trilhas de auditoria.                          |       Must | Retenção 12 meses; export e pesquisa.                               |
| RF15 | Testes e CI/CD            | Testes E2E e pipelines para infra e modelos.                           |       Must | Pipelines CI com testes unitários e integração; gates.              |
| RF16 | Exportação interoperável  | Exportação em CSV, JSON e GIS.                                         |      Could | Export CSV/JSON; GeoJSON para bacias/reservatórios.                 |
| RF17 | Recomendação racionamento | Mecanismo de recomendações operacionais.                               |      Could | Regras definidas; justificativa e workflow de aprovação.            |
| RF18 | Transparência legal       | Painel de conformidade e metas legais.                                 |     Should | Exibição de metas legais; histórico de conformidade.                |

### Requisitos Não‑Funcionais

#### Objetivo

Definir requisitos não‑funcionais (RNF) do produto: disponibilidade, desempenho, segurança, conformidade, usabilidade, manutenção, observabilidade e limitações operacionais. Esses requisitos orientam arquiteturas, SLAs e critérios de aceitação para a entrega do produto.

#### RNF (Lista detalhada)

| ID    | Categoria                         | Requisito                                                                           | Meta / Critério de Aceitação                                                                                                  |
| ----- | --------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| RNF01 | Disponibilidade                   | Painel público e APIs devem ter alta disponibilidade para usuários.                 | Dashboard público ≥ 99% mensal; APIs críticas ≥ 99.5% mensal; monitoramento e alertas quando SLO degradado.                   |
| RNF02 | Latência / Freshness              | Dados e previsões devem estar atualizados e com latência aceitável.                 | Telemetria: atualização ≤ 30 min; Previsões diárias: geradas até 02:00 local; APIs: P95 ≤ 2 s para endpoints críticos.        |
| RNF03 | Escalabilidade                    | Sistema suporta aumento de volume de dados e usuários sem degradação significativa. | Suportar 5× volume atual de séries; testes de carga/soak aprovados.                                                           |
| RNF04 | Segurança                         | Proteção de dados e autenticação de acesso.                                         | TLS em trânsito; dados em repouso criptografados; OAuth2 / token; RBAC para painéis internos; rotação de chaves.              |
| RNF05 | Privacidade / Conformidade        | Conformidade com LGPD e políticas de dados locais.                                  | Sem PII em releases públicas; política de retenção e anonimização documentada; registro de consentimento quando aplicável.    |
| RNF06 | Auditabilidade                    | Rastreabilidade de ações, alterações e acesso a dados.                              | Logs imutáveis; retenção mínima 12 meses; export e pesquisa por auditoria.                                                    |
| RNF07 | Precisão e Qualidade              | Metas de qualidade para dados e previsões.                                          | Definições claras de métricas (MAE/RMSE/ROC); alertas quando métricas fora do alvo; processos de validação.                   |
| RNF08 | Usabilidade / Acessibilidade      | Interface clara para público e stakeholders técnicos.                               | PT‑BR por padrão; tempo de carregamento de páginas essenciais < 2 s; conformidade WCAG AA para componentes públicos críticos. |
| RNF09 | Manutenibilidade                  | Código e infra devem permitir manutenção e evolução com baixo custo.                | Código modular; cobertura de testes mínima (unit+integration) definida; documentação técnica atualizada.                      |
| RNF10 | Resiliência / Tolerância a Falhas | Mecanismos de retry e fallback para ingestão e processamento.                       | Retries automáticos; filas com dead‑letter; fallback para fontes históricas ou scraping; planilhas de recuperação testadas.   |
| RNF11 | Localização / Internacionalização | Preparação para múltiplos idiomas e formatos regionais.                             | PT‑BR completo no v1; textos externalizados; roadmap para EN; formatos de data/numero locale-aware.                           |
| RNF12 | Documentação / API                | Documentação consumível por integradores e equipe.                                  | OpenAPI publicada; exemplos; changelog de API; guias de integração.                                                           |
| RNF13 | Backup & DR                       | Estratégia de backup e recuperação de desastres.                                    | Backups diários; RPO ≤ 24h; RTO acordado (ex.: ≤ 24h para dashboards; ≤ 6h para APIs críticas) e testes semestrais.           |
| RNF14 | Logs & Observability              | Métricas, tracing e logs para operação.                                             | Métricas expostas (latência, errors, throughput); dashboards SLO/SLA; alertas configuráveis; tracing para requests críticos.  |
| RNF15 | Interoperabilidade                | Dados exportáveis e APIs compatíveis com padrões.                                   | Exports CSV/JSON e GeoJSON; exemplos de integração e schema estável; semântica dos campos documentada.                        |
| RNF16 | Performance sob pico              | Sistema deve tolerar picos de acesso (ex.: comunicados públicos).                   | Capacidade para 10× tráfego normal por janela de 1 hora com degradação graciosa; testes de stress aprovados.                  |
| RNF17 | Custo / Operação                  | Diretrizes para custos operacionais e otimização.                                   | Custos estimados para operação mensal; alertas de budget; otimização por tier de armazenamento/computação.                    |
| RNF18 | Governança de Dados               | Políticas de ownership, catálogo e glossário.                                       | Catálogo de dados publicado; owners atribuídos; processos de aprovação para alterações em schema.                             |

#### Critérios de Aceitação & Evidências

- Para cada RNF, definir SLOs, SLIs e testes de aceitação automatizados (ex.: scripted load tests, verificações de backup, testes de segurança - SAST/DAST).
- Evidências exigidas: relatórios de testes de carga, screenshots de dashboards de SLO, logs de auditoria, relatórios de conformidade LGPD.

#### Monitoramento / SLIs sugeridos

- Disponibilidade (uptime % por serviço)
- Latência P50/P95/P99 por endpoint
- Taxa de erro (4xx/5xx)
- Freshness: latência de ingestão por fonte
- Taxa de sucesso de jobs ETL
- Cobertura de testes automatizados

#### Considerações de Segurança e Privacidade

- Inventário de dados sensíveis e PII (se houver)
- Criptografia em trânsito e repouso
- Gestão de segredos (HashiCorp Vault / Secrets Manager)
- Controle de acesso granular (RBAC + logs de acesso)
- Revisões periódicas de compliance (LGPD)

#### Observabilidade e Operações

- Stack sugerido: Prometheus + Grafana (métricas), ELK/Opensearch (logs), Jaeger (tracing).
- Alertas integrados com Slack / e‑mail / PagerDuty.
- Runbooks e runbooks de incidente documentados por serviço.

### Histórico de Versão

| Versão | Data       | Descrição            | Autor | Revisor |
| :----: | ---------- | -------------------- | ----- | ------- |
| `1.0`  | 20/10/2025 | Criação do documento | Hugo  | Gabriel |
