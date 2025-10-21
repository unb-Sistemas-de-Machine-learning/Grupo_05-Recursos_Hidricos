// /src/js/compare/compare.page.js
function resolveRoot(mountedEl) {
  return mountedEl
    || document.querySelector('#ap-content')
    || document.querySelector('#app-page')
    || document;
}

export function initComparePage(mountedEl) {
  const root = resolveRoot(mountedEl);
  if (!root || root.dataset.comparePageReady === '1') return;
  root.dataset.comparePageReady = '1';

  const target =
    root.querySelector('#compare-root') ||
    root.querySelector('#cmp-chart-overlay') ||
    root;

  requestAnimationFrame(() => {
    const io = new IntersectionObserver(async (entries, obs) => {
      if (!entries[0] || !entries[0].isIntersecting) return;
      obs.disconnect();

      const mod = await import('/src/js/compare/compare.effects.js');
      if (typeof mod.initCompareEffects === 'function') mod.initCompareEffects(root);
      root.dataset.compareEffectsLoaded = '1';
    }, { rootMargin: '120px 0px' });

    io.observe(target);

    // Fallback
    setTimeout(async () => {
      if (root.dataset.compareEffectsLoaded === '1') return;
      const mod = await import('/src/js/compare/compare.effects.js');
      if (typeof mod.initCompareEffects === 'function') mod.initCompareEffects(root);
      root.dataset.compareEffectsLoaded = '1';
    }, 1500);
  });
}
