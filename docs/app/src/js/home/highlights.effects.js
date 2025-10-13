// /src/js/home/highlights.effects.js
// Pílulas: abre só a clicada. Animação com timer (sem transitionend) e guard por card.

export function initHighlightsEffects(root){
  if (!root || root.dataset.boundHighlights === '1') return;
  root.dataset.boundHighlights = '1';

  const cards = Array.from(root.querySelectorAll('[data-highlight]'));
  if (!cards.length) return;

  // estado inicial
  cards.forEach(card => {
    const extra = card.querySelector('[data-highlight-extra]');
    if (extra) {
      extra.classList.add('hidden');
      extra.style.overflow   = 'hidden';
      extra.style.maxHeight  = '0px';
      extra.style.opacity    = '0';
      extra.style.transition = 'max-height 420ms ease, opacity 320ms ease';
    }
    card.setAttribute('aria-expanded', 'false');
    card.setAttribute('tabindex', '0');
    card.style.cursor = 'pointer';
  });

  const getExtra = c => c.querySelector('[data-highlight-extra]');
  const getTid   = el => (el.dataset.tid ? Number(el.dataset.tid) : null);
  const setTid   = (el, id) => { el.dataset.tid = String(id); };
  const clearTid = el => { const id = getTid(el); if (id) { clearTimeout(id); delete el.dataset.tid; } };

  function closeCard(card){
    const extra = getExtra(card); if (!extra) return;
    clearTid(extra);
    extra.style.maxHeight = '0px';
    extra.style.opacity   = '0';
    setTid(extra, window.setTimeout(() => {
      extra.classList.add('hidden');
      clearTid(extra);
    }, 430));
    card.setAttribute('aria-expanded', 'false');
    card.classList.remove('ring-2','ring-[#0A5C67]/30','dark:ring-white/20');
  }

  function openCard(card){
    const extra = getExtra(card); if (!extra) return;
    clearTid(extra);
    extra.classList.remove('hidden');
    extra.style.maxHeight = '0px';
    extra.style.opacity   = '0';
    const h = extra.scrollHeight;
    requestAnimationFrame(() => {
      extra.style.maxHeight = h + 'px';
      extra.style.opacity   = '1';
    });
    card.setAttribute('aria-expanded', 'true');
    card.classList.add('ring-2','ring-[#0A5C67]/30','dark:ring-white/20');
  }

  function toggleExclusive(card){
    const isOpen = card.getAttribute('aria-expanded') === 'true';
    cards.forEach(c => { if (c !== card) closeCard(c); });
    if (!isOpen) openCard(card); else closeCard(card);
  }

  cards.forEach(card => {
    card.addEventListener('click', () => toggleExclusive(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleExclusive(card); }
      if (e.key === 'Escape') { e.preventDefault(); closeCard(card); }
    });
  });

  // responsivo: só o aberto é reajustado
  let rid;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(rid);
    rid = requestAnimationFrame(() => {
      const open = cards.find(c => c.getAttribute('aria-expanded') === 'true');
      if (open) {
        const extra = getExtra(open);
        if (extra) extra.style.maxHeight = extra.scrollHeight + 'px';
      }
    });
  }, { passive: true });
}
