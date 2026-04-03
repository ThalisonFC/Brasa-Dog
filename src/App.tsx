import { CartProvider } from '@/context/CartContext';
import { AdminProvider } from '@/context/AdminContext';
import { CustomerProvider } from '@/context/CustomerContext';
import { ToastProvider } from '@/context/ToastContext';
import { SiteContentProvider } from '@/context/SiteContentContext';
import { AppRouter } from '@/routes/AppRouter';
import { ToastViewport } from '@/components/ui/Toast';

export default function App() {
  return (
    <ToastProvider>
      <AdminProvider>
        <CustomerProvider>
          <SiteContentProvider>
            <CartProvider>
              <AppRouter />
              <ToastViewport />
            </CartProvider>
          </SiteContentProvider>
        </CustomerProvider>
      </AdminProvider>
    </ToastProvider>
  );
}
