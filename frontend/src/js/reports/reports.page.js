// /src/js/reports/reports.page.js
function resolveRoot(mountedEl) {
  return mountedEl
    || document.querySelector('#ap-content')
    || document.querySelector('#app-page')
    || document;
}

export function initReportsPage(mountedEl) {
  const root = resolveRoot(mountedEl);
  if (!root || root.dataset.reportsPageReady === '1') return;
  root.dataset.reportsPageReady = '1';

  // Lazy-load ao entrar na viewport
  const target = root.querySelector('#reports-root') || root;
  const io = new IntersectionObserver(async (entries, obs) => {
    if (!entries[0] || !entries[0].isIntersecting) return;
    obs.disconnect();
    const mod = await import('/src/js/reports/reports.effects.js');
    mod.initReportsEffects(root);
  }, { rootMargin: '120px 0px' });
  io.observe(target);
}
