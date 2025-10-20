// /src/main.js
// ═════════════════════════════════════════════════════════════════════════════
// CSS (ordem importa): Tailwind core primeiro, depois o bundle modular
import './css/core.css';
import './css/style.css';

// ═════════════════════════════════════════════════════════════════════════════
// Partials HTML (via Vite ?raw) – só montam se o alvo existir na página
import headerHtml       from '/src/partials/globals/header.html?raw';
import footerHtml       from '/src/partials/globals/footer.html?raw';
import socialFloatHtml  from '/src/partials/globals/social-floating.html?raw';
import sidebarHtml      from '/src/partials/globals/sidebar.html?raw'; // ⬅ sidebar (dashboard)

import heroHtml         from '/src/partials/home/hero.html?raw';
import truststripHtml   from '/src/partials/home/trust-strip.html?raw';
import highlightsHtml   from '/src/partials/home/highlights-pills.html?raw';
import mapPreviewHtml   from '/src/partials/home/section-map-preview.html?raw';
import howHtml          from '/src/partials/home/section-how-it-works.html?raw';

import loginHtml        from '/src/partials/auth/login.html?raw';
import registerHtml     from '/src/partials/auth/register.html?raw';

// ═════════════════════════════════════════════════════════════════════════════
// JS de seções/partials
import { initHeroEffects }        from '/src/js/home/hero.effects.js';
import { initHighlightsEffects }  from '/src/js/home/highlights.effects.js';
import { initMapPreviewEffects }  from '/src/js/home/map-preview.effects.js';
import { initHowEffects }         from '/src/js/home/how.effects.js';

import { initLoginEffects }       from '/src/js/auth/login.effects.js';
import { initRegisterEffects }    from '/src/js/auth/register.effects.js';

import { initSocialFloating }     from '/src/js/globals/social-floating.js';
import { initSidebar }            from '/src/js/globals/sidebar.js';      // ⬅ sidebar (dashboard)

import { applyTranslations, startI18nObserver } from '/src/js/i18n/i18n.js';

// ═════════════════════════════════════════════════════════════════════════════
// Helper: monta um partial se o container existir
function mount(selector, html) {
  const el = document.querySelector(selector);
  if (!el) return null;
  el.innerHTML = html;
  return el;
}

// ═════════════════════════════════════════════════════════════════════════════
/** Montagem (funciona na landing, login, signup e dashboard) */
const headerRoot       = mount('#app-header', headerHtml);
const footerRoot       = mount('#app-footer', footerHtml);
const socialFloatRoot  = mount('#app-social-floating', socialFloatHtml);

// Dashboard
const sidebarRoot      = mount('#app-sidebar-root', sidebarHtml); // ⬅ sidebar (se existir)

// Landing
const heroRoot         = mount('#app-hero', heroHtml);
const truststripRoot   = mount('#app-truststrip', truststripHtml);
const highlightsRoot   = mount('#app-highlights', highlightsHtml);
const mapPrevRoot      = mount('#app-map-preview', mapPreviewHtml);
const howRoot          = mount('#app-how', howHtml);

// Auth
const loginRoot        = mount('#app-auth-login', loginHtml);
const registerRoot     = mount('#app-auth-register', registerHtml);

// ═════════════════════════════════════════════════════════════════════════════
// Header/Footer – lazy init (evita carregar JS quando a seção não existe)
(async () => {
  if (headerRoot) {
    const { initHeaderNav } = await import('/src/js/globals/header-nav.js');
    initHeaderNav();
  }
  if (footerRoot) {
    const { initFooter } = await import('/src/js/globals/footer.js');
    initFooter(footerRoot);
  }
})();

// ═════════════════════════════════════════════════════════════════════════════
// I18N global
applyTranslations(document);
startI18nObserver();

// ═════════════════════════════════════════════════════════════════════════════
/** Efeitos por seção (duplo rAF para garantir DOM estável) */
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    // Dashboard
    if (sidebarRoot)      initSidebar(sidebarRoot);

    // Landing
    if (heroRoot)         initHeroEffects(heroRoot);
    if (truststripRoot)   { /* (estático por enquanto) */ }
    if (highlightsRoot)   initHighlightsEffects(highlightsRoot);
    if (mapPrevRoot)      initMapPreviewEffects(mapPrevRoot);
    if (howRoot)          initHowEffects(howRoot);

    // Auth
    if (loginRoot)        initLoginEffects(loginRoot);
    if (registerRoot)     initRegisterEffects(registerRoot);

    // Widget social (fixo, sem auto-hide e abre no desktop)
    if (socialFloatRoot)  initSocialFloating(document);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// Re-aplica i18n quando navegar via hash (opcional)
window.addEventListener('hashchange', () => applyTranslations(document));
