import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCustomer } from '@/hooks/useCustomer';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

export function ContaCliente() {
  const navigate = useNavigate();
  const { session, isAuthenticated, isLoading, logout } = useCustomer();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
        <h1
          className="mb-6 text-2xl text-primary"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Minha conta
        </h1>
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Nome</dt>
            <dd className="text-foreground">{session.user.name}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">E-mail</dt>
            <dd className="text-foreground">{session.user.email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Telefone</dt>
            <dd className="text-foreground">{session.user.phone || '—'}</dd>
          </div>
        </dl>
        <p className="mt-6 text-xs text-muted-foreground">
          Os dados ficam apenas neste navegador. Para produção, integre um servidor seguro.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/"
            className="rounded-lg border-2 border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Voltar ao site
          </Link>
          <Button
            type="button"
            variant="outline"
            className="px-4 py-2"
            onClick={() => {
              void logout().then(() => navigate('/', { replace: true }));
            }}
          >
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
}
