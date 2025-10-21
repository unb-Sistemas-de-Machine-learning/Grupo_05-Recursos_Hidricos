// /src/js/series/series.effects.js
// - Sem libs externas (canvas puro)
// - Post-auth: não toca em footer
// - Usa API URL do projeto (window.API_URL | import.meta.env)

const API =
  (window.API_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL)) ||
  (window.NEXT_PUBLIC_API_URL) ||
  'http://127.0.0.1:5000';

function qs(root, sel){ return (root || document).querySelector(sel); }
function qsa(root, sel){ return Array.from((root || document).querySelectorAll(sel)); }

function fmtDate(d){
  const dt = (d instanceof Date) ? d : new Date(d);
  return dt.toLocaleDateString();
}

function toCSV(rows){
  const header = 'date,value';
  const body = rows.map(r => `${r.date},${r.value}`).join('\n');
  return `${header}\n${body}`;
}

function download(filename, blob){
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function drawChart(canvas, rows){
  const ctx = canvas.getContext('2d');
  const DPR = Math.max(1, window.devicePixelRatio || 1);

  // sizing
  const W = canvas.clientWidth || 960;
  const H = canvas.getAttribute('height') ? parseInt(canvas.getAttribute('height')) : 340;
  canvas.width = Math.floor(W * DPR);
  canvas.height = Math.floor(H * DPR);
  ctx.scale(DPR, DPR);

  // theme
  const isDark = document.documentElement.classList.contains('dark') ||
                 document.body.classList.contains('dark');
  const axis = isDark ? '#96A2B8' : '#5B677A';
  const line = isDark ? '#6BAAC9' : '#0A5C67';
  const grid = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  // bounds
  const pad = {l: 48, r: 16, t: 16, b: 28};
  const minV = Math.min(...rows.map(r => r.value));
  const maxV = Math.max(...rows.map(r => r.value));
  const y0 = minV === maxV ? minV - 1 : minV;

  // bg
  ctx.clearRect(0,0,W,H);

  // grid Y (4 lines)
  ctx.strokeStyle = grid; ctx.lineWidth = 1;
  for(let i=0;i<=4;i++){
    const y = pad.t + ((H - pad.t - pad.b) * i / 4);
    ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y); ctx.stroke();
  }

  // axes
  ctx.strokeStyle = axis; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, H - pad.b); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(pad.l, H - pad.b); ctx.lineTo(W - pad.r, H - pad.b); ctx.stroke();

  // scale helpers
  const xAt = (i)=> pad.l + (i * (W - pad.l - pad.r) / Math.max(1, rows.length-1));
  const yAt = (v)=> {
    const f = (v - y0) / Math.max(1e-9, (maxV - y0));
    return (H - pad.b) - f * (H - pad.t - pad.b);
  };

  // line
  ctx.strokeStyle = line; ctx.lineWidth = 2;
  ctx.beginPath();
  rows.forEach((r,i)=>{ const x=xAt(i), y=yAt(r.value); i?ctx.lineTo(x,y):ctx.moveTo(x,y); });
  ctx.stroke();

  // last point marker
  if(rows.length){
    const x = xAt(rows.length-1), y = yAt(rows[rows.length-1].value);
    ctx.fillStyle = line; ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2); ctx.fill();
  }
}

function paginate(arr, page, perPage){
  const total = Math.max(1, Math.ceil(arr.length / perPage));
  const p = Math.min(Math.max(1, page), total);
  const start = (p-1)*perPage;
  return { total, page: p, slice: arr.slice(start, start+perPage) };
}

function computeKpis(rows){
  if(!rows.length) return {points:0, min:'—', max:'—', last:'—'};
  const values = rows.map(r=>r.value);
  return {
    points: rows.length,
    min: Math.min(...values).toFixed(2),
    max: Math.max(...values).toFixed(2),
    last: rows[rows.length-1].value.toFixed(2),
  };
}

async function fetchSeries(filters){
  // Endpoint sugerido (ajuste no backend): GET /api/series?basin=&station=&var=&res=&from=&to=
  const url = new URL('/api/series', API);
  Object.entries({
    basin: filters.basin,
    station: filters.station,
    variable: filters.variable,
    resolution: filters.resolution,
    from: filters.from || '',
    to: filters.to || ''
  }).forEach(([k,v])=> url.searchParams.set(k, v));

  try{
    const r = await fetch(url.toString(), { headers: { 'Accept': 'application/json' } });
    if(!r.ok) throw new Error('HTTP '+r.status);
    const data = await r.json();
    // Esperado: [{date:'YYYY-MM-DD', value:Number}, ...]
    return Array.isArray(data) ? data : [];
  }catch(_e){
    // MOCK (fallback)
    const now = new Date();
    const N=120;
    const out=[];
    let acc= Math.random()*5 + 20;
    for(let i=N-1;i>=0;i--){
      const d = new Date(now); d.setDate(d.getDate()-i);
      acc += (Math.random()-0.5)*2;
      out.push({ date: d.toISOString().slice(0,10), value: Math.max(0, acc) });
    }
    return out;
  }
}

export function initSeriesEffects(root){
  const elRoot = root || document;
  if(elRoot.dataset.boundSeries === '1') return;
  elRoot.dataset.boundSeries = '1';

  const canvas = qs(elRoot, '#series-chart');
  const tblBody = qs(elRoot, '#tbl-body');
  const tblRange= qs(elRoot, '#tbl-range');
  const status  = qs(elRoot, '#tbl-status');
  const pgPrev  = qs(elRoot, '#pg-prev');
  const pgNext  = qs(elRoot, '#pg-next');
  const pgInfo  = qs(elRoot, '#pg-info');

  const kPoints = qs(elRoot, '#kpi-points');
  const kMin    = qs(elRoot, '#kpi-min');
  const kMax    = qs(elRoot, '#kpi-max');
  const kLast   = qs(elRoot, '#kpi-last');

  const F = {
    basin: qs(elRoot, '#f-basin'),
    station: qs(elRoot, '#f-station'),
    variable: qs(elRoot, '#f-variable'),
    resolution: qs(elRoot, '#f-resolution'),
    from: qs(elRoot, '#f-from'),
    to: qs(elRoot, '#f-to'),
  };

  let rows = [];
  let page = 1;
  const PER_PAGE = 12;

  function updateKpis(){
    const k = computeKpis(rows);
    kPoints.textContent = k.points;
    kMin.textContent = k.min;
    kMax.textContent = k.max;
    kLast.textContent = k.last;
  }

  function renderTable(){
    const { total, page: p, slice } = paginate(rows, page, PER_PAGE);
    tblBody.innerHTML = slice.map(r => `
      <tr>
        <td class="td-cell">${fmtDate(r.date)}</td>
        <td class="td-cell">${Number(r.value).toFixed(2)}</td>
      </tr>
    `).join('');

    pgPrev.disabled = (p<=1);
    pgNext.disabled = (p>=total);
    pgInfo.textContent = `${p}/${total}`;
    status.textContent = `${rows.length} registros`;
    if(rows.length){
      const first = rows[0].date, last = rows[rows.length-1].date;
      tblRange.textContent = `${fmtDate(first)} — ${fmtDate(last)}`;
    } else {
      tblRange.textContent = '—';
    }
  }

  async function refresh(){
    page = 1;
    const filters = {
      basin: F.basin.value,
      station: F.station.value,
      variable: F.variable.value,
      resolution: F.resolution.value,
      from: F.from.value,
      to: F.to.value
    };
    rows = await fetchSeries(filters);
    drawChart(canvas, rows);
    updateKpis();
    renderTable();
  }

  // events
  qsa(elRoot, '.f-select,.f-input').forEach(el => el.addEventListener('change', refresh));
  qs(elRoot, '#btn-refresh')?.addEventListener('click', refresh);

  pgPrev.addEventListener('click', ()=>{ page--; renderTable(); });
  pgNext.addEventListener('click', ()=>{ page++; renderTable(); });

  qs(elRoot, '#btn-export-csv')?.addEventListener('click', ()=>{
    const csv = toCSV(rows);
    download('series.csv', new Blob([csv], {type:'text/csv;charset=utf-8'}));
  });

  qs(elRoot, '#btn-export-png')?.addEventListener('click', ()=>{
    canvas.toBlob((blob)=> download('series.png', blob), 'image/png');
  });

  qs(elRoot, '#btn-toggle-filters')?.addEventListener('click', ()=>{
    qs(elRoot, '.filters-row')?.classList.toggle('hidden');
  });

  // initial
  refresh();
  // resize
  window.addEventListener('resize', ()=> drawChart(canvas, rows), { passive:true });
}
