// /src/js/series/series.page.js
// Orquestra a página de Séries sem scripts no partial.
// Faz lazy-load do módulo pesado: /src/js/series/series.effects.js

function resolveRoot(mountedEl) {
  return mountedEl
    || document.querySelector('#ap-content')
    || document.querySelector('#app-page')
    || document;
}

export function initSeriesPage(mountedEl) {
  const root = resolveRoot(mountedEl);
  if (!root || root.dataset.seriesPageReady === '1') return;
  root.dataset.seriesPageReady = '1';

  // Alvos possíveis no partial (compatível com tua marcação atual)
  const target =
    root.querySelector('#series-chart') ||
    root.querySelector('#series-chart-root') ||
    root.querySelector('#series-root') ||
    root;

  // Garante que o primeiro paint ocorra antes do observer
  requestAnimationFrame(() => {
    const io = new IntersectionObserver(async (entries, obs) => {
      if (!entries[0] || !entries[0].isIntersecting) return;
      obs.disconnect();

      // Importa efeitos apenas quando necessário
      const mod = await import('/src/js/series/series.effects.js');
      if (typeof mod.initSeriesEffects === 'function') {
        mod.initSeriesEffects(root);
      } else if (typeof mod.initSeriesCharts === 'function') {
        mod.initSeriesCharts(root);
      }
      root.dataset.seriesEffectsLoaded = '1';
    }, { rootMargin: '120px 0px' });

    io.observe(target);

    // Fallback: se IntersectionObserver não disparar
    setTimeout(async () => {
      if (root.dataset.seriesEffectsLoaded === '1') return;
      const mod = await import('/src/js/series/series.effects.js');
      if (typeof mod.initSeriesEffects === 'function') {
        mod.initSeriesEffects(root);
      } else if (typeof mod.initSeriesCharts === 'function') {
        mod.initSeriesCharts(root);
      }
      root.dataset.seriesEffectsLoaded = '1';
    }, 1500);
  });
}
