// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { redirects } from './redirects.config.mjs';

const SITE = 'https://exquisite-crostata-a53a97.netlify.app';

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
 * Integración mínima: emite `_redirects` (Netlify/Cloudflare Pages) en dist/
 * a partir de redirects.config.mjs, para 301 reales en producción.
 */
function emitRedirectsFile() {
  return {
    name: 'emit-redirects-file',
    hooks: {
      /** @param {{ dir: URL }} params */
      'astro:build:done': ({ dir }) => {
        const lines = Object.entries(redirects).map(([from, to]) => `${from}/ ${to}/ 301`);
        // variantes sin slash final también cubiertas
        const bare = Object.entries(redirects).map(([from, to]) => `${from} ${to}/ 301`);
        writeFileSync(join(dir.pathname.replace(/^\/([A-Za-z]:)/, '$1'), '_redirects'), [...lines, ...bare, ''].join('\n'), 'utf8');
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
    emitRedirectsFile(),
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
