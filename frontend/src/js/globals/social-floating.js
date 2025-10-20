// /src/js/globals/social-floating.js
// - abre/fecha com clique
// - fecha no ESC e clique fora
// - ✅ SEM auto-hide: o botão fica sempre visível
// - inicia ABERTO no desktop (>= 1024px)

export function initSocialFloating(root = document) {
  const wrap   = root.querySelector('#social-floating');
  if (!wrap) return;

  const toggle = wrap.querySelector('#social-toggle');
  const stack  = wrap.querySelector('#social-links');
  const copyBt = wrap.querySelector('#social-copy');

  const open = () => {
    if (wrap.classList.contains('is-open')) return;
    wrap.classList.add('is-open');
    toggle?.setAttribute('aria-expanded', 'true');
    stack?.setAttribute('aria-hidden', 'false');
    // animação em cascata
    if (stack) {
      [...stack.children].forEach((el, i) => {
        el.style.transitionDelay = `${i * 35}ms`;
        el.classList.add('show');
      });
    }
  };

  const close = () => {
    if (!wrap.classList.contains('is-open')) return;
    wrap.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
    stack?.setAttribute('aria-hidden', 'true');
    if (stack) {
      [...stack.children].forEach((el) => {
        el.style.transitionDelay = `0ms`;
        el.classList.remove('show');
      });
    }
  };

  const toggleOpen = () => (wrap.classList.contains('is-open') ? close() : open());

  // eventos básicos
  toggle?.addEventListener('click', toggleOpen);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target) && wrap.classList.contains('is-open')) {
      close();
    }
  });

  // copiar link atual
  if (copyBt) {
    copyBt.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(location.href);
        copyBt.classList.add('copied');
        setTimeout(() => copyBt.classList.remove('copied'), 1200);
      } catch { /* ignore */ }
    });
  }

  // ─────────────────────────────────────────────
  // ✅ SEM AUTO-HIDE: removemos listeners de scroll/focus
  // ─────────────────────────────────────────────
  // (nada aqui; o FAB permanece sempre visível)

  // ─────────────────────────────────────────────
  // Abrir automaticamente no desktop
  // ─────────────────────────────────────────────
  const desktopMq = window.matchMedia('(min-width: 1024px)');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  const maybeAutoOpen = () => {
    if (desktopMq.matches) {
      const delay = prefersReduced.matches ? 0 : 120;
      setTimeout(open, delay);
    } else {
      close(); // mobile começa fechado
    }
  };

  // estado inicial
  maybeAutoOpen();

  // atualiza ao cruzar breakpoint
  desktopMq.addEventListener?.('change', maybeAutoOpen);
}
