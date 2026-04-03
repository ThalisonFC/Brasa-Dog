import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Product, ProductCategory } from '@/types';
import { productsService } from '@/services/products.service';
import { Spinner } from '@/components/ui/Spinner';
import { CategoryTabs } from './CategoryTabs';
import { ProductCard } from './ProductCard';

type ProductGridProps = {
  onCustomize: (product: Product) => void;
};

export function ProductGrid({ onCustomize }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<ProductCategory | 'todos'>('todos');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await productsService.getProducts();
      setProducts(list);
    } catch {
      setError('Não foi possível carregar o cardápio.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = useMemo(() => {
    const availableOnly = products.filter((p) => p.available);
    if (category === 'todos') return availableOnly;
    return availableOnly.filter((p) => p.category === category);
  }, [products, category]);

  if (loading) {
    return <Spinner label="Carregando cardápio" />;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-card p-6 text-center text-destructive">
        {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        Nenhum produto cadastrado no momento.
      </p>
    );
  }

  return (
    <>
      <CategoryTabs value={category} onChange={setCategory} />
      {visible.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          Nenhum item nesta categoria.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} onCustomize={onCustomize} />
          ))}
        </div>
      )}
    </>
  );
}
