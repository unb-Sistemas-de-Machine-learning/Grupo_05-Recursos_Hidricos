// Anima fade-in com IntersectionObserver
export function initHeroEffects(root=document){
  const items = root.querySelectorAll('.fade-item');
  if (!items.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (e.isIntersecting){ e.target.classList.add('fade-in'); io.unobserve(e.target); }
    });
  }, {threshold:0.15, rootMargin:'0px 0px -10% 0px'});
  items.forEach((el,i)=>{ el.style.transitionDelay = `${i*70}ms`; io.observe(el); });
}
