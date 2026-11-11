import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// 只需要改这一处：把 YOURNAME 换成你的 GitHub 用户名。
// 如果以后绑定自定义域名，改成 'https://你的域名' 即可，其他不用动。
export default defineConfig({
  site: 'https://Yharime.github.io',
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});
