// 前台整体布局：星空背景 + 吸顶导航 + 内容区 + 页脚。
import { Outlet } from 'react-router-dom';
import StarField from './StarField';
import Navbar from './Navbar';
import Footer from './Footer';

export default function FrontLayout() {
  return (
    <div className="relative min-h-screen">
      <StarField />
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
