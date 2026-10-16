// 页脚：版权信息 + 社交链接。
import { useEffect, useState } from 'react';
import { profileApi } from '@/api/profile';
import type { Profile } from '@/types';

export default function Footer() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    profileApi.getProfile().then(setProfile);
  }, []);

  return (
    <footer className="border-t border-slate-800 py-10">
      <div className="container-page flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} {profile?.name ?? 'Portfolio'} · 用 React 构建
        </p>
        <div className="flex items-center gap-4 text-sm">
          {profile?.github && (
            <a href={profile.github} target="_blank" rel="noreferrer" className="text-slate-400 transition hover:text-white">
              GitHub
            </a>
          )}
          {profile?.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 transition hover:text-white">
              LinkedIn
            </a>
          )}
          {profile?.twitter && (
            <a href={profile.twitter} target="_blank" rel="noreferrer" className="text-slate-400 transition hover:text-white">
              Twitter
            </a>
          )}
          {profile?.email && (
            <a href={`mailto:${profile.email}`} className="text-slate-400 transition hover:text-white">
              邮箱
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
