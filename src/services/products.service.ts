import { menuProducts } from '@/data/menu';
import { buildDefaultCustomizationConfig } from '@/data/customization';
import type { Product, ProductFormData } from '@/types';
import { generateId } from '@/utils/generateId';
import { storageService } from './storage.service';

const KEY = 'brasadog_products';

// TODO: Substituir implementação por chamadas Supabase

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function readAll(): Product[] {
  let list = storageService.get<Product[]>(KEY);
  if (!list || list.length === 0) {
    list = [...menuProducts];
    storageService.set(KEY, list);
  }
  // Migração leve: produtos antigos sem customizationConfig recebem o padrão.
  const migrated = list.map((product) => {
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
            available:
              'available' in s ? !!s.available : fallback.sausages[i]?.available ?? true,
          })) ?? fallback.sausages,
        addons:
          config.addons?.map((a, i) => ({
            ...a,
            available: 'available' in a ? !!a.available : fallback.addons[i]?.available ?? true,
          })) ?? fallback.addons,
      },
    };
  });
  if (JSON.stringify(migrated) !== JSON.stringify(list)) {
    storageService.set(KEY, migrated);
  }
  return migrated;
}

function writeAll(products: Product[]): void {
  storageService.set(KEY, products);
}

export const productsService = {
  async getProducts(): Promise<Product[]> {
    return delay([...readAll()]);
  },

  async getProductById(id: string): Promise<Product | null> {
    const p = readAll().find((x) => x.id === id) ?? null;
    return delay(p);
  },

  async createProduct(data: ProductFormData): Promise<Product> {
    const now = new Date().toISOString();
    const product: Product = {
      id: generateId(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    const list = readAll();
    list.push(product);
    writeAll(list);
    return delay(product);
  },

  async updateProduct(id: string, data: Partial<ProductFormData>): Promise<Product> {
    const list = readAll();
    const i = list.findIndex((p) => p.id === id);
    if (i === -1) throw new Error('Produto não encontrado');
    const updated: Product = {
      ...list[i],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    list[i] = updated;
    writeAll(list);
    return delay(updated);
  },

  async deleteProduct(id: string): Promise<void> {
    writeAll(readAll().filter((p) => p.id !== id));
    return delay(undefined);
  },

  async toggleAvailability(id: string): Promise<Product> {
    const list = readAll();
    const i = list.findIndex((p) => p.id === id);
    if (i === -1) throw new Error('Produto não encontrado');
    list[i] = {
      ...list[i],
      available: !list[i].available,
      updatedAt: new Date().toISOString(),
    };
    writeAll(list);
    return delay(list[i]);
  },
};
