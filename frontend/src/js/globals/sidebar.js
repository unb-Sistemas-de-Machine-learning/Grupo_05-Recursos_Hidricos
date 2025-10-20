// /src/js/globals/sidebar.js
import { applyTranslations, setLanguage } from '/src/js/i18n/i18n.js';

const THEME_KEY = 'ap-theme';
const SB_COLLAPSE_KEY = 'ap-sb-collapsed';

const API =
  (window.API_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL)) ||
  (window.NEXT_PUBLIC_API_URL) ||
  'http://127.0.0.1:3001';

/* ===== Utils ===== */
const qs  = (r, s) => r.querySelector(s);
const qsa = (r, s) => Array.from(r.querySelectorAll(s));

const getAuthUser = () => { try { return JSON.parse(localStorage.getItem('auth_user') || 'null'); } catch { return null; } };
const setAuthUser = (u)  => { try { localStorage.setItem('auth_user', JSON.stringify(u || {})); } catch {} };

const getTokens = () => { try { return JSON.parse(localStorage.getItem('auth_tokens') || 'null'); } catch { return null; } };
const setTokens = (t)  => { try { localStorage.setItem('auth_tokens', JSON.stringify(t || {})); } catch {} };

const abs = (url) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `${API}${url.startsWith('/') ? '' : '/'}${url}`;
};

/* ===== API helper com auto-refresh ===== */
async function refreshAccess() {
  const tokens = getTokens();
  const refresh = tokens?.refresh;
  if (!refresh) return null;

  // Refresh usa Authorization: Bearer <refresh> ou body? Nosso backend espera JWT de refresh no header.
  const res = await fetch(`${API}/auth/refresh`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${refresh}` }
  });
  let data = {};
  try { data = await res.json(); } catch {}
  if (!res.ok || !data?.access) return null;

  const newTokens = { access: data.access, refresh };
  setTokens(newTokens);
  return newTokens.access;
}

async function apiFetch(path, options = {}, retry = true) {
  const url = path.startsWith('http') ? path : `${API}${path.startsWith('/') ? '' : '/'}${path}`;

  const tokens = getTokens();
  const access = tokens?.access;

  const headers = new Headers(options.headers || {});
  if (access) headers.set('Authorization', `Bearer ${access}`);
  if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(url, { ...options, headers });

  if ((res.status === 401 || res.status === 422) && retry) {
    const newAccess = await refreshAccess();
    if (newAccess) {
      const retryHeaders = new Headers(options.headers || {});
      retryHeaders.set('Authorization', `Bearer ${newAccess}`);
      if (!retryHeaders.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
        retryHeaders.set('Content-Type', 'application/json');
      }
      return fetch(url, { ...options, headers: retryHeaders });
    } else {
      // sessão acabou de vez
      localStorage.removeItem('auth_tokens');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_remember');
    }
  }

  return res;
}

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

/* ========== Perfil (render) ========== */
function renderProfile(sidebar) {
  const user = getAuthUser();
  const name  = user?.name  || user?.fullName || 'Usuário';
  const email = user?.email || 'email@exemplo.com';
  const fallback = `${API}/avatars/svg/tone06.svg`;
  const avatarUrl = abs(user?.avatar) || fallback;

  const elName  = qs(sidebar, '#sb-name');
  const elEmail = qs(sidebar, '#sb-email');
  const avatar  = qs(sidebar, '#sb-avatar');
  const mini    = qs(sidebar, '#sb-mini-avatar');
  const miniName= qs(sidebar, '#sb-mini-name');

  if (elName)  elName.textContent = name;
  if (elEmail) elEmail.textContent = email;

  const setImg = (imgEl, src) => { if (imgEl) imgEl.src = abs(src); };
  setImg(avatar, avatarUrl);
  setImg(mini,   avatarUrl);

  if (miniName) miniName.textContent = name;
}

/* ========== Seletor de avatar ========== */
let AVATAR_CACHE = null;
async function fetchAvatars(){
  if (AVATAR_CACHE) return AVATAR_CACHE;
  const res = await fetch(`${API}/avatars`);
  const data = await res.json().catch(()=>({items:[]}));
  AVATAR_CACHE = data.items || [];
  return AVATAR_CACHE;
}

function openAvatarPicker(sidebar){
  const scrimId = 'ap-avatar-scrim';
  const modalId = 'ap-avatar-modal';

  let scrim = document.getElementById(scrimId);
  let modal = document.getElementById(modalId);
  if (!scrim){
    scrim = document.createElement('div');
    scrim.id = scrimId;
    scrim.className = 'fixed inset-0 bg-black/40 z-[200]';
    document.body.appendChild(scrim);
  }
  if (!modal){
    modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'fixed z-[201] inset-0 grid place-items-center p-4';
    document.body.appendChild(modal);
  }

  const close = () => { scrim.remove(); modal.remove(); };

  scrim.onclick = close;
  window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') close(); }, { once:true });

  modal.innerHTML = `
    <div class="w-full max-w-xl rounded-2xl bg-white dark:bg-[#0C1A2A] border border-black/10 dark:border-white/10 p-4 shadow-2xl">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold text-[#031E21] dark:text-white">Escolher avatar</h2>
        <button class="rounded-lg px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10" id="ap-avatar-close">Fechar</button>
      </div>
      <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">Selecione um tom que te represente. Você pode mudar a qualquer momento.</p>
      <div id="ap-avatar-grid" class="grid grid-cols-3 sm:grid-cols-4 gap-3"></div>
    </div>
  `;
  qs(modal, '#ap-avatar-close')?.addEventListener('click', close);

  fetchAvatars().then(items => {
    const grid = qs(modal, '#ap-avatar-grid');
    items.forEach(({id, label, url}) => {
      const card = document.createElement('button');
      card.className = 'group rounded-xl border border-black/10 dark:border-white/10 overflow-hidden hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#0A5C67]';
      card.innerHTML = `
        <img src="${abs(url)}" alt="${label}" class="w-full h-28 object-cover">
        <div class="px-2 py-1 text-xs text-gray-700 dark:text-gray-200">${label}</div>
      `;
      card.onclick = async () => {
        try {
          const res = await apiFetch('/users/me/avatar-select', {
            method: 'POST',
            body: JSON.stringify({ id })
          });
          let data = {};
          try { data = await res.json(); } catch {}

          if (!res.ok) {
            const msg = data?.message || data?.error || `Erro ${res.status}`;
            alert(msg);
            if (res.status === 401 || res.status === 422) {
              // manda pro login
              window.location.href = '/login.html';
            }
            return;
          }

          // sucesso
          const user = getAuthUser() || {};
          const updated = { ...user, ...(data.user || {}) };
          setAuthUser(updated);
          setTokens(getTokens()); // garante persistência
          window.dispatchEvent(new CustomEvent('auth:login', { detail: { user: updated, tokens: getTokens() } }));
          close();
        } catch (e) {
          alert('Não foi possível salvar o avatar.');
        }
      };
      grid.appendChild(card);
    });
  });
}

/* ========== Ações de conta ========== */
function handleAccountAction(action){
  switch(action){
    case 'profile':
      window.location.href = '/profile.html';
      break;
    case 'prefs':
      alert('Abrir Preferências');
      break;
    case 'shortcuts':
      alert('Atalhos do teclado');
      break;
    case 'help':
      window.location.href = '/docs/';
      break;
    case 'signout':
      localStorage.removeItem('auth_tokens');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_remember');
      window.location.href = '/login.html';
      break;
  }
}

/* ========== Init ========== */
export function initSidebar(root){
  const sidebar = qs(root, '#ap-sidebar') || root;

  initThemeControl(sidebar);
  initLangDropdown(sidebar);
  initAccountMenu(sidebar);
  renderProfile(sidebar);

  applyCollapsedState(sidebar, getStoredCollapsed());

  qs(sidebar, '#sb-collapse')?.addEventListener('click', () => {
    const collapsed = !(sidebar.hasAttribute('data-collapsed') || sidebar.classList.contains('collapsed')) ? true : false;
    applyCollapsedState(sidebar, collapsed);
    setStoredCollapsed(collapsed);
    closePopover();
  });

  qs(sidebar, '#sb-avatar')?.addEventListener('click', () => openAvatarPicker(sidebar));
  qs(sidebar, '#sb-mini-avatar')?.addEventListener('click', () => openAvatarPicker(sidebar));
  qs(sidebar, '#sb-profile-btn')?.addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    openAvatarPicker(sidebar);
  });

  window.addEventListener('auth:login', () => renderProfile(sidebar));

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
