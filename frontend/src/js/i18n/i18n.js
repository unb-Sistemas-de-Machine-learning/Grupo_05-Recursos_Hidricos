// /src/js/i18n/i18n.js
import { TRANSLATIONS } from './translations.js';

const STORAGE_KEY  = 'aguaprev_lang';
const DEFAULT_LANG = 'pt-BR';

let currentLang = null;
let observer    = null;

// Flags para evitar loop infinito
let isTranslating = false;
let pendingApply  = false;

export function getLanguage() {
  if (currentLang) return currentLang;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return (currentLang = saved);

  const nav = navigator.language || navigator.userLanguage || DEFAULT_LANG;
  if (['pt-BR','en','es'].includes(nav)) return (currentLang = nav);
  if (nav.startsWith('pt')) return (currentLang = 'pt-BR');
  if (nav.startsWith('es')) return (currentLang = 'es');
  return (currentLang = DEFAULT_LANG);
}

export function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem(STORAGE_KEY, lang);
  applyTranslations(document);
}

export function t(key, lang = getLanguage()) {
  const entry = TRANSLATIONS[key];
  if (!entry) return key;
  return entry[lang] ?? entry[DEFAULT_LANG] ?? key;
}

export function applyTranslations(root = document) {
  // Evita reentrância: se já estamos traduzindo, agenda uma rodada futura.
  if (isTranslating) { pendingApply = true; return; }
  isTranslating = true;

  const lang = getLanguage();
  const nodes = root.querySelectorAll('[data-i18n]');
  nodes.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    // Permite HTML controlado (títulos com <br>, <strong>, etc.)
    const html = t(key, lang);
    if (el.innerHTML !== html) el.innerHTML = html;
  });

  // Libera flag no próximo frame para o observer perceber que acabou
  requestAnimationFrame(() => {
    isTranslating = false;
    if (pendingApply) {
      pendingApply = false;
      // Debounce: aplica de novo caso algo tenha sido enfileirado durante a tradução
      applyTranslations(root);
    }
  });
}

/** Observa mutações e reaplica i18n quando partials são montados/trocados,
 *  mas ignora as mudanças causadas pelo próprio applyTranslations. */
export function startI18nObserver(root = document.body) {
  if (observer) observer.disconnect();

  let rafId = null;
  const schedule = () => {
    if (isTranslating) return;           // estamos alterando o DOM: ignore
    if (rafId) return;                   // debounce por frame
    rafId = requestAnimationFrame(() => {
      rafId = null;
      applyTranslations(document);
    });
  };

  observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (isTranslating) return; // alterações vieram do i18n; ignore
      if (m.type === 'childList' && (m.addedNodes?.length || m.removedNodes?.length)) { schedule(); return; }
      if (m.type === 'attributes' && m.attributeName === 'data-i18n') { schedule(); return; }
    }
  });

  observer.observe(root, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-i18n']
  });

  // Primeira aplicação
  applyTranslations(document);
}
