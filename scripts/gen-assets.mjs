/**
 * Genera los activos raster de marca: og-default.jpg (1200×630),
 * apple-touch-icon.png (180), icon-192.png, icon-512.png y logo-cenipsa.png.
 * Uso: node scripts/gen-assets.mjs
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

mkdirSync('public/images', { recursive: true });

const fingerprint = (scale = 1, x = 0, y = 0, color = '#2993aa', width = 2.5) => `
  <g transform="translate(${x} ${y}) scale(${scale})" stroke="${color}" stroke-width="${width}" stroke-linecap="round" fill="none">
    <path d="M100 28c-42 0-70 30-70 68 0 26-4 48-12 68"/>
    <path d="M100 48c-30 0-50 22-50 48 0 30-3 54-10 74"/>
    <path d="M100 68c-19 0-30 14-30 28 0 34-2 58-8 78"/>
    <path d="M100 88c-7 0-10 4-10 8 0 38-2 60-6 80"/>
    <path d="M100 28c42 0 70 30 70 68 0 26 4 48 12 68" opacity=".55"/>
    <path d="M100 48c30 0 50 22 50 48 0 30 3 54 10 74" opacity=".55"/>
    <path d="M100 68c19 0 30 14 30 28 0 34 2 58 8 78" opacity=".55"/>
    <path d="M100 88c7 0 10 4 10 8 0 38 2 60 6 80" opacity=".55"/>
    <path d="M100 108v68" opacity=".8"/>
  </g>`;

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <radialGradient id="glow1" cx="20%" cy="0%" r="80%">
      <stop offset="0%" stop-color="#2993aa" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#2993aa" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="95%" cy="100%" r="70%">
      <stop offset="0%" stop-color="#c19a2e" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#c19a2e" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#0a141e"/>
  <rect width="1200" height="630" fill="url(#glow1)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>
  ${fingerprint(2.6, 780, 30, '#2993aa', 2.2)}
  <g transform="translate(90 200)">
    <path d="M60 21A30 30 0 1 0 60 75" stroke="#fbfaf7" stroke-width="7" stroke-linecap="round" fill="none"/>
    ${fingerprint(0.42, 24, 6, '#45afc4', 5)}
  </g>
  <text x="90" y="352" font-family="Georgia, serif" font-size="76" font-weight="600" fill="#fbfaf7">CENIPSA</text>
  <text x="90" y="404" font-family="Segoe UI, Arial, sans-serif" font-size="27" letter-spacing="10" fill="#80cedb">INVESTIGADORES &amp; ABOGADOS</text>
  <rect x="90" y="446" width="64" height="4" rx="2" fill="#c19a2e"/>
  <text x="90" y="502" font-family="Segoe UI, Arial, sans-serif" font-size="30" fill="#c9d8e4">Inteligencia Investigativa · Encontramos la verdad</text>
  <text x="90" y="546" font-family="Segoe UI, Arial, sans-serif" font-size="24" fill="#6a90ac">Bogotá · Medellín · Cali · Colombia</text>
</svg>`;

const icon = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 48 48">
  <rect width="48" height="48" rx="10" fill="#0a141e"/>
  <path d="M30 10.5A15 15 0 1 0 30 37.5" stroke="#fbfaf7" stroke-width="3.4" stroke-linecap="round" fill="none"/>
  <g stroke="#2993aa" stroke-width="1.9" stroke-linecap="round" fill="none">
    <path d="M33 20.2c2.9 0 5.3 2.3 5.3 5.2 0 2.1-.2 4.2-.7 6.1"/>
    <path d="M33 24c.9 0 1.6.7 1.6 1.5 0 2.6-.3 5.1-1 7.4"/>
    <path d="M29.4 25.5c0-2 1.6-3.7 3.6-3.7"/>
    <path d="M29.4 29.2c0 2.4-.3 4.3-.8 6" opacity=".65"/>
    <path d="M36.9 22.4a8.9 8.9 0 0 1 1.5 5" opacity=".65"/>
  </g>
</svg>`;

// logo horizontal para JSON-LD
const logo = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="200">
  <rect width="600" height="200" fill="#0a141e" rx="16"/>
  <g transform="translate(40 40)">
    <path d="M60 21A30 30 0 1 0 60 75" stroke="#fbfaf7" stroke-width="7" stroke-linecap="round" fill="none"/>
    ${fingerprint(0.42, 24, 6, '#45afc4', 5)}
  </g>
  <text x="180" y="105" font-family="Georgia, serif" font-size="52" font-weight="600" fill="#fbfaf7">CENIPSA</text>
  <text x="182" y="142" font-family="Segoe UI, Arial, sans-serif" font-size="17" letter-spacing="6" fill="#80cedb">INVESTIGADORES &amp; ABOGADOS</text>
</svg>`;

await sharp(Buffer.from(og)).jpeg({ quality: 88 }).toFile('public/images/og-default.jpg');
await sharp(Buffer.from(icon(180))).resize(180, 180).png().toFile('public/apple-touch-icon.png');
await sharp(Buffer.from(icon(192))).resize(192, 192).png().toFile('public/icon-192.png');
await sharp(Buffer.from(icon(512))).resize(512, 512).png().toFile('public/icon-512.png');
await sharp(Buffer.from(logo)).png().toFile('public/images/logo-cenipsa.png');
console.log('Activos generados: og-default.jpg, apple-touch-icon.png, icon-192/512.png, logo-cenipsa.png');
