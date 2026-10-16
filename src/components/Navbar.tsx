// 吸顶导航栏，支持移动端折叠菜单与锚点平滑滚动。
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { label: '首页', target: 'home' },
  { label: '关于', target: 'about' },
  { label: '技能', target: 'skills' },
  { label: '项目', target: 'projects' },
  { label: '联系', target: 'contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 切换页面后自动收起移动端菜单
  useEffect(() => {
    setOpen(false);
  }, [location]);

  // 区块链接：始终回到首页并通过 hash 定位，由全局 HashScroll 完成滚动
  const sectionLink = (target: string) => ({ pathname: '/', hash: target });

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled ? 'bg-ink/80 shadow-lg shadow-black/20 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Portfolio
          </span>
        </Link>

        {/* 桌面端导航 */}
        <div className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.target}
              to={sectionLink(item.target)}
              className="text-sm text-slate-300 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <Link to="/blog" className="text-sm text-slate-300 transition hover:text-white">
            博客
          </Link>
        </div>

        {/* 移动端菜单按钮 */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-200 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="打开菜单"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* 移动端下拉菜单 */}
      {open && (
        <div className="border-t border-slate-800 bg-ink/95 backdrop-blur-md md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.target}
                to={sectionLink(item.target)}
                className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
              >
                {item.label}
              </Link>
            ))}
            <Link to="/blog" className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800">
              博客
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
