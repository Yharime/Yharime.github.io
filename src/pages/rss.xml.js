import rss from '@astrojs/rss';
import { getPosts } from '../lib/content';
import { SITE } from '../consts';

export async function GET(context) {
  const posts = await getPosts();

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/posts/${post.id}/`,
    })),
    customData: '<language>zh-CN</language>',
  });
}
