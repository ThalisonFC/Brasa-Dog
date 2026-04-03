import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type {
  Addon,
  Product,
  ProductBreadOption,
  ProductCategory,
  ProductFormData,
  ProductSausageOption,
} from '@/types';
import { buildDefaultCustomizationConfig } from '@/data/customization';
import { productSchema } from '@/schemas/productSchema';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { generateId } from '@/utils/generateId';
import { isValidImageUrl } from '@/utils/validators';

type ProductFormProps = {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSubmitProduct: (data: ProductFormData, id?: string) => Promise<void>;
};

const categories: { value: ProductCategory; label: string }[] = [
  { value: 'classicos', label: 'Clássicos' },
  { value: 'especiais', label: 'Especiais' },
  { value: 'combos', label: 'Combos' },
  { value: 'bebidas', label: 'Bebidas' },
];

export function ProductForm({
  isOpen,
  onClose,
  product,
  onSubmitProduct,
}: ProductFormProps) {
  const [breads, setBreads] = useState<ProductBreadOption[]>([]);
  const [sausages, setSausages] = useState<ProductSausageOption[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [newBread, setNewBread] = useState({ label: '', priceModifier: 0 });
  const [newSausage, setNewSausage] = useState({ label: '', priceModifier: 0 });
  const [newAddon, setNewAddon] = useState({ label: '', price: 0 });
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      imageUrl: '',
      basePrice: 1,
      category: 'classicos',
      available: true,
      featured: false,
      customizationConfig: buildDefaultCustomizationConfig(),
    },
  });

  const imageUrl = watch('imageUrl');

  useEffect(() => {
    if (isOpen) {
      if (product) {
        reset({
          name: product.name,
          description: product.description,
          imageUrl: product.imageUrl,
          basePrice: product.basePrice,
          category: product.category,
          available: product.available,
          featured: product.featured,
          customizationConfig: product.customizationConfig,
        });
        setBreads(product.customizationConfig.breads);
        setSausages(product.customizationConfig.sausages);
        setAddons(product.customizationConfig.addons);
      } else {
        const defaults = buildDefaultCustomizationConfig();
        reset({
          name: '',
          description: '',
          imageUrl: '',
          basePrice: 1,
          category: 'classicos',
          available: true,
          featured: false,
          customizationConfig: defaults,
        });
        setBreads(defaults.breads);
        setSausages(defaults.sausages);
        setAddons(defaults.addons);
      }
      setNewBread({ label: '', priceModifier: 0 });
      setNewSausage({ label: '', priceModifier: 0 });
      setNewAddon({ label: '', price: 0 });
    }
  }, [isOpen, product, reset]);

  const submit = async (data: ProductFormData) => {
    if (breads.length === 0 || breads.every((b) => !b.available)) {
      setError('root', {
        message: 'Mantenha ao menos um pão ativo para o produto.',
      });
      return;
    }
    if (sausages.length === 0 || sausages.every((s) => !s.available)) {
      setError('root', {
        message: 'Mantenha ao menos uma salsicha ativa para o produto.',
      });
      return;
    }
    clearErrors('root');
    const finalData: ProductFormData = {
      ...data,
      customizationConfig: {
        breads,
        sausages,
        addons,
      },
    };
    await onSubmitProduct(finalData, product?.id);
    onClose();
  };

  const showPreview = imageUrl && isValidImageUrl(imageUrl);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Editar produto' : 'Novo produto'}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <div>
          <label htmlFor="pf-name" className="mb-1 block text-sm text-muted-foreground">
            Nome
          </label>
          <Input id="pf-name" error={errors.name?.message} {...register('name')} />
        </div>
        <div>
          <label htmlFor="pf-desc" className="mb-1 block text-sm text-muted-foreground">
            Descrição
          </label>
          <Textarea id="pf-desc" error={errors.description?.message} {...register('description')} />
        </div>
        <div>
          <label htmlFor="pf-img" className="mb-1 block text-sm text-muted-foreground">
            URL da imagem
          </label>
          <Input id="pf-img" type="url" error={errors.imageUrl?.message} {...register('imageUrl')} />
          {showPreview ? (
            <img
              src={imageUrl}
              alt=""
              width={320}
              height={200}
              className="mt-2 max-h-40 rounded-lg border border-border object-cover"
            />
          ) : null}
        </div>
        <div>
          <label htmlFor="pf-price" className="mb-1 block text-sm text-muted-foreground">
            Preço base
          </label>
          <Input
            id="pf-price"
            type="number"
            step="0.01"
            min={0}
            error={errors.basePrice?.message}
            {...register('basePrice', { valueAsNumber: true })}
          />
        </div>
        <div>
          <label htmlFor="pf-cat" className="mb-1 block text-sm text-muted-foreground">
            Categoria
          </label>
          <Select id="pf-cat" error={errors.category?.message} {...register('category')}>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" {...register('available')} className="h-4 w-4 rounded" />
            Disponível
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" {...register('featured')} className="h-4 w-4 rounded" />
            Destaque
          </label>
        </div>
        <section className="space-y-4 rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold text-primary">Variações de pães</h3>
          <div className="space-y-2">
            {breads.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2 rounded border border-border p-2"
              >
                <span className="text-sm text-foreground">{item.label}</span>
                <Input
                  type="number"
                  step="0.01"
                  value={item.priceModifier}
                  onChange={(e) =>
                    setBreads((prev) =>
                      prev.map((x) =>
                        x.id === item.id ? { ...x, priceModifier: Number(e.target.value) || 0 } : x
                      )
                    )
                  }
                  className="w-24"
                />
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={item.available}
                    onChange={() =>
                      setBreads((prev) =>
                        prev.map((x) =>
                          x.id === item.id ? { ...x, available: !x.available } : x
                        )
                      )
                    }
                  />
                  Ativo
                </label>
                <button
                  type="button"
                  disabled={breads.length <= 1}
                  onClick={() => setBreads((prev) => prev.filter((x) => x.id !== item.id))}
                  className="text-xs text-destructive disabled:opacity-40"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-[1fr_120px_auto] gap-2">
            <Input
              placeholder="Novo pão"
              value={newBread.label}
              onChange={(e) => setNewBread((p) => ({ ...p, label: e.target.value }))}
            />
            <Input
              type="number"
              step="0.01"
              value={newBread.priceModifier}
              onChange={(e) =>
                setNewBread((p) => ({ ...p, priceModifier: Number(e.target.value) || 0 }))
              }
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (!newBread.label.trim()) return;
                setBreads((prev) => [
                  ...prev,
                  {
                    id: `bread-${generateId()}`,
                    label: newBread.label.trim(),
                    priceModifier: newBread.priceModifier,
                    available: true,
                  },
                ]);
                setNewBread({ label: '', priceModifier: 0 });
              }}
            >
              Adicionar
            </Button>
          </div>
        </section>

        <section className="space-y-4 rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold text-primary">Variações de salsicha</h3>
          <div className="space-y-2">
            {sausages.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2 rounded border border-border p-2"
              >
                <span className="text-sm text-foreground">{item.label}</span>
                <Input
                  type="number"
                  step="0.01"
                  value={item.priceModifier}
                  onChange={(e) =>
                    setSausages((prev) =>
                      prev.map((x) =>
                        x.id === item.id ? { ...x, priceModifier: Number(e.target.value) || 0 } : x
                      )
                    )
                  }
                  className="w-24"
                />
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={item.available}
                    onChange={() =>
                      setSausages((prev) =>
                        prev.map((x) =>
                          x.id === item.id ? { ...x, available: !x.available } : x
                        )
                      )
                    }
                  />
                  Ativo
                </label>
                <button
                  type="button"
                  disabled={sausages.length <= 1}
                  onClick={() => setSausages((prev) => prev.filter((x) => x.id !== item.id))}
                  className="text-xs text-destructive disabled:opacity-40"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-[1fr_120px_auto] gap-2">
            <Input
              placeholder="Nova salsicha"
              value={newSausage.label}
              onChange={(e) => setNewSausage((p) => ({ ...p, label: e.target.value }))}
            />
            <Input
              type="number"
              step="0.01"
              value={newSausage.priceModifier}
              onChange={(e) =>
                setNewSausage((p) => ({ ...p, priceModifier: Number(e.target.value) || 0 }))
              }
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (!newSausage.label.trim()) return;
                setSausages((prev) => [
                  ...prev,
                  {
                    id: `sausage-${generateId()}`,
                    label: newSausage.label.trim(),
                    priceModifier: newSausage.priceModifier,
                    available: true,
                  },
                ]);
                setNewSausage({ label: '', priceModifier: 0 });
              }}
            >
              Adicionar
            </Button>
          </div>
        </section>

        <section className="space-y-4 rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold text-primary">Ingredientes adicionais</h3>
          <div className="space-y-2">
            {addons.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2 rounded border border-border p-2"
              >
                <span className="text-sm text-foreground">{item.label}</span>
                <Input
                  type="number"
                  step="0.01"
                  value={item.price}
                  onChange={(e) =>
                    setAddons((prev) =>
                      prev.map((x) =>
                        x.id === item.id ? { ...x, price: Number(e.target.value) || 0 } : x
                      )
                    )
                  }
                  className="w-24"
                />
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={item.available}
                    onChange={() =>
                      setAddons((prev) =>
                        prev.map((x) =>
                          x.id === item.id ? { ...x, available: !x.available } : x
                        )
                      )
                    }
                  />
                  Ativo
                </label>
                <button
                  type="button"
                  disabled={addons.length <= 1}
                  onClick={() => setAddons((prev) => prev.filter((x) => x.id !== item.id))}
                  className="text-xs text-destructive disabled:opacity-40"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-[1fr_120px_auto] gap-2">
            <Input
              placeholder="Novo adicional"
              value={newAddon.label}
              onChange={(e) => setNewAddon((p) => ({ ...p, label: e.target.value }))}
            />
            <Input
              type="number"
              step="0.01"
              value={newAddon.price}
              onChange={(e) => setNewAddon((p) => ({ ...p, price: Number(e.target.value) || 0 }))}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (!newAddon.label.trim()) return;
                setAddons((prev) => [
                  ...prev,
                  {
                    id: `addon-${generateId()}`,
                    label: newAddon.label.trim(),
                    price: newAddon.price,
                    available: true,
                  },
                ]);
                setNewAddon({ label: '', price: 0 });
              }}
            >
              Adicionar
            </Button>
          </div>
        </section>
        {errors.root?.message ? (
          <p className="text-sm text-red-400" role="alert">
            {errors.root.message}
          </p>
        ) : null}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="px-4 py-2">
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} className="px-4 py-2">
            Salvar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
