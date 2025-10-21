// /src/js/alerts/alerts.effects.js
// Mock simples — troque por fetch do seu backend quando tiver endpoint.

function mockAlerts(count = 37) {
  const basins = ['descoberto','paranoa','sb'];
  const vars = ['precip','flow','storage'];
  const sevs = ['critical','high','medium','low'];
  const locs = ['Est. A', 'Est. B', 'Reserv. X', 'Ponto Y'];
  const msgs = {
    precip: 'Precipitação prevista acima do limiar',
    flow: 'Vazão projetada acima do alerta',
    storage: 'Armazenamento abaixo do mínimo seguro'
  };

  const now = Date.now();
  return Array.from({length: count}, (_,i) => {
    const v = vars[i % vars.length];
    const s = sevs[i % sevs.length];
    const b = basins[i % basins.length];
    const t = now - (i * 60 * 60 * 1000); // hora a hora
    const status = i % 7 === 0 ? 'closed' : (i % 5 === 0 ? 'ack' : 'new');
    return {
      id: `al-${i+1}`,
      when: new Date(t),
      basin: b,
      location: locs[i % locs.length],
      variable: v,
      severity: s,
      message: msgs[v],
      status
    };
  });
}

function fmtDate(d) {
  const pad = n => String(n).padStart(2,'0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function badge(sev) {
  const map = {
    critical: 'badge badge-critical',
    high: 'badge badge-high',
    medium: 'badge badge-medium',
    low: 'badge badge-low',
  };
  return `<span class="${map[sev]||'badge'}">${sev}</span>`;
}

export async function initAlertsEffects(root) {
  const dataAll = mockAlerts(64);
  let page = 1, perPage = 10;
  let filters = { basin:'', variable:'', severity:'', status:'', onlyOpen:false, onlyNew:false };

  // refs
  const tbody = root.querySelector('#al-tbody');
  const stxt  = root.querySelector('#al-status-text');
  const spage = root.querySelector('#al-page');

  // filtros
  const fBasin  = root.querySelector('#al-basin');
  const fVar    = root.querySelector('#al-var');
  const fSev    = root.querySelector('#al-sev');
  const fStatus = root.querySelector('#al-status');
  const fOnlyOpen = root.querySelector('#al-only-open');
  const fOnlyNew  = root.querySelector('#al-only-new');

  const kTotal   = root.querySelector('#al-kpi-total');
  const kCrit    = root.querySelector('#al-kpi-critical');
  const kOpen    = root.querySelector('#al-kpi-open');
  const kAck     = root.querySelector('#al-kpi-ack');

  function applyFilters() {
    let arr = dataAll.slice();

    if (filters.basin)   arr = arr.filter(a => a.basin === filters.basin);
    if (filters.variable)arr = arr.filter(a => a.variable === filters.variable);
    if (filters.severity)arr = arr.filter(a => a.severity === filters.severity);
    if (filters.status)  arr = arr.filter(a => a.status === filters.status);
    if (filters.onlyOpen)arr = arr.filter(a => a.status === 'new' || a.status === 'ack');
    if (filters.onlyNew) arr = arr.filter(a => a.status === 'new');

    return arr;
  }

  function updateKpis(arr) {
    kTotal.textContent = String(arr.length);
    kCrit.textContent  = String(arr.filter(a => a.severity === 'critical').length);
    kOpen.textContent  = String(arr.filter(a => a.status !== 'closed').length);
    kAck.textContent   = String(arr.filter(a => a.status === 'ack').length);
  }

  function render() {
    const arr = applyFilters();
    updateKpis(arr);

    const totalPages = Math.max(1, Math.ceil(arr.length / perPage));
    if (page > totalPages) page = totalPages;
    const start = (page - 1) * perPage;
    const slice = arr.slice(start, start + perPage);

    tbody.innerHTML = slice.map(a => `
      <tr>
        <td class="td-cell whitespace-nowrap">${fmtDate(a.when)}</td>
        <td class="td-cell capitalize">${a.basin}</td>
        <td class="td-cell">${a.location}</td>
        <td class="td-cell">${a.variable}</td>
        <td class="td-cell">${badge(a.severity)}</td>
        <td class="td-cell">${a.message}</td>
        <td class="td-cell text-right">
          ${a.status !== 'closed' ? `<button data-id="${a.id}" data-act="ack" class="btn-mini">Reconhecer</button>` : ''}
          ${a.status !== 'closed' ? `<button data-id="${a.id}" data-act="close" class="btn-mini btn-mini-ghost">Encerrar</button>` : '<span class="text-xs text-gray-500">—</span>'}
        </td>
      </tr>
    `).join('');

    stxt.textContent = `${arr.length} alertas • página ${page}/${totalPages}`;
    spage.textContent = `${page}/${totalPages}`;

    // paginação
    const prev = root.querySelector('#al-prev');
    const next = root.querySelector('#al-next');
    prev.disabled = page <= 1;
    next.disabled = page >= totalPages;

    prev.onclick = () => { if (page > 1) { page--; render(); } };
    next.onclick = () => { if (page < totalPages) { page++; render(); } };

    // ações
    tbody.querySelectorAll('button[data-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const act = btn.dataset.act;
        const idx = dataAll.findIndex(a => a.id === id);
        if (idx >= 0) {
          if (act === 'ack')   dataAll[idx].status = 'ack';
          if (act === 'close') dataAll[idx].status = 'closed';
          render();
        }
      });
    });
  }

  function bindFilters() {
    fBasin?.addEventListener('change',  e => { filters.basin = e.target.value; page = 1; render(); });
    fVar?.addEventListener('change',    e => { filters.variable = e.target.value; page = 1; render(); });
    fSev?.addEventListener('change',    e => { filters.severity = e.target.value; page = 1; render(); });
    fStatus?.addEventListener('change', e => { filters.status = e.target.value; page = 1; render(); });
    fOnlyOpen?.addEventListener('change', e => { filters.onlyOpen = e.target.checked; page = 1; render(); });
    fOnlyNew?.addEventListener('change',  e => { filters.onlyNew  = e.target.checked; page = 1; render(); });

    root.querySelector('#al-refresh')?.addEventListener('click', () => render());

    // export CSV
    root.querySelector('#al-export-csv')?.addEventListener('click', () => {
      const arr = applyFilters();
      const rows = [['id','quando','bacia','local','variavel','severidade','status','mensagem']];
      arr.forEach(a => rows.push([
        a.id, fmtDate(a.when), a.basin, a.location, a.variable, a.severity, a.status, `"${a.message}"`
      ]));
      const blob = new Blob([rows.map(r=>r.join(',')).join('\n')], { type:'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'alertas.csv'; a.click();
      setTimeout(()=>URL.revokeObjectURL(url), 1200);
    });
  }

  bindFilters();
  render();
}
