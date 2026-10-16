# 个人作品集网站（Portfolio）

深色主题的个人作品集网站，React 18 + TypeScript + Vite + Tailwind CSS。
包含前台展示与后台管理，数据使用 localStorage 模拟。

## 快速开始

```bash
npm install
npm run dev
```

打开 http://localhost:5173

- **前台**：`/`
- **后台管理**：`/admin`（默认账号 `admin / admin123`）

## 常用命令

```bash
npm run dev        # 开发服务器
npm run build      # 类型检查 + 构建
npm run preview    # 预览构建产物
npm run typecheck  # 仅类型检查
```

## 目录结构

```
src/
├── api/         # localStorage 模拟接口层
├── components/  # 前台公共组件
├── pages/       # 前台页面
├── admin/       # 后台页面与组件
├── types/       # TypeScript 类型
├── hooks/       # 自定义 Hooks（含路由守卫）
├── utils/       # 工具函数
├── App.tsx
└── main.tsx
```

## 部署

### Vercel

1. 将代码推送到 GitHub / GitLab。
2. 在 [Vercel](https://vercel.com) 导入仓库，框架会自动识别为 **Vite**。
3. 构建命令 `npm run build`，输出目录 `dist`（默认即可）。
4. 点击 Deploy。Vercel 会自动处理 SPA 路由回退。

### Cloudflare Pages

1. 推送代码到 GitHub。
2. 在 Cloudflare Pages 新建项目并连接仓库。
3. 构建设置：
   - 构建命令：`npm run build`
   - 输出目录：`dist`
4. 部署后添加 **SPA 回退规则**（否则直接访问 `/blog/xxx`、`/admin` 会 404）：

   在项目 **Settings → Functions → Configuration** 中创建重写规则，或使用
   `public/_redirects` 文件：

   ```
   /*    /index.html   200
   ```

> 提示：本项目的「数据库」是浏览器 localStorage，属于纯前端实现。
> 部署到生产后，每个访客/管理员看到的是自己浏览器里的独立数据；
> 若需真正的多用户共享数据，请按 `TECH_DESIGN.md` 将 `src/api` 替换为真实后端。

## 文档

- [PRD.md](./PRD.md) — 产品需求文档
- [TECH_DESIGN.md](./TECH_DESIGN.md) — 技术设计文档
- [AGENTS.md](./AGENTS.md) — 开发规范
