// /src/js/compare/compare.effects.js
async function loadChartJS() {
  if (window.Chart) return window.Chart;
  await new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
    s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
  return window.Chart;
}

// mocks simples (substitua por fetch ao backend)
function mockSeries(len = 60, base = 10, jitter = 5) {
  const now = Date.now();
  const day = 86400000;
  return Array.from({ length: len }, (_, i) => ({
    t: new Date(now - (len - i) * day),
    v: base + Math.sin(i / 7) * jitter + (Math.random() - .5) * jitter
  }));
}

function avg(arr) {
  if (!arr?.length) return 0;
  return arr.reduce((s, x) => s + x, 0) / arr.length;
}

export async function initCompareEffects(root) {
  const Chart = await loadChartJS();

  const elA = root.querySelector('#cmp-chart-a');
  const elB = root.querySelector('#cmp-chart-b');
  const elO = root.querySelector('#cmp-chart-overlay');

  // dados fake iniciais (trocar por fetch conforme filtros)
  let seriesA = mockSeries(90, 12, 6);
  let seriesB = mockSeries(90, 15, 5);

  const labels = seriesA.map(p => p.t.toISOString().slice(0,10));
  const cfgLine = {
    type: 'line',
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { autoSkip: true, maxTicksLimit: 8 } },
        y: { beginAtZero: false }
      }
    }
  };

  // Chart A
  const chA = new Chart(elA.getContext('2d'), {
    ...cfgLine,
    data: {
      labels,
      datasets: [{ label: 'A', data: seriesA.map(p=>p.v), tension: .3, fill: false }]
    }
  });

  // Chart B
  const chB = new Chart(elB.getContext('2d'), {
    ...cfgLine,
    data: {
      labels,
      datasets: [{ label: 'B', data: seriesB.map(p=>p.v), tension: .3, fill: false }]
    }
  });

  // Overlay
  const chO = new Chart(elO.getContext('2d'), {
    ...cfgLine,
    data: {
      labels,
      datasets: [
        { label: 'A', data: seriesA.map(p=>p.v), tension: .3, fill: false },
        { label: 'B', data: seriesB.map(p=>p.v), tension: .3, fill: false }
      ]
    },
    options: {
      ...cfgLine.options,
      plugins: { legend: { display: true } }
    }
  });

  // KPIs
  function updateKpis() {
    const aMean = avg(seriesA.map(p=>p.v));
    const bMean = avg(seriesB.map(p=>p.v));
    const diffAbs = bMean - aMean;
    const diffPct = aMean !== 0 ? (diffAbs / aMean) * 100 : 0;

    root.querySelector('#kpi-a-mean').textContent = aMean.toFixed(2);
    root.querySelector('#kpi-b-mean').textContent = bMean.toFixed(2);
    root.querySelector('#kpi-diff-abs').textContent = diffAbs.toFixed(2);
    root.querySelector('#kpi-diff-pct').textContent = `${diffPct.toFixed(1)}%`;
  }
  updateKpis();

  // Filtros (plug simples; troque por fetch ao backend)
  root.querySelector('#cmp-refresh')?.addEventListener('click', () => {
    seriesA = mockSeries(90, 10 + Math.random()*5, 5 + Math.random()*2);
    seriesB = mockSeries(90, 12 + Math.random()*5, 4 + Math.random()*2);

    // update charts
    chA.data.datasets[0].data = seriesA.map(p=>p.v);
    chB.data.datasets[0].data = seriesB.map(p=>p.v);
    chO.data.datasets[0].data = seriesA.map(p=>p.v);
    chO.data.datasets[1].data = seriesB.map(p=>p.v);
    chA.update(); chB.update(); chO.update();

    updateKpis();
  });

  // Export PNG do comparativo
  root.querySelector('#cmp-export-png')?.addEventListener('click', async () => {
    const a = document.createElement('a');
    a.href = elO.toDataURL('image/png');
    a.download = 'comparativo-aguaprev.png';
    a.click();
  });

  // Export CSV (labels + A + B)
  root.querySelector('#cmp-export-csv')?.addEventListener('click', () => {
    const rows = [['data','serie_a','serie_b']];
    for (let i=0;i<labels.length;i++){
      rows.push([labels[i], seriesA[i]?.v?.toFixed(3) ?? '', seriesB[i]?.v?.toFixed(3) ?? '']);
    }
    const blob = new Blob([rows.map(r=>r.join(',')).join('\n')], { type:'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'comparativo.csv'; a.click();
    setTimeout(()=>URL.revokeObjectURL(url), 1500);
  });
}
