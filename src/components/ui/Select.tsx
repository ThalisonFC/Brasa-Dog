import { forwardRef, type SelectHTMLAttributes } from 'react';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', error, id, children, ...props }, ref) => (
    <div className="w-full">
      <select
        ref={ref}
        id={id}
        className={`w-full rounded-lg border border-border bg-input-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${className}`.trim()}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <p id={`${id}-err`} className="mt-1 text-xs text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
);
Select.displayName = 'Select';
