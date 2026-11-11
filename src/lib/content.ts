import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;
export type Note = CollectionEntry<'notes'>;

// 本地开发时把草稿也渲染出来，方便预览；正式构建时自动隐藏草稿。
const SHOW_DRAFTS = import.meta.env.DEV;

export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => SHOW_DRAFTS || !data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getNotes(): Promise<Note[]> {
  const notes = await getCollection('notes', ({ data }) => SHOW_DRAFTS || !data.draft);
  return notes.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export type TimelineItem = {
  type: 'post' | 'note';
  href: string;
  title: string;
  date: Date;
};

// 首页把长文和短笔记混排成一条时间线
export async function getTimeline(): Promise<TimelineItem[]> {
  const [posts, notes] = await Promise.all([getPosts(), getNotes()]);
  const items: TimelineItem[] = [
    ...posts.map((p) => ({
      type: 'post' as const,
      href: `/posts/${p.id}/`,
      title: p.data.title,
      date: p.data.date,
    })),
    ...notes.map((n) => ({
      type: 'note' as const,
      href: `/notes/${n.id}/`,
      title: noteTitle(n),
      date: n.data.date,
    })),
  ];
  return items.sort((a, b) => b.date.getTime() - a.date.getTime());
}

// 笔记可以不起标题，取正文第一行当标题显示
export function noteTitle(note: Note): string {
  if (note.data.title) return note.data.title;
  const firstLine =
    (note.body ?? '')
      .split('\n')
      .map((line) => line.trim())
      .find((line) => line.length > 0) ?? '';

  const clean = firstLine
    .replace(/^#{1,6}\s+/, '')
    .replace(/[*_`>]/g, '')
    .trim();

  if (!clean) return '无标题笔记';
  return clean.length > 28 ? `${clean.slice(0, 28)}…` : clean;
}

// 统一按北京时间输出，避免部署环境时区不同导致日期差一天
export function isoDate(date: Date): string {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function displayDate(date: Date): string {
  return isoDate(date).replaceAll('-', '.');
}

export function readingTime(body = ''): number {
  const cjk = (body.match(/[\u4e00-\u9fa5]/g) ?? []).length;
  const words = (body.match(/[a-zA-Z0-9]+/g) ?? []).length;
  return Math.max(1, Math.round(cjk / 300 + words / 200));
}

export type TagCount = { tag: string; count: number };

export async function getTagCounts(): Promise<TagCount[]> {
  const [posts, notes] = await Promise.all([getPosts(), getNotes()]);
  const map = new Map<string, number>();

  for (const entry of [...posts, ...notes]) {
    for (const tag of entry.data.tags) {
      map.set(tag, (map.get(tag) ?? 0) + 1);
    }
  }

  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh'));
}

export async function getEntriesByTag(tag: string): Promise<TimelineItem[]> {
  const [posts, notes] = await Promise.all([getPosts(), getNotes()]);

  const items: TimelineItem[] = [
    ...posts
      .filter((post) => post.data.tags.includes(tag))
      .map((post) => ({
        type: 'post' as const,
        href: `/posts/${post.id}/`,
        title: post.data.title,
        date: post.data.date,
      })),
    ...notes
      .filter((note) => note.data.tags.includes(tag))
      .map((note) => ({
        type: 'note' as const,
        href: `/notes/${note.id}/`,
        title: noteTitle(note),
        date: note.data.date,
      })),
  ];

  return items.sort((a, b) => b.date.getTime() - a.date.getTime());
}
