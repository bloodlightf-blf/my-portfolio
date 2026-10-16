// 项目管理：Markdown 编辑器带实时预览。
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import MDEditor from '@uiw/react-md-editor';
import { projectsApi, type ProjectInput } from '@/api/projects';
import type { Project } from '@/types';
import { parseTags } from '@/utils/format';
import Modal from './components/Modal';
import ConfirmDialog from './components/ConfirmDialog';

const schema = z.object({
  title: z.string().min(1, '请输入项目名称'),
  description: z.string(),
  cover: z.string(),
  tech: z.string(),
  demoUrl: z.string(),
  repoUrl: z.string(),
  featured: z.boolean(),
  content: z.string(),
});

type ProjectForm = z.infer<typeof schema>;

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState<Project | null>(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      cover: '',
      tech: '',
      demoUrl: '',
      repoUrl: '',
      featured: false,
      content: '',
    },
  });

  const load = () =>
    projectsApi.list().then((list) => {
      setProjects(list);
      setLoading(false);
    });

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    reset({
      title: '',
      description: '',
      cover: '',
      tech: '',
      demoUrl: '',
      repoUrl: '',
      featured: false,
      content: '',
    });
    setOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditing(project);
    reset({
      title: project.title,
      description: project.description,
      cover: project.cover,
      tech: project.tech.join(', '),
      demoUrl: project.demoUrl,
      repoUrl: project.repoUrl,
      featured: project.featured,
      content: project.content,
    });
    setOpen(true);
  };

  const onSubmit = async (values: ProjectForm) => {
    const input: ProjectInput = {
      title: values.title,
      description: values.description,
      cover: values.cover,
      tech: parseTags(values.tech),
      demoUrl: values.demoUrl,
      repoUrl: values.repoUrl,
      featured: values.featured,
      content: values.content,
    };
    if (editing) {
      await projectsApi.update(editing.id, input);
    } else {
      await projectsApi.create(input);
    }
    setOpen(false);
    load();
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeletingLoading(true);
    await projectsApi.remove(deleting.id);
    setDeletingLoading(false);
    setDeleting(null);
    load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">项目管理</h2>
        <button type="button" className="btn-primary px-4 py-2" onClick={openCreate}>
          + 新增项目
        </button>
      </div>

      {loading ? (
        <p className="text-slate-500">加载中...</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-800 bg-slate-900/40">
              <tr className="text-left text-slate-400">
                <th className="px-4 py-3">项目名称</th>
                <th className="px-4 py-3">技术标签</th>
                <th className="px-4 py-3">精选</th>
                <th className="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-slate-800 last:border-0">
                  <td className="px-4 py-3 font-medium">{project.title}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {project.tech.map((t) => (
                        <span key={t} className="rounded bg-slate-800 px-2 py-0.5 text-xs text-cyan-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">{project.featured ? '⭐ 是' : '否'}</td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" className="text-indigo-400 hover:text-indigo-300" onClick={() => openEdit(project)}>
                      编辑
                    </button>
                    <button type="button" className="ml-3 text-red-400 hover:text-red-300" onClick={() => setDeleting(project)}>
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={open} title={editing ? '编辑项目' : '新增项目'} onClose={() => setOpen(false)} wide>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">项目名称</label>
            <input className="input" {...register('title')} />
            {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
          </div>

          <div>
            <label className="label">短描述</label>
            <textarea className="input min-h-20" {...register('description')} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">封面地址（URL）</label>
              <input className="input" placeholder="留空则使用渐变占位" {...register('cover')} />
            </div>
            <div>
              <label className="label">技术标签（逗号分隔）</label>
              <input className="input" placeholder="React, TypeScript" {...register('tech')} />
            </div>
            <div>
              <label className="label">演示地址</label>
              <input className="input" {...register('demoUrl')} />
            </div>
            <div>
              <label className="label">源码地址</label>
              <input className="input" {...register('repoUrl')} />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" className="h-4 w-4 accent-indigo-500" {...register('featured')} />
            设为精选项目（前台展示）
          </label>

          <div>
            <label className="label">详细说明（Markdown，实时预览）</label>
            <div data-color-mode="dark">
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <MDEditor value={field.value} onChange={(v) => field.onChange(v || '')} height={300} />
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
        title="删除项目"
        message={`确定要删除「${deleting?.title}」吗？此操作不可撤销。`}
        loading={deletingLoading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
