import { X } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

const typeStyles = {
  success: 'border-green-600/50 bg-green-950/90 text-green-100',
  error: 'border-red-600/50 bg-red-950/90 text-red-100',
  warning: 'border-yellow-600/50 bg-yellow-950/90 text-yellow-100',
  info: 'border-primary/50 bg-card text-foreground',
};

export function ToastViewport() {
  const { toasts, dismissToast } = useToast();

  return (
    <div
      className="pointer-events-none fixed right-4 top-4 z-[200] flex max-w-sm flex-col gap-2"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex translate-x-0 items-start gap-2 rounded-lg border p-3 shadow-lg transition-all duration-300 ${typeStyles[t.type]}`.trim()}
          role="status"
        >
          <p className="flex-1 text-sm">{t.message}</p>
          <button
            type="button"
            onClick={() => dismissToast(t.id)}
            className="shrink-0 text-current opacity-70 hover:opacity-100"
            aria-label="Fechar notificação"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
