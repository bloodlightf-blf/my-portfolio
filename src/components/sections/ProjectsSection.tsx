// 项目精选卡片列表，支持点击「详情」查看 Markdown 说明。
import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { projectsApi } from '@/api/projects';
import { useAsyncData } from '@/hooks/useAsyncData';
import type { Project } from '@/types';
import SectionTitle from '../SectionTitle';
import Reveal from '../Reveal';

export default function ProjectsSection() {
  const { data } = useAsyncData(() => projectsApi.list());
  const [active, setActive] = useState<Project | null>(null);

  // 前台只展示精选项目
  const projects = (data ?? []).filter((p) => p.featured);

  return (
    <section id="projects" className="scroll-mt-24 py-24">
      <div className="container-page">
        <SectionTitle title="项目精选" subtitle="我参与和主导的部分项目" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Reveal key={project.id}>
              <article className="card group flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:border-indigo-500/50">
                <div className="relative h-44 overflow-hidden bg-gradient-to-br from-indigo-500/30 to-cyan-500/30">
                  {project.cover ? (
                    <img src={project.cover} alt={project.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-5xl">🚀</div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-400">{project.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span key={t} className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-cyan-300">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center gap-3 pt-5">
                    {project.demoUrl && (
                      <a href={project.demoUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-indigo-400 transition hover:text-indigo-300">
                        演示 →
                      </a>
                    )}
                    {project.repoUrl && (
                      <a href={project.repoUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-400 transition hover:text-slate-200">
                        源码
                      </a>
                    )}
                    {project.content && (
                      <button type="button" onClick={() => setActive(project)} className="ml-auto text-sm text-cyan-400 transition hover:text-cyan-300">
                        详情
                      </button>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {/* 项目详情弹窗（Markdown 渲染） */}
      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setActive(null)}>
          <div
            className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-surface p-6"
            onClick={(e) => e.stopPropagation()}
            data-color-mode="dark"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">{active.title}</h3>
              <button type="button" onClick={() => setActive(null)} className="text-slate-400 transition hover:text-white" aria-label="关闭">
                ✕
              </button>
            </div>
            <MDEditor.Markdown source={active.content} />
          </div>
        </div>
      )}
    </section>
  );
}
