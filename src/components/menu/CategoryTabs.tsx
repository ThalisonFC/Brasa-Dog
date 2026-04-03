import type { ProductCategory } from '@/types';

const LABELS: Record<ProductCategory, string> = {
  classicos: 'Clássicos',
  especiais: 'Especiais',
  combos: 'Combos',
  bebidas: 'Bebidas',
};

const ORDER: ProductCategory[] = ['classicos', 'especiais', 'combos', 'bebidas'];

type CategoryTabsProps = {
  value: ProductCategory | 'todos';
  onChange: (c: ProductCategory | 'todos') => void;
};

export function CategoryTabs({ value, onChange }: CategoryTabsProps) {
  const tabs: (ProductCategory | 'todos')[] = ['todos', ...ORDER];
  return (
    <div
      className="mb-8 flex flex-wrap justify-center gap-2"
      role="tablist"
      aria-label="Filtrar por categoria"
    >
      {tabs.map((tab) => {
        const label = tab === 'todos' ? 'Todos' : LABELS[tab];
        const selected = value === tab;
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab)}
            className={`rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-all ${
              selected
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:border-primary/50'
            }`.trim()}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
