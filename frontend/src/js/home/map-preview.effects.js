// /src/js/home/map-preview.effects.js
export function initMapPreviewEffects(root = document) {
  // dropdown região
  const btn = root.querySelector('#region-toggle');
  const menu = root.querySelector('#region-menu');
  const label = root.querySelector('#region-current');
  const series = {
    precip: root.querySelector('[data-mock="precip"]'),
    flow: root.querySelector('[data-mock="flow"]'),
    storage: root.querySelector('[data-mock="storage"]'),
  };

  if (btn && menu && label) {
    const close = () => menu.classList.add('hidden');
    const open  = () => menu.classList.remove('hidden');

    btn.addEventListener('click', () => menu.classList.contains('hidden') ? open() : close());
    document.addEventListener('mousedown', (e) => {
      if (!menu.contains(e.target) && !btn.contains(e.target)) close();
    });

    menu.querySelectorAll('[data-region]').forEach(item => {
      item.addEventListener('click', () => {
        const region = item.getAttribute('data-region');
        label.textContent = region;
        // mocks aleatórios
        series.precip.textContent  = (10 + Math.round(Math.random()*40)).toString();
        series.flow.textContent    = (5 + Math.round(Math.random()*25)).toString();
        series.storage.textContent = (40 + Math.round(Math.random()*50)).toString();
        close();
      });
    });
  }

  // micro-entrada animada
  const mapCard = root.querySelector('[data-map-card]');
  const seriesCard = root.querySelector('[data-series-card]');
  [mapCard, seriesCard].forEach((el, i) => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    el.style.transition = `opacity 400ms ease ${i*50}ms, transform 500ms ease ${i*50}ms`;
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  });
}
