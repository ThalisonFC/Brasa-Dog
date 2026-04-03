import { z } from 'zod';

const productCategories = ['classicos', 'especiais', 'combos', 'bebidas'] as const;

export const productSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(80, 'Nome deve ter no máximo 80 caracteres'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  imageUrl: z
    .string()
    .min(1, 'URL da imagem é obrigatória')
    .refine(
      (v) => /^https?:\/\//i.test(v),
      'Informe uma URL http(s) válida'
    ),
  basePrice: z.coerce.number().positive('Preço deve ser maior que zero'),
  category: z.enum(productCategories, {
    message: 'Selecione uma categoria',
  }),
  available: z.boolean(),
  featured: z.boolean(),
  customizationConfig: z.object({
    breads: z
      .array(
        z.object({
          id: z.string().min(1),
          label: z.string().min(1),
          priceModifier: z.number(),
          available: z.boolean(),
        })
      )
      .min(1),
    sausages: z
      .array(
        z.object({
          id: z.string().min(1),
          label: z.string().min(1),
          priceModifier: z.number(),
          available: z.boolean(),
        })
      )
      .min(1),
    addons: z
      .array(
        z.object({
          id: z.string().min(1),
          label: z.string().min(1),
          price: z.number(),
          available: z.boolean(),
        })
      )
      .min(1),
  }),
});

export type ProductSchemaIn = z.infer<typeof productSchema>;
