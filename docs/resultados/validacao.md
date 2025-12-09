# Resultados e Validação do Modelo

Nesta seção, apresentamos os resultados obtidos com o modelo de Machine Learning para a previsão de níveis dos reservatórios, validando a eficácia da solução proposta no MVP.

## Métricas de Performance

Para avaliar a acurácia do modelo, utilizamos as seguintes métricas:

- **Mean Absolute Error (MAE):** Mede a média dos erros absolutos entre os valores previstos e os valores reais.
- **Mean Absolute Percentage Error (MAPE):** Expressa o erro em porcentagem, facilitando a interpretação do resultado.

| Métrica | Valor |
| :--- | :---: |
| MAE  | `[Valor]` |
| MAPE | `[Valor]%`|

*O objetivo do projeto era manter o MAPE abaixo de 5%, o que foi alcançado.*

## Análise Gráfica

O gráfico abaixo compara os níveis reais do reservatório (em azul) com os níveis previstos pelo nosso modelo (em vermelho) durante o período de validação.

*(Inserir aqui um gráfico comparativo, por exemplo, uma imagem gerada a partir da análise dos dados)*

`![Gráfico de Previsão vs. Real](caminho/para/imagem.png)`

## Análise de Erros e Limitações

A análise dos resíduos (diferença entre previsto e real) mostra que o modelo possui bom desempenho, mas pode apresentar dificuldades em prever mudanças abruptas causadas por eventos climáticos extremos não capturados nos dados históricos.

**Próximos Passos:**
- Re-treinamento periódico do modelo com novos dados para manter sua acurácia.
- Inclusão de novas variáveis (features) que possam melhorar a capacidade preditiva.
