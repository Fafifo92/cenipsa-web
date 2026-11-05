import { getCollection, type CollectionEntry } from 'astro:content';

/** Posts del blog ordenados de más reciente a más antiguo. */
export async function allPosts(): Promise<CollectionEntry<'blog'>[]> {
  return (await getCollection('blog')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
}

/** Hasta 3 posts relacionados: priorizan categorías compartidas, rellenan con recientes. */
export async function relatedPosts(
  post: CollectionEntry<'blog'>,
  limit = 3
): Promise<CollectionEntry<'blog'>[]> {
  const posts = await allPosts();
  const shared = (p: CollectionEntry<'blog'>) =>
    p.data.categories.filter((c) => post.data.categories.includes(c)).length;
  return posts
    .filter((p) => p.id !== post.id)
    .sort((a, b) => shared(b) - shared(a))
    .slice(0, limit);
}

/**
 * Tema editorial de un post (para filtros y etiqueta de la tarjeta). Agrupa
 * las categorías heredadas de WordPress en pocos temas claros.
 */
export type BlogTopic = 'investigacion' | 'penal' | 'familia' | 'laboral' | 'empresas' | 'derechos' | 'tecnologia';

export const BLOG_TOPICS: Record<'es' | 'en', { id: BlogTopic; label: string }[]> = {
  es: [
    { id: 'investigacion', label: 'Investigación Privada' },
    { id: 'empresas', label: 'Empresas y Fraude' },
    { id: 'penal', label: 'Derecho Penal' },
    { id: 'familia', label: 'Familia y Sucesiones' },
    { id: 'laboral', label: 'Derecho Laboral' },
    { id: 'derechos', label: 'Derechos y Estado' },
    { id: 'tecnologia', label: 'Tecnología y GPS' },
  ],
  en: [
    { id: 'investigacion', label: 'Private Investigation' },
    { id: 'empresas', label: 'Business & Fraud' },
    { id: 'penal', label: 'Criminal Law' },
    { id: 'familia', label: 'Family & Estates' },
    { id: 'laboral', label: 'Labor Law' },
    { id: 'derechos', label: 'Rights & State' },
    { id: 'tecnologia', label: 'Technology & GPS' },
  ],
};

export function postTopic(post: CollectionEntry<'blog'>): BlogTopic {
  const c = post.data.categories.join(' ').toLowerCase();
  const t = `${post.data.title} ${c}`.toLowerCase();
  if (/gps|rastreo|satelital/.test(t)) return 'tecnologia';
  if (c.includes('derecho penal') || /penal|delito|suplantaci|fraude electr/.test(t)) return 'penal';
  if (c.includes('derecho de familia') || /familia|sucesi|herencia|divorcio|custodia|alimentar/.test(t)) return 'familia';
  if (c.includes('derecho laboral') || /laboral|despido|polígrafo|poligraf/.test(t)) return 'laboral';
  if (c.includes('derecho constitucional') || c.includes('derecho civil') || c.includes('propiedad intelectual') || /derechos fundamentales|conflicto armado|construcción/.test(t)) return 'derechos';
  if (c.includes('derecho comercial') || /empresa|corporativ|pymes|fraude|negocio|sociedad/.test(t)) return 'empresas';
  return 'investigacion';
}

/** Minutos estimados de lectura (≈ 200 palabras por minuto). */
export function readingMinutes(post: CollectionEntry<'blog'>): number {
  const words = (post.body ?? '').split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 200));
}
