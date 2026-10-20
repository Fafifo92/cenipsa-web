/**
 * Genera vercel.json (headers de seguridad + redirects 301) a partir de
 * redirects.config.mjs y de la CSP definida en public/_headers.
 * Uso: node scripts/gen-vercel.mjs  (ejecutar tras cambiar redirects o CSP)
 */
import { writeFileSync, readFileSync } from 'node:fs';
import { redirects, legalDomainRedirects, LEGAL_DOMAIN, LEGAL_DOMAIN_FALLBACK } from '../redirects.config.mjs';

const SITE = 'https://www.inteligenciainvestigativa.com';

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
  // Vercel hace matching estricto del path: hay que cubrir la forma con y sin
  // slash final (las URLs indexadas de WordPress usan slash final).
  redirects: [
    // Dominio jurídico antiguo: 301 por host hacia la sección equivalente.
    ...[LEGAL_DOMAIN, `www.${LEGAL_DOMAIN}`].flatMap((host) => [
      ...Object.entries(legalDomainRedirects).flatMap(([from, to]) => {
        const has = [{ type: 'host', value: host }];
        const destination = `${SITE}${to}`;
        if (from === '/') return [{ source: '/', has, destination, permanent: true }];
        const source = from.endsWith('/*') ? from.replace(/\/\*$/, '/:path*') : from;
        return [
          { source: `${source}/`, has, destination, permanent: true },
          { source, has, destination, permanent: true },
        ];
      }),
      { source: '/:path*', has: [{ type: 'host', value: host }], destination: `${SITE}${LEGAL_DOMAIN_FALLBACK}`, permanent: true },
    ]),
    ...Object.entries(redirects).flatMap(([source, destination]) => [
      { source: `${source}/`, destination: `${destination}/`, permanent: true },
      { source, destination: `${destination}/`, permanent: true },
    ]),
  ],
  headers: [
    { source: '/(.*)', headers: securityHeaders },
    {
      source: '/(images|_astro|fonts)/(.*)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
  ],
};

writeFileSync('vercel.json', JSON.stringify(vercel, null, 2) + '\n', 'utf8');
console.log(`vercel.json generado: ${vercel.redirects.length} reglas de redirect, ${securityHeaders.length} headers`);
