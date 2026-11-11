import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// 站点地址：GitHub Pages 的域名一律是小写，这里也保持小写。
// 绑定自定义域名时改成 'https://你的域名' 即可，其他不用动。
export default defineConfig({
  site: 'https://yharime.github.io',
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
