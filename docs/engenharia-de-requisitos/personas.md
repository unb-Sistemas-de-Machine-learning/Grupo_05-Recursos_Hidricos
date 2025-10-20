# Perfis de usuário e personas do ÁguaPrev

## Perfil de Usuário

### Fundamentação

Abaixo estão os perfis e personas, divididos em dois tipos focos do produto (Técnico e Não‑técnico), fundamentados nos achados da PDAD‑DF 2021. Onde relevante, números implicam requisitos de produto e UX.

Referências PDAD 2021:

- População urbana: 3,01 milhões; idade média: 34 anos; 52,2% feminino [PDAD 2021, Resultados – Moradores].
- Acesso à internet: 85,7% usaram nos últimos 3 meses; 96,1% acessam todos os dias; 97,9% acessam por celular/tablet; 51,1% por microcomputador [PDAD 2021, 3.4].
- Posse de celular: 83,6% têm celular pessoal; linhas: 49,5% pré‑paga e 65,8% pós‑paga (há sobreposição) [PDAD 2021, 3.4].
- Dificuldades visuais: 15,6% têm alguma dificuldade para enxergar (alguma/muita/nenhuma) [PDAD 2021, 3.3].
- Localidades com grande relevância de serviços e população: Plano Piloto, Ceilândia, Taguatinga, Samambaia etc. [PDAD 2021, 3.2.3 e figuras 3.3.5].

Existem informações a serem processadas do PDAD 2024, entretanto a informação mas confiante está nesse de 2021.

Os tipos de usuários técnicos foram pensandos por meio de introspecção.

---

### Implicações diretas para o Produto

- Mobile‑first e páginas leves: alto acesso diário e predominância de celular (97,9%).
- Funcionar bem em planos pré‑pagos: otimizar dados, permitir modo “baixo consumo”, para usuários não-técnicos.
- Acessibilidade: contraste alto, opção de fonte grande e linguagem simples — parcela com algum grau de dificuldade de visão (15,6%).
- Conteúdo em português claro, com visualizações intuitivas e alertas proativos.

---

### Perfil 1 — Usuários Técnicos (ANA,CAESB e ADASA)

- Contexto: Engenheiros(as), analistas operacionais, hidrólogos, meteorologistas.
- Dispositivos: Desktop no trabalho; celular em plantões.
- Necessidades centrais:
  - Séries históricas e tempo real de nível por reservatório, vazões, precipitação observada e prevista.
  - Previsões com horizonte diário/semanal/mensal, com possibilidade de ver bandas de incerteza.
  - Simulações de cenários (chuva e nível de reserva).
  - Alertas configuráveis por limiares (atenção/alerta/criticidade) e por bacia/reservatório.
  - Auditoria e rastreabilidade dos dados e exportação (CSV).
  - Integração com dashboards internos e relatórios em moldes institucionais mas inteligíveis.

#### Personas Primárias (Técnicas)

- João, Engenheiro de Operações de Reservatórios, 38

  - Objetivo: Decidir volume liberado para as regiões administrativas e plano de operação diário e semanal.
  - Dores: Dados de telemetria instáveis em pontos remotos; previsões sem incerteza clara.
  - O que precisa: Tela “Reservas” com nível atual, balanço hídrico, previsão 1–7 dias, possilibilidade de ocorrer uma estiagem, e alarmes.

- Ana, Analista de Dados/Planejamento Hídrico, 32
  - Objetivo: Produzir estudos e relatórios para diretoria e regulação.
  - Dores: Bases fragmentadas, tempos de atualização lentos, falta de metadados padronizados.
  - O que precisa: Possibilidade de exportação de dados de diferentes tipos e relatórios com informações de compartilhamento inteligevel.

#### Personas Secundárias

- Carlos, Gestor de Crises e Comunicação, 45
  - Objetivo: Preparar respostas rápidas e comunicação pública em estiagem.
  - Dores: Comunicação reativa; ausência de mensagens padronizadas com margens de incerteza.
  - O que precisa: Painel de risco com semáforos por RA/bacia, uso do sistema de emergências do distrito federal mensagens, cenários “e se” e trilhas de decisão.

---

### Perfil 2 — Usuários Não‑técnicos (público leigo do DF)

- Contexto: Moradores que querem saber “se vai chover” e “como estão os reservatórios”, além de quando há risco de racionamento.
- Dispositivos: Predominantemente celular; parte relevante em planos pré‑pagos.
- Necessidades centrais:
  - Informações simples, visuais e localizadas por RA/bairro.
  - Linguagem direta, sem jargão; explicações curtas e educativas.
  - Alertas proativos de chuva forte/estiagem e orientações práticas.
  - Compartilhamento fácil (link leve) e baixa exigência de dados.

#### Personas Primárias(não‑técnicas)

- Maria, Moradora de Ceilândia, 29

  - Objetivo: Saber se choverá forte e se haverá ações que afetem o abastecimento.
  - Dores: Notificações chegam tarde; termos técnicos confusos.
  - O que precisa: Tela inicial com “Hoje/Amanhã/Próximos 7 dias”, mapa simples da RA, card “Reservatórios: estável/caindo/subindo” e botão “Receber alertas”.

- Paula, Professora no Plano Piloto, 41
  - Objetivo: Explicar aos alunos a situação hídrica e mudança climática local.
  - Dores: Falta de material didático simples e confiável.
  - O que precisa: Infográficos compartilháveis e explicadores curtos “Como ler o gráfico de reservatório”, “Por que economizar água no período seco?”.

#### Personas Secundárias

- Seu José, Agricultor periurbano (Planaltina), 56
  - Objetivo: Planejar irrigação e colheita com base em chuva prevista e tendência de reservatório.
  - Dores: Sinal e dados limitados; páginas pesadas.
  - O que precisa: Versão leve com previsão diária acumulada de chuva e aviso de risco de estiagem; download de boletim em PDF leve.

#### Recursos essenciais (não‑técnicos)

- Painel “Como estão nossos reservatórios?” com setas de tendência e percentuais.
- Previsão de chuva por localidade em linguagem natural (+ pictogramas).
- Alertas com cores e mensagens curtas; opção de receber por e‑mail/SMS/notificação web.
- Glossário simples e seção “Aprenda” com 2–3 minutos de leitura.

---

### Histórico de Versão

| Versão | Data       | Descrição            | Autor   | Revisor |
| :----: | ---------- | -------------------- | ------- | ------- |
| `1.0`  | 20/10/2025 | Criação do documento | Gabriel | Hugo    |
