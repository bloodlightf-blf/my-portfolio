// 博客文章管理：Markdown 编辑器带实时预览，支持发布状态。
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import MDEditor from '@uiw/react-md-editor';
import { blogsApi, type BlogInput } from '@/api/blogs';
import type { BlogPost } from '@/types';
import { formatDate, parseTags, slugify } from '@/utils/format';
import Modal from './components/Modal';
import ConfirmDialog from './components/ConfirmDialog';

const schema = z.object({
  title: z.string().min(1, '请输入标题'),
  slug: z.string().min(1, '请输入 slug'),
  excerpt: z.string(),
  cover: z.string(),
  tags: z.string(),
  published: z.boolean(),
  content: z.string(),
});

type BlogForm = z.infer<typeof schema>;

export default function Blogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [deleting, setDeleting] = useState<BlogPost | null>(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BlogForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      cover: '',
      tags: '',
      published: true,
      content: '',
    },
  });

  const load = () =>
    blogsApi.list().then((list) => {
      setBlogs(list);
      setLoading(false);
    });

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    reset({ title: '', slug: '', excerpt: '', cover: '', tags: '', published: true, content: '' });
    setOpen(true);
  };

  const openEdit = (blog: BlogPost) => {
    setEditing(blog);
    reset({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      cover: blog.cover,
      tags: blog.tags.join(', '),
      published: blog.published,
      content: blog.content,
    });
    setOpen(true);
  };

  const generateSlug = () => {
    setValue('slug', slugify(getValues('title')), { shouldValidate: true });
  };

  const onSubmit = async (values: BlogForm) => {
    const input: BlogInput = {
      title: values.title,
      slug: values.slug,
      excerpt: values.excerpt,
      cover: values.cover,
      tags: parseTags(values.tags),
      published: values.published,
      content: values.content,
    };
    if (editing) {
      await blogsApi.update(editing.id, input);
    } else {
      await blogsApi.create(input);
    }
    setOpen(false);
    load();
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeletingLoading(true);
    await blogsApi.remove(deleting.id);
    setDeletingLoading(false);
    setDeleting(null);
    load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">博客文章管理</h2>
        <button type="button" className="btn-primary px-4 py-2" onClick={openCreate}>
          + 新增文章
        </button>
      </div>

      {loading ? (
        <p className="text-slate-500">加载中...</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-800 bg-slate-900/40">
              <tr className="text-left text-slate-400">
                <th className="px-4 py-3">标题</th>
                <th className="px-4 py-3">状态</th>
                <th className="px-4 py-3">标签</th>
                <th className="px-4 py-3">更新时间</th>
                <th className="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id} className="border-b border-slate-800 last:border-0">
                  <td className="px-4 py-3 font-medium">{blog.title}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-xs ${
                        blog.published ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-700/40 text-slate-400'
                      }`}
                    >
                      {blog.published ? '已发布' : '草稿'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {blog.tags.map((t) => (
                        <span key={t} className="rounded bg-slate-800 px-2 py-0.5 text-xs text-cyan-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{formatDate(blog.updatedAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" className="text-indigo-400 hover:text-indigo-300" onClick={() => openEdit(blog)}>
                      编辑
                    </button>
                    <button type="button" className="ml-3 text-red-400 hover:text-red-300" onClick={() => setDeleting(blog)}>
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={open} title={editing ? '编辑文章' : '新增文章'} onClose={() => setOpen(false)} wide>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">标题</label>
            <input className="input" {...register('title')} />
            {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
          </div>

          <div>
            <label className="label">Slug（URL 标识）</label>
            <div className="flex gap-2">
              <input className="input" {...register('slug')} />
              <button type="button" className="btn-ghost shrink-0 px-4 py-2" onClick={generateSlug}>
                从标题生成
              </button>
            </div>
            {errors.slug && <p className="mt-1 text-xs text-red-400">{errors.slug.message}</p>}
          </div>

          <div>
            <label className="label">摘要</label>
            <textarea className="input min-h-20" {...register('excerpt')} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">封面地址（URL）</label>
              <input className="input" placeholder="留空则使用渐变占位" {...register('cover')} />
            </div>
            <div>
              <label className="label">标签（逗号分隔）</label>
              <input className="input" placeholder="React, Hooks" {...register('tags')} />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" className="h-4 w-4 accent-indigo-500" {...register('published')} />
            发布（前台展示）
          </label>

          <div>
            <label className="label">正文（Markdown，实时预览）</label>
            <div data-color-mode="dark">
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <MDEditor value={field.value} onChange={(v) => field.onChange(v || '')} height={400} />
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-ghost px-4 py-2" onClick={() => setOpen(false)}>
              取消
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary px-4 py-2">
              {isSubmitting ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="删除文章"
        message={`确定要删除「${deleting?.title}」吗？此操作不可撤销。`}
        loading={deletingLoading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
