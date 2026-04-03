import { forwardRef, type ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'outline' | 'ghost' | 'danger';

const variants: Record<Variant, string> = {
  primary:
    'bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-all',
  outline:
    'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold rounded-lg transition-all',
  ghost: 'text-muted-foreground hover:text-foreground transition-colors',
  danger: 'text-destructive hover:text-destructive/80 text-sm transition-colors',
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={`${variants[variant]} ${className}`.trim()}
      {...props}
    />
  )
);
Button.displayName = 'Button';
