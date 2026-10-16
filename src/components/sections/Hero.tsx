// 首页 Hero 区域：头像、姓名职位、简介、跳转按钮。
import { Link } from 'react-router-dom';
import { profileApi } from '@/api/profile';
import { useAsyncData } from '@/hooks/useAsyncData';

export default function Hero() {
  const { data: profile } = useAsyncData(() => profileApi.getProfile());

  return (
    <section id="home" className="relative flex min-h-screen items-center pt-16">
      <div className="container-page grid items-center gap-10 py-20 md:grid-cols-2">
        <div className="order-2 text-center md:order-1 md:text-left">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-indigo-400">你好，我是</p>
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            {profile?.name ?? '你的名字'}
          </h1>
          <p className="mt-3 text-xl font-medium text-cyan-400 sm:text-2xl">
            {profile?.title ?? '前端工程师'}
          </p>
          <p className="mt-5 max-w-xl text-slate-400">{profile?.bio}</p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <Link to={{ pathname: '/', hash: 'projects' }} className="btn-primary">
              查看项目
            </Link>
            <Link to={{ pathname: '/', hash: 'contact' }} className="btn-ghost">
              联系我
            </Link>
          </div>
        </div>

        <div className="order-1 flex justify-center md:order-2">
          <div className="animate-float relative">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-indigo-500/30 to-cyan-500/30 blur-2xl" />
            <div className="relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-2 border-indigo-500/50 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 text-6xl sm:h-48 sm:w-48">
              {profile?.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
              ) : (
                <span>{profile?.name?.charAt(0) ?? '👤'}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
