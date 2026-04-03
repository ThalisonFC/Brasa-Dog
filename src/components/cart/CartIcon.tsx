import { ShoppingBag } from 'lucide-react';

type CartIconProps = {
  totalItems: number;
  onClick: () => void;
};

export function CartIcon({ totalItems, onClick }: CartIconProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex items-center gap-2 rounded-lg border-2 border-primary bg-primary/10 px-4 py-2 text-primary transition-all hover:bg-primary/20"
      aria-label={`Abrir carrinho${totalItems > 0 ? `, ${totalItems} itens` : ''}`}
    >
      <ShoppingBag className="h-5 w-5" />
      <span className="font-semibold">Carrinho</span>
      {totalItems > 0 && (
        <span className="badge-pulse absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
          {totalItems}
        </span>
      )}
    </button>
  );
}
