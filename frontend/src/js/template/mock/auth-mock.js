// /src/js/mock/auth-mock.js
// Simula uma API de autenticação no frontend usando localStorage.
// NÃO use em produção — somente para testes/dev.

const MOCK_USERS_KEY = 'mock_users_v1';
const MOCK_TOKEN_KEY = 'mock_token_v1';
const MOCK_USER_COMPAT_KEY = 'mock_auth_user';

export const mockApi = (function () {
  const toBase64 = (obj) => btoa(JSON.stringify(obj));
  const fromBase64 = (str) => { try { return JSON.parse(atob(str)); } catch { return null; } };

  function hashPlain(p) {
    let h = 0; for (let i = 0; i < p.length; i++) h = (h*31 + p.charCodeAt(i))|0;
    return `mockhash_${(h>>>0).toString(16)}`;
  }
  function cryptoRandomId() { return 'u_' + Math.random().toString(36).slice(2, 10); }
  function delay(ms=200){ return new Promise(r=>setTimeout(r,ms)); }

  function normalizeRole(role) {
    const r = (role || '').toString().trim().toLowerCase();
    return (r === 'medico' || r === 'paciente' || r === 'admin') ? r : 'paciente';
  }

  function loadUsers() {
    try { return JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]'); }
    catch { return []; }
  }
  function saveUsers(users) { localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users)); }

  function sanitize(u) {
    if (!u) return null;
    return { id: u.id, name: u.name, email: u.email, role: normalizeRole(u.role), createdAt: u.createdAt };
  }

  // Seed + MIGRAÇÃO: garante admin e papéis normalizados mesmo se já existir base antiga
  function seed() {
    let users = loadUsers();

    if (!users.length) {
      users = [
        { name: 'Admin do Sistema', role: 'admin',   email: 'admin@example.com',    passhash: hashPlain('Admin123!')   },
        { name: 'Dr. Maria Silva',  role: 'medico',  email: 'medico@example.com',   passhash: hashPlain('Medico123!')  },
        { name: 'João Paciente',    role: 'paciente',email: 'paciente@example.com', passhash: hashPlain('Paciente123!')}
      ].map(u => ({ id: cryptoRandomId(), createdAt: Date.now(), ...u }));
      saveUsers(users);
      return users;
    }

    // --- migração: normaliza role, garante admin e evita duplicar
    let changed = false;
    users = users.map(u => {
      const role = normalizeRole(u.role);
      if (u.role !== role) changed = true;
      return { ...u, role };
    });

    const hasAdmin = users.some(u => u.role === 'admin');
    const hasAdminEmail = users.some(u => u.email?.toLowerCase() === 'admin@example.com');
    if (!hasAdmin && !hasAdminEmail) {
      users.push({
        id: cryptoRandomId(),
        name: 'Admin do Sistema',
        role: 'admin',
        email: 'admin@example.com',
        passhash: hashPlain('Admin123!'),
        createdAt: Date.now()
      });
      changed = true;
    }

    if (changed) saveUsers(users);
    return users;
  }

  async function register({ name, email, password, role }) {
    await delay(250);
    const users = loadUsers();
    const lower = (email || '').toLowerCase();
    if (!lower || !password) { const err = new Error('Preencha e-mail e senha'); err.code='MISSING_FIELDS'; throw err; }
    if (users.find(u => u.email === lower)) { const err = new Error('E-mail já cadastrado'); err.code='EMAIL_TAKEN'; throw err; }
    const user = {
      id: cryptoRandomId(),
      name: (name && name.trim()) || lower.split('@')[0],
      role: normalizeRole(role || 'paciente'),
      email: lower,
      passhash: hashPlain(password),
      createdAt: Date.now()
    };
    users.push(user);
    saveUsers(users);
    return { ok: true, user: sanitize(user) };
  }

  async function login({ email, password }) {
    await delay(220);
    // garante migração/seed antes de logar
    seed();

    const users = loadUsers();
    const lower = (email || '').toLowerCase();
    const u = users.find(x => x.email === lower);
    if (!u || u.passhash !== hashPlain(password)) {
      const err = new Error('Credenciais inválidas'); err.code='BAD_CREDENTIALS'; throw err;
    }
    const payload = { id: u.id, email: u.email, name: u.name, role: normalizeRole(u.role), iat: Date.now(), exp: Date.now()+1000*60*60 };
    const token = toBase64(payload);
    localStorage.setItem(MOCK_TOKEN_KEY, token);
    // compat para telas antigas
    localStorage.setItem(MOCK_USER_COMPAT_KEY, JSON.stringify(sanitize(u)));
    return { ok: true, token, user: sanitize(u) };
  }

  function logout() {
    localStorage.removeItem(MOCK_TOKEN_KEY);
    localStorage.removeItem(MOCK_USER_COMPAT_KEY);
  }

  function currentTokenPayload() {
    const t = localStorage.getItem(MOCK_TOKEN_KEY);
    if (!t) return null;
    return fromBase64(t);
  }

  function getCurrentUser() {
    const payload = currentTokenPayload();
    if (payload) {
      const users = loadUsers();
      const u = users.find(x => x.email === payload.email);
      return u ? sanitize(u) : null;
    }
    try { return JSON.parse(localStorage.getItem(MOCK_USER_COMPAT_KEY) || 'null'); }
    catch { return null; }
  }

  function getUsersList() { return loadUsers().map(sanitize); }

  return {
    seed, register, login, logout, getCurrentUser, getUsersList,
    _resetAll: () => {
      localStorage.removeItem(MOCK_USERS_KEY);
      localStorage.removeItem(MOCK_TOKEN_KEY);
      localStorage.removeItem(MOCK_USER_COMPAT_KEY);
    }
  };
})();

// Auto-seed/migração
mockApi.seed();
window._mockApi = mockApi;
