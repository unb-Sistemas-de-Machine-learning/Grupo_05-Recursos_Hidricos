// /src/js/auth/login.effects.js
import { applyTranslations } from '/src/js/i18n/i18n.js';

const API =
  (window.API_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL)) ||
  (window.NEXT_PUBLIC_API_URL) ||
  'http://127.0.0.1:3001';

const PWD_HASH_KEY = 'aguaprev.pwd_hash';
const DEFAULT_PWD  = 'changeme';

/* ================= Utils ================= */
async function sha256Hex(text){
  const enc = new TextEncoder().encode(text || '');
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}
function getFromLS(k, fallback=null){ try{ return JSON.parse(localStorage.getItem(k) || 'null') ?? fallback; }catch{ return fallback; } }
function getFromSS(k, fallback=null){ try{ return JSON.parse(sessionStorage.getItem(k) || 'null') ?? fallback; }catch{ return fallback; } }
function setLS(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch{} }
function setSS(k, v){ try{ sessionStorage.setItem(k, JSON.stringify(v)); }catch{} }
function rmLS(k){ try{ localStorage.removeItem(k); }catch{} }

/** E-mail “de referência” salvo localmente */
function getRefEmail(){
  const profile = getFromLS('aguaprev.profile', {});
  const auLS = getFromLS('auth_user', null);
  const auSS = getFromSS('auth_user', null);
  return (profile.email || auLS?.email || auSS?.email || '').trim().toLowerCase();
}

/** Se senha local foi personalizada (≠ DEFAULT) e email corresponde, devemos enforçar local */
async function mustEnforceLocal(email){
  const inEmail = (email || '').trim().toLowerCase();
  const refEmail = getRefEmail();
  if (!refEmail || inEmail !== refEmail) return false; // outro usuário → não enforça
  const stored = localStorage.getItem(PWD_HASH_KEY) || '';
  if (!stored) return false;
  const defHex = await sha256Hex(DEFAULT_PWD);
  return stored !== defHex; // true se já trocou a senha local
}

/** Confere senha com hash local (considera trim) */
async function checkLocalPassword(password){
  const stored = localStorage.getItem(PWD_HASH_KEY) || '';
  if (!stored) return false;
  const hex = await sha256Hex(password || '');
  const hexT = await sha256Hex((password || '').trim());
  return stored === hex || stored === hexT;
}

/* ============== Fallback de autenticação local (DEV/offline) ============== */
async function tryLocalAuth(email, password){
  const refEmail = getRefEmail();
  const inEmail  = (email || '').trim().toLowerCase();
  if (!refEmail || !inEmail || refEmail !== inEmail) return null;

  // aceita se senha bater com o hash local, ou se ainda estiver no DEFAULT
  const stored = localStorage.getItem(PWD_HASH_KEY) || '';
  const defHex = await sha256Hex(DEFAULT_PWD);

  let ok = false;
  if (!stored){
    // sem hash salvo: aceita vazio/DEFAULT para primeiro uso
    const hex = await sha256Hex(password || '');
    const hexT= await sha256Hex((password || '').trim());
    ok = (!password || hex === defHex || hexT === defHex);
  } else {
    ok = await checkLocalPassword(password);
    if (!ok && stored === defHex){
      const hex = await sha256Hex(password || '');
      const hexT= await sha256Hex((password || '').trim());
      ok = (!password || hex === defHex || hexT === defHex);
    }
  }
  if (!ok) return null;

  const profile = getFromLS('aguaprev.profile', {});
  const au = getFromLS('auth_user', {}) || getFromSS('auth_user', {}) || {};
  const user = {
    ...au,
    name: au.name || au.fullName || 'Usuário',
    fullName: au.fullName || au.name || 'Usuário',
    email: refEmail,
    role: au.role || profile.role || 'pesquisador',
    avatar: au.avatar || profile.avatarDataUrl || '/src/assets/img/avatar-default.png'
  };
  const now = Date.now();
  return { access: `dev-access-${now}`, refresh: `dev-refresh-${now}`, user };
}

/* ==================== Login normal (API) + merge ==================== */
const extractTokens = (data) => {
  const t = data?.tokens || {};
  const access  = t.access  || data?.access  || data?.access_token  || null;
  const refresh = t.refresh || data?.refresh || data?.refresh_token || null;
  return { access, refresh };
};

async function doLogin(email, password){
  // 1) Se senha local foi personalizada para esse e-mail, enforça local ANTES de chamar a API.
  if (await mustEnforceLocal(email)){
    const ok = await checkLocalPassword(password);
    if (!ok) throw new Error('Senha incorreta.');
    // Se passou: podemos pular API e autenticar local direto (rápido)
    const local = await tryLocalAuth(email, password);
    if (local) return local;
    // fallback improvável: se falhar, joga erro
    throw new Error('Falha na autenticação local.');
  }

  // 2) Fluxo normal via API
  let data = null, res = null, networkErr = null;
  try{
    res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    try{ data = await res.json(); }catch{ data = {}; }
  }catch(err){
    networkErr = err;
  }

  if (res && res.ok){
    const { access, refresh } = extractTokens(data);
    if(!access) throw new Error('Resposta sem access token.');

    // Hidrata via /me
    let meUser = null;
    try{
      const meRes = await fetch(`${API}/me`, { headers: { Authorization: `Bearer ${access}` } });
      const meData = await meRes.json().catch(()=>({}));
      if (meRes.ok && meData?.user) meUser = meData.user;
    }catch{}

    const userFromLogin = data.user || data.profile || {};
    const mergedUser = {
      ...userFromLogin,
      ...meUser,
      name: (meUser?.name || userFromLogin?.name || userFromLogin?.fullName || 'Usuário'),
      fullName: (meUser?.fullName || userFromLogin?.fullName || userFromLogin?.name || 'Usuário'),
      email: (meUser?.email || userFromLogin?.email || email),
      avatar: (meUser?.avatar || userFromLogin?.avatar || '/src/assets/img/avatar-default.png'),
      role: (meUser?.role || userFromLogin?.role || 'pesquisador')
    };
    return { access, refresh, user: mergedUser };
  }

  // 3) Falhou API → tenta local (DEV/offline)
  const localAuth = await tryLocalAuth(email, password);
  if (localAuth) return localAuth;

  const msg = data?.message || data?.error || (networkErr ? 'Falha de rede ao acessar o servidor.' : `Erro ${res?.status || ''}`.trim());
  throw new Error(msg || 'Falha no login.');
}

/* ==================== UI ==================== */
export function initLoginEffects(root){
  if(!root || root.dataset.boundLogin === '1') return;
  root.dataset.boundLogin = '1';

  const form     = root.querySelector('#login-form');
  const emailEl  = root.querySelector('#login-email');
  const passEl   = root.querySelector('#login-password');
  const remember = root.querySelector('#login-remember');
  const feedback = root.querySelector('#login-feedback');
  const btn      = root.querySelector('#login-submit');
  const spinner  = root.querySelector('#login-spinner');

  // Mostrar/ocultar senha
  const togglePass = root.querySelector('#toggle-pass');
  const eye        = root.querySelector('#icon-eye');
  const eyeOff     = root.querySelector('#icon-eye-off');
  if (togglePass) {
    togglePass.addEventListener('click', () => {
      const isPassword = passEl.type === 'password';
      passEl.type = isPassword ? 'text' : 'password';
      if (eye)    eye.classList.toggle('hidden', isPassword);
      if (eyeOff) eyeOff.classList.toggle('hidden', !isPassword);
      passEl?.focus();
    });
  }

  function setLoading(on){
    if (!btn) return;
    btn.disabled = on;
    spinner?.classList.toggle('hidden', !on);
  }
  function setFieldError(name, msg){
    const p = root.querySelector(`[data-error="${name}"]`);
    if(p){ p.textContent = msg; p.classList.remove('hidden'); }
  }
  function clearFieldErrors(){
    root.querySelectorAll('[data-error]').forEach(p => p.classList.add('hidden'));
  }
  function setFeedback(type, msg){
    if(!feedback) return;
    feedback.textContent = msg || '';
    feedback.classList.toggle('hidden', !msg);
    feedback.classList.remove('text-red-600','text-[#0A5C67]','dark:text-[#6BAAC9]');
    if(type === 'error')   feedback.classList.add('text-red-600');
    if(type === 'success') feedback.classList.add('text-[#0A5C67]','dark:text-[#6BAAC9]');
  }

  // Persistência de sessão com "lembrar-me"
  const saveAuth = (user, tokens, rememberFlag) => {
    const safeUser = user || {};
    const safeTok  = tokens || {};

    if (rememberFlag) {
      setLS('auth_user',   safeUser);
      setLS('auth_tokens', safeTok);
      localStorage.setItem('auth_remember', '1');
    } else {
      rmLS('auth_user');
      rmLS('auth_tokens');
      localStorage.removeItem('auth_remember');
    }
    setSS('auth_user',   safeUser);
    setSS('auth_tokens', safeTok);
  };

  if(form){
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFieldErrors();
      setFeedback('', '');

      const email = (emailEl?.value || '').trim();
      const pass  = (passEl?.value || '');

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if(!emailOk) setFieldError('email', 'Informe um e-mail válido.');
      if(!pass)    setFieldError('password', 'Informe sua senha.');
      if(!emailOk || !pass) return;

      setLoading(true);
      try{
        const { access, refresh, user } = await doLogin(email, pass);
        saveAuth(user, { access, refresh }, !!remember?.checked);

        window.dispatchEvent(new CustomEvent('auth:login', { detail: { user, tokens: { access, refresh } } }));

        setFeedback('success', 'Login realizado! Redirecionando...');
        setTimeout(() => { window.location.href = '/dashboard.html'; }, 600);
      }catch(err){
        setFeedback('error', err.message || 'Falha no login.');
      }finally{
        setLoading(false);
      }
    });
  }

  applyTranslations(root);
}
