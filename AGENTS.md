# 开发规范（AGENTS.md）

本文件面向在该仓库中协作开发的人类与 AI 助手，请在修改代码前阅读。

## 1. 项目概述

个人作品集网站，采用 React 18 + TypeScript + Vite + Tailwind CSS。
包含**前台展示**（`/`）与**后台管理**（`/admin`），数据使用 localStorage 模拟，
通过 `src/api` 统一接口层访问。

## 2. 环境与命令

```bash
npm install     # 安装依赖
npm run dev     # 启动开发服务器（默认 http://localhost:5173）
npm run build   # 类型检查 + 构建
npm run preview # 预览构建产物
npm run typecheck # 仅类型检查
```

- 默认后台账号：`admin / admin123`。
- 首次打开会自动写入种子数据到 localStorage；如需重置，清除站点本地存储即可。

## 3. 目录职责（重要）

| 目录 | 职责 | 约束 |
| --- | --- | --- |
| `src/api` | localStorage 接口层 | 对外函数签名稳定，禁止在业务代码中直接读写 localStorage |
| `src/types` | 全局 TypeScript 类型 | 数据模型集中定义，避免类型散落 |
| `src/components` | 前台公共组件 | 前台可复用组件与区块 |
| `src/pages` | 前台页面 | 路由级别的页面容器 |
| `src/admin` | 后台页面与组件 | 不复用前台导航，自成一体系 |
| `src/hooks` | 自定义 Hooks | 含登录态与路由守卫 |
| `src/utils` | 纯工具函数 | 无副作用优先 |

## 4. 代码风格

- **TypeScript 严格模式**：开启 `strict`、`noUnusedLocals`、`noUnusedParameters`，
  禁止遗留未使用的变量/导入。
- **路径别名**：统一使用 `@/` 指向 `src`，如 `import { skillsApi } from '@/api/skills'`。
- **组件**：函数组件 + Hooks，按文件导出（默认导出），类型用 `interface` 定义 props。
- **表单**：使用 `react-hook-form` + `zod`（`@hookform/resolvers/zod`），
  校验 schema 用 `z.object(...)`，类型通过 `z.infer` 推导。
- **样式**：优先 Tailwind 原子类；可复用样式抽到 `index.css` 的 `@layer components`
  （如 `.btn-primary`、`.card`、`.input`、`.label`）。
- **注释**：关键逻辑（如星空粒子算法、路由守卫、接口层说明）写注释，避免无意义注释。
- **命名**：组件 PascalCase，文件与目录用小写/短横线；变量与函数 camelCase。

## 5. 数据层约定

- 所有数据读写走 `src/api`，函数均返回 `Promise`（已模拟网络延迟）。
- 新增数据模型步骤：
  1. 在 `src/types` 定义类型；
  2. 在 `src/api/db.ts` 增加 `STORAGE_KEYS` 键；
  3. 新建 `src/api/<name>.ts` 实现增删改查；
  4. 如需默认数据，在 `src/api/seed.ts` 补充并在 `initSeedData()` 写入。
- 登录密码**不得**存储于 localStorage，只存 token。

## 6. 测试要求

- 提交前必须通过 `npm run build`（含 `tsc --noEmit` 类型检查）。
- 手工验证清单（每次改动前台/后台后至少自查一次）：
  - [ ] 首页五个区块正常渲染，锚点滚动正常。
  - [ ] 星空粒子在 PC 与移动端均流畅。
  - [ ] 未登录访问 `/admin/*` 会跳转登录页；登录后刷新保持登录态。
  - [ ] 后台四个页面增删改查正常，删除有二次确认。
  - [ ] 博客详情 Markdown 渲染与代码高亮正常。

## 7. 注意事项

- **不要引入重型 UI 组件库**（如 Ant Design、MUI），保持依赖轻量。
- 修改 `src/api` 时保持函数签名不变，确保未来可无缝替换真实后端。
- Tailwind 深色主题主色为 `#0B0F1A`（`bg-ink`），新增界面请保持一致。
- `@uiw/react-md-editor` 体积较大，仅在需要编辑/渲染 Markdown 的页面引入，
  不要在全局入口无差别打包。
- 移动端需关注星空粒子性能与侧边栏收起行为。
