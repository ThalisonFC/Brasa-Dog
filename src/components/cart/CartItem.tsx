import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem as CartLine } from '@/types';
import { formatCurrency } from '@/utils/formatCurrency';

type CartItemProps = {
  item: CartLine;
  onRemove: (cartItemId: string) => void;
  onDelta: (cartItemId: string, delta: number) => void;
};

export function CartItem({ item, onRemove, onDelta }: CartItemProps) {
  const { customization } = item;
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <div className="mb-2 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="mb-1 font-semibold text-foreground">
            {item.quantity}x {item.product.name}
          </h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>Pão: {customization.bread.label}</p>
            <p>Salsicha: {customization.sausage.label}</p>
            {customization.addons.length > 0 && (
              <p>Extras: {customization.addons.map((a) => a.label).join(', ')}</p>
            )}
            {customization.notes.trim() ? <p>Obs: {customization.notes.trim()}</p> : null}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onRemove(item.cartItemId)}
          className="text-muted-foreground transition-colors hover:text-destructive"
          aria-label={`Remover ${item.product.name} do pedido`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onDelta(item.cartItemId, -1)}
            className="flex h-8 w-8 items-center justify-center rounded border border-border hover:border-primary"
            aria-label="Diminuir quantidade"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="min-w-[2rem] text-center text-sm text-foreground">{item.quantity}</span>
          <button
            type="button"
            onClick={() => onDelta(item.cartItemId, 1)}
            className="flex h-8 w-8 items-center justify-center rounded border border-border hover:border-primary"
            aria-label="Aumentar quantidade"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
        <div className="text-right">
          <span className="text-sm text-muted-foreground">
            {item.quantity}x {formatCurrency(item.unitPrice)}
          </span>
          <p className="font-bold text-primary">{formatCurrency(item.totalPrice)}</p>
        </div>
      </div>
    </div>
  );
}
