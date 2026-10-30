/**
 * Carga diferida de terceros (GTM + chat de tawk.to) sin bloquear el
 * renderizado: se activan tras la primera interacción o a los 4 s, lo que
 * ocurra primero. Los IDs llegan por data-attributes del <body> (BaseLayout).
 *
 * El sitio navega con cargas de página normales (sin <ClientRouter />), así
 * que el widget nativo de Tawk vive su ciclo de vida estándar en cada página:
 * no hay swaps de <body> que lo dejen huérfano (causa de los fallos
 * anteriores; ver README.md § Chat en vivo).
 */

interface ThirdPartyWindow extends Window {
  Tawk_API?: Record<string, unknown>;
  Tawk_LoadStart?: Date;
  dataLayer?: Record<string, unknown>[];
}
const w = window as ThirdPartyWindow;

let loaded = false;

function loadGTM(gtmId: string) {
  // GTM bootstrap (equivalente al snippet oficial, en módulo externo para CSP estricta)
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
  document.head.appendChild(s);
}

function loadTawk(tawkId: string) {
  // Snippet oficial de tawk.to (widget nativo: su propio botón y ventana).
  w.Tawk_API = w.Tawk_API ?? {};
  w.Tawk_LoadStart = new Date();
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://embed.tawk.to/${tawkId}`;
  s.charset = 'UTF-8';
  s.setAttribute('crossorigin', '*');
  document.body.appendChild(s);
}

function loadThirdParties() {
  if (loaded) return;
  loaded = true;
  const { gtmId, tawkId } = document.body.dataset;
  if (gtmId) loadGTM(gtmId);
  if (tawkId) loadTawk(tawkId);
}

const TRIGGERS = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;
TRIGGERS.forEach((ev) => window.addEventListener(ev, loadThirdParties, { once: true, passive: true }));
window.setTimeout(loadThirdParties, 4000);

export {};
