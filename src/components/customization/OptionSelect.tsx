type OptionLike = { id: string; label: string; priceModifier?: number; price?: number };

type OptionSelectProps<T extends OptionLike> = {
  name: string;
  label: string;
  options: T[];
  valueId: string;
  onChange: (id: string) => void;
  priceLabel: (opt: T) => string | null;
};

export function OptionSelect<T extends OptionLike>({
  name,
  label,
  options,
  valueId,
  onChange,
  priceLabel,
}: OptionSelectProps<T>) {
  return (
    <div>
      <span className="mb-3 block text-foreground">{label}</span>
      <div className="space-y-2" role="radiogroup" aria-label={label}>
        {options.map((option) => {
          const selected = valueId === option.id;
          const extra = priceLabel(option);
          return (
            <button
              type="button"
              key={option.id}
              onClick={() => onChange(option.id)}
              className={`flex cursor-pointer items-center justify-between rounded-lg border-2 p-4 transition-all ${
                selected
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`.trim()}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name={name}
                  value={option.id}
                  checked={selected}
                  onChange={() => onChange(option.id)}
                  className="h-4 w-4 text-primary"
                  readOnly
                  tabIndex={-1}
                />
                <span className="text-foreground">{option.label}</span>
              </div>
              {extra ? <span className="font-semibold text-primary">{extra}</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
