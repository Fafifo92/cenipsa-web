/**
 * Genera variantes responsivas AVIF/WebP de las fotos de hero (public/images/*.jpg)
 * en public/images/hero/<nombre>-<ancho>.<formato>. Las consume <HeroImage />.
 * Ejecutar tras añadir o cambiar una foto de hero:  node scripts/gen-hero-images.mjs
 * (las variantes existentes se reutilizan; --force las regenera todas).
 *
 * También mide la luminosidad media de la zona donde va el texto (55 % izquierdo)
 * → «lum» (0–1) en el manifiesto: <PageHero /> la usa para elegir un velo más
 * denso en fotos claras y que el texto blanco nunca se pierda.
 */
import sharp from 'sharp';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/** Fotos de hero. Las de servicios/áreas son de Unsplash (licencia libre, uso comercial; ver docs/fotos.md). */
export const HERO_IMAGES = [
  'plaza-bolivar',
  'hero-justicia',
  'hero-mazo',
  'hero-tablero',
  'hero-lupa',
  'hero-forense-digital',
  'despacho-juridico',
  'bogota-edificios',
  'nosotros-equipo',
  'nosotros-bogota',
  'garantias-acuerdo',
  'contacto-mundo',
  'contacto-red-global',
  'blog-cenipsa-auditoria',
  'cenipsa-balanza',
  'servicio-asesoria-juridica',
  'servicio-investigacion-corporativa',
  'servicio-investigacion-personal',
  'servicio-ubicacion-personas',
  'servicio-criminalistica',
  'servicio-auditoria-forense',
  'servicio-ciberseguridad',
  'servicio-barrido-electronico',
  'servicio-monitoreo-gps',
  'servicio-estudios-seguridad',
  'servicio-abogados',
  'derecho-penal',
  'derecho-familia',
  'derecho-civil',
  'derecho-laboral',
  'derecho-comercial',
  'derecho-administrativo',
  'derecho-constitucional',
  'derecho-propiedad-intelectual',
];
export const HERO_WIDTHS = [640, 1024, 1600, 1920];

const FORCE = process.argv.includes('--force');
const root = join(import.meta.dirname, '..', 'public', 'images');
mkdirSync(join(root, 'hero'), { recursive: true });

/** Manifiesto { nombre: { widths, width, height } } para <HeroImage />. */
const manifest = {};

for (const name of HERO_IMAGES) {
  const input = join(root, `${name}.jpg`);
  const { width: srcWidth = 0, height: srcHeight = 0 } = await sharp(input).metadata();
  // Nunca escalar hacia arriba: anchos mayores que la original se sustituyen por la original.
  const widths = [...new Set(HERO_WIDTHS.map((w) => Math.min(w, srcWidth)))];
  for (const w of widths) {
    const avif = join(root, 'hero', `${name}-${w}.avif`);
    const webp = join(root, 'hero', `${name}-${w}.webp`);
    if (!FORCE && existsSync(avif) && existsSync(webp)) continue;
    const base = sharp(input).resize({ width: w });
    await base.clone().avif({ quality: 50 }).toFile(avif);
    await base.clone().webp({ quality: 72 }).toFile(webp);
  }
  const { channels } = await sharp(input)
    .extract({ left: 0, top: 0, width: Math.round(srcWidth * 0.55), height: srcHeight })
    .stats();
  const [r, g, b] = channels.map((c) => c.mean / 255);
  const lum = Math.round((0.2126 * r + 0.7152 * g + 0.0722 * b) * 100) / 100;
  manifest[name] = { widths, width: srcWidth, height: srcHeight, lum };
  console.log(`✓ ${name} (${widths.join(', ')}) lum=${lum}`);
}

writeFileSync(
  join(import.meta.dirname, '..', 'src', 'lib', 'hero-images.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
