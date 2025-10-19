// /src/js/dashboard/charts.js
// Gráficos com paleta dinâmica (dark/light) + filtros simples

function isDark() {
  return document.documentElement.classList.contains('dark');
}

function palette() {
  const text = getComputedStyle(document.body).color;
  const grid = isDark() ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.08)';
  const line = isDark() ? '#9DD3E4' : '#0A5C67';
  const fill = isDark() ? 'rgba(157,211,228,.15)' : 'rgba(10,92,103,.12)';
  const bar  = isDark() ? '#6BAAC9' : '#0A5C67';
  const donut = isDark()
    ? ['#2DD4BF','#FBBF24','#F87171']
    : ['#0EA5E9','#F59E0B','#EF4444'];
  return { text, grid, line, fill, bar, donut };
}

let chartPrecip, chartStorage, chartFlow, chartRisk;

// Dados fake controlados por região
const DATASETS = {
  df: {
    precip: [3, 5, 2, 8, 12, 4, 7],
    flow:   [12,14,13,15,12,16,18,17,19,18,20,22,21,23],
    storage:[72,64,81],
    risk:   [58,30,12]
  },
  descoberto: {
    precip: [2, 4, 3, 6, 10, 7, 6],
    flow:   [11,12,12,13,14,16,15,17,16,18,19,21,22,20],
    storage:[78,58,84],
    risk:   [62,26,12]
  },
  paranoa: {
    precip: [1, 3, 2, 4, 5, 2, 3],
    flow:   [9,10,10,11,11,12,13,13,14,14,15,16,15,14],
    storage:[66,61,74],
    risk:   [54,34,12]
  },
  saob: {
    precip: [4, 6, 4, 9, 11, 6, 8],
    flow:   [13,14,16,15,17,18,19,20,22,21,22,23,24,25],
    storage:[70,68,79],
    risk:   [55,33,12]
  }
};

function buildLineConfig(labels, data, title) {
  const p = palette();
  return {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: title,
        data,
        tension: 0.35,
        borderColor: p.line,
        backgroundColor: p.fill,
        borderWidth: 2,
        fill: true,
        pointRadius: 2,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: p.grid }, ticks: { color: p.text } },
        y: { grid: { color: p.grid }, ticks: { color: p.text } }
      }
    }
  };
}

function buildBarConfig(labels, data) {
  const p = palette();
  return {
    type: 'bar',
    data: {
      labels,
      datasets: [{ data, backgroundColor: p.bar, borderWidth: 0 }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: p.text } },
        y: { grid: { color: p.grid }, ticks: { color: p.text }, suggestedMin: 0, suggestedMax: 100 }
      }
    }
  };
}

function buildDonutConfig(data) {
  const p = palette();
  return {
    type: 'doughnut',
    data: {
      labels: ['Baixo','Médio','Alto'],
      datasets: [{ data, backgroundColor: p.donut, borderWidth: 0 }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels: { color: p.text } }
      },
      cutout: '58%'
    }
  };
}

function destroyCharts() {
  [chartPrecip, chartStorage, chartFlow, chartRisk].forEach(c => c && c.destroy());
  chartPrecip = chartStorage = chartFlow = chartRisk = null;
}

function drawAll(region, metrics) {
  const ds = DATASETS[region] || DATASETS.df;
  destroyCharts();

  // Condicional pelas métricas
  const elPrecip = document.getElementById('ch-precip');
  if (elPrecip && metrics.precip) {
    chartPrecip = new Chart(elPrecip.getContext('2d'),
      buildLineConfig(['D-6','D-5','D-4','D-3','D-2','D-1','Hoje'], ds.precip, 'mm'));
  }

  const elStorage = document.getElementById('ch-storage');
  if (elStorage && metrics.storage) {
    chartStorage = new Chart(elStorage.getContext('2d'),
      buildBarConfig(['Descoberto','Paranoá','São Bartolomeu'], ds.storage));
  }

  const elFlow = document.getElementById('ch-flow');
  if (elFlow && metrics.flow) {
    chartFlow = new Chart(elFlow.getContext('2d'),
      buildLineConfig(Array.from({length: 14}, (_,i) => `D${i-13}`), ds.flow, 'm³/s'));
  }

  const elRisk = document.getElementById('ch-risk');
  if (elRisk) {
    chartRisk = new Chart(elRisk.getContext('2d'), buildDonutConfig(ds.risk));
  }
}

function readFilters() {
  const region = (document.getElementById('f-region')?.value) || 'df';
  const metrics = {
    precip:  document.getElementById('m-precip')?.checked ?? true,
    flow:    document.getElementById('m-flow')?.checked ?? true,
    storage: document.getElementById('m-storage')?.checked ?? true,
  };
  // (Datas estão no layout; aqui não filtramos a série — placeholder)
  return { region, metrics };
}

function initFilters() {
  const form = document.getElementById('dash-filters');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const { region, metrics } = readFilters();
    drawAll(region, metrics);
  });
  document.getElementById('f-reset')?.addEventListener('click', () => {
    document.getElementById('f-region').value = 'df';
    document.getElementById('m-precip').checked = true;
    document.getElementById('m-flow').checked = true;
    document.getElementById('m-storage').checked = true;
    const { region, metrics } = readFilters();
    drawAll(region, metrics);
  });
}

function rerenderOnThemeChange() {
  const mo = new MutationObserver(() => {
    const { region, metrics } = readFilters();
    drawAll(region, metrics);
  });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
}

document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  rerenderOnThemeChange();
  const { region, metrics } = readFilters();
  drawAll(region, metrics);
});
