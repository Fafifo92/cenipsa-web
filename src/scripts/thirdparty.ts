/**
 * Carga diferida de terceros (GTM + tawk.to) sin bloquear el renderizado:
 * se activan tras la primera interacción o a los 4 s, lo que ocurra primero.
 * Los IDs llegan por data-attributes del <body> (definidos en BaseLayout).
 */

let loaded = false;

function loadThirdParties() {
  if (loaded) return;
  loaded = true;

  const { gtmId, tawkId } = document.body.dataset;

  if (gtmId) {
    // GTM bootstrap (equivalente al snippet oficial, en módulo externo para CSP estricta)
    interface DataLayerWindow extends Window {
      dataLayer?: Record<string, unknown>[];
    }
    const w = window as DataLayerWindow;
    w.dataLayer = w.dataLayer ?? [];
    w.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
    document.head.appendChild(s);
  }

  if (tawkId) {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://embed.tawk.to/${tawkId}`;
    s.setAttribute('crossorigin', '*');
    document.head.appendChild(s);
  }
}

const events = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;
const onFirstInteraction = () => {
  loadThirdParties();
  events.forEach((e) => window.removeEventListener(e, onFirstInteraction));
};
events.forEach((e) => window.addEventListener(e, onFirstInteraction, { once: true, passive: true }));
setTimeout(loadThirdParties, 4000);
