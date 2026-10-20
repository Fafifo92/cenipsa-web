// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { appendFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { redirects, legalDomainRedirects, LEGAL_DOMAIN, LEGAL_DOMAIN_FALLBACK } from './redirects.config.mjs';

/**
 * Dominio canónico de producción: canonical, hreflang, JSON-LD y sitemap
 * apuntan SIEMPRE aquí, también en staging (evita que el sitemap publique
 * URLs *.netlify.app). SITE_URL solo para pruebas puntuales.
 */
const SITE = process.env.SITE_URL ?? 'https://www.inteligenciainvestigativa.com';

/**
 * Staging = cualquier build que no se sirve desde el dominio de producción.
 * Netlify expone URL (dominio principal del sitio) y CONTEXT. En staging se
 * emite X-Robots-Tag: noindex y un robots.txt que bloquea el rastreo.
 * Se puede forzar con STAGING=true / STAGING=false.
 */
const IS_STAGING =
  process.env.STAGING != null
    ? process.env.STAGING === 'true'
    : Boolean(process.env.NETLIFY) &&
      (process.env.CONTEXT !== 'production' || !String(process.env.URL ?? '').includes('inteligenciainvestigativa.com'));

/**
 * Rehype plugin para imágenes de markdown: loading="lazy" + decoding="async"
 * y width/height reales (evita CLS) leyendo el archivo de public/ con sharp.
 */
function rehypeLazyImages() {
  /** @type {Map<string, {width?: number, height?: number}>} */
  const dimensionCache = new Map();

  /** @param {any} tree */
  return async (tree) => {
    /** @type {any[]} */
    const images = [];
    const visit = (/** @type {any} */ node) => {
      if (node.type === 'element' && node.tagName === 'img') images.push(node);
      if (node.children) node.children.forEach(visit);
    };
    visit(tree);

    for (const node of images) {
      node.properties ??= {};
      node.properties.loading ??= 'lazy';
      node.properties.decoding ??= 'async';

      const src = String(node.properties.src ?? '');
      if (!src.startsWith('/images/') || (node.properties.width && node.properties.height)) continue;
      if (!dimensionCache.has(src)) {
        try {
          const { default: sharp } = await import('sharp');
          const filePath = join(process.cwd(), 'public', decodeURIComponent(src));
          const meta = await sharp(filePath).metadata();
          dimensionCache.set(src, { width: meta.width, height: meta.height });
        } catch (err) {
          console.warn(`[rehype-lazy-images] sin dimensiones para ${src}: ${err instanceof Error ? err.message : err}`);
          dimensionCache.set(src, {});
        }
      }
      const dims = dimensionCache.get(src) ?? {};
      if (dims.width && dims.height) {
        node.properties.width ??= dims.width;
        node.properties.height ??= dims.height;
      }
    }
  };
}

/** Rutas que no deben aparecer en el sitemap (noindex o utilitarias). */
const NOINDEX_PATHS = new Set([`${SITE}/gracias/`, `${SITE}/en/thank-you/`, `${SITE}/404/`]);

/**
 * Integración mínima de hosting (Netlify/Cloudflare Pages), en dist/:
 * - `_redirects`: 301 por host desde el dominio jurídico antiguo hacia la
 *   sección equivalente de este sitio + 301 internos (redirects.config.mjs).
 * - En staging: X-Robots-Tag noindex en `_headers` y robots.txt bloqueante.
 */
function emitHostingFiles() {
  return {
    name: 'emit-hosting-files',
    hooks: {
      /** @param {{ dir: URL }} params */
      'astro:build:done': ({ dir }) => {
        const out = dir.pathname.replace(/^\/([A-Za-z]:)/, '$1');
        const lines = Object.entries(redirects).map(([from, to]) => `${from}/ ${to}/ 301`);
        // variantes sin slash final también cubiertas
        const bare = Object.entries(redirects).map(([from, to]) => `${from} ${to}/ 301`);

        // Dominio antiguo (con y sin www): reglas por host, forzadas (`!`).
        const legal = [];
        for (const host of [LEGAL_DOMAIN, `www.${LEGAL_DOMAIN}`]) {
          for (const [from, to] of Object.entries(legalDomainRedirects)) {
            const target = `${SITE}${to}`;
            if (from === '/' || from.endsWith('*')) legal.push(`https://${host}${from} ${target} 301!`);
            else legal.push(`https://${host}${from}/ ${target} 301!`, `https://${host}${from} ${target} 301!`);
          }
          legal.push(`https://${host}/* ${SITE}${LEGAL_DOMAIN_FALLBACK} 301!`);
        }

        writeFileSync(join(out, '_redirects'), [...legal, ...lines, ...bare, ''].join('\n'), 'utf8');

        if (IS_STAGING) {
          appendFileSync(join(out, '_headers'), '\n/*\n  X-Robots-Tag: noindex, nofollow\n', 'utf8');
          writeFileSync(join(out, 'robots.txt'), 'User-agent: *\nDisallow: /\n', 'utf8');
          console.log('[hosting] build de STAGING: noindex + robots.txt bloqueante');
        }
      },
    },
  };
}

export default defineConfig({
  site: SITE,
  output: 'static',
  server: { port: process.env.PORT ? Number(process.env.PORT) : 4321 },
  trailingSlash: 'always',
  redirects: Object.fromEntries(
    Object.entries(redirects).map(([from, to]) => [from, { status: 301, destination: to }])
  ),
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      // Excluye páginas noindex y todo el blog EN (canonical → versión ES).
      filter: (page) => !NOINDEX_PATHS.has(page) && !page.includes('/en/blog/'),
      changefreq: 'weekly',
      priority: 0.7,
      serialize(item) {
        if (item.url === `${SITE}/`) return { ...item, priority: 1.0, changefreq: 'weekly' };
        if (item.url.includes('/blog/')) return { ...item, priority: 0.6, changefreq: 'monthly' };
        return item;
      },
    }),
    emitHostingFiles(),
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Scripts SIEMPRE como archivos externos: la CSP solo permite 'self'
      // más el hash del único script inline de BaseHead (sin 'unsafe-inline').
      assetsInlineLimit: 0,
    },
  },
  markdown: {
    rehypePlugins: [rehypeLazyImages],
  },
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
