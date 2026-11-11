# 学习档案

一个用 Astro 搭建的个人学习记录站，部署在 GitHub Pages。主要给作者自己看，所以只保留了最必要的东西：时间线、文章页、标签页、RSS。

技术栈：Astro 7 + Markdown 内容集合 + GitHub Actions 自动部署。没有数据库、没有后端、没有第三方服务。

---

## 一、上手前先改两处

| 改什么 | 在哪 | 说明 |
| --- | --- | --- |
| 站点地址 | `astro.config.mjs` 里的 `site` | 把 `YOURNAME` 换成你的 GitHub 用户名 |
| 站点名称 | `src/consts.ts` | 标题、简介、作者名 |

如果你的仓库名**就是** `<你的用户名>.github.io`，除了这两处不用再改任何东西。

## 二、本地预览

```bash
npm install     # 第一次才需要
npm run dev     # 然后打开 http://localhost:4321
```

改了文件浏览器会自动刷新。按 `Ctrl+C` 停止。

## 三、写内容

只有两个地方要记：

```
src/content/posts/   长文（一个主题写完整的东西）
src/content/notes/   短笔记（一段话、一个坑、一个想法）
```

### 长文模板

文件名用英文 slug，**不要带日期**，因为它会变成网址的一部分，写错了以后改不了：

`src/content/posts/my-first-post.md`

```markdown
---
title: 文章标题
description: 一句话摘要，会出现在搜索结果和 RSS 里
date: 2026-11-11
tags: ['标签一', '标签二']
draft: false
---

正文从这里开始，用 ## 做小标题。
```

### 短笔记模板

文件名建议带日期，方便排序：

`src/content/notes/2026-11-11-some-discovery.md`

```markdown
---
date: 2026-11-11
tags: ['Git']
---

正文。标题可以不写，会自动取第一行。
```

### 字段说明

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | 长文必填 | 短笔记可省略 |
| `description` | 否 | 摘要，不填就是空 |
| `date` | 是 | 写 `2026-11-11` 就行，日期按北京时间显示 |
| `tags` | 否 | 数组，标签名里不要用 `/` |
| `draft` | 否 | `true` 时只在本地可见，正式构建会跳过 |

### 图片

放进 `public/images/`，然后 `![](/images/文件名.png)` 引用。

### 公式

支持 `$行内公式$` 和 `$$块级公式$$`。语法参考 `src/content/posts/markdown-syntax.md`。

## 四、发布上线

只需要做一次：

1. 在 GitHub 新建仓库，名字填 `<你的用户名>.github.io`（必须完全一致）。**不要勾选** "Add a README"、".gitignore" 这些初始化选项，否则推送时会冲突。
2. 把本项目推上去（下面命令里的尖括号是占位符说明，**真正执行时要把尖括号删掉**，否则 bash 会把它当成重定向符号报错）：

```bash
git init
git add -A
git commit -m "init"
git branch -M main
git remote add origin https://github.com/你的用户名/你的用户名.github.io.git
git push -u origin main
```

3. 打开仓库 **Settings → Pages**，把 **Source** 改成 **GitHub Actions**（这一步不做，部署一定失败）。
4. 等一分钟，看仓库的 **Actions** 标签页变成绿色，访问 `https://<你的用户名>.github.io`。

### 以后每次更新

```bash
git add -A
git commit -m "add: 新文章"
git push
```

推送完自动构建部署，不用管别的。

## 五、常见问题

**日期差一天？** 已经在代码里固定成北京时间渲染，不会再出现。如果还差，检查 front matter 里的 `date` 有没有写错。

**部署失败提示找不到 package-lock.json？** 本地跑一次 `npm install` 把它提交上去。

**仓库名不想用 username.github.io？** 那就要在 `astro.config.mjs` 里加一行 `base: '/仓库名'`，否则样式会全丢。

**想换域名？** 把 `site` 改成新域名，在 `public/` 放一个 `CNAME` 文件写上域名即可。

**标签页 404？** 标签名里不能有 `/` 和 `#`。

## 六、不要手动改的部分

`src/pages/`、`src/components/`、`src/layouts/`、`src/styles/` 这几个目录是页面结构和样式，想调整版式告诉我，别自己改，容易连锁出错。

日常写作只碰 `src/content/` 和 `src/consts.ts` 就够。

## 七、目录结构

```
astro.config.mjs          站点配置（site 地址、Markdown 插件）
src/consts.ts             站点名称、简介、作者
src/content.config.ts     内容字段的校验规则
src/content/posts/        长文
src/content/notes/        短笔记
src/lib/content.ts        排序、日期格式化、标签统计
src/pages/                页面路由
  index.astro               首页时间线
  posts/[...id].astro       文章详情
  notes/[...id].astro       笔记详情
  tags/index.astro          标签总览
  tags/[tag].astro          单个标签下的内容
  about.astro               关于页
  rss.xml.js                RSS 输出
src/styles/global.css     全站样式
public/favicon.svg        网站图标
public/images/            放图片（自己建这个目录）
.github/workflows/deploy.yml  自动部署
```
