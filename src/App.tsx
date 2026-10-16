// 应用入口：路由配置 + hash 锚点滚动处理。
import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import FrontLayout from '@/components/FrontLayout';
import Home from '@/pages/Home';
import BlogList from '@/pages/BlogList';
import BlogDetail from '@/pages/BlogDetail';
import NotFound from '@/pages/NotFound';
import Login from '@/admin/Login';
import AdminLayout from '@/admin/AdminLayout';
import Settings from '@/admin/Settings';
import Skills from '@/admin/Skills';
import Projects from '@/admin/Projects';
import Blogs from '@/admin/Blogs';
import RequireAuth from '@/hooks/RequireAuth';

/** 处理 hash 锚点平滑滚动与页面切换回到顶部 */
function HashScroll() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      // 等待页面渲染完成后再滚动
      const timer = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

export default function App() {
  return (
    <>
      <HashScroll />
      <Routes>
        {/* 前台 */}
        <Route element={<FrontLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
        </Route>

        {/* 后台登录页 */}
        <Route path="/admin" element={<Login />} />

        {/* 后台受保护路由（未登录会重定向到 /admin） */}
        <Route element={<RequireAuth />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/skills" element={<Skills />} />
            <Route path="/admin/projects" element={<Projects />} />
            <Route path="/admin/blogs" element={<Blogs />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
