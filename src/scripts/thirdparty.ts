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
    // Configura la API de Tawk ANTES de cargar el embed para ocultar su launcher
    // por defecto: usamos nuestro propio botón animado (ver ChatLauncher).
    interface TawkWindow extends Window {
      Tawk_API?: {
        hideWidget?: () => void;
        showWidget?: () => void;
        maximize?: () => void;
        onLoad?: () => void;
        onChatMinimized?: () => void;
        onChatMaximized?: () => void;
      };
      Tawk_LoadStart?: Date;
    }
    const w = window as TawkWindow;
    w.Tawk_API = w.Tawk_API ?? {};
    const api = w.Tawk_API;
    const emit = (name: string) => document.dispatchEvent(new CustomEvent(name));
    api.onLoad = () => {
      api.hideWidget?.();
      emit('tawk:ready');
    };
    api.onChatMaximized = () => emit('tawk:maximized');
    api.onChatMinimized = () => {
      api.hideWidget?.();
      emit('tawk:minimized');
    };

    const s = document.createElement('script');
    s.async = true;
    s.src = `https://embed.tawk.to/${tawkId}`;
    s.setAttribute('crossorigin', '*');
    document.head.appendChild(s);
  }
}

/** Fuerza la carga de terceros (usado por el launcher de chat al primer clic). */
export function ensureThirdParties() {
  loadThirdParties();
}

const events = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;
const onFirstInteraction = () => {
  loadThirdParties();
  events.forEach((e) => window.removeEventListener(e, onFirstInteraction));
};
events.forEach((e) => window.addEventListener(e, onFirstInteraction, { once: true, passive: true }));
setTimeout(loadThirdParties, 4000);
