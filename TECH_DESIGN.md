# 个人作品集网站 · 技术设计文档（TECH_DESIGN）

## 1. 技术栈

| 分类 | 技术 | 说明 |
| --- | --- | --- |
| 框架 | React 18 | 函数组件 + Hooks |
| 语言 | TypeScript 5 | 严格模式（strict） |
| 构建 | Vite 5 | 极速开发服务器与打包 |
| 样式 | Tailwind CSS 3 | 原子化 CSS |
| 路由 | react-router-dom 6 | 前后台路由隔离 |
| 表单 | react-hook-form + zod | 表单状态与校验 |
| Markdown | @uiw/react-md-editor | 编辑器（实时预览）+ 渲染（代码高亮） |
| 数据 | localStorage | 模拟后端数据库 |

## 2. 项目目录结构

```
my-portfolio/
├── public/
│   └── favicon.svg
├── src/
│   ├── api/                 # localStorage 模拟接口层（可无缝替换真实后端）
│   │   ├── db.ts            # 通用读写 / uid / 延迟
│   │   ├── seed.ts          # 默认种子数据
│   │   ├── auth.ts          # 登录校验
│   │   ├── profile.ts       # 个人信息
│   │   ├── skills.ts        # 技能
│   │   ├── projects.ts      # 项目
│   │   └── blogs.ts         # 博客
│   ├── components/          # 前台公共组件
│   │   ├── sections/        # 首页各区块
│   │   ├── StarField.tsx    # Canvas 星空粒子
│   │   ├── Navbar.tsx       # 吸顶导航
│   │   ├── Footer.tsx
│   │   ├── FrontLayout.tsx
│   │   ├── SectionTitle.tsx
│   │   └── Reveal.tsx       # 滚动淡入动画
│   ├── pages/               # 前台页面
│   │   ├── Home.tsx
│   │   ├── BlogList.tsx
│   │   ├── BlogDetail.tsx
│   │   └── NotFound.tsx
│   ├── admin/               # 后台页面
│   │   ├── components/
│   │   │   ├── ConfirmDialog.tsx   # 二次确认弹窗
│   │   │   ├── Modal.tsx           # 通用弹窗
│   │   │   └── TimelineForm.tsx    # 时间线条目表单
│   │   ├── AdminLayout.tsx  # 侧边栏 + 顶栏
│   │   ├── Login.tsx
│   │   ├── Settings.tsx
│   │   ├── Skills.tsx
│   │   ├── Projects.tsx
│   │   └── Blogs.tsx
│   ├── types/index.ts       # 全局类型
│   ├── hooks/
│   │   ├── useAuth.ts       # 登录态 Hook
│   │   ├── RequireAuth.tsx  # 路由守卫
│   │   └── useAsyncData.ts  # 异步数据 Hook
│   ├── utils/
│   │   ├── authStore.ts     # token 外部存储
│   │   └── format.ts        # 日期 / slug / 标签工具
│   ├── App.tsx              # 路由表
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── PRD.md
├── TECH_DESIGN.md
└── AGENTS.md
```

## 3. 数据模型

### 3.1 Profile（个人信息）

```ts
interface Profile {
  id: string;
  name: string;
  title: string;
  avatar: string;
  bio: string;
  summary: string;
  email: string;
  location: string;
  phone?: string;
  github: string;
  twitter: string;
  linkedin: string;
  website: string;
  resumeUrl?: string;
  timeline: TimelineItem[];
}
```

### 3.2 Skill（技能）

```ts
interface Skill {
  id: string;
  name: string;
  icon: string;    // emoji
  category: string;
  level: number;   // 0-100
}
```

### 3.3 Project（项目）

```ts
interface Project {
  id: string;
  title: string;
  description: string;
  cover: string;
  tech: string[];
  demoUrl: string;
  repoUrl: string;
  featured: boolean;
  content: string; // Markdown 详细说明
  createdAt: string;
}
```

### 3.4 BlogPost（博客）

```ts
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown
  cover: string;
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## 4. 数据层设计

所有数据通过 `src/api` 下的模块访问，函数均为异步（返回 `Promise`），内部使用
`localStorage` 读写，并附带模拟网络延迟。**关键点**：函数签名稳定，替换真实后端时
只需修改 `src/api` 内部实现，业务代码零改动。

- 存储键：`portfolio_profile` / `portfolio_skills` / `portfolio_projects` / `portfolio_blogs`。
- 首次访问由 `initSeedData()` 写入默认数据。
- 登录只返回随机 token，密码不落盘。

## 5. 关键技术难点

### 5.1 星空粒子背景（Canvas）

- 使用 `requestAnimationFrame` 驱动动画，粒子做缓慢漂移与透明度闪烁。
- 桌面端额外绘制距离阈值内的粒子连线（O(n²)），形成星座效果。
- 移动端（`< 768px`）将粒子数从 160 降到 60，并关闭连线，保证流畅度。
- 监听 `resize` 事件，画布尺寸与粒子数量实时重算。

### 5.2 锚点平滑滚动与多页共存

前台既有单页区块（首页），又有独立页（博客），锚点链接需同时支持：

- 在首页点击锚点 → 直接平滑滚动。
- 在其他页点击锚点 → 跳回首页并通过 `hash` 定位。
- 实现：导航统一使用 `{ pathname: '/', hash: 'xxx' }`，由全局 `HashScroll` 组件
  在路由变化后 `scrollIntoView({ behavior: 'smooth' })`。

### 5.3 登录态与路由守卫

- token 存于 `localStorage`，通过自定义外部存储 `authStore` + `useSyncExternalStore`
  实现响应式同步，任意组件登录/退出后全局即时刷新。
- `RequireAuth` 组件包裹后台受保护路由，未登录时 `<Navigate to="/admin">`。

### 5.4 Markdown 编辑与渲染

- 后台使用 `@uiw/react-md-editor` 的 `MDEditor`，自带分屏实时预览。
- 前台使用 `MDEditor.Markdown` 渲染，内置 Prism 代码高亮。
- 通过 `data-color-mode="dark"` 适配深色主题。

## 6. 部署要点

本项目为纯前端 SPA，部署到 Vercel / Cloudflare Pages 时需配置 **SPA 回退规则**
（所有路由重写到 `index.html`），否则直接访问 `/blog/xxx` 或 `/admin` 会 404。

- Vercel：默认会自动识别 Vite 并处理 SPA 回退。
- Cloudflare Pages：构建命令 `npm run build`，输出目录 `dist`；需添加重写规则。

详见 `README.md`。
