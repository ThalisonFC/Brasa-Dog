import { Suspense, lazy, type ReactNode } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Home } from '@/pages/Home';
import { LoginCliente } from '@/pages/LoginCliente';
import { CadastroCliente } from '@/pages/CadastroCliente';
import { ContaCliente } from '@/pages/ContaCliente';
import { NotFound } from '@/pages/NotFound';
import { ProtectedRoutes } from './ProtectedRoutes';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Spinner } from '@/components/ui/Spinner';

const AdminLogin = lazy(() =>
  import('@/pages/admin/AdminLogin').then((m) => ({ default: m.AdminLogin }))
);
const AdminDashboard = lazy(() =>
  import('@/pages/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
const AdminProducts = lazy(() =>
  import('@/pages/admin/AdminProducts').then((m) => ({ default: m.AdminProducts }))
);
const AdminContent = lazy(() =>
  import('@/pages/admin/AdminContent').then((m) => ({ default: m.AdminContent }))
);
const AdminSettings = lazy(() =>
  import('@/pages/admin/AdminSettings').then((m) => ({ default: m.AdminSettings }))
);
const AdminOrders = lazy(() =>
  import('@/pages/admin/AdminOrders').then((m) => ({ default: m.AdminOrders }))
);

function AdminLoginSuspense({ children }: { children: ReactNode }) {
  return <Suspense fallback={<Spinner fullscreen />}>{children}</Suspense>;
}

export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <LoginCliente />
            </Layout>
          }
        />
        <Route
          path="/cadastro"
          element={
            <Layout>
              <CadastroCliente />
            </Layout>
          }
        />
        <Route
          path="/conta"
          element={
            <Layout>
              <ContaCliente />
            </Layout>
          }
        />
        <Route path="/404" element={<NotFound />} />
        <Route
          path="/admin/login"
          element={
            <AdminLoginSuspense>
              <Layout>
                <AdminLogin />
              </Layout>
            </AdminLoginSuspense>
          }
        />
        <Route element={<ProtectedRoutes />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
