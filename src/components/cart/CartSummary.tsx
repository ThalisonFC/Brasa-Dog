import { formatCurrency } from '@/utils/formatCurrency';

type CartSummaryProps = {
  subtotal: number;
  deliveryFee?: number;
  deliveryMode?: 'entrega' | 'retirada';
};

export function CartSummary({
  subtotal,
  deliveryFee = 0,
  deliveryMode = 'retirada',
}: CartSummaryProps) {
  const total = subtotal + (deliveryMode === 'entrega' ? deliveryFee : 0);
  return (
    <div className="space-y-4 rounded-lg border border-border bg-background p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="text-foreground">{formatCurrency(subtotal)}</span>
      </div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-muted-foreground">Entrega</span>
        <span className="text-foreground">
          {deliveryMode === 'entrega' ? formatCurrency(deliveryFee) : 'Retirada'}
        </span>
      </div>
      <div className="flex items-center justify-between border-t border-border pt-2">
        <span className="font-semibold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
          Total
        </span>
        <span className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
          {formatCurrency(total)}
        </span>
      </div>
    </div>
  );
}
