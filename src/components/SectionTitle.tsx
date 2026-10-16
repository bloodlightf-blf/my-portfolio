// 区块标题组件：标题 + 渐变分隔线 + 可选副标题。
interface SectionTitleProps {
  title: string;
  subtitle?: string;
  id?: string;
}

export default function SectionTitle({ title, subtitle, id }: SectionTitleProps) {
  return (
    <div id={id} className="mb-12 text-center">
      <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
      <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500" />
      {subtitle && <p className="mx-auto mt-4 max-w-2xl text-slate-400">{subtitle}</p>}
    </div>
  );
}
