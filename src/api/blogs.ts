// 博客接口：增删改查
import { STORAGE_KEYS, delay, readJSON, writeJSON, uid } from './db';
import { seedBlogs } from './seed';
import type { BlogPost } from '@/types';

/** 新建 / 更新文章时传入的数据（id 与时间戳由接口层维护） */
export type BlogInput = Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>;

export const blogsApi = {
  /** 获取文章列表（按更新时间倒序） */
  async list(): Promise<BlogPost[]> {
    await delay(150);
    const blogs = readJSON<BlogPost[] | null>(STORAGE_KEYS.blogs, null);
    if (!blogs) {
      writeJSON(STORAGE_KEYS.blogs, seedBlogs);
      return [...seedBlogs];
    }
    return [...blogs].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  },

  /** 根据 slug 获取文章 */
  async getBySlug(slug: string): Promise<BlogPost> {
    await delay(150);
    const blogs = await blogsApi.list();
    const post = blogs.find((b) => b.slug === slug);
    if (!post) throw new Error('文章不存在');
    return post;
  },

  /** 新增文章 */
  async create(input: BlogInput): Promise<BlogPost> {
    await delay(200);
    const blogs = await blogsApi.list();
    const now = new Date().toISOString();
    const post: BlogPost = {
      ...input,
      id: uid(),
      createdAt: now,
      updatedAt: now,
    };
    writeJSON(STORAGE_KEYS.blogs, [post, ...blogs]);
    return post;
  },

  /** 更新文章 */
  async update(id: string, input: BlogInput): Promise<BlogPost> {
    await delay(200);
    const blogs = await blogsApi.list();
    const index = blogs.findIndex((b) => b.id === id);
    if (index === -1) throw new Error('文章不存在');
    const updated: BlogPost = {
      ...blogs[index],
      ...input,
      id,
      updatedAt: new Date().toISOString(),
    };
    blogs[index] = updated;
    writeJSON(STORAGE_KEYS.blogs, blogs);
    return updated;
  },

  /** 删除文章 */
  async remove(id: string): Promise<void> {
    await delay(200);
    const blogs = await blogsApi.list();
    writeJSON(
      STORAGE_KEYS.blogs,
      blogs.filter((b) => b.id !== id),
    );
  },
};
