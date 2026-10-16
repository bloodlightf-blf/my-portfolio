// 首次访问时的默认种子数据，写入 localStorage，保证前台初次加载即有内容。
import { STORAGE_KEYS, writeJSON } from './db';
import type { BlogPost, Profile, Project, Skill } from '@/types';

export const seedProfile: Profile = {
  id: 'profile-1',
  name: '张三',
  title: '资深前端工程师',
  avatar: '',
  bio: '热爱构建优雅、高性能、体验出色的 Web 应用，专注于 React 生态与前端工程化。',
  summary:
    '拥有 5 年以上前端开发经验，主导过多个中大型项目的前端架构设计与落地，在性能优化、组件库建设与工程化方面有丰富实践。',
  email: 'hello@example.com',
  location: '中国 · 上海',
  phone: '138-0000-0000',
  github: 'https://github.com/yourname',
  twitter: 'https://twitter.com/yourname',
  linkedin: 'https://linkedin.com/in/yourname',
  website: 'https://example.com',
  resumeUrl: '',
  timeline: [
    {
      id: 't1',
      type: 'experience',
      title: '资深前端工程师',
      organization: '某科技公司',
      location: '上海',
      startDate: '2022-04',
      endDate: '至今',
      description: '负责核心产品前端架构设计与团队技术建设，推动组件库与构建体系升级。',
    },
    {
      id: 't2',
      type: 'experience',
      title: '前端工程师',
      organization: '某互联网公司',
      location: '杭州',
      startDate: '2020-07',
      endDate: '2022-03',
      description: '参与电商中台多个业务模块开发，负责性能优化与前端监控告警体系搭建。',
    },
    {
      id: 't3',
      type: 'education',
      title: '计算机科学与技术 · 本科',
      organization: '某大学',
      location: '北京',
      startDate: '2016-09',
      endDate: '2020-06',
      description: '主修计算机基础、数据结构与算法，多次获得校级奖学金。',
    },
  ],
};

export const seedSkills: Skill[] = [
  { id: 's1', name: 'React', icon: '⚛️', category: '前端框架', level: 92 },
  { id: 's2', name: 'TypeScript', icon: '🔷', category: '语言', level: 88 },
  { id: 's3', name: 'Vue', icon: '💚', category: '前端框架', level: 80 },
  { id: 's4', name: 'Next.js', icon: '▲', category: '前端框架', level: 78 },
  { id: 's5', name: 'Tailwind CSS', icon: '🌊', category: '样式', level: 90 },
  { id: 's6', name: 'Node.js', icon: '🟩', category: '后端', level: 75 },
  { id: 's7', name: 'Vite / Webpack', icon: '⚡', category: '工程化', level: 85 },
  { id: 's8', name: 'Git / CI', icon: '🔀', category: '工程化', level: 82 },
  { id: 's9', name: 'Docker', icon: '🐳', category: '工程化', level: 70 },
];

export const seedProjects: Project[] = [
  {
    id: 'p1',
    title: '个人作品集网站',
    description: 'React + TypeScript + Tailwind 构建的深色主题作品集，含星空粒子背景与后台管理。',
    cover: '',
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
    demoUrl: 'https://example.com',
    repoUrl: 'https://github.com/yourname/portfolio',
    featured: true,
    createdAt: '2026-01-10',
    content: `# 项目介绍

这是一款**个人作品集网站**，具有以下特性：

- 深色主题与星空粒子背景
- 响应式布局
- 前台展示 + 后台管理

\`\`\`tsx
const hello = (name: string) => \`Hello, \${name}!\`;
\`\`\``,
  },
  {
    id: 'p2',
    title: '数据可视化大屏',
    description: '基于 ECharts 的实时数据可视化大屏，支持多种图表联动与自适应布局。',
    cover: '',
    tech: ['React', 'ECharts', 'WebSocket'],
    demoUrl: 'https://example.com',
    repoUrl: 'https://github.com/yourname/dashboard',
    featured: true,
    createdAt: '2025-08-15',
    content: `# 项目介绍

实时数据可视化大屏，支持：

1. 多图表联动
2. WebSocket 实时推送
3. 自适应缩放`,
  },
  {
    id: 'p3',
    title: '组件库 Design System',
    description: '企业级 React 组件库，包含 40+ 组件、主题定制与完善文档。',
    cover: '',
    tech: ['React', 'TypeScript', 'Storybook'],
    demoUrl: 'https://example.com',
    repoUrl: 'https://github.com/yourname/design-system',
    featured: true,
    createdAt: '2025-05-20',
    content: `# 项目介绍

企业级组件库，包含：

- 40+ 基础组件
- 主题定制能力
- 单元测试覆盖`,
  },
];

export const seedBlogs: BlogPost[] = [
  {
    id: 'b1',
    title: '深入理解 React Hooks',
    slug: 'understanding-react-hooks',
    excerpt: 'React Hooks 是函数组件的灵魂，本文梳理常用 Hook 的使用与常见陷阱。',
    cover: '',
    tags: ['React', 'Hooks'],
    published: true,
    createdAt: '2026-02-01',
    updatedAt: '2026-02-01',
    content: `# 深入理解 React Hooks

React Hooks 是函数组件的灵魂。本文梳理常用 Hook 的使用与陷阱。

## useState 与闭包

\`\`\`tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
\`\`\`

## useEffect 依赖数组

- 空数组：仅在挂载时执行
- 传入依赖：依赖变化时执行
- 不传：每次渲染都执行`,
  },
  {
    id: 'b2',
    title: 'TypeScript 类型体操入门',
    slug: 'typescript-type-challenges',
    excerpt: '从条件类型、infer 到模板字面量类型，掌握 TypeScript 进阶类型技巧。',
    cover: '',
    tags: ['TypeScript'],
    published: true,
    createdAt: '2026-01-15',
    updatedAt: '2026-01-15',
    content: `# TypeScript 类型体操入门

类型体操是掌握 TypeScript 高阶能力的关键。

## 条件类型

\`\`\`ts
type IsString<T> = T extends string ? true : false;

type A = IsString<'hello'>; // true
type B = IsString<42>; // false
\`\`\`

## infer 关键字

\`infer\` 用于在条件类型中推断类型变量，常用于提取函数返回值等场景。`,
  },
  {
    id: 'b3',
    title: '使用 Canvas 实现星空粒子效果',
    slug: 'canvas-star-particles',
    excerpt: '用原生 Canvas 绘制可交互的星空粒子背景，并针对移动端做性能优化。',
    cover: '',
    tags: ['Canvas', '动画'],
    published: true,
    createdAt: '2025-12-20',
    updatedAt: '2025-12-20',
    content: `# 使用 Canvas 实现星空粒子效果

Canvas 是实现粒子背景最轻量的方式。

## 核心思路

\`\`\`ts
const ctx = canvas.getContext('2d');

function draw() {
  ctx.clearRect(0, 0, width, height);
  for (const star of stars) {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = \`rgba(255, 255, 255, \${star.alpha})\`;
    ctx.fill();
  }
  requestAnimationFrame(draw);
}
\`\`\`

移动端通过减少粒子数量来保证流畅度。`,
  },
];

/** 初始化种子数据：仅当对应键不存在时写入 */
export function initSeedData(): void {
  if (!localStorage.getItem(STORAGE_KEYS.profile)) {
    writeJSON(STORAGE_KEYS.profile, seedProfile);
  }
  if (!localStorage.getItem(STORAGE_KEYS.skills)) {
    writeJSON(STORAGE_KEYS.skills, seedSkills);
  }
  if (!localStorage.getItem(STORAGE_KEYS.projects)) {
    writeJSON(STORAGE_KEYS.projects, seedProjects);
  }
  if (!localStorage.getItem(STORAGE_KEYS.blogs)) {
    writeJSON(STORAGE_KEYS.blogs, seedBlogs);
  }
}
