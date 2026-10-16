// 个人信息管理页面：基本信息 + 时间线（经历/教育）管理。
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { profileApi } from '@/api/profile';
import { uid } from '@/api/db';
import type { Profile, TimelineItem } from '@/types';
import Modal from './components/Modal';
import ConfirmDialog from './components/ConfirmDialog';
import TimelineForm from './components/TimelineForm';

const profileSchema = z.object({
  name: z.string().min(1, '请输入姓名'),
  title: z.string().min(1, '请输入职位'),
  avatar: z.string(),
  bio: z.string(),
  summary: z.string(),
  email: z.string().email('请输入有效的邮箱'),
  location: z.string(),
  phone: z.string(),
  github: z.string(),
  twitter: z.string(),
  linkedin: z.string(),
  website: z.string(),
  resumeUrl: z.string(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function Settings() {
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [saved, setSaved] = useState(false);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<TimelineItem | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  // 加载现有资料并回填表单
  useEffect(() => {
    profileApi.getProfile().then((p) => {
      reset({
        name: p.name,
        title: p.title,
        avatar: p.avatar,
        bio: p.bio,
        summary: p.summary,
        email: p.email,
        location: p.location,
        phone: p.phone ?? '',
        github: p.github,
        twitter: p.twitter,
        linkedin: p.linkedin,
        website: p.website,
        resumeUrl: p.resumeUrl ?? '',
      });
      setTimeline(p.timeline);
    });
  }, [reset]);

  const onSubmit = async (values: ProfileForm) => {
    const current = await profileApi.getProfile();
    const updated: Profile = { ...current, ...values, timeline };
    await profileApi.updateProfile(updated);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const openCreateTimeline = () => {
    setEditingItem(null);
    setTimelineOpen(true);
  };

  const openEditTimeline = (item: TimelineItem) => {
    setEditingItem(item);
    setTimelineOpen(true);
  };

  const handleTimelineDelete = () => {
    if (deletingItem) {
      setTimeline((prev) => prev.filter((it) => it.id !== deletingItem.id));
    }
    setDeletingItem(null);
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">个人信息管理</h2>
        {saved && <span className="text-sm text-emerald-400">✓ 已保存</span>}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card p-6">
          <h3 className="mb-5 text-lg font-semibold">基本信息</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">姓名</label>
              <input className="input" {...register('name')} />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
            </div>
            <div>
              <label className="label">职位</label>
              <input className="input" {...register('title')} />
              {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="label">头像地址（URL）</label>
              <input className="input" placeholder="留空则显示姓名首字" {...register('avatar')} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">一句话简介</label>
              <textarea className="input min-h-20" {...register('bio')} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">详细总结</label>
              <textarea className="input min-h-24" {...register('summary')} />
            </div>
            <div>
              <label className="label">邮箱</label>
              <input className="input" {...register('email')} />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label">所在地</label>
              <input className="input" {...register('location')} />
            </div>
            <div>
              <label className="label">电话</label>
              <input className="input" {...register('phone')} />
            </div>
            <div>
              <label className="label">简历地址</label>
              <input className="input" {...register('resumeUrl')} />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="mb-5 text-lg font-semibold">社交链接</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">GitHub</label>
              <input className="input" {...register('github')} />
            </div>
            <div>
              <label className="label">LinkedIn</label>
              <input className="input" {...register('linkedin')} />
            </div>
            <div>
              <label className="label">Twitter</label>
              <input className="input" {...register('twitter')} />
            </div>
            <div>
              <label className="label">个人网站</label>
              <input className="input" {...register('website')} />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-semibold">时间线（经历 / 教育）</h3>
            <button type="button" className="btn-primary px-4 py-2" onClick={openCreateTimeline}>
              + 新增
            </button>
          </div>

          {timeline.length === 0 ? (
            <p className="text-sm text-slate-500">暂无时间线条目</p>
          ) : (
            <div className="space-y-3">
              {timeline.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-4 rounded-lg border border-slate-800 bg-slate-900/40 p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded px-2 py-0.5 text-xs ${
                          item.type === 'experience' ? 'bg-indigo-500/15 text-indigo-300' : 'bg-cyan-500/15 text-cyan-300'
                        }`}
                      >
                        {item.type === 'experience' ? '工作' : '教育'}
                      </span>
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-400">
                      {item.organization} · {item.startDate} — {item.endDate}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-3 text-sm">
                    <button type="button" className="text-indigo-400 hover:text-indigo-300" onClick={() => openEditTimeline(item)}>
                      编辑
                    </button>
                    <button type="button" className="text-red-400 hover:text-red-300" onClick={() => setDeletingItem(item)}>
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? '保存中...' : '保存个人信息'}
          </button>
        </div>
      </form>

      {/* 时间线条目编辑弹窗 */}
      <Modal open={timelineOpen} title={editingItem ? '编辑时间线条目' : '新增时间线条目'} onClose={() => setTimelineOpen(false)}>
        <TimelineForm
          initial={editingItem}
          onCancel={() => setTimelineOpen(false)}
          onSubmit={(data) => {
            if (editingItem) {
              setTimeline((prev) => prev.map((it) => (it.id === editingItem.id ? { ...data, id: editingItem.id } : it)));
            } else {
              setTimeline((prev) => [...prev, { ...data, id: uid() }]);
            }
            setTimelineOpen(false);
          }}
        />
      </Modal>

      {/* 删除确认弹窗 */}
      <ConfirmDialog
        open={Boolean(deletingItem)}
        title="删除时间线条目"
        message={`确定要删除「${deletingItem?.title}」吗？此操作不可撤销。`}
        onConfirm={handleTimelineDelete}
        onCancel={() => setDeletingItem(null)}
      />
    </div>
  );
}
