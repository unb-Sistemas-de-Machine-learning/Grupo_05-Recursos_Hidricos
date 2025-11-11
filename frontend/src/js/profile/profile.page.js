// /src/js/profile/profile.page.js
// Controlador da página de Perfil: carregar, validar, salvar
// Persistência em localStorage + integração com API (com fallback local)
// - Pré-preenche com auth_user
// - Avatar (seleção de tom via API; upload local com pré-visualização + AUTOSAVE local)
// - Troca de senha com verificação local (hash) + gancho para backend
// - Activity log real (login / updates) persistido
// - "Função" como dropdown com opção "Outro"

const LS_KEY          = 'aguaprev.profile';
const PWD_HASH_KEY    = 'aguaprev.pwd_hash';
const ACTIVITY_KEY    = 'aguaprev.activity';
const DEFAULT_AVATAR  = '/src/assets/img/avatar-default.png';
const DEFAULT_PWD     = 'changeme';

const API =
  (window.API_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL)) ||
  (window.NEXT_PUBLIC_API_URL) ||
  'http://127.0.0.1:3001';

const TOKENS_KEY = 'auth_tokens';

// =============== Helpers DOM & feedback ===============
function getEl(root, sel) { return root.querySelector(sel); }
function say(msg) {
  const live = document.getElementById('pf-status');
  if (live) live.textContent = msg;
}
function toast(msg) {
  say(msg);
  const t = document.createElement('div');
  t.textContent = msg;
  t.className = 'fixed bottom-4 right-4 z-[60] px-3 py-2 rounded-xl text-sm bg-black/80 text-white shadow-lg';
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2000);
}

// =============== LocalStorage ===============
function loadFromLS() { try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; } }
function saveToLS(data) { localStorage.setItem(LS_KEY, JSON.stringify(data)); }

// Lê de LS OU SS (dá prioridade ao LS)
function getAuthUser() {
  try {
    const ls = localStorage.getItem('auth_user');
    if (ls) return JSON.parse(ls);
    const ss = sessionStorage.getItem('auth_user');
    return JSON.parse(ss || 'null');
  } catch { return null; }
}
// Espelha em LS + SS para manter a UI consistente mesmo sem “lembrar-me”
function setAuthUser(u) {
  try {
    const v = JSON.stringify(u || {});
    localStorage.setItem('auth_user', v);
    sessionStorage.setItem('auth_user', v);
  } catch {}
}

function getTokens() {
  try {
    const ls = localStorage.getItem(TOKENS_KEY);
    if (ls) return JSON.parse(ls);
    const ss = sessionStorage.getItem(TOKENS_KEY);
    return JSON.parse(ss || 'null');
  } catch { return null; }
}

// =============== Activity log ===============
function loadActivity() { try { return JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]'); } catch { return []; } }
function saveActivity(list) { localStorage.setItem(ACTIVITY_KEY, JSON.stringify(list || [])); }
function addActivity(type, meta) {
  const list = loadActivity();
  list.unshift({ type, ts: Date.now(), meta: meta || null });
  saveActivity(list.slice(0, 50));
}
function formatTS(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' });
}
function renderActivity(ul) {
  if (!ul) return;
  const list = loadActivity();
  if (!list.length) {
    ul.innerHTML = `<li>• Sem atividades registradas ainda.</li>`;
    return;
  }
  const label = (t) => ({ login:'Login bem-sucedido', profile_update:'Perfil atualizado', password_change:'Senha alterada' }[t] || t);
  ul.innerHTML = list.slice(0, 6).map(a => `• ${label(a.type)} — ${formatTS(a.ts)}`).map(s => `<li>${s}</li>`).join('');
}

// =============== Hash de senha (fallback local) ===============
async function sha256Hex(text) {
  const enc = new TextEncoder().encode(text || '');
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}
async function getPwdHash() { return localStorage.getItem(PWD_HASH_KEY) || ''; }
async function setPwdHash(hex) { if (hex) localStorage.setItem(PWD_HASH_KEY, hex); }
async function ensurePwdHash() {
  const cur = await getPwdHash();
  if (!cur) await setPwdHash(await sha256Hex(DEFAULT_PWD));
}
const PWD_READY = ensurePwdHash();

// =============== API helpers (simples) ===============
async function apiFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API}${path.startsWith('/') ? '' : '/'}${path}`;
  const headers = new Headers(options.headers || {});
  const tokens = getTokens();
  const access = tokens?.access;
  if (access) headers.set('Authorization', `Bearer ${access}`);
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) headers.set('Content-Type','application/json');

  const res = await fetch(url, { ...options, headers });
  const type = res.headers.get('content-type') || '';
  const data = type.includes('application/json') ? await res.json().catch(()=>null) : null;

  if (!res.ok) {
    const msg = data?.message || data?.error || `Erro ${res.status}`;
    const err = new Error(msg);
    err.status = res.status; err.data = data;
    throw err;
  }
  return data;
}

// =============== Verificação / troca de senha ===============
async function verifyCurrentPasswordLocal(current) {
  await PWD_READY;
  const stored = await getPwdHash();
  if (!stored) return true;

  const cur = (current ?? '').toString();
  const curHex      = await sha256Hex(cur);
  const curTrimHex  = await sha256Hex(cur.trim());
  const defaultHex  = await sha256Hex(DEFAULT_PWD);

  if (stored === curHex || stored === curTrimHex) return true;

  if (stored === defaultHex) { // primeira vez
    if (!cur || curHex === defaultHex || curTrimHex === defaultHex) return true;
  }
  return false;
}

async function changePassword(current, next) {
  // Gancho para backend futuro (desabilitado por padrão)
  // try {
  //   await apiFetch('/users/me/password-change', {
  //     method: 'POST',
  //     body: JSON.stringify({ current_password: current, new_password: next })
  //   });
  //   return;
  // } catch { /* fallback local */ }

  const ok = await verifyCurrentPasswordLocal(current);
  if (!ok) throw new Error('Senha atual incorreta.');
  await setPwdHash(await sha256Hex(next));
}

// =============== Roles (dropdown com "Outro") ===============
async function loadRoles(roleSel, roleOtherEl, currentRole) {
  try {
    const res = await apiFetch('/meta/funcoes');
    const items = res.items || [];
    roleSel.innerHTML = items.map(i => `<option value="${i.id}">${i.label}</option>`).join('');
    if (!items.find(i => i.id === 'outro')) roleSel.insertAdjacentHTML('beforeend', `<option value="outro">Outro</option>`);
    const isOther = currentRole && !items.some(i => i.id === currentRole);
    roleSel.value = isOther ? 'outro' : (currentRole || 'pesquisador');
    roleOtherEl.classList.toggle('hidden', !isOther);
    if (isOther) roleOtherEl.value = currentRole || '';
  } catch {
    // Fallback estático
    roleSel.innerHTML = `
      <option value="pesquisador">Pesquisador(a)</option>
      <option value="engenheiro">Engenheiro(a)</option>
      <option value="tecnico">Técnico(a)</option>
      <option value="gestor">Gestor(a)</option>
      <option value="estudante">Estudante</option>
      <option value="outro">Outro</option>`;
    roleSel.value = currentRole || 'pesquisador';
    roleOtherEl.classList.toggle('hidden', roleSel.value !== 'outro');
  }

  roleSel.addEventListener('change', () => {
    const show = roleSel.value === 'outro';
    roleOtherEl.classList.toggle('hidden', !show);
    if (!show) roleOtherEl.value = '';
  });
}

// =============== Form helpers ===============
function readForm(root) {
  const roleSel     = getEl(root,'#pf-role');
  const roleOtherEl = getEl(root,'#pf-role-other');
  const roleVal = roleSel?.value === 'outro'
    ? (roleOtherEl?.value?.trim() || 'outro')
    : (roleSel?.value || '');

  return {
    name:  getEl(root,'#pf-name')?.value?.trim() || '',
    email: getEl(root,'#pf-email')?.value?.trim() || '',
    org:   getEl(root,'#pf-org')?.value?.trim() || '',
    role:  roleVal,
    phone: getEl(root,'#pf-phone')?.value?.trim() || '',
    lang:  getEl(root,'#pf-lang')?.value || 'pt-BR',
    dark:  !!getEl(root,'#pf-dark')?.checked,
    alerts:!!getEl(root,'#pf-alerts')?.checked,
    avatarDataUrl: getEl(root,'#pf-avatar-preview')?.src || DEFAULT_AVATAR,
  };
}
function writeForm(root, d) {
  if (!d) return;
  const set = (sel, val) => { const el = getEl(root, sel); if (!el) return; el.value = val ?? ''; };
  set('#pf-name',  d.name);
  set('#pf-email', d.email);
  set('#pf-org',   d.org);
  set('#pf-phone', d.phone);

  const lang = getEl(root,'#pf-lang');   if (lang) lang.value = d.lang || 'pt-BR';
  const dark = getEl(root,'#pf-dark');   if (dark) dark.checked = !!d.dark;
  const alrt = getEl(root,'#pf-alerts'); if (alrt) alrt.checked = !!d.alerts;

  const av = getEl(root,'#pf-avatar-preview');
  if (av) av.src = d.avatarDataUrl || DEFAULT_AVATAR;
}
function validPassword(newP, confP) {
  const n = (newP || '');
  if (!n && !confP) return { ok:true, msg:'' };
  if (n.length < 8)   return { ok:false, msg:'Senha muito curta.' };
  if (n !== confP)    return { ok:false, msg:'Confirmação não confere.' };
  return { ok:true, msg:'' };
}
function onAvatarPreview(file, previewEl, onReady) {
  if (!file || !previewEl) return;
  if (file.size > 5 * 1024 * 1024) { toast('Imagem acima de 5MB.'); return; }
  const reader = new FileReader();
  reader.onload = () => {
    previewEl.src = reader.result;
    if (typeof onReady === 'function') onReady(reader.result);
  };
  reader.readAsDataURL(file);
}

// =============== Persistência no backend (perfil) ===============
async function saveProfileToAPI(form) {
  // Mantido como gancho futuro
  // try {
  //   const res = await apiFetch('/users/me/profile', { method:'POST', body: JSON.stringify({
  //     name: form.name, role: form.role, organization: form.org, phone: form.phone, lang: form.lang, dark_mode: !!form.dark
  //   }) });
  //   return res.user || null;
  // } catch {}
  return null;
}

// =============== Init principal ===============
export function initProfilePage(root) {
  const el = {
    save:  getEl(root,'#pf-save'),
    reset: getEl(root,'#pf-reset'),

    avatarFile:   getEl(root,'#pf-avatar'),
    avatarRemove: getEl(root,'#pf-avatar-remove'),
    avatarPreview:getEl(root,'#pf-avatar-preview'),
    avatarToneBtn:getEl(root,'[data-pf-avatar-tone]'),

    passCur: getEl(root,'#pf-pass-current'),
    passNew: getEl(root,'#pf-pass-new'),
    passCnf: getEl(root,'#pf-pass-confirm'),
    activity: getEl(root,'#pf-activity'),
    name: getEl(root,'#pf-name'),

    roleSel: getEl(root,'#pf-role'),
    roleOther: getEl(root,'#pf-role-other'),
  };

  // Defaults
  const defaults = {
    name:'Usuário AguaPrev',
    email:'usuario@exemplo.com',
    org:'Universidade de Brasília',
    role:'pesquisador',
    phone:'(61) 9 9999-9999',
    lang:'pt-BR',
    dark:false,
    alerts:true,
    avatarDataUrl: DEFAULT_AVATAR
  };

  // Prefill com auth_user + LS
  const au = getAuthUser();
  const fromAuth = au ? {
    name: au.name || au.fullName || defaults.name,
    email: au.email || defaults.email,
    avatarDataUrl: au.avatar || defaults.avatarDataUrl,
    role: au.role || defaults.role
  } : {};
  const data = { ...defaults, ...fromAuth, ...loadFromLS() };
  writeForm(root, data);

  // Carrega roles (dropdown + outro)
  if (el.roleSel && el.roleOther) {
    loadRoles(el.roleSel, el.roleOther, data.role || 'pesquisador').catch(()=>{});
  }

  if (data.dark) document.documentElement.classList.add('dark');

  // ========= Avatar: AUTOSAVE local ao trocar =========
  el.avatarFile?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onAvatarPreview(file, el.avatarPreview, (dataUrl) => {
      // Persistência imediata
      const cur = loadFromLS();
      const merged = { ...cur, avatarDataUrl: dataUrl };
      saveToLS(merged);

      const auth = getAuthUser() || {};
      const updatedAuth = { ...auth, avatar: dataUrl };
      setAuthUser(updatedAuth);

      // Atualiza sidebar instantaneamente
      window.dispatchEvent(new CustomEvent('profile:avatar-updated', { detail: { avatar: dataUrl } }));
      toast('Avatar atualizado (salvo localmente).');
    });
    // limpa input para poder reenviar a mesma imagem depois
    e.target.value = '';
  });

  // Avatar (remover -> volta default local) com AUTOSAVE
  el.avatarRemove?.addEventListener('click', () => {
    el.avatarPreview.src = DEFAULT_AVATAR;

    const cur = loadFromLS();
    saveToLS({ ...cur, avatarDataUrl: DEFAULT_AVATAR });

    const auth = getAuthUser() || {};
    setAuthUser({ ...auth, avatar: DEFAULT_AVATAR });

    window.dispatchEvent(new CustomEvent('profile:avatar-updated', { detail: { avatar: DEFAULT_AVATAR } }));
    toast('Avatar removido.');
  });

  // Seleção de tom (SVG) via API estável (também persiste local e em auth_user)
  el.avatarToneBtn?.addEventListener('click', async () => {
    try {
      const list = await apiFetch('/avatars');
      const items = list.items || [];
      const id = prompt('Escolha o ID do tom de avatar:\n' + items.map(it => `- ${it.id} (${it.label})`).join('\n') + '\nEx.: tone03');
      if (!id) return;
      const res = await apiFetch('/users/me/avatar-select', { method:'POST', body: JSON.stringify({ id }) });
      const u = res.user;
      if (u?.avatar) {
        el.avatarPreview && (el.avatarPreview.src = u.avatar);

        const cur = loadFromLS();
        saveToLS({ ...cur, avatarDataUrl: u.avatar });

        const auth = getAuthUser() || {};
        setAuthUser({ ...auth, avatar: u.avatar });

        window.dispatchEvent(new CustomEvent('profile:avatar-updated', { detail: { avatar: u.avatar } }));
        toast('Avatar definido.');
      }
    } catch {
      toast('Não foi possível definir o avatar');
    }
  });

  // Salvar (restante do formulário + senha)
  el.save?.addEventListener('click', async () => {
    await PWD_READY;

    const form = readForm(root);
    const curP  = (el.passCur?.value || '').toString();
    const newP  = (el.passNew?.value || '').toString();
    const confP = (el.passCnf?.value || '').toString();

    const v = validPassword(newP, confP);
    if (!v.ok) { toast(v.msg); (el.passNew||el.passCnf)?.focus(); return; }

    // Troca de senha se fornecida
    if (newP) {
      const ok = await verifyCurrentPasswordLocal(curP); // checagem prévia local (UX)
      if (!ok) { toast('Senha atual incorreta.'); el.passCur?.focus(); return; }
      try {
        await changePassword(curP, newP);
        addActivity('password_change');
      } catch (e) {
        toast(e?.message || 'Erro ao alterar senha.');
        return;
      }
    }

    // Aplica tema na hora
    document.documentElement.classList.toggle('dark', !!form.dark);

    // Persistências locais do formulário (já temos avatar salvo no autosave)
    saveToLS({ ...loadFromLS(), ...form });

    const updatedFromAPI = await saveProfileToAPI(form);
    if (updatedFromAPI?.avatar) {
      form.avatarDataUrl = updatedFromAPI.avatar;
      el.avatarPreview && (el.avatarPreview.src = updatedFromAPI.avatar);
      window.dispatchEvent(new CustomEvent('profile:avatar-updated', { detail: { avatar: updatedFromAPI.avatar } }));
    }

    // Atualiza auth_user (para sidebar, etc.)
    const userNow = getAuthUser() || {};
    const updatedAuth = {
      ...userNow,
      name: form.name || userNow.name || userNow.fullName,
      fullName: form.name || userNow.fullName || userNow.name,
      email: form.email || userNow.email,
      role: form.role || userNow.role,
      avatar: (loadFromLS().avatarDataUrl) || form.avatarDataUrl || userNow.avatar || DEFAULT_AVATAR
    };
    setAuthUser(updatedAuth);

    // Eventos p/ outras partes do app (sidebar, etc.)
    window.dispatchEvent(new CustomEvent('auth:login', { detail:{ user: updatedAuth }}));
    window.dispatchEvent(new CustomEvent('profile:avatar-updated', { detail: { avatar: updatedAuth.avatar } }));
    window.dispatchEvent(new CustomEvent('profile:updated', { detail: { user: updatedAuth } }));
    addActivity('profile_update');

    // Limpa campos de senha
    if (el.passCur) el.passCur.value = '';
    if (el.passNew) el.passNew.value = '';
    if (el.passCnf) el.passCnf.value = '';

    toast(newP ? 'Perfil e senha atualizados.' : 'Perfil atualizado.');
    el.name?.focus();

    // Re-render da atividade
    renderActivity(el.activity);
  });

  // Descartar
  el.reset?.addEventListener('click', () => {
    writeForm(root, loadFromLS() || { ...defaults, ...fromAuth });
    toast('Alterações descartadas.');
    el.name?.focus();
  });

  // Render activity
  renderActivity(el.activity);

  // Quando o usuário loga (em qualquer lugar do app), registramos
  window.addEventListener('auth:login', (e) => {
    addActivity('login', { uid: e?.detail?.user?.id || null });
    renderActivity(el.activity);
    // repopula mínimo
    const au2 = getAuthUser();
    if (au2) writeForm(root, { ...loadFromLS(), name: au2.name || au2.fullName, email: au2.email, avatarDataUrl: au2.avatar || DEFAULT_AVATAR });
  });
}
