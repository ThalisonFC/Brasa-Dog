import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import {
  customerLoginSchema,
  type CustomerLoginSchemaIn,
} from '@/schemas/customerSchema';
import { useCustomer } from '@/hooks/useCustomer';
import { useAdmin } from '@/hooks/useAdmin';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function LoginCliente() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useCustomer();
  const { login: loginAdmin, isLoading: isLoadingAdmin } = useAdmin();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/conta', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<CustomerLoginSchemaIn>({
    resolver: zodResolver(customerLoginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: CustomerLoginSchemaIn) => {
    try {
      await login(data.email, data.password);
      navigate('/conta', { replace: true });
    } catch {
      try {
        await loginAdmin({ email: data.email, password: data.password });
        navigate('/admin/dashboard', { replace: true });
      } catch {
        setError('root', { message: 'E-mail ou senha invÃ¡lidos.' });
      }
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
        <h1
          className="mb-2 text-center text-2xl text-primary"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Entrar
        </h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Sua conta usa autenticação e sessão do Supabase.
        </p>
        <div className="mb-6 rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm">
          <p className="font-semibold text-primary">Acesso admin (pelo mesmo Entrar):</p>
          <p className="text-foreground">E-mail: admin@brasadog.com</p>
          <p className="text-foreground">Senha: BrasaDog@2024</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="cli-email" className="mb-1 block text-sm text-muted-foreground">
              E-mail
            </label>
            <Input
              id="cli-email"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>
          <div>
            <label htmlFor="cli-password" className="mb-1 block text-sm text-muted-foreground">
              Senha
            </label>
            <Input
              id="cli-password"
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
          <Button type="submit" disabled={isLoading || isLoadingAdmin} className="w-full py-3">
            {isLoading || isLoadingAdmin ? 'Entrandoâ€¦' : 'Entrar'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          NÃ£o tem conta?{' '}
          <Link to="/cadastro" className="font-semibold text-primary hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}

