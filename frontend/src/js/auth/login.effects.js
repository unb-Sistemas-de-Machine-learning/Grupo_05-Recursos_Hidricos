// /src/js/auth/login.effects.js
import { applyTranslations } from '/src/js/i18n/i18n.js';

const API =
  (window.API_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL)) ||
  (window.NEXT_PUBLIC_API_URL) ||
  'http://127.0.0.1:3001';

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

  const togglePass = root.querySelector('#toggle-pass');
  const eye        = root.querySelector('#icon-eye');
  const eyeOff     = root.querySelector('#icon-eye-off');
  if(togglePass){
    togglePass.addEventListener('click', () => {
      const isText = passEl.type === 'text';
      passEl.type = isText ? 'password' : 'text';
      eye?.classList.toggle('hidden', !isText === false);
      eyeOff?.classList.toggle('hidden', !isText);
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
    if(type === 'error') feedback.classList.add('text-red-600');
    if(type === 'success') feedback.classList.add('text-[#0A5C67]','dark:text-[#6BAAC9]');
  }

  const saveAuth = (user, tokens, rememberFlag) => {
    try{
      localStorage.setItem('auth_user',   JSON.stringify(user || {}));
      localStorage.setItem('auth_tokens', JSON.stringify(tokens || {}));
      localStorage.setItem('auth_remember', rememberFlag ? '1' : '0');
      if(!rememberFlag){
        sessionStorage.setItem('auth_user',   JSON.stringify(user || {}));
        sessionStorage.setItem('auth_tokens', JSON.stringify(tokens || {}));
      }
    }catch{}
  };

  const extractTokens = (data) => {
    const t = data?.tokens || {};
    const access  = t.access  || data?.access  || data?.access_token  || null;
    const refresh = t.refresh || data?.refresh || data?.refresh_token || null;
    return { access, refresh };
  };

  async function doLogin(email, password){
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    let data = {};
    try{ data = await res.json(); }catch{}

    if(!res.ok){
      const msg = data?.message || data?.error || `Erro ${res.status}`;
      throw new Error(msg);
    }

    const { access, refresh } = extractTokens(data);
    const user = data.user || data.profile || null;
    if(!access) throw new Error('Resposta sem access token.');
    return { access, refresh, user };
  }

  if(form){
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFieldErrors();
      setFeedback('', '');

      const email = (emailEl?.value || '').trim();
      const pass  = (passEl?.value || '').trim();

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if(!emailOk) setFieldError('email', 'Informe um e-mail válido.');
      if(!pass)    setFieldError('password', 'Informe sua senha.');
      if(!emailOk || !pass) return;

      setLoading(true);
      try{
        const { access, refresh, user } = await doLogin(email, pass);
        saveAuth(user, { access, refresh }, !!remember?.checked);
        setFeedback('success', 'Login realizado! Redirecionando...');
        window.dispatchEvent(new CustomEvent('auth:login', { detail: { user, tokens: { access, refresh } } }));
        setTimeout(() => { window.location.href = '/dashboard.html'; }, 700);
      }catch(err){
        setFeedback('error', err.message || 'Falha no login.');
      }finally{
        setLoading(false);
      }
    });
  }

  applyTranslations(root);
}
