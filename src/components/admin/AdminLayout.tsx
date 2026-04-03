import { Suspense, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Spinner } from '@/components/ui/Spinner';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

const titles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/products': 'Produtos',
  '/admin/content': 'Conteúdo do site',
  '/admin/settings': 'Configurações',
  '/admin/orders': 'Pedidos',
};

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const title = useMemo(() => {
    const path = location.pathname.replace(/\/$/, '') || '/admin/dashboard';
    return titles[path] ?? 'Admin';
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminSidebar
        mobileOpen={mobileOpen}
        onNavigate={() => setMobileOpen(false)}
      />
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          aria-label="Fechar menu"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div className="md:pl-64">
        <AdminHeader title={title} onMenuClick={() => setMobileOpen(true)} />
        <div className="p-4 md:p-6">
          <Suspense fallback={<Spinner />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
