// 后台布局：侧边栏 + 顶栏，深色主题，与前台风格统一但复用前台导航。
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const MENU = [
  { to: '/admin/settings', label: '个人信息', icon: '👤' },
  { to: '/admin/skills', label: '技能管理', icon: '🛠️' },
  { to: '/admin/projects', label: '项目管理', icon: '📦' },
  { to: '/admin/blogs', label: '博客管理', icon: '📝' },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-ink text-slate-300">
      {/* 侧边栏 */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 transform border-r border-slate-800 bg-surface/60 transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-slate-800 px-6">
          <span className="text-lg font-bold text-indigo-400">Portfolio</span>
          <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-400">后台</span>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {MENU.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition ${
                  isActive ? 'bg-indigo-500/15 text-indigo-300' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`
              }
            >
              <span>{item.icon}</span> {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute inset-x-0 bottom-0 border-t border-slate-800 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-red-400"
          >
            <span>🚪</span> 退出登录
          </button>
        </div>
      </aside>

      {/* 移动端遮罩 */}
      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}

      {/* 主内容区 */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
          <button
            type="button"
            className="text-slate-300 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="打开菜单"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-sm font-medium text-slate-400 lg:text-base">内容管理后台</h1>
          <a href="/" className="text-sm text-indigo-400 transition hover:text-indigo-300">
            ← 返回前台
          </a>
        </header>

        <main className="flex-1 overflow-x-hidden p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
