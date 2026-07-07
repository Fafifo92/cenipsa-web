/**
 * Verifica que todos los enlaces internos del build apunten a páginas existentes
 * o a redirects definidos. Uso: node scripts/check-links.mjs (tras `npm run build`).
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { redirects } from '../redirects.config.mjs';

const DIST = 'dist';
const htmlFiles = [];
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.html')) htmlFiles.push(p);
  }
})(DIST);

const errors = [];
const checked = new Set();

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)[#?]?[^"]*"/g)) {
    const url = m[1];
    if (checked.has(url)) continue;
    checked.add(url);
    if (url.startsWith('//')) continue;
    const clean = url.replace(/\/$/, '');
    const candidates = [
      join(DIST, clean, 'index.html'),
      join(DIST, url),
      join(DIST, clean),
    ];
    const ok =
      url === '/' ||
      candidates.some((c) => existsSync(c)) ||
      clean in redirects;
    if (!ok) errors.push(url);
  }
}

if (errors.length) {
  console.error(`✗ ${errors.length} enlaces internos rotos:`);
  errors.sort().forEach((e) => console.error(`  ${e}`));
  process.exit(1);
}
console.log(`✓ ${checked.size} URLs internas verificadas en ${htmlFiles.length} páginas — sin enlaces rotos`);
