// /src/js/home/hero.effects.js

/** Pequenas animações do hero: entrada suave e parallax leve no card flutuante. */
export function initHeroEffects(root = document) {
  const visual = root.querySelector('[data-hero-visual]');
  const floatCard = root.querySelector('[data-hero-float]');

  // Fade/slide-in ao montar
  requestAnimationFrame(() => {
    if (visual) {
      visual.style.opacity = '0';
      visual.style.transform = 'translateY(8px)';
      visual.style.transition = 'opacity 400ms ease, transform 500ms ease';
      requestAnimationFrame(() => {
        visual.style.opacity = '1';
        visual.style.transform = 'translateY(0)';
      });
    }
    if (floatCard) {
      floatCard.style.opacity = '0';
      floatCard.style.transform = 'translateY(6px)';
      floatCard.style.transition = 'opacity 400ms ease 120ms, transform 500ms ease 120ms';
      requestAnimationFrame(() => {
        floatCard.style.opacity = '1';
        floatCard.style.transform = 'translateY(0)';
      });
    }
  });

  // Parallax sutil no card flutuante
  if (floatCard) {
    const onScroll = () => {
      const rect = floatCard.getBoundingClientRect();
      const viewportH = window.innerHeight || document.documentElement.clientHeight;
      // 0 (fora) → 1 (no centro)
      const progress = 1 - Math.min(Math.max((rect.top + rect.height / 2) / viewportH, 0), 1);
      const translate = Math.round(progress * 6); // até ~6px
      floatCard.style.transform = `translateY(${translate}px)`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
}
