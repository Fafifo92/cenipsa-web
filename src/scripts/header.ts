/** Comportamiento del header: estado scrolled, menú móvil y dropdowns accesibles. */

function initHeader() {
  const header = document.getElementById('site-header');
  const menuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!header) return;

  // — estado scrolled (glass + compactar topbar)
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // — menú móvil
  if (menuButton && mobileMenu) {
    const setOpen = (open: boolean) => {
      menuButton.setAttribute('aria-expanded', String(open));
      mobileMenu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    menuButton.addEventListener('click', () => {
      setOpen(menuButton.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        menuButton.focus();
      }
    });
    mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  }

  // — dropdowns de escritorio: sincroniza aria-expanded con hover/focus
  document.querySelectorAll<HTMLElement>('[data-dropdown]').forEach((li) => {
    const btn = li.querySelector<HTMLButtonElement>('button[aria-haspopup]');
    if (!btn) return;
    const sync = (open: boolean) => btn.setAttribute('aria-expanded', String(open));
    li.addEventListener('mouseenter', () => sync(true));
    li.addEventListener('mouseleave', () => sync(false));
    li.addEventListener('focusin', () => sync(true));
    li.addEventListener('focusout', (e) => {
      if (!li.contains(e.relatedTarget as Node)) sync(false);
    });
    // En pantallas táctiles el botón alterna el estado
    btn.addEventListener('click', () => sync(btn.getAttribute('aria-expanded') !== 'true'));
  });
}

initHeader();
document.addEventListener('astro:page-load', initHeader);
