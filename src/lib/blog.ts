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
