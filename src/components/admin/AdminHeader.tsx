import { Menu } from 'lucide-react';

type AdminHeaderProps = {
  title: string;
  onMenuClick: () => void;
};

export function AdminHeader({ title, onMenuClick }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border bg-background px-4 py-3 md:px-6">
      <button
        type="button"
        className="rounded-lg p-2 text-foreground hover:bg-muted md:hidden"
        onClick={onMenuClick}
        aria-label="Abrir menu"
      >
        <Menu className="h-6 w-6" />
      </button>
      <h1 className="text-lg font-semibold text-foreground md:text-xl">{title}</h1>
    </header>
  );
}
