// /src/js/reports/history.effects.js
import { REPORTS_MOCK } from '/src/js/mock/reports-mock.js'

/* ===== Config ===== */
const USE_API = false;
const API_BASE = '';

/* ===== Utils ===== */
function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem('mock_auth_user') || 'null'); }
  catch { return null; }
}
const fmtDate = (iso) => new Date(iso).toLocaleString();
const fmtDur  = (s) => `${Math.floor(s/60)}min ${s%60}s`;
const badge = (status) => {
  const map = {
    ok:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    warn: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    emg:  'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
  };
  const text = { ok:'Concluído', warn:'Com alerta', emg:'Parada de emergência' }[status] ?? status;
  return `<span class="px-2 py-0.5 rounded text-[11px] ${map[status]||'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300'}">${text}</span>`;
};
function paginate(arr, page, size){ const start=(page-1)*size; return arr.slice(start, start+size); }

// Datas (local)
function parseDateInput(val){ if(!val) return null; const [y,m,d]=val.split('-').map(Number); return new Date(y, m-1, d); }
const startOfDay = (d)=> new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0,0,0,0);
const endOfDay   = (d)=> new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23,59,59,999);

/* ===== Dropdown custom de Status ===== */
function mountStatusDropdown(root = document) {
  const wrap  = root.querySelector('#dd-status');
  const input = root.querySelector('#f-status');
  const btn   = root.querySelector('#dd-status-btn');
  const list  = root.querySelector('#dd-status-list');
  const label = root.querySelector('#dd-status-label');
  if (!wrap || !input || !btn || !list || !label) return;

  const opts  = Array.from(list.querySelectorAll('.dd-opt'));
  const textMap = { '': 'Todos', ok: 'Concluído', warn: 'Com alerta', emg: 'Parada de emergência' };

  let open = false;
  let idx  = Math.max(0, opts.findIndex(li => li.dataset.value === (input.value || '')));

  function renderOpen(state){
    open = state;
    list.classList.toggle('invisible', !open);
    list.classList.toggle('opacity-0', !open);
    list.classList.toggle('pointer-events-none', !open);
    btn.querySelector('svg')?.classList.toggle('rotate-180', open);
    if (open) highlight(idx);
  }
  function choose(i){
    const el = opts[i]; if (!el) return;
    idx = i;
    input.value = el.dataset.value;
    label.textContent = textMap[input.value] ?? 'Todos';
    renderOpen(false);
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
  function highlight(i){
    opts.forEach(li => li.classList.remove('bg-black/5','dark:bg-white/10'));
    const el = opts[i];
    if (el) el.classList.add('bg-black/5','dark:bg-white/10');
  }

  btn.addEventListener('click', () => renderOpen(!open));
  opts.forEach((li, i) => {
    li.addEventListener('mousemove', () => { idx = i; highlight(idx); });
    li.addEventListener('click', () => choose(i));
  });
  btn.addEventListener('keydown', (e) => {
    if (['ArrowDown','ArrowUp','Enter',' '].includes(e.key)) { e.preventDefault(); renderOpen(true); }
  });
  list.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); idx = (idx+1)%opts.length; highlight(idx); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); idx = (idx-1+opts.length)%opts.length; highlight(idx); }
    if (e.key === 'Enter')     { e.preventDefault(); choose(idx); }
    if (e.key === 'Escape')    { e.preventDefault(); renderOpen(false); btn.focus(); }
  });
  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) renderOpen(false);
  });
  label.textContent = textMap[input.value] ?? 'Todos';
  renderOpen(false);
}

/* ===== Dropdown custom para o <select id="f-patient"> ===== */
function mountPatientDropdown(root = document) {
  const wrap   = root.querySelector('#f-patient-wrap');
  const select = root.querySelector('#f-patient');
  if (!wrap || !select) return;
  if (wrap.querySelector('#dd-patient')) return; // já montado

  const dd = document.createElement('div');
  dd.id = 'dd-patient';
  dd.className = 'relative mt-1';

  const btn = document.createElement('button');
  btn.id = 'dd-patient-btn';
  btn.type = 'button';
  btn.className = 'w-full flex justify-between items-center rounded-lg border border-gray-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm';

  const label = document.createElement('span');
  label.id = 'dd-patient-label';
  label.className = 'truncate';
  label.textContent = select.options[select.selectedIndex]?.text || 'Todos';

  const caret = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  caret.setAttribute('viewBox','0 0 24 24');
  caret.setAttribute('fill','none');
  caret.setAttribute('stroke','currentColor');
  caret.classList.add('w-4','h-4','ml-2','transition-transform');
  caret.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>`;

  btn.appendChild(label);
  btn.appendChild(caret);

  const ul = document.createElement('ul');
  ul.id = 'dd-patient-list';
  ul.className = 'absolute left-0 mt-1 w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-[#0E1A2B] shadow-lg transition invisible opacity-0 pointer-events-none z-[9999]';

  Array.from(select.options).forEach(opt => {
    const li = document.createElement('li');
    li.className = 'ddp-opt px-3 py-2 text-sm cursor-pointer hover:bg-black/5 dark:hover:bg-white/10';
    li.dataset.value = opt.value;
    li.textContent = opt.text;
    ul.appendChild(li);
  });

  dd.appendChild(btn);
  dd.appendChild(ul);
  wrap.insertBefore(dd, select);
  select.style.display = 'none';

  const opts = Array.from(ul.querySelectorAll('.ddp-opt'));
  let open = false;
  let idx = Math.max(0, opts.findIndex(li => li.dataset.value === (select.value || '')));

  function renderOpen(state){
    open = state;
    ul.classList.toggle('invisible', !open);
    ul.classList.toggle('opacity-0', !open);
    ul.classList.toggle('pointer-events-none', !open);
    caret.classList.toggle('rotate-180', open);
    if (open) highlight(idx);
  }
  function choose(i){
    const el = opts[i]; if (!el) return;
    idx = i;
    select.value = el.dataset.value;
    label.textContent = el.textContent || 'Todos';
    renderOpen(false);
    select.dispatchEvent(new Event('change', { bubbles:true }));
  }
  function highlight(i){
    opts.forEach(li => li.classList.remove('bg-black/5','dark:bg-white/10'));
    const el = opts[i];
    if (el) el.classList.add('bg-black/5','dark:bg-white/10');
  }

  btn.addEventListener('click', () => renderOpen(!open));
  opts.forEach((li, i) => {
    li.addEventListener('mousemove', () => { idx = i; highlight(idx); });
    li.addEventListener('click', () => choose(i));
  });
  btn.addEventListener('keydown', (e) => {
    if (['ArrowDown','ArrowUp','Enter',' '].includes(e.key)) { e.preventDefault(); renderOpen(true); }
  });
  ul.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); idx = (idx+1)%opts.length; highlight(idx); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); idx = (idx-1+opts.length)%opts.length; highlight(idx); }
    if (e.key === 'Enter')     { e.preventDefault(); choose(idx); }
    if (e.key === 'Escape')    { e.preventDefault(); renderOpen(false); btn.focus(); }
  });
  document.addEventListener('click', (e) => {
    if (!dd.contains(e.target)) renderOpen(false);
  });

  dd._resetLabel = () => { label.textContent = select.options[0]?.text || 'Todos'; };
}

/* Util: fecha listas abertas (evita overlay) */
function closeAllDropdowns(root=document){
  root.querySelector('#dd-status-list')?.classList.add('invisible','opacity-0','pointer-events-none');
  root.querySelector('#dd-status-btn svg')?.classList.remove('rotate-180');
  root.querySelector('#dd-patient-list')?.classList.add('invisible','opacity-0','pointer-events-none');
  root.querySelector('#dd-patient-btn svg')?.classList.remove('rotate-180');
}

/* ===== API ===== */
async function fetchReportsFromApi(params) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k,v])=>{
    if (v !== undefined && v !== null && `${v}`.trim() !== '') qs.append(k, v);
  });
  const url = `${API_BASE}/api/reports?${qs.toString()}`;
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) throw new Error(`Erro ao carregar relatórios (${res.status})`);
  return res.json();
}

/* ===== Página ===== */
export function initReportsEffects(root = document){
  mountStatusDropdown(root);

  const user = getCurrentUser();
  const role = String(user?.role || 'paciente').toLowerCase(); // NORMALIZA

  const el = {
    subtitle: root.querySelector('#rep-subtitle'),
    thPatient: root.querySelector('#th-patient'),
    filters: {
      q:      root.querySelector('#f-name') || root.querySelector('#f-q'),
      start:  root.querySelector('#f-start'),
      end:    root.querySelector('#f-end'),
      status: root.querySelector('#f-status'),
      patientWrap: root.querySelector('#f-patient-wrap'),
      patient:root.querySelector('#f-patient'),
      apply:  root.querySelector('#f-apply'),
      clear:  root.querySelector('#f-clear'),
    },
    list: root.querySelector('#rep-list'),
    empty:root.querySelector('#rep-empty'),
    count:root.querySelector('#rep-count'),
    pager:{ prev: root.querySelector('#pg-prev'), next: root.querySelector('#pg-next'), info: root.querySelector('#pg-info') },
  };

  // Subtítulo
  if (role === 'paciente') {
    el.subtitle.textContent = 'Relatórios das suas sessões de exercício.';
  } else if (role === 'medico') {
    el.subtitle.textContent = 'Relatórios dos seus pacientes.';
  } else {
    el.subtitle.textContent = 'Relatórios do sistema.';
  }

  // Filtro Paciente (para médico/admin)
  const showPatient = role !== 'paciente';
  if (showPatient) {
    el.thPatient.classList.remove('hidden');
    el.filters.patientWrap.classList.remove('hidden');

    const seen = new Set();
    const patients = REPORTS_MOCK
      .filter(r => { if (seen.has(r.userId)) return false; seen.add(r.userId); return true; })
      .map(r => ({ userId: r.userId, name: r.patientName }))
      .sort((a,b)=> a.name.localeCompare(b.name, 'pt-BR'));

    el.filters.patient.innerHTML =
      `<option value="">Todos</option>` +
      patients.map(p => `<option value="${p.userId}">${p.name}</option>`).join('');

    mountPatientDropdown(root);
  }

  let page=1, size=8, currentRows=[];

  async function apply() {
    closeAllDropdowns(root); // garante que nenhum dropdown fique por cima

    // ===== MODO API opcional =====
    if (USE_API) {
      try {
        const params = {
          start:  el.filters.start?.value || '',
          end:    el.filters.end?.value   || '',
          status: el.filters.status?.value || '',
          q:      (el.filters.q?.value || '').trim(),
          patientId: showPatient ? (el.filters.patient?.value || '') : '',
          page, size
        };
        if (role === 'paciente' && user?.id) params.patientId = user.id;

        const r = await fetchReportsFromApi(params);
        const total = r.total ?? 0;
        const totalPages = Math.max(1, Math.ceil(total / (r.size || size)));
        if (page > totalPages) page = totalPages;

        currentRows = r.items || [];
        renderTable(currentRows);

        el.count.textContent = `${total} resultado(s)`;
        el.pager.info.textContent = `Página ${r.page || page} de ${totalPages}`;
        el.pager.prev.disabled = (r.page || page) <= 1;
        el.pager.next.disabled = (r.page || page) >= totalPages;
        el.empty.classList.toggle('hidden', total > 0);
        return;
      } catch (err) {
        console.warn('[reports] Falha na API, usando mock]:', err);
      }
    }

    // ===== MODO MOCK =====
    let rows = REPORTS_MOCK.slice();
    if (role === 'paciente') {
      rows = rows.filter(r => r.userId === user?.id);
    }

    // datas locais com proteção de inversão
    let s = el.filters.start?.value ? startOfDay(parseDateInput(el.filters.start.value)) : null;
    let e = el.filters.end  ?.value ? endOfDay  (parseDateInput(el.filters.end.value))   : null;
    if (s && e && s > e) { const tmp = s; s = e; e = tmp; }

    const st = el.filters.status?.value || '';
    const p  = showPatient ? (el.filters.patient?.value || '') : '';
    const q  = (el.filters.q?.value || '').trim().toLowerCase();

    rows = rows.filter(r => {
      const t = new Date(r.date);
      if (s && t < s) return false;
      if (e && t > e) return false;
      if (st && r.status !== st) return false;
      if (p && r.userId !== p) return false;
      if (q) {
        const hay = `${r.patientName} ${r.id}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    rows.sort((a,b)=> new Date(b.date)-new Date(a.date));

    const total = rows.length;
    const totalPages = Math.max(1, Math.ceil(total/size));
    if (page>totalPages) page = totalPages;

    currentRows = paginate(rows, page, size);

    renderTable(currentRows);
    el.count.textContent = `${total} resultado(s)`;
    el.pager.info.textContent = `Página ${page} de ${totalPages}`;
    el.pager.prev.disabled = page<=1;
    el.pager.next.disabled = page>=totalPages;

    el.empty.classList.toggle('hidden', total>0);
  }

  function renderTable(rows){
    el.list.innerHTML = rows.map(r => {
      const hasPdf = !!r.pdf;
      const actions = `
        <div class="flex items-center gap-2">
          ${hasPdf
            ? `<a href="${r.pdf}" download class="text-xs px-2 py-1 rounded bg-indigo-600 text-white hover:brightness-110">PDF</a>`
            : `<span class="text-xs px-2 py-1 rounded bg-slate-400/50 text-white cursor-not-allowed opacity-60">PDF</span>`
          }
          ${hasPdf
            ? `<a href="${r.pdf}" target="_blank" rel="noopener noreferrer"
                 class="text-xs px-2 py-1 rounded border border-gray-300 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10">
                 Detalhes
               </a>`
            : `<button disabled
                 class="text-xs px-2 py-1 rounded border border-gray-300 dark:border-white/20 opacity-50 cursor-not-allowed">
                 Detalhes
               </button>`
          }
        </div>`;
      const patientCell = (role !== 'paciente') ? `<td class="py-2 pr-4">${r.patientName}</td>` : '';
      return `
        <tr class="border-b border-black/5 dark:border-white/10">
          ${patientCell}
          <td class="py-2 pr-4">${fmtDate(r.date)}</td>
          <td class="py-2 pr-4">${fmtDur(r.durationSec)}</td>
          <td class="py-2 pr-4">${r.target}</td>
          <td class="py-2 pr-4">${r.reps}</td>
          <td class="py-2 pr-4">${badge(r.status)}</td>
          <td class="py-2 pr-4">${actions}</td>
        </tr>`;
    }).join('');
  }

  // Eventos
  el.filters.apply.addEventListener('click', ()=>{ page=1; apply(); });
  el.filters.clear.addEventListener('click', ()=>{
    if (el.filters.q) el.filters.q.value='';
    if (el.filters.start)  el.filters.start.value='';
    if (el.filters.end)    el.filters.end.value='';
    if (el.filters.status) el.filters.status.value='';
    root.querySelector('#dd-status-label') && (root.querySelector('#dd-status-label').textContent = 'Todos');
    if (showPatient && el.filters.patient) {
      el.filters.patient.value='';
      root.querySelector('#dd-patient')?._resetLabel?.();
    }
    page=1; apply();
  });

  // Auto-apply em mudanças
  el.filters.start?.addEventListener('change', ()=>{ page=1; apply(); });
  el.filters.end?.addEventListener('change',   ()=>{ page=1; apply(); });
  el.filters.status?.addEventListener('change',()=>{ page=1; apply(); });
  el.filters.patient?.addEventListener('change',()=>{ page=1; apply(); });

  if (el.filters.q) {
    el.filters.q.addEventListener('keydown', (e)=>{
      if (e.key === 'Enter') { e.preventDefault(); page=1; apply(); }
    });
  }
  el.pager.prev.addEventListener('click', ()=>{ page=Math.max(1,page-1); apply(); });
  el.pager.next.addEventListener('click', ()=>{ page=page+1; apply(); });

  apply();
}
