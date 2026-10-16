// 时间线条目表单（工作经历 / 教育背景），使用 react-hook-form + zod 校验。
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { TimelineItem } from '@/types';

const schema = z.object({
  type: z.enum(['experience', 'education']),
  title: z.string().min(1, '请输入标题'),
  organization: z.string().min(1, '请输入组织 / 学校'),
  location: z.string(),
  startDate: z.string().min(1, '请输入开始时间'),
  endDate: z.string().min(1, '请输入结束时间'),
  description: z.string(),
});

type FormValues = z.infer<typeof schema>;

interface TimelineFormProps {
  initial?: TimelineItem | null;
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
}

export default function TimelineForm({ initial, onSubmit, onCancel }: TimelineFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'experience',
      title: '',
      organization: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
    },
  });

  useEffect(() => {
    if (initial) {
      // 显式映射字段，避免可选字段（如 location）与额外字段（如 id）导致的类型不匹配
      reset({
        type: initial.type,
        title: initial.title,
        organization: initial.organization,
        location: initial.location ?? '',
        startDate: initial.startDate,
        endDate: initial.endDate,
        description: initial.description,
      });
    }
  }, [initial, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="label">类型</label>
        <select className="input" {...register('type')}>
          <option value="experience">工作经历</option>
          <option value="education">教育背景</option>
        </select>
      </div>

      <div>
        <label className="label">标题 / 职位</label>
        <input className="input" placeholder="如：前端工程师" {...register('title')} />
        {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
      </div>

      <div>
        <label className="label">组织 / 学校</label>
        <input className="input" placeholder="如：某科技公司" {...register('organization')} />
        {errors.organization && <p className="mt-1 text-xs text-red-400">{errors.organization.message}</p>}
      </div>

      <div>
        <label className="label">地点</label>
        <input className="input" placeholder="如：上海" {...register('location')} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">开始时间</label>
          <input className="input" placeholder="2020-07" {...register('startDate')} />
          {errors.startDate && <p className="mt-1 text-xs text-red-400">{errors.startDate.message}</p>}
        </div>
        <div>
          <label className="label">结束时间</label>
          <input className="input" placeholder="至今" {...register('endDate')} />
          {errors.endDate && <p className="mt-1 text-xs text-red-400">{errors.endDate.message}</p>}
        </div>
      </div>

      <div>
        <label className="label">描述</label>
        <textarea className="input min-h-24" {...register('description')} />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-ghost px-4 py-2">
          取消
        </button>
        <button type="submit" className="btn-primary px-4 py-2">
          保存
        </button>
      </div>
    </form>
  );
}
