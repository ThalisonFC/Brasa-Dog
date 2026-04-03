import type { Addon } from '@/types';
import { formatCurrency } from '@/utils/formatCurrency';

type AddonCheckboxProps = {
  addon: Addon;
  checked: boolean;
  onToggle: () => void;
};

export function AddonCheckbox({ addon, checked, onToggle }: AddonCheckboxProps) {
  if (!addon.available) return null;
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex cursor-pointer items-center justify-between rounded-lg border-2 p-4 transition-all ${
        checked ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
      }`.trim()}
    >
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="h-4 w-4 rounded text-primary"
          aria-label={addon.label}
          readOnly
          tabIndex={-1}
        />
        <span className="text-foreground">{addon.label}</span>
      </div>
      <span className="font-semibold text-primary">+{formatCurrency(addon.price)}</span>
    </button>
  );
}
