// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { redirects } from './redirects.config.mjs';

const SITE = 'https://www.inteligenciainvestigativa.com';

/**
 * Rehype plugin: loading="lazy" + decoding="async" en imágenes de markdown
 * (las de contenido migrado van bajo el pliegue).
 */
function rehypeLazyImages() {
  /** @param {any} tree */
  return (tree) => {
    const visit = (/** @type {any} */ node) => {
      if (node.type === 'element' && node.tagName === 'img') {
        node.properties ??= {};
        node.properties.loading ??= 'lazy';
        node.properties.decoding ??= 'async';
      }
      if (node.children) node.children.forEach(visit);
    };
    visit(tree);
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
      filter: (page) => !NOINDEX_PATHS.has(page),
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
  },
  markdown: {
    rehypePlugins: [rehypeLazyImages],
  },
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
