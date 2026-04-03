import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { ToastMessage } from '@/types';
import { generateId } from '@/utils/generateId';

type ToastInput = Omit<ToastMessage, 'id'> & { id?: string };

type ToastContextValue = {
  toasts: ToastMessage[];
  showToast: (t: ToastInput) => void;
  dismissToast: (id: string) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (t: ToastInput) => {
      const id = t.id ?? generateId();
      const toast: ToastMessage = {
        id,
        type: t.type,
        message: t.message,
        duration: t.duration ?? 3000,
      };
      setToasts((prev) => [...prev, toast]);
      const ms = toast.duration ?? 3000;
      if (ms > 0) {
        window.setTimeout(() => dismissToast(id), ms);
      }
    },
    [dismissToast]
  );

  const value = useMemo(
    () => ({ toasts, showToast, dismissToast }),
    [toasts, showToast, dismissToast]
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}
