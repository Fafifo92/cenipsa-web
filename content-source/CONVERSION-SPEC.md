# Especificación de conversión de contenido (WordPress → Astro)

Reglas OBLIGATORIAS para convertir el contenido migrado a archivos de contenido de Astro.

## Principios

1. **El texto es sagrado.** El contenido textual se conserva ÍNTEGRO y VERBATIM. Solo se permite:
   - Corregir errores ortográficos evidentes (p. ej. "De ante mano" → "De antemano", "Microfonos" → "Micrófonos").
   - Normalizar espacios/entidades HTML (`&amp;` → `&`, `&nbsp;` → espacio).
   - NO parafrasear, NO resumir, NO añadir texto de marketing inventado.
2. **Sin H1 en el cuerpo.** El H1 lo pinta el layout. El cuerpo empieza en el primer párrafo. La jerarquía h2/h3 del original se conserva.
3. **Markdown limpio.** Convertir `<p>`, `<h2>/<h3>`, `<strong>`, `<em>`, `<a>`, `<ul>/<ol>`, `<img>`, `<blockquote>` a Markdown. Eliminar: wrappers del tema (div/row/col/section), estilos inline, clases, shortcodes (`[vc_*]`, `[contact-form-7]`, etc.), scripts, iframes de terceros salvo YouTube (convertir a enlace).
4. **Imágenes:** sustituir cada URL `https://www.inteligenciainvestigativa.com/wp-content/uploads/<ruta>` por su ruta local según `content-source/image-map.json`. Alt text: conservar el original; si está vacío, redactar uno descriptivo breve en español. Si una imagen no está en el mapa, omitirla.
5. **Enlaces internos:** convertir URLs absolutas del dominio a rutas relativas con slash final (`https://www.inteligenciainvestigativa.com/x/` → `/x/`). Aplicar el mapa de redirects (`redirects.config.mjs` en la raíz): si el enlace apunta a un slug redirigido, enlazar directamente al destino final. `tel:`, `mailto:`, `https://api.whatsapp.com/...` se conservan. Enlaces a otras webs: conservar con el texto original.
6. **Codificación:** UTF-8 sin BOM. Tildes y eñes escritas directamente (no entidades).

## Blog (`src/content/blog/{slug}.md`)

Fuente: `content-source/split/posts/{slug}.json` (campo `content` = HTML del post).

```yaml
---
title: "«title» del JSON (limpiar entidades)"
description: "seo.rmDesc o seo.yoastDesc; si ambos vacíos, redactar ≤158 chars fiel al primer párrafo"
pubDate: 2025-02-07            # fecha de `date` (solo día)
updatedDate: 2026-07-06        # de `modified`, SOLO si difiere >30 días de pubDate; si no, omitir
categories: ["nombre legible de cada categoría del JSON (domain=category), EXCLUYENDO «Blog» y «Sin categoría»"]
image: "/images/uploads/…"     # primera imagen del contenido; si no hay, omitir
imageAlt: "alt de esa imagen"
focusKeyword: "seo.rmFocusKw o seo.yoastFocusKw si existe"
---
```

Cuerpo: el HTML de `content` convertido a Markdown según las reglas. Los saltos dobles de WordPress
(`\n\n`) equivalen a párrafos. Conservar TODOS los párrafos, encabezados, listas y enlaces.

## Páginas (`src/content/paginas/{slug}.md`)

Fuente: `content-source/pages-manifest.json` (entrada con tu `slug`) + para cada slug de `sources`,
el archivo `content-source/live-content/{source}.body.html` (contenido real del sitio en vivo).

```yaml
---
title: "H1 humano (manifest.h1 || liveH1 || título del JSON) — capitalización tipo oración, NUNCA MAYÚSCULAS SOSTENIDAS"
seoTitle: "manifest.liveTitle (el <title> del sitio en vivo, conserva el sufijo « - Inteligencia Investigativa»)"
description: "manifest.liveDesc; si vacío, rank_math/yoast del JSON de página; si vacío, redactar ≤158 fiel al contenido"
type: service | landing | info | legal   # del manifest
focusKeyword: "del JSON de página (seo.rmFocusKw/yoastFocusKw) si existe"
related:                                  # EXACTAMENTE los del manifest
  - { label: "…", href: "/…/" }
order: N                                  # del manifest si existe
icon: "…"                                 # del manifest si existe
---
```

Cuerpo:
- `sources[0]` es la fuente canónica: su contenido se convierte completo (sin el H1).
- `sources[1..]` son páginas duplicadas que se fusionan: añadir SOLO las secciones/párrafos con
  información sustantiva que NO esté ya cubierta por la canónica, bajo sus encabezados originales.
  Nunca duplicar párrafos casi idénticos. Si la duplicada no aporta nada nuevo, ignórala.
- Los `.body.html` traen markup del tema Bootstrap (`<div class="row">`, `col-md-*`, etc.):
  extraer solo el contenido semántico (encabezados, párrafos, listas, imágenes).
- Bloques de "contacto"/"formulario" embebidos al final de la página original: ELIMINAR
  (el layout ya añade CTA de conversión).
- Si el original repite el mismo bloque dos veces (slider duplicado del tema), inclúyelo UNA vez.

## Verificación (antes de terminar)

- El archivo no contiene: `wp-content`, `<div`, `<span`, `style=`, `class=`, `[vc_`, `<script`.
- El frontmatter es YAML válido (comillas en strings con `:` o comillas internas escapadas).
- Los enlaces internos existen en el mapa del sitio (ver ARCHITECTURE.md) o son destinos de redirect.
- El texto quedó completo comparado con la fuente (mismo número aproximado de párrafos/secciones).
