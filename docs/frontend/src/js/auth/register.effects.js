// /src/js/auth/register.effects.js
import { applyTranslations } from '/src/js/i18n/i18n.js';

/* Descobre a URL do backend */
const API =
  (window.API_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL)) ||
  (window.NEXT_PUBLIC_API_URL) ||
  'http://127.0.0.1:3001';

function saveAuth(tokens, user) {
  try {
    localStorage.setItem('auth_tokens', JSON.stringify(tokens));
    localStorage.setItem('auth_user', JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('auth:login', { detail: { user, tokens } }));
  } catch { /* ignore */ }
}

export function initRegisterEffects(root = document) {
  const form = root.querySelector('#ap-register-form');
  if (!form) return;

  const $ = (sel) => form.querySelector(sel);

  const el = {
    name:   $('#ap-fullname'),
    email:  $('#ap-email'),
    pass:   $('#ap-pass'),
    pass2:  $('#ap-pass2'),
    terms:  $('#ap-terms'),
    toggle: $('#toggle-pass'),
    bar:    $('#ap-pass-strength-bar'),
    label:  $('#ap-pass-strength-label'),
    match:  $('#ap-pass-match'),
    submit: form.querySelector('button[type="submit"]'),
  };

  // ===== Mostrar / ocultar senha =====
  const setToggleState = (visible) => {
    const span = el.toggle?.querySelector('span');
    const svg  = el.toggle?.querySelector('svg');
    if (!span || !svg) return;
    span.setAttribute('data-i18n', visible ? 'Auth.toggle_hide' : 'Auth.toggle_show');
    applyTranslations(span.parentElement);
    svg.innerHTML = visible
      ? `<path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.29 20.29 0 0 1 4.23-5.52m4.43-2.49A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a20.28 20.28 0 0 1-3.12 4.02"></path><line x1="1" y1="1" x2="23" y2="23"></line>`
      : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z"></path><circle cx="12" cy="12" r="3"></circle>`;
  };
  el.toggle?.addEventListener('click', () => {
    const show = el.pass.type === 'password';
    el.pass.type  = show ? 'text' : 'password';
    el.pass2.type = show ? 'text' : 'password';
    setToggleState(show);
  });
  setToggleState(false);

  // ===== Força da senha =====
  const strengthInfo = (pw) => {
    if (!pw) return { pct: 0, cls: 'bg-gray-300 dark:bg-white/15', key: 'Auth.Password.strength_unknown' };

    let score = 0;
    if (pw.length >= 8)  score++;
    if (pw.length >= 12) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw))   score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    if (score <= 1)  return { pct: 20, cls: 'bg-red-500',    key: 'Auth.Password.very_weak' };
    if (score === 2) return { pct: 40, cls: 'bg-orange-500', key: 'Auth.Password.weak' };
    if (score === 3) return { pct: 60, cls: 'bg-amber-500',  key: 'Auth.Password.medium' };
    if (score === 4) return { pct: 80, cls: 'bg-lime-500',   key: 'Auth.Password.strong' };
    return               { pct: 100,cls: 'bg-emerald-500',   key: 'Auth.Password.very_strong' };
  };

  const updateStrength = () => {
    const s = strengthInfo(el.pass.value);
    if (el.bar) {
      el.bar.style.width = `${s.pct}%`;
      el.bar.className = `h-2 rounded-full transition-all duration-300 ease-out ${s.cls}`;
    }
    if (el.label) {
      el.label.setAttribute('data-i18n', s.key);
      applyTranslations(el.label.parentElement);
    }
  };

  // ===== Feedback de confirmação =====
  const updateMatch = () => {
    if (!el.match) return;
    const a = el.pass.value;
    const b = el.pass2.value;

    if (!b) {
      el.match.classList.add('hidden');
      el.pass2.classList.remove('ring-2','ring-emerald-400','ring-rose-400','border-emerald-400/70','border-red-400/70');
      return;
    }

    el.match.classList.remove('hidden');

    if (a === b) {
      el.match.setAttribute('data-i18n', 'Auth.Password.match_ok');
      el.match.className = 'mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400';
      el.pass2.classList.remove('ring-rose-400','border-red-400/70');
      el.pass2.classList.add('ring-2','ring-emerald-400','border-emerald-400/70');
    } else {
      el.match.setAttribute('data-i18n', 'Auth.Password.match_bad');
      el.match.className = 'mt-2 text-xs font-medium text-rose-600 dark:text-rose-400';
      el.pass2.classList.remove('ring-emerald-400','border-emerald-400/70');
      el.pass2.classList.add('ring-2','ring-rose-400','border-red-400/70');
    }
    applyTranslations(el.match.parentElement);
  };

  el.pass.addEventListener('input', () => { updateStrength(); updateMatch(); });
  el.pass2.addEventListener('input', updateMatch);
  updateStrength();

  // ===== Envio (API real) =====
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullname = el.name.value.trim();
    const email    = el.email.value.trim().toLowerCase();
    const password = el.pass.value;
    const password2= el.pass2.value;

    if (!fullname || !email || !password || !password2) {
      alert('Preencha todos os campos.');
      return;
    }
    if (password !== password2) {
      alert('As senhas precisam ser iguais.');
      el.pass2.focus();
      return;
    }
    if (!el.terms.checked) {
      alert('Você precisa aceitar os termos.');
      el.terms.focus();
      return;
    }

    const payload = { name: fullname, email, password };
    el.submit && (el.submit.disabled = true);

    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const err = (data && (data.error || data.message)) || `Erro ${res.status}`;
        alert(err);
        return;
      }

      // sucesso
      saveAuth(data.tokens, data.user);
      window.location.href = '/dashboard.html'; // ajuste se necessário
    } catch {
      alert('Falha ao conectar no servidor.');
    } finally {
      el.submit && (el.submit.disabled = false);
    }
  });
}

// Auto-init
if (document.readyState !== 'loading') {
  initRegisterEffects();
} else {
  document.addEventListener('DOMContentLoaded', () => initRegisterEffects());
}
