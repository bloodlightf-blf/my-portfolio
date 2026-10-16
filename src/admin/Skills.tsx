// 技能管理：增删改查。
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { skillsApi } from '@/api/skills';
import type { Skill } from '@/types';
import Modal from './components/Modal';
import ConfirmDialog from './components/ConfirmDialog';

const schema = z.object({
  name: z.string().min(1, '请输入技能名称'),
  icon: z.string().min(1, '请输入图标（emoji）'),
  category: z.string().min(1, '请输入分类'),
  level: z.coerce.number().min(0, '熟练度不能小于 0').max(100, '熟练度不能大于 100'),
});

type SkillForm = z.infer<typeof schema>;

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [deleting, setDeleting] = useState<Skill | null>(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SkillForm>({
    resolver: zodResolver(schema),
  });

  const load = () => skillsApi.list().then((list) => {
    setSkills(list);
    setLoading(false);
  });

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    reset({ name: '', icon: '', category: '', level: 80 });
    setOpen(true);
  };

  const openEdit = (skill: Skill) => {
    setEditing(skill);
    reset({ name: skill.name, icon: skill.icon, category: skill.category, level: skill.level });
    setOpen(true);
  };

  const onSubmit = async (values: SkillForm) => {
    if (editing) {
      await skillsApi.update(editing.id, values);
    } else {
      await skillsApi.create(values);
    }
    setOpen(false);
    load();
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeletingLoading(true);
    await skillsApi.remove(deleting.id);
    setDeletingLoading(false);
    setDeleting(null);
    load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">技能管理</h2>
        <button type="button" className="btn-primary px-4 py-2" onClick={openCreate}>
          + 新增技能
        </button>
      </div>

      {loading ? (
        <p className="text-slate-500">加载中...</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-800 bg-slate-900/40">
              <tr className="text-left text-slate-400">
                <th className="px-4 py-3">图标</th>
                <th className="px-4 py-3">名称</th>
                <th className="px-4 py-3">分类</th>
                <th className="px-4 py-3">熟练度</th>
                <th className="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill) => (
                <tr key={skill.id} className="border-b border-slate-800 last:border-0">
                  <td className="px-4 py-3 text-xl">{skill.icon}</td>
                  <td className="px-4 py-3">{skill.name}</td>
                  <td className="px-4 py-3 text-slate-400">{skill.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 rounded-full bg-slate-800">
                        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${skill.level}%` }} />
                      </div>
                      <span className="text-xs text-slate-500">{skill.level}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" className="text-indigo-400 hover:text-indigo-300" onClick={() => openEdit(skill)}>
                      编辑
                    </button>
                    <button type="button" className="ml-3 text-red-400 hover:text-red-300" onClick={() => setDeleting(skill)}>
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={open} title={editing ? '编辑技能' : '新增技能'} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">名称</label>
            <input className="input" {...register('name')} />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
          </div>
          <div>
            <label className="label">图标（emoji）</label>
            <input className="input" placeholder="如 ⚛️" {...register('icon')} />
            {errors.icon && <p className="mt-1 text-xs text-red-400">{errors.icon.message}</p>}
          </div>
          <div>
            <label className="label">分类</label>
            <input className="input" placeholder="如 前端框架" {...register('category')} />
            {errors.category && <p className="mt-1 text-xs text-red-400">{errors.category.message}</p>}
          </div>
          <div>
            <label className="label">熟练度（0-100）</label>
            <input type="number" className="input" {...register('level')} />
            {errors.level && <p className="mt-1 text-xs text-red-400">{errors.level.message}</p>}
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
        title="删除技能"
        message={`确定要删除「${deleting?.name}」吗？此操作不可撤销。`}
        loading={deletingLoading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
