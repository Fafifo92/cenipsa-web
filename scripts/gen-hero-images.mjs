/**
 * Genera variantes responsivas AVIF/WebP de las fotos de hero (public/images/*.jpg)
 * en public/images/hero/<nombre>-<ancho>.<formato>. Las consume <HeroImage />.
 * Ejecutar tras añadir o cambiar una foto de hero:  node scripts/gen-hero-images.mjs
 */
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/** Fotos de hero. Las de servicios/áreas son de Unsplash (licencia libre, uso comercial; ver docs/fotos.md). */
export const HERO_IMAGES = [
  'plaza-bolivar',
  'despacho-juridico',
  'bogota-edificios',
  'nosotros-equipo',
  'garantias-acuerdo',
  'contacto-mundo',
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
    const base = sharp(input).resize({ width: w });
    await base.clone().avif({ quality: 50 }).toFile(join(root, 'hero', `${name}-${w}.avif`));
    await base.clone().webp({ quality: 72 }).toFile(join(root, 'hero', `${name}-${w}.webp`));
  }
  manifest[name] = { widths, width: srcWidth, height: srcHeight };
  console.log(`✓ ${name} (${widths.join(', ')})`);
}

writeFileSync(
  join(import.meta.dirname, '..', 'src', 'lib', 'hero-images.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
