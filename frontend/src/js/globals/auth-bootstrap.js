// /src/js/globals/auth-bootstrap.js
// Hidrata auth_user a partir do backend quando houver tokens válidos.
// Mantém avatar/nome persistentes entre sessões.

const TOKENS_KEY = 'auth_tokens';

const API =
  (window.API_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL)) ||
  (window.NEXT_PUBLIC_API_URL) ||
  'http://127.0.0.1:3001';

function getTokens(){ try { return JSON.parse(localStorage.getItem(TOKENS_KEY) || 'null'); } catch { return null; } }
function setTokens(t){ try { localStorage.setItem(TOKENS_KEY, JSON.stringify(t || {})); } catch {} }

function getAuthUser(){ try { return JSON.parse(localStorage.getItem('auth_user') || 'null'); } catch { return null; } }
function setAuthUser(u){ try { localStorage.setItem('auth_user', JSON.stringify(u || {})); } catch {} }

async function apiFetch(path, options = {}){
  const url = path.startsWith('http') ? path : `${API}${path.startsWith('/') ? '' : '/'}${path}`;
  const headers = new Headers(options.headers || {});
  const access = getTokens()?.access;
  if (access) headers.set('Authorization', `Bearer ${access}`);
  if (!(options.body instanceof FormData) && !headers.has('Content-Type'))
    headers.set('Content-Type','application/json');
  const res = await fetch(url, { ...options, headers });
  let data = null; try { data = await res.json(); } catch {}
  if (!res.ok) {
    const err = new Error(data?.message || data?.error || `Erro ${res.status}`);
    err.status = res.status; err.data = data; throw err;
  }
  return data;
}

async function refreshAccess(){
  const tokens = getTokens(); const refresh = tokens?.refresh;
  if (!refresh) return null;
  const res = await fetch(`${API}/auth/refresh`, {
    method:'POST',
    headers: { Authorization: `Bearer ${refresh}` }
  });
  let data = null; try { data = await res.json(); } catch {}
  if (!res.ok || !data?.access) return null;
  const next = { access: data.access, refresh };
  setTokens(next);
  return next.access;
}

export async function hydrateAuthUserFromAPI({ force=false } = {}){
  const tokens = getTokens();
  if (!tokens?.access && !tokens?.refresh) return null;

  // se já temos auth_user e não for force, mantemos
  if (!force && getAuthUser()) return getAuthUser();

  // tenta /me com access; se expirar, tenta refresh
  async function getMe(){
    try { return await apiFetch('/me'); }
    catch (e) {
      if (e.status === 401 || e.status === 422) {
        const ok = await refreshAccess();
        if (ok) return await apiFetch('/me');
      }
      throw e;
    }
  }

  try {
    const data = await getMe();
    const user = data?.user || null;
    if (user) {
      setAuthUser(user);
      window.dispatchEvent(new CustomEvent('auth:login', { detail:{ user, tokens: getTokens() }}));
      return user;
    }
  } catch {
    // tokens inválidos → limpa sessão
    localStorage.removeItem('auth_tokens');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_remember');
  }
  return null;
}

export function initAuthBootstrap(){
  // Hidrata assim que possível (pós-carregamento), sem travar a UI
  queueMicrotask(() => { hydrateAuthUserFromAPI().catch(()=>{}); });

  // Quando avatar for atualizado no perfil, regrava auth_user (já vem do evento)
  window.addEventListener('profile:avatar-updated', (e) => {
    const avatar = e?.detail?.avatar;
    if (!avatar) return;
    const u = getAuthUser() || {};
    const updated = { ...u, avatar };
    setAuthUser(updated);
    window.dispatchEvent(new CustomEvent('auth:login', { detail:{ user: updated, tokens: getTokens() }}));
  });
}
