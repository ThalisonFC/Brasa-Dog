import { Loader2 } from 'lucide-react';

type SpinnerProps = {
  className?: string;
  fullscreen?: boolean;
  label?: string;
};

export function Spinner({ className = '', fullscreen, label = 'Carregando' }: SpinnerProps) {
  const icon = (
    <Loader2
      className={`w-8 h-8 text-primary animate-spin ${className}`}
      aria-hidden
    />
  );
  if (fullscreen) {
    return (
      <div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-3 bg-background/90"
        role="status"
        aria-live="polite"
        aria-label={label}
      >
        {icon}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
    );
  }
  return (
    <div className="flex justify-center py-12" role="status" aria-live="polite" aria-label={label}>
      {icon}
    </div>
  );
}
