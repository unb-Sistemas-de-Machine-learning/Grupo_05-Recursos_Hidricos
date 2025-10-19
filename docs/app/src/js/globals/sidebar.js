// /src/js/globals/sidebar.js
import { applyTranslations, setLanguage } from '/src/js/i18n/i18n.js';

const THEME_KEY = 'ap-theme';
const SB_COLLAPSE_KEY = 'ap-sb-collapsed';

const qs  = (r, s) => r.querySelector(s);
const qsa = (r, s) => Array.from(r.querySelectorAll(s));

/* ========== Tema ========== */
function getStoredTheme(){ return localStorage.getItem(THEME_KEY); }
function applyTheme(theme){
  const isDark = theme === 'dark' || (!theme && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', isDark);
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
}
function initThemeControl(root){
  applyTheme(getStoredTheme());
  qs(root, '#theme-toggle')?.addEventListener('click', () => {
    applyTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark');
  });
}

/* ========== Colapsado ========== */
function getStoredCollapsed(){ return localStorage.getItem(SB_COLLAPSE_KEY) === '1'; }
function setStoredCollapsed(v){ localStorage.setItem(SB_COLLAPSE_KEY, v ? '1' : '0'); }
function applyCollapsedState(sidebar, collapsed){
  sidebar.toggleAttribute('data-collapsed', collapsed);
  sidebar.classList.toggle('collapsed', collapsed);

  const logoExpanded  = qs(sidebar, '#sb-logo-expanded');
  const logoCollapsed = qs(sidebar, '#sb-logo-collapsed');
  if (logoExpanded && logoCollapsed){
    logoExpanded.classList.toggle('hidden', collapsed);
    logoCollapsed.classList.toggle('hidden', !collapsed);
  }

  qsa(sidebar, '[data-sb-label]').forEach(el => el.classList.toggle('hidden', collapsed));
  qs(sidebar, '#sb-collapse')?.setAttribute('aria-label', collapsed ? 'Expandir menu' : 'Comprimir menu');

  document.body.classList.add('has-sidebar');
  document.body.classList.toggle('sb-collapsed', collapsed);
}

/* ========== Dropdown flip (expandido) ========== */
function flipDropdown(dropEl, anchorBtn){
  if (!dropEl || !anchorBtn) return;
  const btnRect = anchorBtn.getBoundingClientRect();
  const desiredH = Math.min(260, dropEl.scrollHeight || 260);
  const spaceBelow = window.innerHeight - btnRect.bottom;
  const openDown = spaceBelow >= desiredH + 16;
  dropEl.classList.toggle('down', openDown);
  dropEl.classList.toggle('up', !openDown);
}

/* ========== Popover (colapsado) ========== */
function ensureScrim(){
  let scrim = document.getElementById('sb-popover-scrim');
  if (!scrim){
    scrim = document.createElement('div');
    scrim.id = 'sb-popover-scrim';
    scrim.className = 'hidden';
    document.body.appendChild(scrim);
  }
  return scrim;
}
function openPopover(anchorEl, contentEl){
  const pop = document.getElementById('sb-popover');
  if (!pop || !anchorEl || !contentEl) return;

  const scrim = ensureScrim();
  scrim.classList.remove('hidden');
  scrim.onclick = closePopover;

  pop.innerHTML = '';
  const clone = contentEl.cloneNode(true);
  clone.classList.remove('hidden');
  clone.style.position = 'static';
  clone.style.inset = 'auto';
  pop.appendChild(clone);

  const rect = anchorEl.getBoundingClientRect();
  const width = Math.max(240, anchorEl.offsetWidth);
  const left = Math.min(rect.right + 10, window.innerWidth - width - 8);
  let maxH = Math.min(320, window.innerHeight - 16);
  pop.style.maxHeight = `${maxH}px`;

  let top = rect.top - 8;
  if (top + maxH > window.innerHeight - 8) top = window.innerHeight - maxH - 8;
  if (top < 8) top = 8;

  Object.assign(pop.style, { left:`${left}px`, top:`${top + window.scrollY}px`, width:`${width}px` });
  pop.classList.remove('hidden');

  qsa(pop, '[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang') || 'pt-BR';
      try { setLanguage(lang); } catch {
        document.documentElement.lang = lang;
        localStorage.setItem('ap-lang', lang);
        applyTranslations(document);
      }
      const current = document.querySelector('#lang-current');
      if (current) current.textContent = lang;
      closePopover();
    });
  });
  qsa(pop, '[data-sb-action]').forEach(btn => {
    btn.addEventListener('click', () => { handleAccountAction(btn.getAttribute('data-sb-action')); closePopover(); });
  });

  window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closePopover(); }, { once:true });
  window.addEventListener('resize', closePopover, { once:true });
  window.addEventListener('scroll', closePopover, { once:true, passive:true });
}
function closePopover(){
  const pop   = document.getElementById('sb-popover');
  const scrim = document.getElementById('sb-popover-scrim');
  if (pop){ pop.classList.add('hidden'); pop.innerHTML=''; }
  scrim?.classList.add('hidden');
}

/* ========== Idioma ========== */
function initLangDropdown(root){
  const toggle = qs(root, '#lang-toggle');
  const menu   = qs(root, '#lang-menu');
  const currentLabel = qs(root, '#lang-current');
  const setLabel = (code) => { if (currentLabel) currentLabel.textContent = code; };

  const open  = () => { if (!menu) return; flipDropdown(menu, toggle); menu.classList.remove('hidden'); toggle?.setAttribute('aria-expanded','true'); };
  const close = () => { if (!menu) return; menu.classList.add('hidden');    toggle?.setAttribute('aria-expanded','false'); };
  const toggleOpen = () => (menu?.classList.contains('hidden') ? open() : close());

  toggle?.addEventListener('click', (e) => {
    const sb = root.querySelector('#ap-sidebar') || root;
    const isCollapsed = sb.hasAttribute('data-collapsed') || sb.classList.contains('collapsed');
    if (isCollapsed){ e.preventDefault(); openPopover(toggle, menu); }
    else{ toggleOpen(); }
  });

  document.addEventListener('click', (e) => {
    if (!menu || !toggle) return;
    if (!root.contains(e.target)) return;
    const inside = menu.contains(e.target) || toggle.contains(e.target);
    if (!inside) close();
  });

  window.addEventListener('keydown', (e) => { if (e.key === 'Escape'){ close(); closePopover(); } });

  qsa(menu, '.sb-dd-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang') || 'pt-BR';
      try { setLanguage(lang); } catch {
        document.documentElement.lang = lang;
        localStorage.setItem('ap-lang', lang);
        applyTranslations(document);
      }
      setLabel(lang); close();
    });
  });

  const saved = localStorage.getItem('ap-lang') || 'PT-BR';
  setLabel(saved);
}

/* ========== Conta ========== */
function initAccountMenu(root){
  const toggle = qs(root, '#account-toggle');
  const menu   = qs(root, '#account-menu');

  const open  = () => { if (!menu) return; flipDropdown(menu, toggle); menu.classList.remove('hidden'); toggle?.setAttribute('aria-expanded','true'); };
  const close = () => { if (!menu) return; menu.classList.add('hidden');    toggle?.setAttribute('aria-expanded','false'); };
  const toggleOpen = () => (menu?.classList.contains('hidden') ? open() : close());

  toggle?.addEventListener('click', (e) => {
    const sb = root.querySelector('#ap-sidebar') || root;
    const isCollapsed = sb.hasAttribute('data-collapsed') || sb.classList.contains('collapsed');
    if (isCollapsed){ e.preventDefault(); openPopover(toggle, menu); }
    else{ toggleOpen(); }
  });

  document.addEventListener('click', (e) => {
    if (!menu || !toggle) return;
    if (!root.contains(e.target)) return;
    const inside = menu.contains(e.target) || toggle.contains(e.target);
    if (!inside) close();
  });

  window.addEventListener('keydown', (e) => { if (e.key === 'Escape'){ close(); closePopover(); } });

  qsa(menu, '[data-sb-action]').forEach(btn => {
    btn.addEventListener('click', () => handleAccountAction(btn.getAttribute('data-sb-action')));
  });
}

/* ========== Ações de conta (stub) ========== */
function handleAccountAction(action){
  switch(action){
    case 'profile':   alert('Ir para Perfil'); break;
    case 'prefs':     alert('Abrir Preferências'); break;
    case 'shortcuts': alert('Atalhos do teclado'); break;
    case 'help':      window.location.href = '/docs/'; break;
    case 'signout':   alert('Você saiu.'); window.location.href = '/login.html'; break;
  }
}

/* ========== Init ==========
   Chame initSidebar(document) após montar o HTML. */
export function initSidebar(root){
  const sidebar = qs(root, '#ap-sidebar') || root;

  initThemeControl(sidebar);
  initLangDropdown(sidebar);
  initAccountMenu(sidebar);

  applyCollapsedState(sidebar, getStoredCollapsed());

  qs(sidebar, '#sb-collapse')?.addEventListener('click', () => {
    const collapsed = !(sidebar.hasAttribute('data-collapsed') || sidebar.classList.contains('collapsed')) ? true : false;
    applyCollapsedState(sidebar, collapsed);
    setStoredCollapsed(collapsed);
    closePopover();
  });

  const mq = matchMedia('(max-width: 1023px)');
  const syncMobile = () => {
    if (mq.matches){
      document.body.classList.remove('has-sidebar', 'sb-collapsed');
      closePopover();
    } else {
      document.body.classList.add('has-sidebar');
      document.body.classList.toggle('sb-collapsed', getStoredCollapsed());
    }
  };
  syncMobile();
  mq.addEventListener?.('change', syncMobile);

  window.addEventListener('resize', closePopover);
}
