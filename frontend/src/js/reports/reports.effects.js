// /src/js/reports/reports.effects.js
// Mock robusto (bacia + estação + variável) + filtros reativos + distribuição
// + impressão em PDF apenas por iframe (sem abrir nova aba).

/* ========================= Utilidades ========================= */
const pad = n => String(n).padStart(2, '0');
const DAY_MS = 86400000;
const fmtDate = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const parseISO = s => {
  if (!s) return null;
  const [Y,M,D] = s.split('-').map(Number);
  const d = new Date(Date.UTC(Y, M-1, D));
  d.setHours(12,0,0,0);
  return d;
};
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const avg = a => a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0;
const min = a => a.length ? a.reduce((m, x) => (x < m ? x : m), +Infinity) : NaN;
const max = a => a.length ? a.reduce((m, x) => (x > m ? x : m), -Infinity) : NaN;
const debounce = (fn, ms=250) => { let t; return (...args)=>{ clearTimeout(t); t=setTimeout(()=>fn(...args), ms); }; };

/* ===================== PRNG determinístico ==================== */
function mulberry32(seed){ return function(){ let t=seed+=0x6D2B79F5; t=Math.imul(t^t>>>15,t|1); t^=t+Math.imul(t^t>>>7,t|61); return((t^t>>>14)>>>0)/4294967296; }; }
const hashStr = s => s.split('').reduce((h,c)=>Math.imul(h^c.charCodeAt(0),2654435761)>>>0,0x811C9DC5);

/* ======================== Domínio mock ======================== */
const BASINS = ['DF — Geral', 'Descoberto', 'Paranoá', 'São Bartolomeu'];
const STATIONS_BY_BASIN = {
  'DF — Geral':     ['Est. Central (DF-01)', 'Est. Norte (DF-02)', 'Reservatório Geral'],
  'Descoberto':     ['UHE Descoberto', 'Pluv. Taguatinga', 'Seção Ponte Alta'],
  'Paranoá':        ['UHE Paranoá', 'Pluv. Lago Norte', 'Seção Ponte JK'],
  'São Bartolomeu': ['Seção Rio Melchior', 'Pluv. Gama', 'Est. Fazenda Papuda']
};
const VARIABLES = ['Precipitação (mm)','Nível (m)','Vazão (m³/s)','Armazenamento (%)'];

// base e amplitude por bacia/variável
const BASES = {
  'DF — Geral':     { precip:[8,10],  nivel:[5.2,0.3],  flow:[16,6],  storage:[64,10] },
  'Descoberto':     { precip:[9,12],  nivel:[6.0,0.4],  flow:[18,8],  storage:[72,12] },
  'Paranoá':        { precip:[7,9],   nivel:[4.5,0.3],  flow:[14,5],  storage:[68,10] },
  'São Bartolomeu': { precip:[10,12], nivel:[5.6,0.35], flow:[20,9],  storage:[60,14] }
};

function varKey(label){
  if (/precip/i.test(label)) return 'precip';
  if (/nível|nivel/i.test(label)) return 'nivel';
  if (/vaz[aã]o/i.test(label))   return 'flow';
  if (/armazen|%/i.test(label))  return 'storage';
  return 'flow';
}

/* ===================== Geração da série diária ===================== */
const DAYS = 720; // ~24 meses
function seasonalFactor(i){ const f=(i%365)/365; return 0.6 + 0.4 * Math.sin(2*Math.PI*(f+0.15)); }

function generateDailySeries(basin, station, variable){
  const vk = varKey(variable);
  const [base, amp] = BASES[basin][vk];
  const rnd = mulberry32(hashStr(`${basin}::${station}::${variable}`));
  const end = Date.now();

  return Array.from({length:DAYS}, (_,i)=>{
    const t = new Date(end - (DAYS-1-i)*DAY_MS); t.setHours(12,0,0,0);
    const season = seasonalFactor(i);
    const noise = (rnd()-0.5);
    const stationFactor = 0.9 + rnd()*0.2; // ±10%

    let value = (base*stationFactor)
      + (amp*stationFactor) * Math.sin((i/11) + rnd()*0.7) * season
      + (amp*0.15) * (Math.cos(i/5) + Math.sin(i/7))
      + noise * amp * 0.35;

    if (vk==='precip'){
      value = (rnd() < clamp(season*0.9,0.18,0.95)) ? Math.max(0,value) : 0; // eventos de chuva
    }
    if (vk==='storage'){ value = clamp(value,15,100); }
    if (vk==='nivel'){ value = clamp(value,2.2,8.8); }
    if (vk==='flow'){ value = Math.max(0,value); }

    return { t, v:Number(value.toFixed(3)) };
  });
}

/* ======================= "Banco" em memória ======================= */
const DB = {}; // key `${basin}::${station}::${variable}` => array
const ensureSeries = (b,s,v)=> (DB[`${b}::${s}::${v}`] ??= generateDailySeries(b,s,v));

/* ==================== Slicing e agregação ==================== */
function sliceByDate(series, fromISO, toISO){
  const from = parseISO(fromISO), to = parseISO(toISO);
  return series.filter(({t})=>{
    if (from && t<from) return false;
    if (to && t>to) return false;
    return true;
  });
}
function aggregate(series, agg){
  if (agg==='D') return series;
  const map = new Map();
  series.forEach(({t,v})=>{
    let key;
    if (agg==='W'){
      const tmp=new Date(t.getTime()); tmp.setDate(tmp.getDate()+3-((tmp.getDay()+6)%7));
      const week1=new Date(tmp.getFullYear(),0,4);
      const w=1+Math.round(((tmp-week1)/DAY_MS-3+((week1.getDay()+6)%7))/7);
      key=`W${tmp.getFullYear()}-${pad(w)}`;
    }else{
      key=`M${t.getFullYear()}-${pad(t.getMonth()+1)}`;
    }
    (map.get(key) ?? map.set(key,[]).get(key)).push(v);
  });
  const out=[];
  map.forEach((arr,key)=>{
    let t;
    if (key.startsWith('W')){
      const [Y,W]=key.slice(1).split('-').map(Number);
      t=new Date(Date.UTC(Y,0,1+(W-1)*7));
    }else{
      const [Y,M]=key.slice(1).split('-').map(Number);
      t=new Date(Date.UTC(Y,M-1,1));
    }
    out.push({t, v:Number(avg(arr).toFixed(3))});
  });
  out.sort((a,b)=>a.t-b.t);
  return out;
}
function getMockData({basin,station,variable,from,to,agg}){
  const daily = ensureSeries(basin, station, variable);
  return aggregate(sliceByDate(daily, from, to), agg||'D');
}

/* ======================= Sparkline & Distribuição ======================= */
function sparkline(values,w=460,h=92,padX=8,padY=10){
  if (!values.length) return '';
  const vmin=Math.min(...values), vmax=Math.max(...values), span=Math.max(1e-9,vmax-vmin);
  const step=(w-padX*2)/Math.max(1,values.length-1);
  const pts=values.map((v,i)=>{
    const x=padX+i*step, y=h-padY-((v-vmin)/span)*(h-padY*2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-label="Série">
    <polyline points="${pts}" fill="none" stroke="#0A5C67" stroke-width="2"/>
  </svg>`;
}
function buildDistributionHTML(values){
  if (!values.length) return '<p style="color:#6b7280">—</p>';
  const bins=14, vmin=Math.min(...values), vmax=Math.max(...values), span=vmax-vmin||1;
  const counts=new Array(bins).fill(0);
  values.forEach(v=>{ let i=Math.floor(((v-vmin)/span)*bins); if(i===bins)i=bins-1; counts[i]++; });
  const maxC=Math.max(...counts,1);
  return `
    <div style="display:grid;grid-template-columns:repeat(${bins},1fr);gap:6px;align-items:end;height:160px">
      ${counts.map(c=>`<div style="background:#0A5C671A;border-radius:6px;height:${Math.round(130*(c/maxC))}px;border:1px solid #0A5C6733"></div>`).join('')}
    </div>`;
}

/* ============================ Presets ============================ */
function offsetDate(days){ const d=new Date(Date.now()+days*DAY_MS); d.setHours(12,0,0,0); return fmtDate(d); }
const PRESETS = {
  df_daily_overview:   ()=>({ basin:'DF — Geral',   station:'Est. Central (DF-01)', variable:'Vazão (m³/s)',        agg:'D', from:offsetDate(-7),  to:offsetDate(0) }),
  desc_precip_30d:     ()=>({ basin:'Descoberto',   station:'Pluv. Taguatinga',     variable:'Precipitação (mm)',   agg:'D', from:offsetDate(-30), to:offsetDate(0) }),
  paranoa_month_level: ()=>({ basin:'Paranoá',      station:'UHE Paranoá',          variable:'Nível (m)',           agg:'M', from:`${new Date().getFullYear()}-01-01`, to:offsetDate(0) }),
  sb_flow_90d_weekly:  ()=>({ basin:'São Bartolomeu',station:'Seção Rio Melchior',  variable:'Vazão (m³/s)',        agg:'W', from:offsetDate(-90), to:offsetDate(0) }),
};

/* ======================= Controlador da página ======================= */
export function initReportsEffects(root){
  const el = {
    basin: root.querySelector('#rep-basin'),
    station: root.querySelector('#rep-station'),
    variable: root.querySelector('#rep-var'),
    agg: root.querySelector('#rep-agg'),
    from: root.querySelector('#rep-from'),
    to: root.querySelector('#rep-to'),

    generate: root.querySelector('#rep-generate'),
    exportCsv: root.querySelector('#rep-export-csv'),
    print: root.querySelector('#rep-print'),

    presetSelect: root.querySelector('#rep-preset'),
    presetCards: root.querySelectorAll('.preset-card'),
    chips: root.querySelectorAll('.chip'),

    kPoints: root.querySelector('#rep-kpi-points'),
    kMean: root.querySelector('#rep-kpi-mean'),
    kMin: root.querySelector('#rep-kpi-min'),
    kMax: root.querySelector('#rep-kpi-max'),

    summary: root.querySelector('#rep-summary'),
    findings: root.querySelector('#rep-findings'),
    distr: root.querySelector('#rep-distribution'),

    tbody: root.querySelector('#rep-tbody'),
    status: root.querySelector('#rep-status'),
    pageLabel: root.querySelector('#rep-page'),
    prev: root.querySelector('#rep-prev'),
    next: root.querySelector('#rep-next'),
  };

  if (el.status) el.status.setAttribute('aria-live','polite');

  /* --------- popula estações quando há #rep-station --------- */
  function populateStations(){
    if (!el.station) return;
    const basin = el.basin?.value || BASINS[0];
    const list = STATIONS_BY_BASIN[basin] ?? [];
    el.station.innerHTML = list.map(s=>`<option value="${s}">${s}</option>`).join('');
  }

  // Estado
  let current = { data: [], meta: {} };
  let page=1, perPage=20;

  const setStatus = (m)=>{ if(el.status) el.status.textContent=m; };
  const setBusy = (b)=>{ if(!el.generate) return; el.generate.disabled=b; el.generate.textContent=b?'Gerando…':'Gerar'; };

  function validateRange(){
    const a=parseISO(el.from?.value), b=parseISO(el.to?.value);
    if (a && b && a>b) return 'Intervalo inválido: "De" é maior que "Até".';
    return '';
  }

  function fetchData(){
    const err = validateRange();
    if (err){ setStatus(err); return; }
    setBusy(true);
    setTimeout(()=>{
      const basin    = el.basin?.value    || BASINS[0];
      const station  = el.station?.value  || (STATIONS_BY_BASIN[basin]?.[0] ?? 'Ponto 1');
      const variable = el.variable?.value || VARIABLES[2]; // default Vazão
      const agg      = el.agg?.value      || 'D';
      const from     = el.from?.value     || offsetDate(-30);
      const to       = el.to?.value       || offsetDate(0);

      const query = { basin, station, variable, agg, from, to };
      const data = getMockData(query);

      current = { data, meta: query };
      page = 1;
      render();
      setBusy(false);
      setStatus(`${data.length} pontos carregados.`);
    }, 40);
  }

  function applyPreset(id){
    const p = PRESETS[id]?.(); if (!p) return;
    if (el.basin) el.basin.value = p.basin;
    populateStations();
    if (el.station) el.station.value = p.station;
    if (el.variable) el.variable.value = p.variable;
    if (el.agg) el.agg.value = p.agg;
    if (el.from) el.from.value = p.from;
    if (el.to) el.to.value = p.to;
    fetchData();
  }

  function setQuickRange(kind){
    const now=new Date();
    if (el.to) el.to.value = offsetDate(0);
    if (el.from){
      if (kind==='7d')   el.from.value=offsetDate(-7);
      if (kind==='30d')  el.from.value=offsetDate(-30);
      if (kind==='90d')  el.from.value=offsetDate(-90);
      if (kind==='ytd')  el.from.value=`${now.getFullYear()}-01-01`;
    }
  }

  // CSV
  el.exportCsv?.addEventListener('click', ()=>{
    const rows=[['bacia','estacao','variavel','agregacao','data','valor']];
    current.data.forEach(p=>rows.push([current.meta.basin,current.meta.station,current.meta.variable,current.meta.agg,fmtDate(p.t),p.v]));
    const blob=new Blob([rows.map(r=>r.join(',')).join('\n')],{type:'text/csv;charset=utf-8;'});
    const url=URL.createObjectURL(blob); const a=document.createElement('a');
    a.href=url; a.download='relatorio.csv'; a.click(); setTimeout(()=>URL.revokeObjectURL(url), 800);
  });

  /* ===================== Impressão somente via iframe ===================== */
  function buildReportHTML(){
    const vals=current.data.map(d=>d.v);
    const title = `Relatório — ${current.meta?.basin || ''} — ${current.meta?.station || ''} — ${current.meta?.variable || ''}`;
    const meta = `
      <div style="font-size:12px;color:#6b7280;margin:8px 0 14px 0">
        Bacia: <b>${current.meta?.basin || '—'}</b> •
        Estação: <b>${current.meta?.station || '—'}</b> •
        Variável: <b>${current.meta?.variable || '—'}</b> •
        Agregação: <b>${current.meta?.agg || '—'}</b> •
        Período: <b>${el.from?.value || '—'}</b> a <b>${el.to?.value || '—'}</b>
      </div>`;

    const kpi = `
      <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:0 0 12px 0">
        ${[['Observações', current.data.length||'—'],
           ['Média', vals.length?avg(vals).toFixed(2):'—'],
           ['Mín',   vals.length?min(vals).toFixed(2):'—'],
           ['Máx',   vals.length?max(vals).toFixed(2):'—']
          ].map(([l,v])=>`
            <div style="border:1px solid #e5e7eb;border-radius:12px;padding:12px;">
              <div style="font-size:12px;color:#6b7280">${l}</div>
              <div style="font-size:20px;font-weight:700">${v}</div>
            </div>`).join('')}
      </div>`;

    const aggLabel = current.meta?.agg==='D'?'diária': current.meta?.agg==='W'?'semanal':'mensal';
    const summaryTxt = vals.length
      ? `${current.meta.variable} — ${current.meta.station} (bacia ${current.meta.basin}, agregação ${aggLabel}). ` +
        `Período ${el.from?.value||'—'} a ${el.to?.value||'—'}. ` +
        `Média ${vals.length?avg(vals).toFixed(2):'—'}, mín ${vals.length?min(vals).toFixed(2):'—'}, máx ${vals.length?max(vals).toFixed(2):'—'}.`
      : 'Sem observações para o período selecionado.';
    const summary = `<p style="margin:6px 0 10px 0">${summaryTxt}</p>`;

    const spark = `<div style="margin:10px 0 18px 0">${sparkline(vals)}</div>`;
    const distr = `<div style="margin:6px 0 18px 0">${buildDistributionHTML(vals)}</div>`;

    const maxRows = 1000;
    const rowsHtml = current.data.slice(0, maxRows).map(p=>`
      <tr>
        <td style="border-bottom:1px solid #f3f4f6;padding:8px">${fmtDate(p.t)}</td>
        <td style="border-bottom:1px solid #f3f4f6;padding:8px">${p.v}</td>
      </tr>`).join('');
    const table = `
      <table style="width:100%;border-collapse:collapse;font-size:12px;margin-top:4px">
        <thead>
          <tr>
            <th style="text-align:left;border-bottom:1px solid #e5e7eb;padding:8px">Data</th>
            <th style="text-align:left;border-bottom:1px solid #e5e7eb;padding:8px">Valor</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>
      ${current.data.length>maxRows
        ? `<div style="font-size:11px;color:#6b7280;margin-top:6px">Exibindo ${maxRows} de ${current.data.length} linhas.</div>` : ''}`;

    return `
      <!doctype html><html><head>
        <meta charset="utf-8"/>
        <title>${title}</title>
        <style>
          @media print { @page { margin: 16mm; } body { -webkit-print-color-adjust: exact; } }
          body { font-family: system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif; padding: 16px; color:#111827; }
          h1 { margin:0 0 4px 0; font-size:22px; font-weight:800; }
          h2 { font-size:14px; font-weight:700; margin:18px 0 6px 0; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        ${meta}
        ${kpi}
        <h2>Série</h2>
        ${summary}
        ${spark}
        <h2>Distribuição</h2>
        ${distr}
        <h2>Tabela de observações</h2>
        ${table}
      </body></html>`;
  }

  function printWithIframe(html){
    const iframe = document.createElement('iframe');
    iframe.style.position='fixed';
    iframe.style.right='0'; iframe.style.bottom='0';
    iframe.style.width='0'; iframe.style.height='0';
    iframe.style.border='0'; iframe.setAttribute('aria-hidden','true');
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow || iframe.contentDocument;
    const idoc = doc.document || doc;
    idoc.open(); idoc.write(html); idoc.close();
    iframe.onload = ()=> {
      try { (iframe.contentWindow || iframe).focus(); (iframe.contentWindow || iframe).print(); }
      catch(_) {}
      setTimeout(()=>iframe.remove(), 1200);
    };
  }

  // Imprimir: somente iframe (não abre about:blank)
  el.print?.addEventListener('click', ()=>{
    const html = buildReportHTML();
    printWithIframe(html);
    setStatus('Preparando impressão…');
  });

  /* ==================== Interações e render ==================== */
  // popula estações quando muda bacia
  el.basin?.addEventListener('change', ()=>{
    populateStations();
    if (el.station){
      el.station.value = STATIONS_BY_BASIN[el.basin.value]?.[0] ?? '';
    }
  });

  // filtros reativos
  const refetch = debounce(fetchData, 250);
  [el.basin, el.station, el.variable, el.agg].forEach(sel=> sel?.addEventListener('change', refetch));
  [el.from, el.to].forEach(inp=>{
    inp?.addEventListener('change', refetch);
    inp?.addEventListener('input', refetch);
  });

  // gerar manual
  el.generate?.addEventListener('click', fetchData);

  // presets e chips
  el.presetSelect?.addEventListener('change', e=>{ if (e.target.value) applyPreset(e.target.value); });
  el.presetCards?.forEach(btn=>btn.addEventListener('click', ()=>applyPreset(btn.dataset.preset)));
  el.chips?.forEach(c=>c.addEventListener('click', ()=>{ setQuickRange(c.dataset.range); fetchData(); }));

  // paginação
  el.prev?.addEventListener('click', ()=>{ if (page>1){ page--; render(); } });
  el.next?.addEventListener('click', ()=>{
    const total=Math.max(1, Math.ceil(current.data.length / perPage));
    if (page<total){ page++; render(); }
  });

  function render(){
    const vals=current.data.map(d=>d.v);
    if (el.kPoints) el.kPoints.textContent = String(current.data.length || '—');
    if (el.kMean)   el.kMean.textContent   = vals.length ? avg(vals).toFixed(2) : '—';
    if (el.kMin)    el.kMin.textContent    = vals.length ? min(vals).toFixed(2) : '—';
    if (el.kMax)    el.kMax.textContent    = vals.length ? max(vals).toFixed(2) : '—';

    const aggLabel = (el.agg?.value==='D'?'diária': el.agg?.value==='W'?'semanal':'mensal');
    if (el.summary) el.summary.textContent = vals.length
      ? `${el.variable?.value} — ${el.station?.value || '—'} (bacia ${el.basin?.value || '—'}, agregação ${aggLabel}). Período ${el.from?.value||'—'} a ${el.to?.value||'—'}. Média ${el.kMean?.textContent}, mín ${el.kMin?.textContent}, máx ${el.kMax?.textContent}.`
      : 'Sem observações para o período selecionado.';

    const findings=[];
    if (vals.length){
      const first=vals[0], last=vals.at(-1), delta=last-first;
      if (Math.abs(delta) > Math.max(0.2*(avg(vals)||1), 0.01))
        findings.push(delta>0?'Tendência de alta no período analisado.':'Tendência de queda no período analisado.');
      findings.push(`Amplitude (máx - mín): ${(max(vals)-min(vals)).toFixed(2)}.`);
      if (/Precipitação/.test(el.variable?.value) && max(vals)>30) findings.push('Ocorreram eventos de chuva intensa.');
      if (/Armazenamento/.test(el.variable?.value) && max(vals)>90) findings.push('Armazenamento próximo da capacidade máxima.');
      if (/Vazão/.test(el.variable?.value) && max(vals)>35) findings.push('Picos de vazão elevados em alguns momentos.');
    } else { findings.push('Nenhum achado relevante.'); }
    if (el.findings) el.findings.innerHTML = findings.map(f=>`<li>${f}</li>`).join('');

    // distribuição
    if (el.distr){
      if (!vals.length) el.distr.innerHTML = '<div class="text-sm text-gray-500">—</div>';
      else el.distr.innerHTML = buildDistributionHTML(vals);
    }

    // tabela
    const totalPages = Math.max(1, Math.ceil(current.data.length / perPage));
    if (page>totalPages) page=totalPages;
    const start=(page-1)*perPage;
    const slice=current.data.slice(start, start+perPage);
    if (el.tbody) el.tbody.innerHTML = slice.map(p=>`
      <tr>
        <td class="td-cell whitespace-nowrap">${fmtDate(p.t)}</td>
        <td class="td-cell">${p.v}</td>
      </tr>`).join('');
    if (el.pageLabel) el.pageLabel.textContent = `${page}/${totalPages}`;
    if (el.prev) el.prev.disabled = page<=1;
    if (el.next) el.next.disabled = page>=totalPages;
  }

  // Boot
  populateStations();
  applyPreset('df_daily_overview'); // já chama fetch/render
}
