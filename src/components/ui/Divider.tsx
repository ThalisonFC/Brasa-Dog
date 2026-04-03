export function Divider({ className = '' }: { className?: string }) {
  return <div className={`h-px w-full bg-border ${className}`.trim()} role="separator" />;
}
