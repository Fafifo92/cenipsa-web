# CENIPSA — Inteligencia Investigativa · Arquitectura del sitio (Astro)

Migración de WordPress (www.inteligenciainvestigativa.com) a Astro estático.
Fuente de contenido: `content-source/` (export WXR parseado + contenido recuperado del sitio en vivo).

## Marca

- **Empresa:** CENIPSA S.A.S. — Investigadores y Abogados ("Inteligencia Investigativa")
- **Dominio:** https://www.inteligenciainvestigativa.com
- **Dirección:** Carrera 62 # 103 – 44, Edificio Torre del Reloj, Oficina 403, Sede Norte, Bogotá, Colombia
- **PBX:** +57 (601) 6290498 · **WhatsApp:** +57 317 4232502
- **Emails:** info@inteligenciainvestigativa.com · gerencia@inteligenciainvestigativa.com
- **Afiliación:** Círculo de Afiliados CCB (Cámara de Comercio de Bogotá) · Pagos: PayU
- **Terceros (en vivo):** GTM `GTM-W8N2BTC`, GA4 `G-9YPEE1RMPM`, tawk.to `5f5fbb92f0e7167d0010402a/default`
- **Redes:** Facebook, Instagram, LinkedIn (extraer URLs exactas del footer en vivo)

## Stack

- Astro 5 estático + TypeScript strict
- Tailwind CSS v4 (`@tailwindcss/vite`)
- `@astrojs/sitemap`
- Content collections: `blog` (markdown), `services`/`landings` (datos + HTML curado)
- i18n: ES raíz (`es-CO`, default, sin prefijo) + EN en `/en/` solo páginas core. hreflang solo donde existe par.
- Imágenes: descargadas de wp-content/uploads a `src/assets/`, servidas optimizadas (astro:assets, AVIF/WebP)
- Formulario de contacto: POST a endpoint configurable (`PUBLIC_FORM_ENDPOINT`), honeypot, validación, redirect a `/gracias/`. Campos: Nombre*, Email*, Teléfono, Mensaje*, checkbox* política de datos.
- Deploy agnóstico: `vercel.json` + `public/_redirects` + `public/_headers` (Netlify/Cloudflare) con 301s y security headers.

## Mapa del sitio (URLs canónicas — NO cambiar slugs)

### Navegación principal
| URL | Página | Fuente contenido |
|---|---|---|
| `/` | Home | live-content/home.body.html + pages.json |
| `/nosotros/` | Quiénes somos (incluye Misión + Visión) | nosotros + mision + vision |
| `/servicios/` | Índice de servicios | servicios.body.html |
| `/blog/` | Índice del blog | posts.json (23 posts) |
| `/faq/` | Preguntas frecuentes | faq.body.html (canónica) |
| `/pagos-en-linea/` | Pagos en línea (PayU) | pagos-en-linea.body.html |
| `/contacto/` | Contacto | contacto.body.html + form CF7 |
| `/gracias/` | Gracias (noindex) | gracias.body.html |

### Servicios (dropdown + footer)
| URL | Página |
|---|---|
| `/investigacion-personal/` | Investigación personal |
| `/investigacion-corporativa/` | Investigación corporativa (fusionar contenido de `-2`) |
| `/asesoria-juridica/` | Asesoría y representación jurídica (fusionar `-2`) |
| `/criminalistica/` | Criminalística |
| `/plataforma-gps/` | GPS rastreo satelital |
| `/servicios-en-linea/` | Servicios en línea |
| `/servicios-especiales/` | Servicios especiales para abogados (fusionar `servicios-especiales-para-abogados-y-empresas-de-cartera`) |
| `/barrido-electronico/` | Barrido electrónico |

### Landing pages SEO (footer "Enlaces de interés" — slugs EXACTOS)
`/detectives-privados-bogota-2/`, `/investigadores-privados-bogota-2/`, `/detectives-privados-en-medellin/`,
`/gps-bogota/`, `/detectives-privados-en-cali/`, `/gps-para-carros-bogota/`, `/detectives-privados-colombia/`,
`/prueba-de-poligrafo-bogota/`, `/investigador-privado-colombia/`, `/detectives-privados-bogota-precios/`,
`/detectives-privados/`, `/abogados-bogota/`, `/investigadores-privados-2/`, `/abogados-sucesiones-bogota/`,
`/poligrafo-laboral/`

### Páginas de contenido profundo (conservar — tienen contenido sustancial)
`/equipo-interdisciplinar/`, `/infidelidad/`, `/seguimientos-inteligentes/`,
`/ubicacion-de-personas-para-notificacion-judicial/`, `/investigacion-patrimonial-para-medidas-cautelares/`,
`/analisis-ejecutivo-de-informacion-financiera-bienes-raices-y-vehiculos/`, `/examen-de-poligrafia/`,
`/garantias/`, `/casos-de-exito/`, `/consejos-de-seguridad/`, `/servicios-comunidad-lgtb/`

### Legales
`/terminos-y-condiciones/`, `/politica-de-tratamiento-de-datos-y-privacidad/`

### Blog
23 posts en `/blog/{slug}/` (contenido íntegro del export; categorías como tags visibles, SIN páginas /category/).

## Redirects 301 (limpieza de redundancias)

| De | A | Motivo |
|---|---|---|
| `/mision/` | `/nosotros/` | thin, fusionada |
| `/vision/` | `/nosotros/` | thin, fusionada |
| `/preguntas-frecuentes/` | `/faq/` | duplicada (FAQ canónica en nav) |
| `/contacto-3/` | `/contacto/` | duplicada |
| `/asesoria-juridica-2/` | `/asesoria-juridica/` | duplicada huérfana |
| `/investigacion-corporativa-2/` | `/investigacion-corporativa/` | duplicada huérfana |
| `/servicios-especiales-para-abogados-y-empresas-de-cartera/` | `/servicios-especiales/` | fusionada |
| `/detectives-privados-bogota/` | `/detectives-privados-bogota-2/` | duplicada (canónica = enlazada en vivo) |
| `/investigadores-privados-bogota/` | `/investigadores-privados-bogota-2/` | duplicada |
| `/investigadores-privados/` | `/investigadores-privados-2/` | duplicada |
| `/investigadores-privados-2-2/` | `/investigadores-privados-2/` | thin duplicada |
| `/detectives-bogota/` | `/detectives-privados-bogota-2/` | duplicada temática |
| `/detectives-privados-precios/` | `/detectives-privados-bogota-precios/` | replica 301 ya activo en vivo* |
| `/programa-espia/` | `/detectives-privados/` | replica 301 ya activo en vivo |
| `/como-espiar-un-celular/` | `/detectives-privados/` | replica 301 ya activo en vivo |
| `/prueba-de-poligrafo/` | `/prueba-de-poligrafo-bogota/` | consolidación poligrafía |
| `/poligrafia/` | `/prueba-de-poligrafo-bogota/` | consolidación poligrafía |
| `/seguimiento-de-infidelidad/` | `/infidelidad/` | consolidación |
| `/galeria/` | `/nosotros/` | página de tema antiguo |
| `/cosas-de-interes/` | `/blog/` | hub obsoleto |
| `/productos-servicios/` | `/servicios/` | catálogo obsoleto |
| `/equipos-gps/` | `/plataforma-gps/` | stub de producto |
| `/camaras-de-largo-alcance/` | `/servicios/` | stub de producto |
| `/microfonos/` | `/barrido-electronico/` | stub de producto |
| `/seguridad/` | `/servicios/` | stub de producto |
| `/busqueda/` | `/blog/` | búsqueda WP eliminada |
| `/formulario-prueba/` | `/contacto/` | página de prueba |

*Nota: el sitio en vivo redirige `detectives-privados-precios` → `detectives-privados-bogota-2`; se corrige el destino a
`detectives-privados-bogota-precios` solo si NO estaba así en vivo — mantener el destino del sitio en vivo: `/detectives-privados-bogota-2/`.

## SEO

- Meta title/description por página desde Rank Math/Yoast del export (`pages.json`/`posts.json`, campos `seo.*`); si faltan, redactar (≤60/≤155 chars) usando el focus keyword.
- Canonical absoluto por página; trailing slash consistente (`/ruta/`).
- hreflang `es-CO`/`en`/`x-default` solo en páginas con par EN.
- JSON-LD: `Organization`+`LocalBusiness` (home/global), `Service` (servicios/landings), `Article` (posts), `FAQPage` (faq), `BreadcrumbList` (todas menos home).
- Sitemap: solo URLs canónicas indexables (excluir `/gracias/`, 404, y todo lo redirigido). robots.txt con referencia al sitemap.
- OG/Twitter cards completas con imagen.

## Seguridad (headers)

CSP (permitiendo GTM/GA/tawk.to/PayU según se activen), X-Content-Type-Options, Referrer-Policy,
Permissions-Policy, X-Frame-Options DENY, HSTS. Sin secretos en cliente. Formulario con honeypot.

## Accesibilidad

Landmarks, skip-link, foco visible, contraste AA, `prefers-reduced-motion` respetado en TODAS las animaciones,
navegación por teclado en menú/acordeones, `aria-expanded`/`aria-controls` correctos, alt en imágenes.

## Diseño

Moderno y sofisticado, sector legal/investigación: paleta tinta profunda + teal refinado + acento dorado;
tipografía display serif + sans limpia (self-hosted); animaciones elegantes (reveals con IntersectionObserver,
micro-interacciones, huella dactilar SVG animada como motivo de marca), glass header sticky, dark footer.
