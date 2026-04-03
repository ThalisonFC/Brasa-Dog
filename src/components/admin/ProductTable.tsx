import { Pencil, Trash2 } from 'lucide-react';
import type { Product, ProductCategory } from '@/types';
import { formatCurrency } from '@/utils/formatCurrency';

const catLabel: Record<ProductCategory, string> = {
  classicos: 'Clássicos',
  especiais: 'Especiais',
  combos: 'Combos',
  bebidas: 'Bebidas',
};

type ProductTableProps = {
  products: Product[];
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
  onToggleAvailable: (p: Product) => void;
};

export function ProductTable({
  products,
  onEdit,
  onDelete,
  onToggleAvailable,
}: ProductTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-muted/80 text-muted-foreground">
          <tr>
            <th scope="col" className="p-3">
              Imagem
            </th>
            <th scope="col" className="p-3">
              Nome
            </th>
            <th scope="col" className="p-3">
              Categoria
            </th>
            <th scope="col" className="p-3">
              Preço
            </th>
            <th scope="col" className="p-3">
              Status
            </th>
            <th scope="col" className="p-3">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, idx) => (
            <tr
              key={p.id}
              className={`border-t border-border transition-colors hover:bg-muted/30 ${
                idx % 2 === 0 ? 'bg-card' : 'bg-background'
              }`.trim()}
            >
              <td className="p-2">
                <img
                  src={p.imageUrl}
                  alt=""
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded object-cover"
                />
              </td>
              <td className="p-3 font-medium text-foreground">{p.name}</td>
              <td className="p-3 text-muted-foreground">{catLabel[p.category]}</td>
              <td className="p-3 text-primary">{formatCurrency(p.basePrice)}</td>
              <td className="p-3">
                <label className="flex items-center gap-2 text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={p.available}
                    onChange={() => onToggleAvailable(p)}
                    aria-label={`Disponível: ${p.name}`}
                    className="h-4 w-4 rounded"
                  />
                  {p.available ? 'Ativo' : 'Inativo'}
                </label>
              </td>
              <td className="p-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(p)}
                    className="rounded p-2 text-primary hover:bg-primary/10"
                    aria-label={`Editar ${p.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(p)}
                    className="rounded p-2 text-destructive hover:bg-destructive/10"
                    aria-label={`Remover ${p.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
