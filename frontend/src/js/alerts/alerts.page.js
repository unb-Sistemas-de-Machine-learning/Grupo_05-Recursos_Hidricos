// /src/js/alerts/alerts.page.js
function resolveRoot(mountedEl) {
  return mountedEl
    || document.querySelector('#ap-content')
    || document.querySelector('#app-page')
    || document;
}

export function initAlertsPage(mountedEl) {
  const root = resolveRoot(mountedEl);
  if (!root || root.dataset.alertsPageReady === '1') return;
  root.dataset.alertsPageReady = '1';

  const target =
    root.querySelector('#alerts-root') ||
    root.querySelector('#al-tbody') ||
    root;

  requestAnimationFrame(() => {
    const io = new IntersectionObserver(async (entries, obs) => {
      if (!entries[0] || !entries[0].isIntersecting) return;
      obs.disconnect();
      const mod = await import('/src/js/alerts/alerts.effects.js');
      if (typeof mod.initAlertsEffects === 'function') mod.initAlertsEffects(root);
      root.dataset.alertsEffectsLoaded = '1';
    }, { rootMargin: '120px 0px' });

    io.observe(target);

    // Fallback
    setTimeout(async () => {
      if (root.dataset.alertsEffectsLoaded === '1') return;
      const mod = await import('/src/js/alerts/alerts.effects.js');
      if (typeof mod.initAlertsEffects === 'function') mod.initAlertsEffects(root);
      root.dataset.alertsEffectsLoaded = '1';
    }, 1500);
  });
}
