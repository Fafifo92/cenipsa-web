/** Animaciones de aparición al hacer scroll — IntersectionObserver, respeta reduced-motion. */

function initReveal() {
  const elements = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)');
  if (elements.length === 0) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
  );

  elements.forEach((el) => observer.observe(el));
}

initReveal();
document.addEventListener('astro:page-load', initReveal);
