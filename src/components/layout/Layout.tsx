import { useEffect, useState, type ReactNode } from 'react';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { settingsService } from '@/services/settings.service';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout({ children }: { children: ReactNode }) {
  const [maintenance, setMaintenance] = useState(false);

  useEffect(() => {
    void settingsService.getSettings().then((s) => setMaintenance(s.maintenanceMode));
  }, []);

  useEffect(() => {
    const onEvt = () => {
      void settingsService.getSettings().then((s) => setMaintenance(s.maintenanceMode));
    };
    window.addEventListener('brasadog:settings', onEvt);
    return () => window.removeEventListener('brasadog:settings', onEvt);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {maintenance && (
        <div
          className="border-b border-primary/40 bg-primary/10 px-4 py-2 text-center text-sm text-primary"
          role="status"
        >
          Estamos em manutenção. Pedidos podem sofrer atraso.
        </div>
      )}
      <Header />
      <main className="pt-[72px]">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
