import { z } from 'zod';

const urlOrPath = z.union([z.string().url(), z.string().min(10)]);

export const siteContentSchema = z.object({
  hero: z.object({
    headline: z.string().min(1),
    subheadline: z.string().min(1),
    ctaText: z.string().min(1),
    backgroundImageUrl: urlOrPath,
  }),
  about: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    imageUrl: urlOrPath,
  }),
  contact: z.object({
    whatsappNumber: z
      .string()
      .min(10, 'Use o formato com DDD e número (apenas dígitos)')
      .regex(/^\d+$/, 'Apenas dígitos, ex: 5511999999999'),
    address: z.string().min(1),
    openingHours: z.string().min(1),
    instagram: z.string().min(1),
  }),
  footer: z.object({
    tagline: z.string().min(1),
  }),
});

export type SiteContentSchemaIn = z.infer<typeof siteContentSchema>;
