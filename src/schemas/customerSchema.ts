import { z } from 'zod';

export const customerRegisterSchema = z
  .object({
    name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(80),
    email: z.string().email('E-mail inválido'),
    phone: z.string().refine((s) => s.replace(/\D/g, '').length >= 10, {
      message: 'Informe um telefone com DDD (mín. 10 dígitos)',
    }),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type CustomerRegisterSchemaIn = z.infer<typeof customerRegisterSchema>;

export const customerLoginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export type CustomerLoginSchemaIn = z.infer<typeof customerLoginSchema>;
