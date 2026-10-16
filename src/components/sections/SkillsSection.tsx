// 技能展示：按分类分组，图标 + 名称 + 熟练度进度条。
import { skillsApi } from '@/api/skills';
import { useAsyncData } from '@/hooks/useAsyncData';
import type { Skill } from '@/types';
import SectionTitle from '../SectionTitle';
import Reveal from '../Reveal';

export default function SkillsSection() {
  const { data: skills } = useAsyncData(() => skillsApi.list());

  // 按分类分组
  const groups: Record<string, Skill[]> = {};
  for (const skill of skills ?? []) {
    (groups[skill.category] ||= []).push(skill);
  }

  return (
    <section id="skills" className="scroll-mt-24 py-24">
      <div className="container-page">
        <SectionTitle title="技能栈" subtitle="这些是我日常工作中使用的主要技术" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(groups).map(([category, list]) => (
            <Reveal key={category}>
              <div className="card h-full p-6">
                <h3 className="mb-5 text-lg font-semibold text-cyan-400">{category}</h3>
                <div className="space-y-4">
                  {list.map((skill) => (
                    <div key={skill.id}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm text-slate-200">
                          <span>{skill.icon}</span> {skill.name}
                        </span>
                        <span className="text-xs text-slate-500">{skill.level}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-1000"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
