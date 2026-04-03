import { Navigate, Outlet } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { Spinner } from '@/components/ui/Spinner';
import { authService } from '@/services/auth.service';

export function ProtectedRoutes() {
  const { isAuthenticated, isLoading, session } = useAdmin();

  if (isLoading) {
    return <Spinner fullscreen label="Verificando sessão" />;
  }

  if (!session || !isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!authService.validateSession(session.token)) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
