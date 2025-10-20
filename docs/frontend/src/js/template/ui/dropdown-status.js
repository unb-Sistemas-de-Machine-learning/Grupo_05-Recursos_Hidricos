// Dropdown custom para o filtro de Status
export function mountStatusDropdown(root = document) {
  const wrap  = root.querySelector('#dd-status');
  if (!wrap) return;

  const btn   = wrap.querySelector('#dd-status-btn');
  const list  = wrap.querySelector('#dd-status-list');
  const label = wrap.querySelector('#dd-status-label');
  const input = wrap.querySelector('#f-status');
  const opts  = Array.from(wrap.querySelectorAll('.dd-opt'));

  let open = false;
  let idx  = Math.max(0, opts.findIndex(li => li.dataset.value === (input.value || '')));
  const textMap = { '': 'Todos', ok: 'Concluído', warn: 'Com alerta', emg: 'Parada de emergência' };

  function renderOpen(state){
    open = state;
    list.classList.toggle('invisible', !open);
    list.classList.toggle('opacity-0', !open);
    list.classList.toggle('pointer-events-none', !open);
    btn.querySelector('svg')?.classList.toggle('rotate-180', open);
    if (open) highlight(idx);
  }
  function choose(i){
    const el = opts[i];
    if (!el) return;
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

  // Abrir/fechar
  btn.addEventListener('click', () => renderOpen(!open));
  // Mouse e clique
  opts.forEach((li, i) => {
    li.addEventListener('mousemove', () => { idx = i; highlight(idx); });
    li.addEventListener('click', () => choose(i));
  });

  // Teclado
  btn.addEventListener('keydown', (e) => {
    if (['ArrowDown','ArrowUp','Enter',' '].includes(e.key)) { e.preventDefault(); renderOpen(true); }
  });
  list.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); idx = (idx+1)%opts.length; highlight(idx); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); idx = (idx-1+opts.length)%opts.length; highlight(idx); }
    if (e.key === 'Enter')     { e.preventDefault(); choose(idx); }
    if (e.key === 'Escape')    { e.preventDefault(); renderOpen(false); btn.focus(); }
  });

  // Clique fora
  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) renderOpen(false);
  });

  // Inicial
  label.textContent = textMap[input.value] ?? 'Todos';
  renderOpen(false);
}
