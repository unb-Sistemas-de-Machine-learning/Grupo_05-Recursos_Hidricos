// /src/js/globals/footer.js
export function initFooter(root) {
  if (!root || root.dataset.boundFooter === '1') return;
  root.dataset.boundFooter = '1';

  // ano automático
  const year = root.querySelector('#footer-year');
  if (year) year.textContent = new Date().getFullYear();

  // scroll suave para o topo
  const toTop = root.querySelector('#footer-top-link');
  if (toTop) {
    toTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
