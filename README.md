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
| `node scripts/gen-hero-images.mjs` | Regenera las variantes AVIF/WebP de las fotos de hero |

## Estructura

- `src/content/blog/` — 23 entradas del blog WordPress + 44 artículos jurídicos integrados desde
  abogadosbogotaespecializados.com (mismo slug, categoría «Asesoría jurídica» + área).
- `src/content/paginas/` — servicios, landings SEO y páginas institucionales (colección `paginas`).
- `src/content/faq/faq.json` — preguntas frecuentes (alimenta el acordeón y el schema FAQPage).
- `src/lib/site.ts` — datos maestros: marca (CENIPSA · descriptor · eslogan · NIT), contacto, navegación, pares i18n.
- `src/lib/pillars.ts` — arquitectura de servicios en 3 pilares (Prevenir · Investigar · Defender), segmentos
  B2B/B2C, áreas del derecho y proceso de atención. Alimenta home, `/servicios/` y footer.
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
| `PUBLIC_TAWK_ID` | Chat en vivo Tawk.to (`propertyId/widgetId`) | No carga el chat (ver también `CHAT_ENABLED` en § Chat en vivo) |
| `PUBLIC_FORM_ENDPOINT` | Endpoint del formulario (Formspree u otro) | El formulario abre `mailto:` |
| `PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA v3 invisible (clave de sitio) | Solo honeypot antispam |

## Formulario de contacto

Estático. Configura `PUBLIC_FORM_ENDPOINT` (p. ej. [Formspree](https://formspree.io)) y el formulario hará
POST con redirección a `/gracias/`. Sin endpoint, degrada a `mailto:` prellenado. Incluye honeypot y, si defines
`PUBLIC_RECAPTCHA_SITE_KEY`, **reCAPTCHA v3 invisible** (envía `g-recaptcha-response`; la verificación del token
la hace el backend receptor — Formspree con su propia protección, o tu endpoint con la clave secreta). El campo
"Tipo de requerimiento" (Empresarial/Personal) y "Fase requerida" (Prevención/Investigación/Asesoría legal) son
`<select>` estilizados con picker nativo en móvil; `?tipo=empresarial|personal` en la URL preselecciona el tipo
(CTA B2B/B2C). El texto pide no enviar documentos ni datos sensibles y aclara que el envío no crea relación
abogado-cliente. Los correos de destino históricos del CF7 de WordPress eran `info@` y
`gerencia@inteligenciainvestigativa.com`.

## Chat en vivo

**Estado: ACTIVO.** Widget nativo de tawk.to (`CHAT_ENABLED` en `src/lib/site.ts`; ID en `PUBLIC_TAWK_ID`),
cargado de forma diferida por `src/scripts/thirdparty.ts`.

Historial: el chat fallaba porque el sitio usaba navegación SPA (`<ClientRouter />` de Astro), que reemplaza el
`<body>` en cada navegación y destruía el widget que Tawk inyecta en tiempo de ejecución. Se retiró
`<ClientRouter />` (las páginas cargan de forma normal) y con eso el widget nativo funciona en cada página. Se
eliminó el botón propio (`ChatLauncher`).

El asistente virtual de preguntas frecuentes y la configuración del bot en Tawk y WhatsApp están en
[`docs/chatbot.md`](docs/chatbot.md).

## Despliegue

Salida 100 % estática (`dist/`). Con soporte listo para:

- **Vercel** — `vercel.json` (301 + headers).
- **Netlify / Cloudflare Pages** — `dist/_redirects` (se genera en el build) + `public/_headers`.

Tras el deploy, verificar los 301 con: `curl -I https://dominio/mision/` → `301 → /nosotros/`.

### Staging vs. producción

- `site` (canonical, hreflang, JSON-LD, sitemap) es **siempre** `https://www.inteligenciainvestigativa.com`,
  también en staging. (Antes apuntaba a un subdominio `*.netlify.app`, por eso el sitemap salía con ese dominio.)
- En Netlify, todo build que no se sirve desde el dominio de producción (variables `URL`/`CONTEXT`) se marca como
  **staging**: `X-Robots-Tag: noindex, nofollow` en todas las rutas y `robots.txt` con `Disallow: /`.
  Forzar con `STAGING=true|false`.
- Al lanzar: añadir `www.inteligenciainvestigativa.com` como dominio principal del sitio en Netlify (el subdominio
  `cenipsa.netlify.app` redirige solo al principal) y hacer un nuevo deploy para que deje de emitirse el noindex.

## Migración de dominios (abogadosbogotaespecializados.com → este sitio)

El contenido jurídico del segundo dominio de la firma se integró aquí:

- Áreas de práctica → `/derecho-penal/`, `/derecho-de-familia/`, `/derecho-civil/`, `/derecho-laboral/`,
  `/derecho-comercial/`, `/derecho-administrativo/`, `/derecho-constitucional/`, `/derecho-de-propiedad-intelectual/`
  (mismos slugs que en el dominio antiguo; las landings por keyword como `/abogado-penal-bogota/` se fusionaron en
  su área).
- 44 artículos del blog → `/blog/<mismo-slug>/`. Los párrafos con teléfonos, correos y sedes antiguas se
  sustituyeron por un cierre estándar hacia `/contacto/`.
- FAQ jurídicas añadidas a `faq.json`.

Los 301 **URL a URL** están en `legalDomainRedirects` (`redirects.config.mjs`); el build los emite como reglas por
host en `dist/_redirects` (Netlify) y `vercel.json` (Vercel). Cualquier otra URL del dominio antiguo va a
`/asesoria-juridica/` (nunca a la home).

Para activarlos en Netlify:

1. Domain management → **Add domain alias**: `abogadosbogotaespecializados.com` y `www.abogadosbogotaespecializados.com`.
2. Apuntar el DNS de ese dominio a Netlify (o delegarlo) y esperar el certificado SSL.
3. Verificar: `curl -I https://abogadosbogotaespecializados.com/derecho-penal/` → `301` a
   `https://www.inteligenciainvestigativa.com/derecho-penal/`.
4. En Google Search Console: verificar ambos dominios, usar **Cambio de dirección** del dominio antiguo al nuevo y
   enviar `https://www.inteligenciainvestigativa.com/sitemap-index.xml`.

## Pendientes que dependen de la firma

- **Correos del dominio CENIPSA**: cuando estén creados, cambiar `emailInfo`/`emailGerencia` en `src/lib/site.ts`.
- **E-E-A-T**: perfiles del equipo (nombre, cargo, formación, tarjeta profesional de los abogados), autor y revisor
  jurídico por artículo, y casos anonimizados (situación, metodología, evidencia, intervención, resultado).
- **Sello CCB**: el archivo oficial del sello del Círculo de Afiliados para mostrarlo como imagen.
- **investigadoresprivadosbogota.com**: si sigue activo, enviar su inventario de URLs para mapear sus 301 igual
  que el dominio jurídico.
