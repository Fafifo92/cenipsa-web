/**
 * Comportamiento del header: estado scrolled, menú móvil y dropdowns accesibles.
 * Compatible con view transitions: los elementos se recrean en cada navegación,
 * por lo que cada binding se guarda con data-bound; los listeners de window/document
 * se registran una sola vez y consultan el DOM vivo.
 */

// — estado scrolled (listener único; consulta el header vigente en cada evento)
function syncScrolled() {
  document.getElementById('site-header')?.classList.toggle('scrolled', window.scrollY > 24);
}

// — Escape global: cierra menú móvil o dropdown abierto (listener único)
function onEscape(e: KeyboardEvent) {
  if (e.key !== 'Escape') return;
  const menuButton = document.getElementById('mobile-menu-button');
  if (menuButton?.getAttribute('aria-expanded') === 'true') {
    setMobileMenu(menuButton, false);
    menuButton.focus();
    return;
  }
  const openDropdown = document.querySelector<HTMLElement>('[data-dropdown].dropdown-open');
  if (openDropdown) {
    setDropdown(openDropdown, false);
    openDropdown.querySelector<HTMLButtonElement>('button[aria-haspopup]')?.focus();
  }
}

function setMobileMenu(button: HTMLElement, open: boolean) {
  const menu = document.getElementById('mobile-menu');
  button.setAttribute('aria-expanded', String(open));
  button.setAttribute(
    'aria-label',
    open
      ? (button.dataset.labelClose ?? 'Cerrar menú')
      : (button.dataset.labelOpen ?? 'Abrir menú')
  );
  menu?.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
  // El resto de la página queda inerte mientras el panel está abierto (focus trap real)
  for (const region of document.querySelectorAll<HTMLElement>('main, footer, [data-wa-button], #chat-launcher')) {
    if (open) region.setAttribute('inert', '');
    else region.removeAttribute('inert');
  }
  // El panel pasa a visible al inicio de la transición; el foco se mueve un
  // instante después para que el elemento ya sea enfocable (setTimeout y no
  // rAF: este último se congela en pestañas en segundo plano).
  if (open) setTimeout(() => menu?.querySelector<HTMLElement>('a, button')?.focus(), 50);
}

function setDropdown(li: HTMLElement, open: boolean) {
  li.classList.toggle('dropdown-open', open);
  li.querySelector<HTMLButtonElement>('button[aria-haspopup]')?.setAttribute('aria-expanded', String(open));
}

const w = window as Window & { __cenipsaHeaderGlobals?: boolean };

function initHeader() {
  if (!w.__cenipsaHeaderGlobals) {
    w.__cenipsaHeaderGlobals = true;
    window.addEventListener('scroll', syncScrolled, { passive: true });
    document.addEventListener('keydown', onEscape);
  }
  syncScrolled();
  document.body.style.overflow = ''; // por si se navegó con el menú abierto

  // — menú móvil
  const menuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuButton && mobileMenu && menuButton.dataset.bound !== 'true') {
    menuButton.dataset.bound = 'true';
    menuButton.addEventListener('click', () => {
      setMobileMenu(menuButton, menuButton.getAttribute('aria-expanded') !== 'true');
    });
    mobileMenu.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => setMobileMenu(menuButton, false))
    );
  }

  // — dropdowns de escritorio: hover/focus + toggle explícito en click (táctil)
  document.querySelectorAll<HTMLElement>('[data-dropdown]').forEach((li) => {
    if (li.dataset.bound === 'true') return;
    li.dataset.bound = 'true';
    const btn = li.querySelector<HTMLButtonElement>('button[aria-haspopup]');
    if (!btn) return;
    li.addEventListener('mouseenter', () => setDropdown(li, true));
    li.addEventListener('mouseleave', () => setDropdown(li, false));
    li.addEventListener('focusin', () => setDropdown(li, true));
    li.addEventListener('focusout', (e) => {
      if (!li.contains(e.relatedTarget as Node)) setDropdown(li, false);
    });
    btn.addEventListener('click', () => setDropdown(li, !li.classList.contains('dropdown-open')));
  });
}

initHeader();
document.addEventListener('astro:page-load', initHeader);
