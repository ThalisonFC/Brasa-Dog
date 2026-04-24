import { menuProducts } from '@/data/menu';
import { buildDefaultCustomizationConfig } from '@/data/customization';
import type { Product, ProductFormData } from '@/types';
import { generateId } from '@/utils/generateId';
import { createClient } from '@/utils/supabase/client';

type ProductRow = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  base_price: number;
  category: Product['category'];
  available: boolean;
  featured: boolean;
  customization_config: Product['customizationConfig'];
  created_at: string;
  updated_at: string;
};

function ensureCustomization(product: Product): Product {
  const fallback = buildDefaultCustomizationConfig();
  const config = product.customizationConfig ?? fallback;
  return {
    ...product,
    customizationConfig: {
      breads:
        config.breads?.map((b, i) => ({
          ...b,
          available: 'available' in b ? !!b.available : fallback.breads[i]?.available ?? true,
        })) ?? fallback.breads,
      sausages:
        config.sausages?.map((s, i) => ({
          ...s,
          available: 'available' in s ? !!s.available : fallback.sausages[i]?.available ?? true,
        })) ?? fallback.sausages,
      addons:
        config.addons?.map((a, i) => ({
          ...a,
          available: 'available' in a ? !!a.available : fallback.addons[i]?.available ?? true,
        })) ?? fallback.addons,
    },
  };
}

function toProduct(row: ProductRow): Product {
  return ensureCustomization({
    id: row.id,
    name: row.name,
    description: row.description,
    imageUrl: row.image_url,
    basePrice: Number(row.base_price),
    category: row.category,
    available: row.available,
    featured: row.featured,
    customizationConfig: row.customization_config,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

function toRow(product: Product): ProductRow {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    image_url: product.imageUrl,
    base_price: product.basePrice,
    category: product.category,
    available: product.available,
    featured: product.featured,
    customization_config: ensureCustomization(product).customizationConfig,
    created_at: product.createdAt,
    updated_at: product.updatedAt,
  };
}

async function seedIfEmpty(): Promise<void> {
  const supabase = createClient();
  const { count, error } = await supabase
    .from('app_products')
    .select('id', { count: 'exact', head: true });
  if (error) throw new Error(error.message);
  if ((count ?? 0) > 0) return;
  const seedRows = menuProducts.map((p) => toRow(ensureCustomization(p)));
  const { error: insertError } = await supabase.from('app_products').upsert(seedRows, {
    onConflict: 'id',
  });
  if (insertError) throw new Error(insertError.message);
}

function fallbackProducts(): Product[] {
  return menuProducts.map((p) => ensureCustomization({ ...p }));
}

export const productsService = {
  async getProducts(): Promise<Product[]> {
    try {
      await seedIfEmpty();
      const supabase = createClient();
      const { data, error } = await supabase
        .from('app_products')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw new Error(error.message);
      return (data as ProductRow[]).map(toProduct);
    } catch {
      // Mantém o cardápio público funcionando enquanto o schema/policies do Supabase não estão prontos.
      return fallbackProducts();
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('app_products')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? toProduct(data as ProductRow) : null;
  },

  async createProduct(data: ProductFormData): Promise<Product> {
    const now = new Date().toISOString();
    const product: Product = {
      id: generateId(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    const supabase = createClient();
    const { error } = await supabase.from('app_products').insert(toRow(product));
    if (error) throw new Error(error.message);
    return product;
  },

  async updateProduct(id: string, data: Partial<ProductFormData>): Promise<Product> {
    const current = await this.getProductById(id);
    if (!current) throw new Error('Produto não encontrado');
    const updated = ensureCustomization({
      ...current,
      ...data,
      updatedAt: new Date().toISOString(),
    });
    const supabase = createClient();
    const { error } = await supabase
      .from('app_products')
      .update(toRow(updated))
      .eq('id', id);
    if (error) throw new Error(error.message);
    return updated;
  },

  async deleteProduct(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from('app_products').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  async toggleAvailability(id: string): Promise<Product> {
    const current = await this.getProductById(id);
    if (!current) throw new Error('Produto não encontrado');
    const updated = {
      ...current,
      available: !current.available,
      updatedAt: new Date().toISOString(),
    };
    const supabase = createClient();
    const { error } = await supabase
      .from('app_products')
      .update(toRow(updated))
      .eq('id', id);
    if (error) throw new Error(error.message);
    return updated;
  },
};
