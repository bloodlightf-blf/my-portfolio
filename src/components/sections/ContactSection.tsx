// 联系模块：邮箱 + 社交链接。
import { profileApi } from '@/api/profile';
import { useAsyncData } from '@/hooks/useAsyncData';
import SectionTitle from '../SectionTitle';

export default function ContactSection() {
  const { data: profile } = useAsyncData(() => profileApi.getProfile());

  return (
    <section id="contact" className="scroll-mt-24 py-24">
      <div className="container-page">
        <SectionTitle title="联系我" subtitle="欢迎交流与合作" />

        <div className="card mx-auto max-w-2xl p-8 text-center">
          {profile?.email && (
            <a href={`mailto:${profile.email}`} className="mb-6 inline-block break-all text-2xl font-semibold text-cyan-400 transition hover:text-cyan-300">
              {profile.email}
            </a>
          )}

          <div className="flex flex-wrap items-center justify-center gap-4">
            {profile?.github && (
              <a href={profile.github} target="_blank" rel="noreferrer" className="btn-ghost">
                GitHub
              </a>
            )}
            {profile?.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn-ghost">
                LinkedIn
              </a>
            )}
            {profile?.twitter && (
              <a href={profile.twitter} target="_blank" rel="noreferrer" className="btn-ghost">
                Twitter
              </a>
            )}
            {profile?.website && (
              <a href={profile.website} target="_blank" rel="noreferrer" className="btn-ghost">
                个人网站
              </a>
            )}
          </div>

          {profile?.location && <p className="mt-6 text-sm text-slate-500">📍 {profile.location}</p>}
        </div>
      </div>
    </section>
  );
}
