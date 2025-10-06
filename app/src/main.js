// CSS global (Tailwind)
import './css/style.css';

// >>> Mocks (autenticação + relatórios) <<<
import '/src/js/mock/auth-mock.js';
import '/src/js/mock/reports-mock.js'; // ← novo

// Partials
import headerHtml    from '/src/partials/globals/header.html?raw';
import heroHtml      from '/src/partials/home/hero.html?raw';
import teamHtml      from '/src/partials/home/team.html?raw';
import loginHtml     from '/src/partials/auth/login.html?raw';
import registerHtml  from '/src/partials/auth/register.html?raw';
import dashboardHtml from '/src/partials/dashboard/dashboard.html?raw';
import historyHtml   from '/src/partials/reports/history.html?raw'; // ← novo

// Effects
import { initHeroEffects }       from '/src/js/home/hero.effects.js';
import { initLoginEffects }      from '/src/js/auth/login.effects.js';
import { initRegisterEffects }   from '/src/js/auth/register.effects.js';
import { initDashboard }         from '/src/js/dashboard/dashboard.effects.js';
import { initReportsEffects }    from '/src/js/reports/history.effects.js'; // ← novo

// Helper para montar um partial
function mount(sel, html){
  const el = document.querySelector(sel);
  if (!el) return null;
  el.innerHTML = html;
  return el;
}

// Montagem
const headerRoot = mount('#app-header', headerHtml);
const heroRoot   = mount('#app-hero', heroHtml);
const teamRoot   = mount('#app-team', teamHtml);
const loginRoot  = mount('#app-auth-login', loginHtml);
const regRoot    = mount('#app-auth-register', registerHtml);
const dashRoot   = mount('#app-dashboard', dashboardHtml);
const repRoot    = mount('#app-reports', historyHtml); // ← novo

// Scripts específicos do header (hambúrguer + tema)
(async () => {
  if (headerRoot) await import('/src/js/globals/header-nav.js');
})();

// Inicialização dos efeitos após pintura
// Usa rAF duplo para garantir que o DOM foi pintado antes das animações.
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    if (heroRoot)  initHeroEffects(heroRoot);
    if (loginRoot) initLoginEffects(loginRoot);
    if (regRoot)   initRegisterEffects(regRoot);
    if (dashRoot)  initDashboard(dashRoot);
    if (repRoot)   initReportsEffects(repRoot); // ← novo
    // (team não precisa de JS por enquanto)
  });
});
