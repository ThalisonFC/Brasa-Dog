import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Product, ProductCategory, ProductFormData } from '@/types';
import { productsService } from '@/services/products.service';
import { debounce } from '@/utils/debounce';
import { ProductForm } from '@/components/admin/ProductForm';
import { ProductTable } from '@/components/admin/ProductTable';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { CategoryTabs } from '@/components/menu/CategoryTabs';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/hooks/useToast';

export function AdminProducts() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ProductCategory | 'todos'>('todos');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const debouncedSetSearch = useMemo(
    () =>
      debounce((v: string) => {
        setSearch(v);
      }, 400),
    []
  );

  useEffect(() => {
    debouncedSetSearch(searchInput);
  }, [searchInput, debouncedSetSearch]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await productsService.getProducts();
      setProducts(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    let list = products;
    if (category !== 'todos') {
      list = list.filter((p) => p.category === category);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    return list;
  }, [products, category, search]);

  const handleSubmitProduct = async (data: ProductFormData, id?: string) => {
    if (id) {
      await productsService.updateProduct(id, data);
      showToast({ type: 'success', message: 'Produto atualizado.' });
    } else {
      await productsService.createProduct(data);
      showToast({ type: 'success', message: 'Produto criado.' });
    }
    await load();
  };

  const handleToggle = async (p: Product) => {
    await productsService.toggleAvailability(p.id);
    showToast({ type: 'info', message: 'Disponibilidade atualizada.' });
    await load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await productsService.deleteProduct(deleteTarget.id);
    showToast({ type: 'success', message: 'Produto removido.' });
    setDeleteTarget(null);
    await load();
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Button
          type="button"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="w-fit px-4 py-2"
        >
          Novo produto
        </Button>
        <div className="max-w-md flex-1">
          <label htmlFor="admin-product-search" className="sr-only">
            Buscar por nome
          </label>
          <Input
            id="admin-product-search"
            placeholder="Buscar por nome..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>

      <CategoryTabs value={category} onChange={setCategory} />

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">Nenhum produto encontrado.</p>
      ) : (
        <ProductTable
          products={filtered}
          onEdit={(p) => {
            setEditing(p);
            setFormOpen(true);
          }}
          onDelete={setDeleteTarget}
          onToggleAvailable={handleToggle}
        />
      )}

      <ProductForm
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        product={editing}
        onSubmitProduct={handleSubmitProduct}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Remover produto?"
        description="Esta ação não pode ser desfeita."
        confirmLabel="Remover"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
