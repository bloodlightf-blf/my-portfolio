// 404 页面。
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center justify-center pt-16">
      <div className="text-center">
        <p className="text-7xl font-black text-indigo-500">404</p>
        <h1 className="mt-4 text-2xl font-bold">页面不存在</h1>
        <Link to="/" className="btn-primary mt-8">
          返回首页
        </Link>
      </div>
    </section>
  );
}
