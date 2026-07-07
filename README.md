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
| `PUBLIC_TAWK_ID` | Chat en vivo Tawk.to (`propertyId/widgetId`) | No carga el chat ni su botón |
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

Se usa un **launcher propio** (`ChatLauncher.astro`) con la estética del sitio y animaciones de entrada, hover y
apertura/cierre; controla el panel de Tawk.to vía `Tawk_API` (el botón por defecto de Tawk queda oculto). El chat
solo se carga tras la primera interacción del usuario (o al pulsar el botón), para no penalizar el rendimiento.
En `dev` los terceros (GTM/Tawk) están desactivados; se activan en el build de producción.

## Despliegue

Salida 100 % estática (`dist/`). Con soporte listo para:

- **Vercel** — `vercel.json` (301 + headers).
- **Netlify / Cloudflare Pages** — `dist/_redirects` (se genera en el build) + `public/_headers`.

Tras el deploy, verificar los 301 con: `curl -I https://dominio/mision/` → `301 → /nosotros/`.
