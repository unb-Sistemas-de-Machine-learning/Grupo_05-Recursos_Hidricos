// /src/js/maps/maps.page.js
// Orquestra a página de Mapas. Carrega efeitos somente quando necessário.

function resolveRoot(mountedEl) {
  return mountedEl
    || document.querySelector('#ap-content')
    || document.querySelector('#app-page')
    || document;
}

export function initMapsPage(mountedEl) {
  const root = resolveRoot(mountedEl);
  if (!root || root.dataset.mapsPageReady === '1') return;
  root.dataset.mapsPageReady = '1';

  const target =
    root.querySelector('#map-container') ||
    root.querySelector('#maps-root') ||
    root;

  requestAnimationFrame(() => {
    const io = new IntersectionObserver(async (entries, obs) => {
      if (!entries[0] || !entries[0].isIntersecting) return;
      obs.disconnect();

      const mod = await import('/src/js/maps/maps.effects.js');
      if (typeof mod.initMapsEffects === 'function') mod.initMapsEffects(root);
      root.dataset.mapsEffectsLoaded = '1';
    }, { rootMargin: '120px 0px' });

    io.observe(target);

    // Fallback caso IO não dispare
    setTimeout(async () => {
      if (root.dataset.mapsEffectsLoaded === '1') return;
      const mod = await import('/src/js/maps/maps.effects.js');
      if (typeof mod.initMapsEffects === 'function') mod.initMapsEffects(root);
      root.dataset.mapsEffectsLoaded = '1';
    }, 1500);
  });
}
