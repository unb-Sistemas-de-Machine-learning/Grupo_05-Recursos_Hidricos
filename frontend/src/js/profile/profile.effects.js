// Lógica da página de Perfil (carrega/salva localStorage + preferências de tema)
const THEME_KEY = 'ap-theme';

function getUser() {
  try { return JSON.parse(localStorage.getItem('auth_user') || 'null'); } catch { return null; }
}
function setUser(u) {
  try { localStorage.setItem('auth_user', JSON.stringify(u || {})); } catch {}
}
function applyThemePref(pref) {
  if (pref === 'light') {
    document.documentElement.classList.remove('dark');
  } else if (pref === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    // system
    const isDark = matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', isDark);
  }
  localStorage.setItem(THEME_KEY, pref);
}

export function initProfileEffects(root) {
  const $ = (s) => (root || document).querySelector(s);

  const el = {
    avatar: $('#profile-avatar'),
    upAvatar: $('#avatar-upload'),
    name: $('#name'),
    email: $('#email'),
    pass: $('#password'),
    pass2: $('#confirm-password'),
    theme: $('#theme-select'),
    nameLabel: $('#profile-name-label'),
    emailLabel: $('#profile-email-label'),
    save: $('#btn-save-profile'),
    del: $('#btn-delete-account'),
    lastLogin: $('#last-login'),
  };

  // prefill
  const u = getUser() || {};
  el.name.value = u.name || u.fullName || '';
  el.email.value = u.email || '';
  if (u.avatar) el.avatar.src = u.avatar;
  el.nameLabel.textContent = el.name.value || 'Usuário';
  el.emailLabel.textContent = el.email.value || 'email@exemplo.com';
  el.theme.value = localStorage.getItem(THEME_KEY) || 'system';

  // avatar preview (local somente)
  el.upAvatar?.addEventListener('change', () => {
    const f = el.upAvatar.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    el.avatar.src = url;
    // salva caminho “tmp” no user (mock); backend real substituirá por upload
    const user = getUser() || {};
    user.avatar = url;
    setUser(user);
    window.dispatchEvent(new CustomEvent('auth:login', { detail: { user } }));
  });

  // tema
  el.theme?.addEventListener('change', () => applyThemePref(el.theme.value));

  // salvar mock
  el.save?.addEventListener('click', (e) => {
    e.preventDefault();
    if (el.pass.value || el.pass2.value) {
      if (el.pass.value !== el.pass2.value) {
        alert('As senhas não conferem.');
        return;
      }
    }
    const user = getUser() || {};
    const updated = {
      ...user,
      name: el.name.value || user.name,
      email: el.email.value || user.email,
      // avatar já salvo no preview (mock)
    };
    setUser(updated);
    el.nameLabel.textContent = updated.name || 'Usuário';
    el.emailLabel.textContent = updated.email || 'email@exemplo.com';
    window.dispatchEvent(new CustomEvent('auth:login', { detail: { user: updated } }));
    alert('Alterações salvas com sucesso (mock).');
  });

  // excluir mock
  el.del?.addEventListener('click', () => {
    if (!confirm('Tem certeza que deseja excluir sua conta?')) return;
    localStorage.removeItem('auth_tokens');
    localStorage.removeItem('auth_user');
    alert('Conta excluída (simulação).');
    window.location.href = '/login.html';
  });

  // label “último acesso” (mock)
  try {
    const last = new Date().toLocaleString('pt-BR');
    if (el.lastLogin) el.lastLogin.textContent = last;
  } catch {}
}
