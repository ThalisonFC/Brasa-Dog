import { Navigate, Outlet } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { Spinner } from '@/components/ui/Spinner';

export function ProtectedRoutes() {
  const { isAuthenticated, isLoading, session } = useAdmin();

  if (isLoading) {
    return <Spinner fullscreen label="Verificando sessão" />;
  }

  if (!session || !isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
