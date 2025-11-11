// /src/main.js
// ═════════════════════════════════════════════════════════════════════════════
// CSS (ordem importa): Tailwind core primeiro, depois o bundle modular
import './css/core.css';
import './css/style.css';
import './css/profile/profile.css'; // ⬅ garante CSS do Perfil no bundle (mata FOUC)

// ═════════════════════════════════════════════════════════════════════════════
/* Partials HTML (via Vite ?raw) – só montam se o alvo existir na página */
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

// ── Séries (PÁGINA / PARTIAL) ────────────────────────────────────────────────
import seriesHtml       from '/src/partials/series/series.html?raw';

// ── Mapas (PÁGINA / PARTIAL) ─────────────────────────────────────────────────
import mapsHtml         from '/src/partials/maps/maps.html?raw';

// ── Comparar (PÁGINA / PARTIAL) ──────────────────────────────────────────────
import compareHtml      from '/src/partials/compare/compare.html?raw';

// ── Alertas (PÁGINA / PARTIAL) ───────────────────────────────────────────────
import alertsHtml       from '/src/partials/alerts/alerts.html?raw';

// ── Relatórios (PÁGINA / PARTIAL) ────────────────────────────────────────────
import reportsHtml      from '/src/partials/reports/reports.html?raw';

// ── Tutorial (PÁGINA / PARTIAL) ──────────────────────────────────────────────
import tutorialHtml     from '/src/partials/tutorial/tutorial.html?raw';

// ── Perfil (PÁGINA / PARTIAL) ────────────────────────────────────────────────
import profileHtml      from '/src/partials/profile/profile.html?raw';

// ═════════════════════════════════════════════════════════════════════════════
/* JS de seções/partials */
import { initHeroEffects }        from '/src/js/home/hero.effects.js';
import { initHighlightsEffects }  from '/src/js/home/highlights.effects.js';
import { initMapPreviewEffects }  from '/src/js/home/map-preview.effects.js';
import { initHowEffects }         from '/src/js/home/how.effects.js';

import { initLoginEffects }       from '/src/js/auth/login.effects.js';
import { initRegisterEffects }    from '/src/js/auth/register.effects.js';

import { initSocialFloating }     from '/src/js/globals/social-floating.js';
import { initSidebar }            from '/src/js/globals/sidebar.js';      // ⬅ sidebar (dashboard)

// Controladores das páginas pós-auth (coordenam lazy-load dos efeitos)
import { initSeriesPage }         from '/src/js/series/series.page.js';
import { initMapsPage }           from '/src/js/maps/maps.page.js';
import { initComparePage }        from '/src/js/compare/compare.page.js';
import { initAlertsPage }         from '/src/js/alerts/alerts.page.js';
import { initReportsPage }        from '/src/js/reports/reports.page.js';
import { initTutorialPage }       from '/src/js/tutorial/tutorial.page.js';
import { initProfilePage }        from '/src/js/profile/profile.page.js';

import { applyTranslations, startI18nObserver } from '/src/js/i18n/i18n.js';

// ═════════════════════════════════════════════════════════════════════════════
// Helper: monta um partial se o container existir
function mount(selector, html) {
  const el = document.querySelector(selector);
  if (!el) return null;
  el.innerHTML = html;
  return el;
}

// Flags de roteamento
const PAGE  = (document.body?.dataset?.page) || '';
const TITLE = (document.title || '').toLowerCase();

const IS_DASHBOARD = PAGE === 'dashboard';

const IS_SERIES =
  PAGE === 'series' ||
  document.body?.classList?.contains('page-series') ||
  /s[ée]ries/.test(TITLE) ||
  !!document.querySelector('[data-page-series]');

const IS_MAPS =
  PAGE === 'maps' ||
  document.body?.classList?.contains('page-maps') ||
  /mapa|mapas/.test(TITLE) ||
  !!document.querySelector('[data-page-maps]');

const IS_COMPARE =
  PAGE === 'compare' ||
  document.body?.classList?.contains('page-compare') ||
  /comparar|comparação|compare/.test(TITLE) ||
  !!document.querySelector('[data-page-compare]');

const IS_ALERTS =
  PAGE === 'alerts' ||
  document.body?.classList?.contains('page-alerts') ||
  /alerta|alertas/.test(TITLE) ||
  !!document.querySelector('[data-page-alerts]');

const IS_REPORTS =
  PAGE === 'reports' ||
  document.body?.classList?.contains('page-reports') ||
  /relat[óo]rio|relatorios|reports/.test(TITLE) ||
  !!document.querySelector('[data-page-reports]');

const IS_TUTORIAL =
  PAGE === 'tutorial' ||
  document.body?.classList?.contains('page-tutorial') ||
  /tutorial/.test(TITLE) ||
  !!document.querySelector('[data-page-tutorial]');

const IS_PROFILE =
  PAGE === 'profile' ||
  document.body?.classList?.contains('page-profile') ||
  /perfil|profile/.test(TITLE) ||
  !!document.querySelector('[data-page-profile]');

// ═════════════════════════════════════════════════════════════════════════════
/** Montagem (landing, auth, dashboard e páginas pós-auth) */
const headerRoot       = mount('#app-header', headerHtml);
const footerRoot       = mount('#app-footer', footerHtml);
const socialFloatRoot  = mount('#app-social-floating', socialFloatHtml);

// Dashboard (sidebar só quando existir o container)
const sidebarRoot      = mount('#app-sidebar-root', sidebarHtml);

// Landing
const heroRoot         = mount('#app-hero', heroHtml);
const truststripRoot   = mount('#app-truststrip', truststripHtml);
const highlightsRoot   = mount('#app-highlights', highlightsHtml);
const mapPrevRoot      = mount('#app-map-preview', mapPreviewHtml);
const howRoot          = mount('#app-how', howHtml);

// Auth
const loginRoot        = mount('#app-auth-login', loginHtml);
const registerRoot     = mount('#app-auth-register', registerHtml);

// Pós-auth
const seriesRoot   = (!IS_DASHBOARD && IS_SERIES)   ? (mount('#ap-content', seriesHtml)   || mount('#app-page', seriesHtml))   : null;
const mapsRoot     = (!IS_DASHBOARD && IS_MAPS)     ? (mount('#ap-content', mapsHtml)     || mount('#app-page', mapsHtml))     : null;
const compareRoot  = (!IS_DASHBOARD && IS_COMPARE)  ? (mount('#ap-content', compareHtml)  || mount('#app-page', compareHtml))  : null;
const alertsRoot   = (!IS_DASHBOARD && IS_ALERTS)   ? (mount('#ap-content', alertsHtml)   || mount('#app-page', alertsHtml))   : null;
const reportsRoot  = (!IS_DASHBOARD && IS_REPORTS)  ? (mount('#ap-content', reportsHtml)  || mount('#app-page', reportsHtml))  : null;
const tutorialRoot = (!IS_DASHBOARD && IS_TUTORIAL) ? (mount('#ap-content', tutorialHtml) || mount('#app-page', tutorialHtml)) : null;
const profileRoot  = (!IS_DASHBOARD && IS_PROFILE)  ? (mount('#ap-content', profileHtml)  || mount('#app-page', profileHtml))  : null;

// ═════════════════════════════════════════════════════════════════════════════
/** Header/Footer – lazy init */
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
/** I18N global */
applyTranslations(document);
startI18nObserver();

// ═════════════════════════════════════════════════════════════════════════════
/** Efeitos por seção (duplo rAF para garantir DOM estável) */
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    if (sidebarRoot)      initSidebar(sidebarRoot);

    if (heroRoot)         initHeroEffects(heroRoot);
    if (truststripRoot)   { /* estático */ }
    if (highlightsRoot)   initHighlightsEffects(highlightsRoot);
    if (mapPrevRoot)      initMapPreviewEffects(mapPrevRoot);
    if (howRoot)          initHowEffects(howRoot);

    if (loginRoot)        initLoginEffects(loginRoot);
    if (registerRoot)     initRegisterEffects(registerRoot);

    if (seriesRoot)       initSeriesPage(seriesRoot);
    if (mapsRoot)         initMapsPage(mapsRoot);
    if (compareRoot)      initComparePage(compareRoot);
    if (alertsRoot)       initAlertsPage(alertsRoot);
    if (reportsRoot)      initReportsPage(reportsRoot);
    if (tutorialRoot)     initTutorialPage(tutorialRoot);
    if (profileRoot)      initProfilePage(profileRoot);

    if (socialFloatRoot)  initSocialFloating(document);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
window.addEventListener('hashchange', () => applyTranslations(document));
