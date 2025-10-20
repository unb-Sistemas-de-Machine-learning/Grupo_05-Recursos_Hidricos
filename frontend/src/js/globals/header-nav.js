// /src/js/globals/header-nav.js

/* ============================ TEMA ============================ */
const THEME_KEY = 'aguaprev_theme';
const prefersDark = () => window.matchMedia?.('(prefers-color-scheme: dark)').matches;
const getSavedTheme = () => localStorage.getItem(THEME_KEY);
function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'dark' || (theme == null && prefersDark())) root.classList.add('dark');
  else root.classList.remove('dark');
}
function toggleTheme() {
  const saved = getSavedTheme();
  const next = saved ? (saved === 'dark' ? 'light' : 'dark') : (prefersDark() ? 'light' : 'dark');
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}

/* ============================ i18n dinâmico ============================ */
let I18N = {
  applyTranslations: () => {},
  startI18nObserver: () => {},
  getLanguage: () => 'pt-BR',
  setLanguage: () => {},
};

/* ============================ HELPERS ============================ */
function lockScroll(lock){ document.body.style.overflow = lock ? 'hidden' : ''; }
function onOutsideClick(triggerEl, panelEl, cb){
  function handler(e){ if(!panelEl.contains(e.target) && !triggerEl.contains(e.target)){ cb(); document.removeEventListener('mousedown', handler);} }
  document.addEventListener('mousedown', handler);
}

/* ============================ SPACER & DECOR ============================ */
function updateHeaderSpacer(){
  const header = document.getElementById('site-header');
  const shell  = document.querySelector('[data-header-shell]');
  const spacer = document.getElementById('header-spacer');
  if(!header || !shell || !spacer) return;

  const rect = shell.getBoundingClientRect();
  const offsetTop = parseFloat(getComputedStyle(header).top || '0') || 0;
  const total = Math.ceil(rect.height + offsetTop + 8); // + respiro
  document.documentElement.style.setProperty('--header-spacer', total + 'px');
}
function enhanceHeaderShadowOnScroll(){
  const shell = document.querySelector('[data-header-shell]');
  if(!shell) return;
  const y = window.scrollY || document.documentElement.scrollTop || 0;
  shell.style.boxShadow = y > 4 ? '0 10px 24px rgba(0,0,0,0.12)' : '';
}

/* ============================ OVERLAY (hambúrguer) ============================ */
function initOverlay(){
  const btnOpen  = document.getElementById('menu-toggle');
  const overlay  = document.getElementById('menu-overlay');
  const btnClose = document.getElementById('menu-close');
  if(!btnOpen || !overlay || !btnClose) return;

  const panel = overlay.querySelector('[data-overlay-panel]');

  function open(){
    overlay.classList.remove('hidden');
    btnOpen.setAttribute('aria-expanded','true');
    lockScroll(true);
    overlay.style.opacity = '0';
    requestAnimationFrame(() => {
      overlay.style.transition = 'opacity 220ms ease';
      overlay.style.opacity = '1';
      panel?.setAttribute('tabindex','-1'); panel?.focus();
    });
    function onEsc(e){ if(e.key==='Escape'){ close(); document.removeEventListener('keydown', onEsc);} }
    document.addEventListener('keydown', onEsc);
  }
  function close(){
    overlay.style.opacity = '1';
    overlay.style.transition = 'opacity 180ms ease';
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.classList.add('hidden');
      btnOpen.setAttribute('aria-expanded','false');
      lockScroll(false);
    }, 180);
    btnOpen.focus();
  }

  btnOpen.addEventListener('click', open);
  btnClose.addEventListener('click', close);
  overlay.addEventListener('click', (e)=>{ if(e.target===overlay) close(); });
  overlay.querySelectorAll('a[href]').forEach(a => a.addEventListener('click', close));

  // Tema também no overlay
  document.getElementById('theme-toggle-overlay')?.addEventListener('click', toggleTheme);
}

/* ============================ IDIOMA (compacto + overlay) ============================ */
function initLanguageUI(root=document){
  // Compacto (topo)
  const cBtn = root.querySelector('#lang-compact');
  const cMenu= root.querySelector('#lang-compact-menu');
  const cLbl = cBtn?.querySelector('[data-i18n="Header.cta_lang"]');
  if(cBtn && cMenu){
    const sync=()=>{ if(cLbl){ const g=I18N.getLanguage(); cLbl.textContent = g==='en'?'EN':g==='es'?'ES':'PT-BR'; } };
    const open =()=>{ cMenu.classList.remove('hidden'); onOutsideClick(cBtn,cMenu,close); cBtn.setAttribute('aria-expanded','true'); };
    const close=()=>{ cMenu.classList.add('hidden'); cBtn.setAttribute('aria-expanded','false'); };
    sync();
    cBtn.addEventListener('click', ()=> cMenu.classList.contains('hidden') ? open() : close());
    cMenu.querySelectorAll('[data-lang]').forEach(item => item.addEventListener('click', ()=>{
      I18N.setLanguage(item.getAttribute('data-lang'));
      I18N.applyTranslations(document);
      sync(); close();
    }));
  }

  // Overlay (dropdown amplo)
  const ddBtn  = root.querySelector('#lang-dropdown');
  const ddMenu = root.querySelector('#menu-overlay #lang-menu');
  const ddCurr = root.querySelector('#lang-current');
  if(ddBtn && ddMenu && ddCurr){
    const labels = { 'pt-BR':'Português (BR)', en:'English', es:'Español' };
    const sync=()=>{ ddCurr.textContent = labels[I18N.getLanguage()] || 'Português (BR)'; };
    const open =()=>{ ddMenu.classList.remove('hidden'); onOutsideClick(ddBtn,ddMenu,close); ddBtn.setAttribute('aria-expanded','true'); };
    const close=()=>{ ddMenu.classList.add('hidden'); ddBtn.setAttribute('aria-expanded','false'); };
    sync();
    ddBtn.addEventListener('click', ()=> ddMenu.classList.contains('hidden') ? open() : close());
    ddMenu.querySelectorAll('[data-lang]').forEach(item => item.addEventListener('click', ()=>{
      I18N.setLanguage(item.getAttribute('data-lang'));
      I18N.applyTranslations(document);
      sync(); close();
    }));
  }
}

/* ============================ INIT ============================ */
export async function initHeaderNav(){
  // tema
  applyTheme(getSavedTheme());

  // i18n (dinâmico)
  try{
    const mod = await import('../i18n/i18n.js');
    I18N = {
      applyTranslations: mod.applyTranslations ?? I18N.applyTranslations,
      startI18nObserver: mod.startI18nObserver ?? I18N.startI18nObserver,
      getLanguage:       mod.getLanguage ?? I18N.getLanguage,
      setLanguage:       mod.setLanguage ?? I18N.setLanguage,
    };
    I18N.applyTranslations(document);
    I18N.startI18nObserver();
  }catch(_){}

  // Spacer + decor
  updateHeaderSpacer();
  enhanceHeaderShadowOnScroll();
  window.addEventListener('resize', updateHeaderSpacer, { passive:true });
  window.addEventListener('scroll', enhanceHeaderShadowOnScroll, { passive:true });

  // Idioma + overlay + tema
  initLanguageUI(document);
  initOverlay();
  document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
}
