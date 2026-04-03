import type { HTMLAttributes } from 'react';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'secondary';
};

export function Badge({ className = '', variant = 'default', ...props }: BadgeProps) {
  const base =
    variant === 'default'
      ? 'bg-primary text-primary-foreground'
      : 'bg-secondary text-secondary-foreground';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${base} ${className}`.trim()}
      {...props}
    />
  );
}
