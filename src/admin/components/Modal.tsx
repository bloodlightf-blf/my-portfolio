// 通用弹窗容器。
import type { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** 宽版弹窗（用于 Markdown 编辑器等场景） */
  wide?: boolean;
}

export default function Modal({ open, title, onClose, children, wide }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4">
      <div className={`my-8 w-full ${wide ? 'max-w-4xl' : 'max-w-xl'} rounded-2xl border border-slate-700 bg-surface p-6`}>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold">{title}</h3>
          <button type="button" onClick={onClose} className="text-slate-400 transition hover:text-white" aria-label="关闭">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
