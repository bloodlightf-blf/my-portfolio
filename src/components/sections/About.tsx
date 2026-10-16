// 个人介绍：时间线经历 + 教育背景。
import { profileApi } from '@/api/profile';
import { useAsyncData } from '@/hooks/useAsyncData';
import SectionTitle from '../SectionTitle';
import Reveal from '../Reveal';

export default function About() {
  const { data: profile } = useAsyncData(() => profileApi.getProfile());

  const experience = profile?.timeline.filter((t) => t.type === 'experience') ?? [];
  const education = profile?.timeline.filter((t) => t.type === 'education') ?? [];

  const renderTimeline = (
    items: typeof experience,
    color: string,
  ) => (
    <div className="space-y-6 border-l border-slate-700 pl-6">
      {items.map((item) => (
        <div key={item.id} className="relative">
          <span className={`absolute -left-[31px] top-1 h-3 w-3 rounded-full ring-4 ring-ink ${color}`} />
          <p className="text-xs text-slate-500">
            {item.startDate} — {item.endDate}
          </p>
          <h4 className="font-semibold text-slate-100">{item.title}</h4>
          <p className="text-sm text-cyan-400">{item.organization}</p>
          <p className="mt-2 text-sm text-slate-400">{item.description}</p>
        </div>
      ))}
    </div>
  );

  return (
    <section id="about" className="scroll-mt-24 py-24">
      <div className="container-page">
        <SectionTitle title="关于我" subtitle={profile?.summary} />

        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold">
              <span>💼</span> 工作经历
            </h3>
            {experience.length > 0 ? (
              renderTimeline(experience, 'bg-indigo-500')
            ) : (
              <p className="text-sm text-slate-500">暂无工作经历</p>
            )}
          </Reveal>

          <Reveal delay={100}>
            <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold">
              <span>🎓</span> 教育背景
            </h3>
            {education.length > 0 ? (
              renderTimeline(education, 'bg-cyan-500')
            ) : (
              <p className="text-sm text-slate-500">暂无教育背景</p>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
