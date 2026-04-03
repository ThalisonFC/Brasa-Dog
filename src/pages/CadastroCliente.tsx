import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import {
  customerRegisterSchema,
  type CustomerRegisterSchemaIn,
} from '@/schemas/customerSchema';
import { useCustomer } from '@/hooks/useCustomer';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function CadastroCliente() {
  const navigate = useNavigate();
  const { register: registerCustomer, isAuthenticated, isLoading } = useCustomer();

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
  } = useForm<CustomerRegisterSchemaIn>({
    resolver: zodResolver(customerRegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: CustomerRegisterSchemaIn) => {
    try {
      await registerCustomer(data);
      navigate('/conta', { replace: true });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Não foi possível cadastrar.';
      setError('root', { message: msg });
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
        <h1
          className="mb-2 text-center text-2xl text-primary"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Criar conta
        </h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Cadastro apenas neste aparelho (localStorage). Sem banco de dados.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="reg-name" className="mb-1 block text-sm text-muted-foreground">
              Nome completo
            </label>
            <Input id="reg-name" error={errors.name?.message} {...register('name')} />
          </div>
          <div>
            <label htmlFor="reg-email" className="mb-1 block text-sm text-muted-foreground">
              E-mail
            </label>
            <Input
              id="reg-email"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>
          <div>
            <label htmlFor="reg-phone" className="mb-1 block text-sm text-muted-foreground">
              Telefone (com DDD)
            </label>
            <Input
              id="reg-phone"
              type="tel"
              autoComplete="tel"
              placeholder="(11) 99999-9999"
              error={errors.phone?.message}
              {...register('phone')}
            />
          </div>
          <div>
            <label htmlFor="reg-pass" className="mb-1 block text-sm text-muted-foreground">
              Senha
            </label>
            <Input
              id="reg-pass"
              type="password"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password')}
            />
          </div>
          <div>
            <label htmlFor="reg-pass2" className="mb-1 block text-sm text-muted-foreground">
              Confirmar senha
            </label>
            <Input
              id="reg-pass2"
              type="password"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </div>
          {errors.root?.message ? (
            <p className="text-sm text-red-400" role="alert">
              {errors.root.message}
            </p>
          ) : null}
          <Button type="submit" disabled={isLoading} className="w-full py-3">
            {isLoading ? 'Cadastrando…' : 'Cadastrar'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Já tem conta?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
