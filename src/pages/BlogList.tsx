// 博客列表页：只展示已发布的文章。
import { Link } from 'react-router-dom';
import { blogsApi } from '@/api/blogs';
import { useAsyncData } from '@/hooks/useAsyncData';
import { formatDate } from '@/utils/format';
import SectionTitle from '@/components/SectionTitle';

export default function BlogList() {
  const { data, loading } = useAsyncData(() => blogsApi.list());
  const posts = (data ?? []).filter((p) => p.published);

  return (
    <section className="pt-28 pb-24">
      <div className="container-page">
        <SectionTitle title="博客" subtitle="记录技术与思考" />

        {loading ? (
          <p className="text-center text-slate-500">加载中...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-slate-500">暂无文章</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:border-indigo-500/50"
              >
                <div className="h-40 overflow-hidden bg-gradient-to-br from-indigo-500/30 to-cyan-500/30">
                  {post.cover ? (
                    <img src={post.cover} alt={post.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl">📝</div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-semibold transition group-hover:text-cyan-300">{post.title}</h3>
                  <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-400">{post.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span>{formatDate(post.createdAt)}</span>
                    <div className="flex gap-1">
                      {post.tags.slice(0, 3).map((t) => (
                        <span key={t} className="rounded bg-slate-800 px-2 py-0.5 text-cyan-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
