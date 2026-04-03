import { ShoppingCart, Star } from 'lucide-react';
import type { Product } from '@/types';
import { formatCurrency } from '@/utils/formatCurrency';

type ProductCardProps = {
  product: Product;
  onCustomize: (product: Product) => void;
};

export function ProductCard({ product, onCustomize }: ProductCardProps) {
  const showBestseller = product.featured;
  const showSpecial = !product.featured && product.category === 'especiais';
  const unavailable = !product.available;

  return (
    <div
      className={`group overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20 ${
        unavailable ? 'opacity-60' : ''
      }`.trim()}
    >
      <div className="relative h-44 overflow-hidden sm:h-48">
        <img
          src={product.imageUrl}
          alt={product.name}
          width={600}
          height={400}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {showBestseller && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
            <Star className="h-3 w-3 fill-current" />
            Mais Vendido
          </div>
        )}
        {showSpecial && !showBestseller && (
          <div className="absolute right-3 top-3 rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-secondary-foreground">
            Especial da Casa
          </div>
        )}
      </div>

      <div className="p-4">
        <h3
          className="mb-1.5 text-base text-foreground md:text-lg"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {product.name}
        </h3>
        <p className="mb-3 line-clamp-2 text-xs text-muted-foreground md:text-sm">
          {product.description}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-[11px] text-muted-foreground">A partir de</span>
            <p className="text-xl font-bold text-primary md:text-2xl">
              {formatCurrency(product.basePrice)}
            </p>
          </div>

          <button
            type="button"
            disabled={unavailable}
            onClick={() => onCustomize(product)}
            className="flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.02] hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/50 disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
          >
            <ShoppingCart className="h-4 w-4" />
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
