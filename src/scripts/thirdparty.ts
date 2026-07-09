/**
 * Carga diferida de terceros (GTM + tawk.to) sin bloquear el renderizado:
 * se activan tras la primera interacción o a los 4 s, lo que ocurra primero.
 * Los IDs llegan por data-attributes del <body> (definidos en BaseLayout).
 *
 * Tawk se recupera automáticamente de la "orfandad" que provoca la
 * navegación SPA de Astro (<ClientRouter />): en cada navegación same-site,
 * Astro reemplaza el <body> completo y solo conserva nodos marcados
 * `transition:persist`. El widget de Tawk se inyecta en tiempo de ejecución
 * como hijo directo de <body> (fuera del árbol que Astro renderiza por SSR),
 * así que NUNCA puede persistir — su DOM real se destruye en cada swap.
 * `window.Tawk_API`, en cambio, sobrevive (es solo estado de módulo JS), así
 * que sin este manejo el botón terminaría llamando a una referencia "zombie"
 * sin ningún widget real detrás: sin error visible, sin efecto observable.
 * Ver README.md § Chat en vivo para el detalle completo de la investigación.
 */

interface TawkAPI {
  hideWidget?: () => void;
  showWidget?: () => void;
  toggle?: () => void;
  maximize?: () => void;
  minimize?: () => void;
  onLoad?: () => void;
  onChatMinimized?: () => void;
  onChatMaximized?: () => void;
}
interface ThirdPartyWindow extends Window {
  Tawk_API?: TawkAPI;
  Tawk_LoadStart?: Date;
  dataLayer?: Record<string, unknown>[];
}
const w = window as ThirdPartyWindow;

let gtmLoaded = false;
let tawkInjected = false; // hay un <script src=embed.tawk.to> insertado (cargando o ya cargado)
let tawkWidgetReady = false; // onLoad de Tawk ya disparó: el DOM del widget existe de verdad
let tawkOrphaned = false; // hubo un swap de <body> después de que el widget existiera

const emit = (name: string) => document.dispatchEvent(new CustomEvent(name));

function loadGTM(gtmId: string) {
  if (gtmLoaded) return;
  gtmLoaded = true;
  // GTM bootstrap (equivalente al snippet oficial, en módulo externo para CSP estricta)
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
  document.head.appendChild(s);
}

/**
 * Quita el script y TODAS las referencias globales de Tawk para forzar una
 * reinicialización limpia. No basta con borrar `Tawk_API`/`Tawk_LoadStart`:
 * el propio script de Tawk deja otros globales internos (motor, socket,
 * registro JSONP de sus chunks, claves de cuenta — p. ej. `$__TawkEngine`,
 * `$__TawkSocket`, `tawkJsonp`, `$_Tawk_AccountKey`) que, si sobreviven,
 * hacen que el script reinyectado detecte "ya estoy inicializado" y
 * reutilice el motor huérfano en vez de crear un widget nuevo — el síntoma
 * observado era que `Tawk_API.toggle` nunca volvía a aparecer tras la
 * reinyección. Se barren por patrón (no por lista fija) porque esos nombres
 * son un detalle interno de Tawk que puede cambiar entre versiones.
 */
function teardownTawk() {
  document.querySelectorAll('script[src*="embed.tawk.to"]').forEach((el) => el.remove());
  for (const key of Object.keys(window)) {
    if (/tawk/i.test(key)) delete (window as unknown as Record<string, unknown>)[key];
  }
  tawkInjected = false;
  tawkWidgetReady = false;
}

function loadTawk(tawkId: string) {
  if (tawkInjected) return;
  tawkInjected = true;
  tawkOrphaned = false;

  // Configura la API de Tawk ANTES de cargar el embed para ocultar su launcher
  // por defecto: usamos nuestro propio botón animado (ver ChatLauncher).
  w.Tawk_LoadStart = new Date(); // parte del snippet oficial: Tawk lo usa para medir el tiempo de carga
  w.Tawk_API = w.Tawk_API ?? {};
  const api = w.Tawk_API;
  api.onLoad = () => {
    tawkWidgetReady = true;
    // Se oculta UNA sola vez, aquí: hidden/visible es un eje independiente
    // de maximizado/minimizado en la API de Tawk, así que no hace falta (y
    // es contraproducente) repetir hideWidget() en cada minimizado — eso
    // llegaba a cortar a media animación la apertura del panel en móvil.
    api.hideWidget?.();
    emit('tawk:ready');
  };
  api.onChatMaximized = () => emit('tawk:maximized');
  api.onChatMinimized = () => emit('tawk:minimized');

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://embed.tawk.to/${tawkId}`;
  s.setAttribute('crossorigin', '*');
  // Tawk.to está en la lista de bloqueo de varios ad-blockers (uBlock, Brave
  // Shields, etc.): si el script no carga, el launcher lo detecta y ofrece
  // WhatsApp como alternativa en vez de quedar colgado sin respuesta.
  s.onerror = () => emit('tawk:blocked');
  document.head.appendChild(s);
}

function loadThirdParties() {
  const { gtmId, tawkId } = document.body.dataset;
  if (gtmId) loadGTM(gtmId);
  if (tawkId) {
    if (tawkOrphaned) teardownTawk();
    loadTawk(tawkId);
  }
}

/** Fuerza la carga de terceros (usado por el launcher de chat al primer clic o tras recuperarse de orfandad). */
export function ensureThirdParties() {
  loadThirdParties();
}

/** true si el widget de Tawk existió pero su DOM fue destruido por una navegación SPA. */
export function isTawkOrphaned() {
  return tawkOrphaned;
}

/** Marca el widget como huérfano (lo usa el watchdog de ChatLauncher si un toggle() no obtiene respuesta). */
export function markTawkOrphaned() {
  if (tawkInjected) tawkOrphaned = true;
}

// Tras cada navegación SPA (<ClientRouter />), Astro reemplaza el <body>
// completo; el DOM que Tawk hubiera creado (fuera del árbol que Astro
// controla) no sobrevive. Si el widget ya estaba listo, márcalo huérfano
// para que el próximo intento de abrir el chat lo reinicie desde cero.
document.addEventListener('astro:after-swap', () => {
  if (tawkWidgetReady) {
    tawkOrphaned = true;
    tawkWidgetReady = false;
  }
});

const events = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;
const onFirstInteraction = () => {
  loadThirdParties();
  events.forEach((e) => window.removeEventListener(e, onFirstInteraction));
};
events.forEach((e) => window.addEventListener(e, onFirstInteraction, { once: true, passive: true }));
setTimeout(loadThirdParties, 4000);
