// /src/js/auth/login.effects.js
export function initLoginEffects(root){
  if(!root || root.dataset.boundLogin === '1') return;
  root.dataset.boundLogin = '1';

  const form = root.querySelector('#login-form');
  const email = root.querySelector('#login-email');
  const pass = root.querySelector('#login-password');
  const remember = root.querySelector('#login-remember');
  const feedback = root.querySelector('#login-feedback');
  const btn = root.querySelector('#login-submit');
  const spinner = root.querySelector('#login-spinner');
  const togglePass = root.querySelector('#toggle-pass');
  const eye = root.querySelector('#icon-eye');
  const eyeOff = root.querySelector('#icon-eye-off');

  // toggle password
  if(togglePass){
    togglePass.addEventListener('click', () => {
      const isText = pass.type === 'text';
      pass.type = isText ? 'password' : 'text';
      eye.classList.toggle('hidden', !isText === false);   // se virou text, esconde eye
      eyeOff.classList.toggle('hidden', !isText);          // mostra o outro
    });
  }

  function setLoading(on){
    btn.disabled = on;
    spinner.classList.toggle('hidden', !on);
  }

  function showError(inputName, msg){
    const p = root.querySelector(`[data-error="${inputName}"]`);
    if(p){
      p.textContent = msg;
      p.classList.remove('hidden');
    }
  }
  function clearErrors(){
    root.querySelectorAll('[data-error]').forEach(p => p.classList.add('hidden'));
  }
  function setFeedback(type, msg){
    if(!feedback) return;
    feedback.textContent = msg;
    feedback.classList.remove('hidden','text-red-600','text-[#0A5C67]','dark:text-[#6BAAC9]');
    if(type === 'error') feedback.classList.add('text-red-600');
    else feedback.classList.add('text-[#0A5C67]','dark:text-[#6BAAC9]');
  }

  if(form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();
      setFeedback('','');
      const vEmail = (email?.value || '').trim();
      const vPass  = (pass?.value || '').trim();

      // validação básica
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vEmail);
      if(!emailOk) showError('email', 'Informe um e-mail válido.');
      if(!vPass)   showError('password', 'Informe sua senha.');
      if(!emailOk || !vPass) return;

      // mock de autenticação
      setLoading(true);
      setTimeout(() => {
        setLoading(false);

        // regra de mock: email contém "aguaprev" loga, senão erro
        if(vEmail.toLowerCase().includes('aguaprev')){
          const token = 'mock-token-' + Math.random().toString(36).slice(2);
          const storage = remember?.checked ? localStorage : sessionStorage;
          storage.setItem('aguaprev_token', token);
          setFeedback('success', 'Login realizado! Redirecionando...');
          // redireciona para dashboard (ajuste a rota real quando existir)
          setTimeout(() => { window.location.href = '/dashboard/'; }, 700);
        } else {
          setFeedback('error', 'Credenciais inválidas.');
        }
      }, 900);
    });
  }
}
