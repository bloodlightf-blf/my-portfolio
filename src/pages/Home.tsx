// 首页：组合所有前台区块。
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import SkillsSection from '@/components/sections/SkillsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ContactSection from '@/components/sections/ContactSection';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
    </>
  );
}
