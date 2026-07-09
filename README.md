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
| `PUBLIC_TAWK_ID` | Chat en vivo Tawk.to (`propertyId/widgetId`) | No carga el chat ni su botón — **actualmente desactivado además por `CHAT_LAUNCHER_ENABLED` en `src/lib/site.ts`, ver § Chat en vivo** |
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

**Estado actual: DESACTIVADO.** `CHAT_LAUNCHER_ENABLED = false` en `src/lib/site.ts` — con la bandera en `false`
no se renderiza el botón **ni** se carga el script de Tawk (cero peticiones de red); el código
(`ChatLauncher.astro`, `src/scripts/thirdparty.ts`) queda intacto para reactivarlo cuando se corrija la causa
raíz descrita abajo. WhatsApp sigue siendo el canal de contacto flotante disponible.

Cuando está activo, el sitio usa un **launcher propio** (`ChatLauncher.astro`) con la estética del sitio y
animaciones de entrada, hover y apertura/cierre; controla el panel de Tawk.to vía `Tawk_API.toggle()` (el botón
por defecto de Tawk queda oculto). GTM se difiere a producción (evitar pageviews falsos en dev); Tawk **no** se
difiere — probarlo en local es necesario y no distorsiona ningún informe de tráfico.

### Por qué se desactivó — causa raíz (investigación con verificación adversarial)

**Síntoma reportado:** en algunos navegadores móviles el panel a veces no se cierra correctamente y el botón deja
de responder a los toques ("la ventana sigue abierta de algún modo y el botón ya no lo ejecuta").

**Causa raíz confirmada** (verificada leyendo el código fuente real de Astro, `swap-functions.js`, no solo
inferida): el sitio usa `<ClientRouter />` (`astro:transitions`) para navegación SPA. En cada navegación
same-site, Astro reemplaza el `<body>` completo (`oldElement.replaceWith(newElement)`) y solo conserva los nodos
marcados con `transition:persist` — ninguno lo está en este proyecto. El widget de Tawk (su iframe/contenedor) lo
inyecta el script embed directamente como hijo de `document.body` **en tiempo de ejecución**, fuera del árbol que
Astro renderiza por SSR, así que **nunca podría persistir** aunque se marcara `#chat-launcher`. Al mismo tiempo,
la bandera `loaded` en `thirdparty.ts` es una variable de módulo que sobrevive indefinidamente entre navegaciones
(el mismo patrón, deliberado, que usa `pendingOpen`/`fallbackTimer`), así que `loadThirdParties()` nunca se
vuelve a ejecutar tras la primera carga.

Resultado: tras la **primera navegación SPA** posterior a usar el chat, el DOM real del widget de Tawk queda
huérfano (destruido), pero `window.Tawk_API` sigue existiendo en memoria con sus métodos intactos.
`requestToggle()` solo decide qué hacer mirando si `api?.toggle` es una función — que lo sigue siendo para
siempre — así que **nunca** cae en la rama de fallback a WhatsApp; simplemente invoca `toggle()` sobre una
referencia "zombie" sin ningún widget real que mover. Sin error visible, sin fallback: el botón deja de tener
cualquier efecto observable por el resto de la sesión.

Factores secundarios de menor confianza que probablemente agravan el problema en móvil específicamente (no
verificables sin dispositivo real, ya que el DOM/CSS interno de Tawk es una caja negra):
- El panel maximizado de Tawk en móvil ocupa toda la pantalla con un z-index casi con certeza muy superior al
  `z-40` de nuestro botón; si una animación de cierre queda interrumpida (p. ej. por el resize de viewport del
  teclado virtual en iOS Safari), el overlay podría quedar tapando físicamente el botón.
- `showWidget()` está declarado pero nunca se invoca (solo `hideWidget()`, una vez, en `onLoad`); si Tawk trata
  hidden/visible como un eje que también afecta al panel (no solo a su burbuja por defecto), podría interferir.
- `requestToggle()` no tiene guard de reentrancia ni timeout de reconciliación tras el `toggle()`.

**Plan para reactivar:** (1) añadir un timeout de reconciliación en `requestToggle()` — si tras `toggle()` no
llega ningún evento `tawk:maximized`/`tawk:minimized` en ~2 s, asumir que el widget está muerto y caer a
WhatsApp (mismo patrón que ya existe para "Tawk bloqueado"); (2) en `astro:page-load`, si Tawk ya se había
cargado antes pero su DOM real ya no está presente, resetear `loaded = false` en `thirdparty.ts` y volver a
inyectar el script; (3) opcionalmente, forzar recarga completa de página (en vez de navegación SPA) en los
enlaces mientras el chat está abierto. Verificar en un dispositivo/emulador móvil real antes de reactivar.

## Despliegue

Salida 100 % estática (`dist/`). Con soporte listo para:

- **Vercel** — `vercel.json` (301 + headers).
- **Netlify / Cloudflare Pages** — `dist/_redirects` (se genera en el build) + `public/_headers`.

Tras el deploy, verificar los 301 con: `curl -I https://dominio/mision/` → `301 → /nosotros/`.
