---
title: 换个框架后，URL 为什么会大面积失效
description: 从一次主题迁移说起：slug 是一次性资产，主题是消耗品。
date: 2026-11-05
tags: ['Astro', '工程实践']
draft: false
---

一句话结论：**文章路径属于内容，不属于主题。** 一旦把「路径由主题决定」和「路径由内容决定」混在一起，换主题就等于把外链全部作废。

## 常见的两种路径策略

| 策略 | 例子 | 换主题后 |
| --- | --- | --- |
| 带日期目录 | `/2026/11/05/hello/` | 通常还能保留，但迁移工具容易漏 |
| 固定 slug | `/posts/hello/` | 稳定，最省心 |

第二种更值得选。代价是你得自己想 slug，好处是它从此不再变化。

## 关键点：文件名就是路径

在 Astro 的内容集合里，`src/content/posts/hello.md` 里的 `hello` 就是 entry 的 `id`，路由里直接用它：

```astro
export async function getStaticPaths() {
  const posts = await getPosts();
  return posts.map((post) => ({ params: { id: post.id }, props: { post } }));
}
```

所以**不要在文件名里塞日期**（除非那篇笔记本身就是按日期组织的）。日期应该放在 front matter 里，让展示层去格式化。

## 顺手记一下时区问题

`date: 2026-11-05` 在构建时会被解析成 UTC 零点。如果服务器时区是西半球，展示出来就会变成前一天。解决办法是渲染时固定时区：

```ts
new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Asia/Shanghai',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})
```

`sv-SE` 这个 locale 会直接输出 `2026-11-05` 这种格式，比手动拼字符串可靠。
