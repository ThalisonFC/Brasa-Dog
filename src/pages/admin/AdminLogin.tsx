import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { loginSchema, type LoginSchemaIn } from '@/schemas/loginSchema';
import { useAdmin } from '@/hooks/useAdmin';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAdmin();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginSchemaIn>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginSchemaIn) => {
    try {
      await login(data);
      navigate('/admin/dashboard', { replace: true });
    } catch {
      setError('root', { message: 'E-mail ou senha inválidos' });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
        <h1
          className="mb-2 text-center text-2xl text-primary"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Acesso administrativo
        </h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Login apenas neste navegador (localStorage). Sem banco de dados — credenciais padrão definidas no código
          para demonstração.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-1 block text-sm text-muted-foreground">
              E-mail
            </label>
            <Input
              id="admin-email"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1 block text-sm text-muted-foreground">
              Senha
            </label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />
          </div>
          {errors.root?.message ? (
            <p className="text-sm text-red-400" role="alert">
              {errors.root.message}
            </p>
          ) : null}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-3"
          >
            {isLoading ? 'Entrando…' : 'Entrar'}
          </Button>
        </form>
      </div>
    </div>
  );
}
