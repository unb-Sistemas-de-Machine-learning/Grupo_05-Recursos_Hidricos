// ====== PREVISÕES CHARTS ======
// Gerencia renderização dos gráficos dinâmicos
// Atualiza em tempo real conforme os filtros mudam

let chartInstance = null;

export async function initCharts(document, manager) {
  const chartCanvas = document.getElementById('ch-historico');
  const chartLoading = document.getElementById('chart-loading');
  
  if (!chartCanvas) return;

  const ctx = chartCanvas.getContext('2d');
  
  // Função para renderizar o gráfico
  const renderChart = () => {
    // Esconde loading
    if (chartLoading) chartLoading.style.display = 'none';
    
    const dados = manager.obterDados();
    
    // Ordena por data
    const dadosOrdenados = [...dados].sort((a, b) => 
      new Date(a.Data_Hora_Medicao) - new Date(b.Data_Hora_Medicao)
    );

    // Prepara dados para o gráfico
    const labels = dadosOrdenados.map(item => {
      const data = new Date(item.Data_Hora_Medicao);
      return data.toLocaleString('pt-BR', { 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit'
      });
    });

    const cotas = dadosOrdenados.map(item => parseFloat(item.Cota_Adotada));
    const chuvas = dadosOrdenados.map(item => parseFloat(item.Chuva_Adotada));

    // Destrói gráfico anterior se existir
    if (chartInstance) {
      chartInstance.destroy();
    }

    // Detecta tema escuro
    const isDark = document.documentElement.classList.contains('dark') || 
                   window.matchMedia('(prefers-color-scheme: dark)').matches;
    const textColor = isDark ? '#d1d5db' : '#374151';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    // Cria novo gráfico
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Cota Hídrica (m)',
            data: cotas,
            borderColor: '#0A5C67',
            backgroundColor: 'rgba(10, 92, 103, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 2,
            pointBackgroundColor: '#0A5C67',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            yAxisID: 'y'
          },
          {
            label: 'Chuva Acumulada (mm)',
            data: chuvas,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 1,
            pointBackgroundColor: '#3b82f6',
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              color: textColor,
              font: {
                size: 12,
                weight: 'bold'
              },
              padding: 15,
              usePointStyle: true
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(15, 23, 42, 0.9)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#0A5C67',
            borderWidth: 1,
            padding: 12,
            titleFont: {
              size: 13,
              weight: 'bold'
            },
            bodyFont: {
              size: 12
            },
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                label += context.parsed.y.toFixed(2);
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: gridColor,
              drawBorder: false
            },
            ticks: {
              color: textColor,
              font: {
                size: 11
              },
              maxRotation: 45,
              minRotation: 0
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            grid: {
              color: gridColor,
              drawBorder: false
            },
            ticks: {
              color: textColor,
              font: {
                size: 11
              },
              callback: function(value) {
                return value.toFixed(0) + ' m';
              }
            },
            title: {
              display: true,
              text: 'Cota (m)',
              color: textColor,
              font: {
                size: 12,
                weight: 'bold'
              }
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
              drawOnChartArea: false,
              drawBorder: false
            },
            ticks: {
              color: textColor,
              font: {
                size: 11
              },
              callback: function(value) {
                return value.toFixed(1) + ' mm';
              }
            },
            title: {
              display: true,
              text: 'Chuva (mm)',
              color: textColor,
              font: {
                size: 12,
                weight: 'bold'
              }
            }
          }
        }
      }
    });
  };

  // Renderiza gráfico inicial
  renderChart();

  // Atualiza gráfico quando filtros mudam
  manager.onFilterChange = renderChart;

  // Observa mudanças no tema
  const observer = new MutationObserver(() => {
    renderChart();
  });

  observer.observe(document.documentElement, { 
    attributes: true, 
    attributeFilter: ['class'] 
  });
}
