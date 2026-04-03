import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useFocusTrap } from '@/hooks/useFocusTrap';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
  labelledBy?: string;
  className?: string;
};

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  labelledBy,
  className = '',
}: ModalProps) {
  const autoId = useId();
  const titleId = labelledBy ?? autoId;
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(isOpen, ref);

  useEffect(() => {
    if (!isOpen) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative z-[81] max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl ${className}`.trim()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card p-4">
          <h2 id={titleId} className="text-lg text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Fechar modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
