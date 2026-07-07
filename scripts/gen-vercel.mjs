/**
 * Genera vercel.json (headers de seguridad + redirects 301) a partir de
 * redirects.config.mjs y de la CSP definida en public/_headers.
 * Uso: node scripts/gen-vercel.mjs  (ejecutar tras cambiar redirects o CSP)
 */
import { writeFileSync, readFileSync } from 'node:fs';
import { redirects } from '../redirects.config.mjs';

const headersFile = readFileSync('public/_headers', 'utf8');
const csp = headersFile.match(/Content-Security-Policy: (.+)/)?.[1]?.trim();
if (!csp) throw new Error('CSP no encontrada en public/_headers');

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Content-Security-Policy', value: csp },
];

const vercel = {
  $schema: 'https://openapi.vercel.sh/vercel.json',
  cleanUrls: false,
  trailingSlash: true,
  redirects: Object.entries(redirects).map(([source, destination]) => ({
    source,
    destination: `${destination}/`,
    permanent: true,
  })),
  headers: [
    { source: '/(.*)', headers: securityHeaders },
    {
      source: '/(images|_astro|fonts)/(.*)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
  ],
};

writeFileSync('vercel.json', JSON.stringify(vercel, null, 2) + '\n', 'utf8');
console.log(`vercel.json generado: ${Object.keys(redirects).length} redirects, ${securityHeaders.length} headers`);
