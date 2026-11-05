/**
 * Animaciones de aparición al hacer scroll — IntersectionObserver, respeta reduced-motion.
 *
 * - threshold 0: un elemento se revela apenas asoma en pantalla. (Antes se
 *   exigía el 12 % de su alto: en artículos largos ese 12 % superaba la altura
 *   de la ventana y el texto NUNCA aparecía — páginas «vacías».)
 * - Red de seguridad: cualquier elemento que ya esté por encima del borde
 *   inferior de la ventana se revela al cargar.
 * - [data-stagger] en un contenedor reparte retrasos crecientes entre sus
 *   hijos [data-reveal] (sin tener que escribir --reveal-delay a mano).
 */

function applyStagger() {
  document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((group) => {
    const step = Number(group.dataset.stagger) || 90;
    group.querySelectorAll<HTMLElement>(':scope > [data-reveal]').forEach((child, i) => {
      if (!child.style.getPropertyValue('--reveal-delay')) child.style.setProperty('--reveal-delay', `${i * step}ms`);
    });
  });
}

function initReveal() {
  applyStagger();
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
    { rootMargin: '0px 0px -6% 0px', threshold: 0 }
  );

  const vh = window.innerHeight;
  elements.forEach((el) => {
    if (el.getBoundingClientRect().top < vh * 0.94) el.classList.add('is-visible');
    else observer.observe(el);
  });
}

/**
 * Red de seguridad para enlaces con ancla entre páginas (p. ej. /nosotros/#ccb):
 * con la transición entre páginas + scroll suave, algunos navegadores no
 * llegan a desplazarse al destino. Si al cargar el ancla no está a la vista,
 * se desplaza explícitamente (respetando scroll-margin-top).
 */
function scrollToHash() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) return;
  const go = () => {
    const top = target.getBoundingClientRect().top;
    if (top > window.innerHeight * 0.5 || top < -10) target.scrollIntoView({ behavior: 'auto', block: 'start' });
  };
  window.addEventListener('load', () => setTimeout(go, 60), { once: true });
}

initReveal();
scrollToHash();
document.addEventListener('astro:page-load', initReveal);
