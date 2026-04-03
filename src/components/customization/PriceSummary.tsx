import { formatCurrency } from '@/utils/formatCurrency';

type PriceSummaryProps = {
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  onConfirm: () => void;
  confirmLabel?: string;
};

export function PriceSummary({
  unitPrice,
  quantity,
  totalPrice,
  onConfirm,
  confirmLabel = 'Adicionar ao Pedido',
}: PriceSummaryProps) {
  return (
    <div className="sticky bottom-0 border-t border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Total do item</p>
          <p className="text-3xl font-bold text-primary">{formatCurrency(totalPrice)}</p>
          <p className="text-xs text-muted-foreground">
            {quantity}x {formatCurrency(unitPrice)}
          </p>
        </div>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-lg bg-primary px-8 py-4 font-bold text-primary-foreground transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/50"
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}
