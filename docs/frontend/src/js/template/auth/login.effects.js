// /src/js/auth/login.effects.js
import { mockApi } from '/src/js/mock/auth-mock.js'; // importa o mock

export function initLoginEffects(root = document) {
  const form = root.querySelector('#login-form');
  const msg  = root.querySelector('#login-msg');
  if (!form) return;

  // failsafe link para register
  const regLink = root.querySelector('a[href="/register.html"], a[href="register.html"]');
  regLink?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = regLink.getAttribute('href');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = '';
    const email = form.email.value.trim();
    const pass  = form.password.value;

    if (!email || !pass) {
      msg.textContent = 'Preencha e-mail e senha.';
      msg.className = 'text-xs text-center text-rose-600';
      return;
    }

    try {
      const res = await mockApi.login({ email, password: pass });
      msg.textContent = 'Login bem-sucedido — redirecionando...';
      msg.className = 'text-xs text-center text-emerald-600';
      // redireciona para dashboard
      setTimeout(() => window.location.href = '/dashboard.html', 500);
    } catch (err) {
      msg.textContent = err?.message || 'Erro no login';
      msg.className = 'text-xs text-center text-rose-600';
    }
  });
}
