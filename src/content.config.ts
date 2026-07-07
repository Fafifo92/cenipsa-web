import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

/** Entradas del blog — contenido íntegro migrado de WordPress. */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    /** Categorías-keyword heredadas de WP (se muestran como etiquetas). */
    categories: z.array(z.string()).default([]),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    focusKeyword: z.string().optional(),
  }),
});

/** Páginas de servicios, landings SEO y contenido profundo. */
const paginas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/paginas' }),
  schema: z.object({
    title: z.string(),
    /** <title> SEO (si difiere del H1). */
    seoTitle: z.string().optional(),
    description: z.string(),
    /** service: página de servicio · landing: SEO local · info: institucional/recurso · legal */
    type: z.enum(['service', 'landing', 'info', 'legal']),
    eyebrow: z.string().optional(),
    focusKeyword: z.string().optional(),
    updatedDate: z.coerce.date().optional(),
    /** Enlaces relacionados que se muestran al final de la página. */
    related: z
      .array(z.object({ label: z.string(), href: z.string() }))
      .default([]),
    /** Orden para listados (índice de servicios). */
    order: z.number().default(99),
    /** Icono para tarjetas de servicio (nombre del set interno). */
    icon: z.string().optional(),
  }),
});

/** Preguntas frecuentes estructuradas (alimentan acordeón + FAQPage schema). */
const faq = defineCollection({
  loader: file('./src/content/faq/faq.json'),
  schema: z.object({
    id: z.string(),
    question: z.string(),
    /** HTML curado propio. */
    answer: z.string(),
    order: z.number(),
  }),
});

export const collections = { blog, paginas, faq };
