// /src/js/maps/maps.effects.js
// Inicializa Leaflet e sparkline via Chart.js, ambos carregados dinamicamente.

async function loadLeaflet() {
  if (window.L) return window.L;
  await Promise.all([
    new Promise((res, rej) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.onload = res; link.onerror = rej;
      document.head.appendChild(link);
    }),
    new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      s.defer = true;
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    })
  ]);
  return window.L;
}

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

export async function initMapsEffects(root) {
  const L = await loadLeaflet();
  const Chart = await loadChartJS();

  const mapEl = root.querySelector('#map-container');
  const basin = root.querySelector('#mf-basin');
  const layerSel = root.querySelector('#mf-layer');
  const lgStations = root.querySelector('#lg-stations');
  const lgIso = root.querySelector('#lg-iso');
  const lgHeat = root.querySelector('#lg-heat');

  // Init mapa
  const map = L.map(mapEl, { zoomControl: true, attributionControl: false });
  const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18
  }).addTo(map);

  // DF aproximado
  map.setView([-15.78, -47.93], 10);

  // Camadas de exemplo
  const stationsLayer = L.layerGroup().addTo(map);
  const isoLayer = L.layerGroup().addTo(map);
  const heatLayer = L.layerGroup(); // começa desligado

  // Estações fake (substitua por seu backend)
  function renderStations() {
    stationsLayer.clearLayers();
    [
      [-15.81, -47.95, 'Estação A'],
      [-15.72, -47.88, 'Estação B'],
      [-15.86, -47.98, 'Estação C']
    ].forEach(([lat, lng, name]) => {
      L.circleMarker([lat, lng], { radius: 6 }).bindPopup(name).addTo(stationsLayer);
    });
  }

  function renderIso() {
    isoLayer.clearLayers();
    const poly = L.polygon(
      [[-15.9,-48.0],[-15.7,-48.1],[-15.6,-47.9],[-15.75,-47.8]],
      { weight: 1, fillOpacity: 0 }
    );
    poly.addTo(isoLayer);
  }

  renderStations();
  renderIso();

  // Heat fake
  function renderHeat() {
    heatLayer.clearLayers();
    const pts = [
      [-15.78,-47.92,0.5],
      [-15.74,-47.96,0.7],
      [-15.83,-47.99,0.2]
    ];
    // fallback simples: círculos com opacidade proporcional
    pts.forEach(([lat,lng,val])=>{
      L.circle([lat,lng], { radius: 1500, color:'#f00', opacity: val, fillOpacity: val*0.3 }).addTo(heatLayer);
    });
  }

  // Toggles
  function syncToggles() {
    if (lgStations.checked) map.addLayer(stationsLayer); else map.removeLayer(stationsLayer);
    if (lgIso.checked) map.addLayer(isoLayer); else map.removeLayer(isoLayer);
    if (lgHeat.checked) { renderHeat(); map.addLayer(heatLayer); } else map.removeLayer(heatLayer);
  }
  [lgStations, lgIso, lgHeat].forEach(el => el?.addEventListener('change', syncToggles));
  syncToggles();

  // Quando mudar bacia/variável, recentra e (falso) recarrega
  function applyFilters() {
    const b = basin?.value || 'df';
    if (b === 'descoberto') map.setView([-15.76, -48.13], 11);
    else if (b === 'paranoa') map.setView([-15.78, -47.80], 12);
    else if (b === 'sb') map.setView([-16.05, -48.00], 10);
    else map.setView([-15.78, -47.93], 10);

    // aqui você chamaria seu backend para trazer camadas por bacia/variável/período
    // ex.: fetch(`/api/map?basin=${b}&var=${layerSel.value}&from=${from}&to=${to}`)
  }
  [basin, layerSel].forEach(el => el?.addEventListener('change', applyFilters));
  applyFilters();

  // Sparkline (série curta)
  const spk = root.querySelector('#map-sparkline');
  if (spk) {
    const ctx = spk.getContext('2d');
    // dados fake
    const data = Array.from({length:7},(_,i)=>({x:i, y: (Math.random()*10+5)|0}));
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(d=>d.x+1),
        datasets: [{ data: data.map(d=>d.y), tension: .3, fill: false }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display:false }, tooltip: { intersect:false } },
        scales: { x: { display:false }, y: { display:false } }
      }
    });
    const last = data.at(-1)?.y ?? '—';
    const lastEl = root.querySelector('#map-last-value');
    if (lastEl) lastEl.textContent = `${last}`;
  }

  // Export PNG (map container)
  const exportBtn = root.querySelector('#map-export-png');
  exportBtn?.addEventListener('click', async () => {
    const html2canvas = await import('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.esm.js');
    const canvas = await html2canvas.default(mapEl, { useCORS:true, backgroundColor: null });
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `mapa-aguaprev.png`;
    a.click();
  });

  // Refresh (re-render simplificado)
  root.querySelector('#map-refresh')?.addEventListener('click', () => {
    renderStations();
    renderIso();
    syncToggles();
  });
}
