import { Minus, Plus } from 'lucide-react';

type QuantityControlProps = {
  quantity: number;
  onDelta: (delta: number) => void;
  min?: number;
};

export function QuantityControl({ quantity, onDelta, min = 1 }: QuantityControlProps) {
  return (
    <div>
      <span className="mb-3 block text-foreground">Quantidade</span>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onDelta(-1)}
          disabled={quantity <= min}
          className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-border transition-all hover:border-primary hover:bg-primary/10 disabled:opacity-40"
          aria-label="Diminuir quantidade"
        >
          <Minus className="h-4 w-4 text-foreground" />
        </button>
        <span className="min-w-[3rem] text-center text-2xl font-bold text-foreground">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => onDelta(1)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-border transition-all hover:border-primary hover:bg-primary/10"
          aria-label="Aumentar quantidade"
        >
          <Plus className="h-4 w-4 text-foreground" />
        </button>
      </div>
    </div>
  );
}
