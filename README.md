# CENIPSA — Inteligencia Investigativa

Sitio web estático de **CENIPSA S.A.S.** (www.inteligenciainvestigativa.com), migrado de WordPress a
**Astro 5 + Tailwind CSS 4**. Español como idioma raíz y versión en inglés (`/en/`) para las páginas core.

## Comandos

| Comando | Acción |
|---|---|
| `npm install` | Instala dependencias |
| `npm run dev` | Servidor de desarrollo en `localhost:4321` |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Previsualiza el build |
| `npm run check` | Verificación de tipos y templates |
| `node scripts/gen-assets.mjs` | Regenera favicon/OG/logo raster |
| `node scripts/gen-vercel.mjs` | Regenera `vercel.json` (tras cambiar redirects o CSP) |

## Estructura

- `src/content/blog/` — 23 entradas migradas íntegras del blog WordPress.
- `src/content/paginas/` — servicios, landings SEO y páginas institucionales (colección `paginas`).
- `src/content/faq/faq.json` — preguntas frecuentes (alimenta el acordeón y el schema FAQPage).
- `src/lib/site.ts` — datos maestros: marca, contacto, navegación, pares i18n.
- `src/lib/seo.ts` — constructores de JSON-LD (Organization, Service, Article, FAQPage, Breadcrumb).
- `redirects.config.mjs` — **única fuente de verdad** de los 301 (consumida por Astro, `_redirects` y `vercel.json`).
- `content-source/` — material de la migración (export WXR parseado + contenido recuperado del sitio en vivo).
- `ARCHITECTURE.md` — decisiones de arquitectura, mapa del sitio y motivos de cada redirect.

## SEO

- Slugs **idénticos** a los del WordPress original (preservan posicionamiento), incluidos los sufijos `-2`
  de las páginas enlazadas en producción.
- Páginas duplicadas/thin consolidadas con 301 (ver `redirects.config.mjs`).
- Canonical, hreflang (solo pares reales), Open Graph, Twitter Cards y JSON-LD por tipo de página.
- Sitemap filtrado (`/sitemap-index.xml`) + `robots.txt`.

## Seguridad

- CSP estricta sin `unsafe-inline` en scripts (script inline único anclado por hash SHA-256).
- Headers en `public/_headers` (Netlify/Cloudflare Pages) y `vercel.json` (Vercel).
- Si cambias el script inline de `BaseHead.astro`, recalcula el hash y actualiza ambos archivos.
- Formulario con honeypot; los IDs de GTM/tawk.to se configuran por variables `PUBLIC_*` (ver `.env.example`).
- Los scripts del sitio se emiten SIEMPRE como archivos externos (`assetsInlineLimit: 0`) para que la CSP
  no necesite `unsafe-inline`. Nota GTM: los tags de tipo **Custom HTML** del contenedor inyectan scripts
  inline que la CSP bloqueará — revisar el contenedor `GTM-W8N2BTC` y migrar esos tags a plantillas nativas.

## Variables de entorno

Todas se definen en `.env` (ver `.env.example`). Son `PUBLIC_*` (llegan al cliente; sin secretos):

| Variable | Para qué | Si se deja vacía |
|---|---|---|
| `PUBLIC_GTM_ID` | Google Tag Manager (analítica) | No carga GTM |
| `PUBLIC_TAWK_ID` | Chat en vivo Tawk.to (`propertyId/widgetId`) | No carga el chat ni su botón (ver también `CHAT_LAUNCHER_ENABLED` en § Chat en vivo) |
| `PUBLIC_FORM_ENDPOINT` | Endpoint del formulario (Formspree u otro) | El formulario abre `mailto:` |
| `PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA v3 invisible (clave de sitio) | Solo honeypot antispam |

## Formulario de contacto

Estático. Configura `PUBLIC_FORM_ENDPOINT` (p. ej. [Formspree](https://formspree.io)) y el formulario hará
POST con redirección a `/gracias/`. Sin endpoint, degrada a `mailto:` prellenado. Incluye honeypot y, si defines
`PUBLIC_RECAPTCHA_SITE_KEY`, **reCAPTCHA v3 invisible** (envía `g-recaptcha-response`; la verificación del token
la hace el backend receptor — Formspree con su propia protección, o tu endpoint con la clave secreta). El campo
"Servicio de interés" es un `<select>` estilizado que usa el picker nativo del sistema en móvil. Los correos de
destino históricos del CF7 de WordPress eran `info@` y `gerencia@inteligenciainvestigativa.com`.

## Chat en vivo

**Estado actual: ACTIVO.** `CHAT_LAUNCHER_ENABLED = true` en `src/lib/site.ts` — es el interruptor maestro; en
`false`, ni se renderiza el botón ni se carga el script de Tawk (cero peticiones de red), sin tocar código.

El sitio usa un **launcher propio** (`ChatLauncher.astro`) con la estética del sitio y animaciones de entrada,
hover y apertura/cierre; controla el panel de Tawk.to vía `Tawk_API.toggle()` (el botón por defecto de Tawk queda
oculto). GTM se difiere a producción (evita pageviews falsos en dev); Tawk **no** se difiere — probarlo en local
es necesario y no distorsiona ningún informe de tráfico.

### Bug corregido: el botón dejaba de responder tras navegar (causa raíz + fix)

**Síntoma reportado:** en algunos navegadores móviles el panel a veces no se cerraba correctamente y el botón
dejaba de responder a los toques ("la ventana sigue abierta de algún modo y el botón ya no lo ejecuta").

**Causa raíz confirmada** (investigación con verificación adversarial, incluyendo lectura del código fuente real
de Astro, `swap-functions.js`, no solo inferida): el sitio usa `<ClientRouter />` (`astro:transitions`) para
navegación SPA. En cada navegación same-site, Astro reemplaza el `<body>` completo
(`oldElement.replaceWith(newElement)`) y solo conserva los nodos marcados con `transition:persist` — ninguno lo
está en este proyecto. El widget de Tawk (su iframe/contenedor) lo inyecta el script embed directamente como hijo
de `document.body` **en tiempo de ejecución**, fuera del árbol que Astro renderiza por SSR, así que **nunca
podría persistir** aunque se marcara `#chat-launcher`. Resultado: tras la primera navegación SPA posterior a usar
el chat, el DOM real del widget quedaba huérfano (destruido), pero `window.Tawk_API` seguía existiendo en
memoria con sus métodos intactos — el botón llamaba `toggle()` sobre una referencia "zombie" sin ningún widget
real que mover, sin error visible y sin caer nunca al fallback de WhatsApp.

**Fix aplicado** (`src/scripts/thirdparty.ts` + `ChatLauncher.astro`):
1. **Detección determinista de orfandad.** Se escucha el evento de ciclo de vida `astro:after-swap` (se dispara
   justo después de que Astro reemplaza el `<body>`): si el widget ya estaba listo (`onLoad` había disparado)
   cuando ocurre el swap, se marca `tawkOrphaned = true`. No se depende de heurísticas sobre el DOM interno de
   Tawk (una caja negra) — se reacciona al evento del propio framework que causa el problema.
2. **Recuperación automática.** `requestToggle()` ahora comprueba `!isTawkOrphaned()` antes de confiar en
   `Tawk_API.toggle`; si el widget está huérfano, se trata igual que "aún no cargó": se hace `teardownTawk()`
   y se reinyecta limpio, reutilizando el mismo flujo de `pendingOpen`/`tawk:ready` que ya existía para la
   primera carga. El teardown no solo borra `window.Tawk_API`/`Tawk_LoadStart`: Tawk deja además varios
   globales internos propios (motor, socket, registro de sus chunks — `$__TawkEngine`, `$__TawkSocket`,
   `tawkJsonp`, `$_Tawk*`) que, si sobreviven, hacen que el script reinyectado detecte "ya estoy
   inicializado" y reutilice el motor huérfano en vez de crear un widget nuevo — se barren todos por patrón
   (`/tawk/i` sobre las claves de `window`), no por lista fija, porque son un detalle interno de Tawk que
   puede cambiar entre versiones. Sin este barrido completo, la recuperación parecía funcionar (el script se
   reinyectaba) pero `Tawk_API.toggle` nunca volvía a aparecer.
3. **Red de seguridad (riesgos secundarios no verificables).** Tras cada `toggle()` se arma un watchdog de
   2.5 s: si no llega confirmación (`tawk:maximized`/`tawk:minimized`) — p. ej. por un overlay de Tawk con
   z-index de terceros tapando el botón, o una animación interrumpida por el teclado virtual en iOS Safari,
   riesgos que no podemos verificar ni controlar directamente — se marca huérfano igualmente y, si el intento
   era de **abrir**, se cae a WhatsApp; si era de **cerrar**, solo se prepara la reconexión limpia para el
   próximo intento (sin redirigir de forma sorpresiva a un cierre fallido). El timeout de "primera carga en
   frío" (`pendingOpen` → `tawk:ready`) se subió de 6 s a 10 s: una recarga completa del widget implica
   ~15-20 peticiones (chunks JS, idiomas, fuentes, sonido) y 6 s podían agotarse antes de que Tawk terminara,
   cayendo a WhatsApp por error incluso cuando el chat sí iba a cargar bien un par de segundos después.

**Verificado en navegador** (Chromium vía CDP, `npm run dev`): ciclo completo abrir → cerrar → navegar (SPA,
clic real en enlaces del sitio, no recarga completa) → abrir de nuevo, repetido en 3 navegaciones consecutivas
(`/` → `/nosotros/` → `/servicios/`), confirmando en cada parada que `Tawk_API.toggle` se recupera y el panel
llega a `data-state="open"`. La parte específica de overlay/z-index en iOS Safari no es reproducible fuera de
un dispositivo real; la red de seguridad del punto 3 cubre ese caso de forma genérica sin necesitar
diagnosticarlo con exactitud.

## Despliegue

Salida 100 % estática (`dist/`). Con soporte listo para:

- **Vercel** — `vercel.json` (301 + headers).
- **Netlify / Cloudflare Pages** — `dist/_redirects` (se genera en el build) + `public/_headers`.

Tras el deploy, verificar los 301 con: `curl -I https://dominio/mision/` → `301 → /nosotros/`.
