// /src/js/auth/register.effects.js
import { applyTranslations } from '/src/js/i18n/i18n.js';

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
  };

  // ===== password show/hide =====
  const setToggleState = (visible) => {
    const span = el.toggle.querySelector('span');
    const svg  = el.toggle.querySelector('svg');
    span.setAttribute('data-i18n', visible ? 'Auth.toggle_hide' : 'Auth.toggle_show');
    applyTranslations(span.parentElement); // traduz só o botão
    svg.innerHTML = visible
      ? `<path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.29 20.29 0 0 1 4.23-5.52m4.43-2.49A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a20.28 20.28 0 0 1-3.12 4.02"/><line x1="1" y1="1" x2="23" y2="23"/>`
      : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z"/><circle cx="12" cy="12" r="3"/>`;
  };
  el.toggle?.addEventListener('click', () => {
    const show = el.pass.type === 'password';
    el.pass.type  = show ? 'text' : 'password';
    el.pass2.type = show ? 'text' : 'password';
    setToggleState(show);
  });
  setToggleState(false);

  // ===== strength meter =====
  const strengthInfo = (pw) => {
    if (!pw) return { pct: 0, cls: 'bg-gray-300 dark:bg-white/15', key: 'Auth.Password.strength_unknown' };

    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    // 0..5 => label/color
    if (score <= 1)  return { pct: 20, cls: 'bg-red-500',    key: 'Auth.Password.very_weak' };
    if (score === 2) return { pct: 40, cls: 'bg-orange-500', key: 'Auth.Password.weak' };
    if (score === 3) return { pct: 60, cls: 'bg-amber-500',  key: 'Auth.Password.medium' };
    if (score === 4) return { pct: 80, cls: 'bg-lime-500',   key: 'Auth.Password.strong' };
    return               { pct: 100,cls: 'bg-emerald-500', key: 'Auth.Password.very_strong' };
  };

  const updateStrength = () => {
    const s = strengthInfo(el.pass.value);
    el.bar.style.width = `${s.pct}%`;
    el.bar.className = `h-2 rounded-full transition-all duration-300 ease-out ${s.cls}`;
    el.label.setAttribute('data-i18n', s.key);
    applyTranslations(el.label.parentElement);
  };

  // ===== match feedback =====
  const updateMatch = () => {
    const a = el.pass.value;
    const b = el.pass2.value;
    el.match.classList.remove('hidden');

    if (!b) {
      el.match.classList.add('hidden');
      el.pass2.classList.remove('ring-2','ring-emerald-400','ring-red-400','border-emerald-400/70','border-red-400/70');
      return;
    }

    if (a === b) {
      el.match.setAttribute('data-i18n', 'Auth.Password.match_ok');
      el.match.className = 'mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400';
      el.pass2.classList.remove('ring-red-400','border-red-400/70');
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

  // ===== submit mock/validations =====
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (el.pass.value !== el.pass2.value) {
      alert('As senhas precisam ser iguais.');
      el.pass2.focus();
      return;
    }
    if (!el.terms.checked) {
      alert('Você precisa aceitar os termos.');
      el.terms.focus();
      return;
    }
    alert('Conta criada com sucesso! (mock)');
    window.location.href = '/login.html';
  });
}
