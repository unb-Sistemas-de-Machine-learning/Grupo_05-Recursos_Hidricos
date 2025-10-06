// Menu robusto: agora o overlay [data-menu] é movido para <body>.
// Estado controlado por classe .is-open no próprio [data-menu].
// Resultado: modal DESKTOP 100% centralizado, sem influência do header/backdrop.
(function () {
  const header = document.querySelector('[data-header-root]');
  const root   = document.documentElement;
  if (!header) return;

  /* ===== THEME ===== */
  const themeBtns = header.querySelectorAll('[data-theme-toggle]');
  const sun  = header.querySelector('[data-icon-sun]');
  const moon = header.querySelector('[data-icon-moon]');
  const prefers = window.matchMedia('(prefers-color-scheme: dark)');

  function applyTheme(mode){
    const dark = mode === 'dark';
    root.classList.toggle('dark', dark);
    sun?.classList.toggle('hidden', dark);
    moon?.classList.toggle('hidden', !dark);
  }
  applyTheme(localStorage.getItem('theme') ?? (prefers.matches ? 'dark' : 'light'));
  themeBtns.forEach(btn => btn.addEventListener('click', () => {
    const next = root.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(next); localStorage.setItem('theme', next);
  }));
  prefers.addEventListener('change', e => {
    if (!localStorage.getItem('theme')) applyTheme(e.matches ? 'dark' : 'light');
  });

  /* ===== NAV ===== */
  const toggleBtn = header.querySelector('[data-nav-toggle]');
  const closeBtns = header.querySelectorAll('[data-nav-close]');
  let   menuRoot  = header.querySelector('[data-menu]');
  const drawer    = header.querySelector('[data-menu-drawer]');
  const modal     = header.querySelector('[data-menu-modal]');
  if (!toggleBtn || !menuRoot || !drawer || !modal) return;

  // === HOIST: move o overlay para <body> para evitar conter por header/backdrop ===
  document.body.appendChild(menuRoot);

  let lastFocus = null, scrollY = 0;
  const isDesktop = () => window.matchMedia('(min-width:1024px)').matches;

  function lockScroll(){
    scrollY = window.scrollY || document.documentElement.scrollTop;
    document.body.style.top = `-${scrollY}px`;
    document.body.classList.add('overflow-hidden','fixed');
    document.body.style.width = '100%';
  }
  function unlockScroll(){
    document.body.classList.remove('overflow-hidden','fixed');
    document.body.style.top = ''; document.body.style.width = '';
    window.scrollTo(0, scrollY);
  }

  function focusables(container){
    return Array.from(container.querySelectorAll(
      'a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])'
    )).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
  }
  function activePanel(){ return isDesktop() ? modal : drawer; }

  function openMenu(){
    lastFocus = document.activeElement;
    menuRoot.classList.add('is-open');            // <- estado no overlay
    toggleBtn.setAttribute('aria-expanded','true');
    lockScroll();
    focusables(activePanel())[0]?.focus?.();
    document.addEventListener('keydown', onKeydown);
  }
  function closeMenu(){
    menuRoot.classList.remove('is-open');
    toggleBtn.setAttribute('aria-expanded','false');
    unlockScroll();
    lastFocus?.focus?.();
    document.removeEventListener('keydown', onKeydown);
  }

  function onKeydown(e){
    if (e.key === 'Escape') return closeMenu();
    if (e.key === 'Tab'){
      const els = focusables(activePanel());
      if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
  }

  toggleBtn.addEventListener('click', () => {
    const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    expanded ? closeMenu() : openMenu();
  });
  closeBtns.forEach(b => b.addEventListener('click', closeMenu));

  // clique fora do card fecha
  menuRoot.addEventListener('click', (e) => {
    if (e.target === menuRoot) closeMenu();
  });

  // links fecham
  menuRoot.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // ao redimensionar, se estiver aberto, refoca no painel ativo
  window.addEventListener('resize', () => {
    if (menuRoot.classList.contains('is-open')) {
      focusables(activePanel())[0]?.focus?.();
    }
  });
})();
