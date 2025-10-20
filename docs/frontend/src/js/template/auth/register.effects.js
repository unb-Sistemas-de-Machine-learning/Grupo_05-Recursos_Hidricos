// /src/js/auth/register.effects.js
import { mockApi } from '/src/js/mock/auth-mock.js';

export function initRegisterEffects(root = document) {
  const form     = root.querySelector('#register-form');
  const pwd      = root.querySelector('#password');
  const confirm  = root.querySelector('#confirm');
  const meter    = root.querySelector('#pwd-meter');
  const hint     = root.querySelector('#pwd-hint');
  const msg      = root.querySelector('#reg-msg');
  if (!form || !pwd || !confirm || !meter) return;

  function scorePassword(s) {
    let score = 0;
    if (!s) return 0;
    const letters = {};
    for (let i=0; i<s.length; i++) letters[s[i]] = (letters[s[i]] || 0) + 1;
    score += Math.min(4, Object.keys(letters).length) * 10;
    score += Math.min(6, s.length) * 5;
    if (/[A-Z]/.test(s)) score += 10;
    if (/[0-9]/.test(s)) score += 10;
    if (/[^A-Za-z0-9]/.test(s)) score += 10;
    return Math.min(100, score);
  }

  function renderMeter(val) {
    meter.style.width = `${val}%`;
    let color = 'bg-rose-500';
    if (val >= 70) color = 'bg-emerald-500';
    else if (val >= 40) color = 'bg-amber-500';
    meter.className = `h-full ${color}`;
    hint.textContent = val >= 70 ? 'Senha forte.' : 'Use 8+ chars, maiúscula, número e símbolo.';
  }

  pwd.addEventListener('input', () => renderMeter(scorePassword(pwd.value)));
  confirm.addEventListener('input', () => {
    if (confirm.value && confirm.value !== pwd.value) confirm.setCustomValidity('As senhas não conferem.');
    else confirm.setCustomValidity('');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.terms.checked) {
      msg.textContent = 'Você precisa aceitar os termos para continuar.';
      msg.className = 'text-xs text-center text-rose-600';
      return;
    }
    if (confirm.value !== pwd.value) {
      msg.textContent = 'As senhas não conferem.';
      msg.className = 'text-xs text-center text-rose-600';
      return;
    }

    // chamar mockApi.register
    try {
      const payload = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        password: pwd.value,
        role: form.role?.value || 'Paciente'
      };
      const res = await mockApi.register(payload);
      msg.textContent = 'Conta criada! Agora faça login.';
      msg.className = 'text-xs text-center text-emerald-600';
      form.reset();
      renderMeter(0);
      // opcional: redirecionar ao login
      setTimeout(() => window.location.href = '/login.html', 900);
    } catch (err) {
      msg.textContent = err?.message || 'Erro ao criar conta';
      msg.className = 'text-xs text-center text-rose-600';
    }
  });

  renderMeter(0);
}
