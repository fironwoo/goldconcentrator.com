import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../lib/site';

export async function GET(context: { site?: URL }) {
  const articles = (await getCollection('knowledge')).sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf(),
  );

  return rss({
    title: `${SITE.name} Knowledge`,
    description: SITE.description,
    site: context.site ?? new URL(SITE.origin),
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.publishedAt,
      link: `/knowledge/${article.id}/`,
    })),
  });
}
