// 博客详情页：Markdown 渲染 + 代码高亮。
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { blogsApi } from '@/api/blogs';
import type { BlogPost } from '@/types';
import { formatDate } from '@/utils/format';

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    blogsApi
      .getBySlug(slug)
      .then(setPost)
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <article className="pt-28 pb-24">
      <div className="container-page max-w-3xl">
        {loading ? (
          <p className="text-center text-slate-500">加载中...</p>
        ) : !post ? (
          <div className="text-center">
            <p className="text-slate-500">文章不存在</p>
            <Link to="/blog" className="btn-ghost mt-6">
              返回博客
            </Link>
          </div>
        ) : (
          <>
            <Link to="/blog" className="text-sm text-slate-400 transition hover:text-white">
              ← 返回博客
            </Link>
            <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{post.title}</h1>
            <p className="mt-3 text-sm text-slate-500">{formatDate(post.createdAt)}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span key={t} className="rounded bg-slate-800 px-2 py-0.5 text-xs text-cyan-300">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-8" data-color-mode="dark">
              <MDEditor.Markdown source={post.content} />
            </div>
          </>
        )}
      </div>
    </article>
  );
}
