import { useEffect, useId, useRef, type ReactNode } from 'react';
import { useFocusTrap } from '@/hooks/useFocusTrap';

type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  side?: 'right';
  titleId?: string;
  widthClass?: string;
  labelledBy?: string;
};

export function Drawer({
  isOpen,
  onClose,
  children,
  titleId: titleIdProp,
  widthClass = 'w-full max-w-md sm:max-w-[480px]',
  labelledBy,
}: DrawerProps) {
  const autoId = useId();
  const titleId = titleIdProp ?? labelledBy ?? autoId;
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
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`fixed right-0 top-0 z-50 flex h-full flex-col border-l border-border bg-card shadow-2xl ${widthClass}`.trim()}
      >
        {children}
      </div>
    </>
  );
}
