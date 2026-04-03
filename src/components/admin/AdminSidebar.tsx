import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FileText,
  Settings,
  ClipboardList,
  LogOut,
} from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';

const nav = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Produtos', icon: Package },
  { to: '/admin/content', label: 'Conteúdo', icon: FileText },
  { to: '/admin/orders', label: 'Pedidos', icon: ClipboardList },
  { to: '/admin/settings', label: 'Configurações', icon: Settings },
];

type AdminSidebarProps = {
  mobileOpen: boolean;
  onNavigate?: () => void;
};

export function AdminSidebar({ mobileOpen, onNavigate }: AdminSidebarProps) {
  const { logout } = useAdmin();
  const navigate = useNavigate();

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-full w-64 border-r border-border bg-card transition-transform md:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`.trim()}
      aria-label="Navegação administrativa"
    >
      <div className="flex h-full flex-col p-4">
        <div
          className="mb-8 px-2 text-xl font-bold text-primary"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          BrasaDog Admin
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'border-l-2 border-primary bg-primary/10 font-medium text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`.trim()
              }
            >
              <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => {
            void logout().then(() => navigate('/admin/login', { replace: true }));
          }}
          className="mt-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-destructive"
        >
          <LogOut className="h-[18px] w-[18px]" aria-hidden />
          Sair
        </button>
      </div>
    </aside>
  );
}
