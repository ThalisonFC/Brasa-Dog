import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import type { Addon, BreadOption, Product, SausageOption } from '@/types';
import { customizationOptions } from '@/data/customization';
import { useCart } from '@/hooks/useCart';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useToast } from '@/hooks/useToast';
import { calculateUnitPrice } from '@/utils/calculatePrice';
import { AddonCheckbox } from './AddonCheckbox';
import { OptionSelect } from './OptionSelect';
import { PriceSummary } from './PriceSummary';
import { QuantityControl } from './QuantityControl';

type CustomizationModalProps = {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
};

export function CustomizationModal({ product, isOpen, onClose }: CustomizationModalProps) {
  const isBeverage = product?.category === 'bebidas';
  const breads = product?.customizationConfig.breads?.length
    ? product.customizationConfig.breads
    : customizationOptions.breads;
  const sausages = product?.customizationConfig.sausages?.length
    ? product.customizationConfig.sausages
    : customizationOptions.sausages;
  const addons = product?.customizationConfig.addons?.length
    ? product.customizationConfig.addons
    : customizationOptions.addons;
  const availableBreads = breads.filter((b) => ('available' in b ? b.available : true));
  const availableSausages = sausages.filter((s) => ('available' in s ? s.available : true));
  const availableAddons = addons.filter((a) => a.available);
  const [selectedBread, setSelectedBread] = useState<BreadOption>(
    breads[0] ?? customizationOptions.breads[0]
  );
  const [selectedSausage, setSelectedSausage] = useState<SausageOption>(
    sausages[0] ?? customizationOptions.sausages[0]
  );
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  const { addItem, openCart } = useCart();
  const { showToast } = useToast();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(isOpen && !!product, panelRef);

  useEffect(() => {
    if (isOpen && product) {
      setSelectedBread(
        availableBreads[0] ?? breads[0] ?? customizationOptions.breads[0]
      );
      setSelectedSausage(
        availableSausages[0] ?? sausages[0] ?? customizationOptions.sausages[0]
      );
      setSelectedAddons([]);
      setNotes('');
      setQuantity(1);
    }
  }, [isOpen, product]);

  useEffect(() => {
    if (!isOpen) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [isOpen, onClose]);

  const unitPrice = useMemo(() => {
    if (!product) return 0;
    return calculateUnitPrice(
      product.basePrice,
      selectedBread,
      selectedSausage,
      selectedAddons
    );
  }, [product, selectedBread, selectedSausage, selectedAddons]);

  const totalPrice = unitPrice * quantity;

  const toggleAddon = useCallback((a: Addon) => {
    setSelectedAddons((prev) =>
      prev.some((x) => x.id === a.id) ? prev.filter((x) => x.id !== a.id) : [...prev, a]
    );
  }, []);

  const handleConfirm = useCallback(() => {
    if (!product) return;
    const n = notes.trim();
    if (n.length > 200) {
      showToast({ type: 'warning', message: 'Observações: máximo 200 caracteres.' });
      return;
    }
    if (quantity < 1) return;
    addItem(
      product,
      {
        bread: selectedBread,
        sausage: selectedSausage,
        addons: selectedAddons,
        notes: n,
      },
      quantity
    );
    showToast({ type: 'success', message: 'Adicionado ao carrinho!' });
    onClose();
    openCart();
  }, [
    product,
    notes,
    quantity,
    addItem,
    selectedBread,
    selectedSausage,
    selectedAddons,
    showToast,
    onClose,
    openCart,
  ]);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 md:items-center md:p-4">
      <div
        className="absolute inset-0 z-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-none border border-border bg-card shadow-2xl md:max-h-[90vh] md:rounded-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card p-6">
          <div>
            <h2
              id={titleId}
              className="mb-1 text-foreground"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {product.name}
            </h2>
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Fechar personalização"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {!isBeverage && (
            <OptionSelect
              name="bread"
              label="Tipo de Pão"
              options={availableBreads}
              valueId={selectedBread.id}
              onChange={(id) => {
                const b = availableBreads.find((x) => x.id === id);
                if (b) setSelectedBread(b);
              }}
              priceLabel={(opt) =>
                opt.priceModifier > 0 ? `+R$ ${opt.priceModifier.toFixed(2)}` : null
              }
            />
          )}

          {!isBeverage && (
            <OptionSelect
              name="sausage"
              label="Tipo de Salsicha"
              options={availableSausages}
              valueId={selectedSausage.id}
              onChange={(id) => {
                const s = availableSausages.find((x) => x.id === id);
                if (s) setSelectedSausage(s);
              }}
              priceLabel={(opt) =>
                opt.priceModifier > 0 ? `+R$ ${opt.priceModifier.toFixed(2)}` : null
              }
            />
          )}

          {!isBeverage && (
            <div>
              <span className="mb-3 block text-foreground">Adicionais</span>
              <div className="space-y-2">
                {availableAddons.map((a) => (
                  <AddonCheckbox
                    key={a.id}
                    addon={a}
                    checked={selectedAddons.some((x) => x.id === a.id)}
                    onToggle={() => toggleAddon(a)}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="custom-notes" className="mb-3 block text-foreground">
              Observações
            </label>
            <textarea
              id="custom-notes"
              maxLength={200}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-lg border-2 border-border bg-input-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              placeholder="Ex.: sem cebola, ponto da salsicha..."
            />
            <p className="mt-1 text-xs text-muted-foreground">{notes.length}/200</p>
          </div>

          <QuantityControl
            quantity={quantity}
            min={1}
            onDelta={(d) => setQuantity((q) => Math.max(1, q + d))}
          />
        </div>

        <PriceSummary
          unitPrice={unitPrice}
          quantity={quantity}
          totalPrice={totalPrice}
          onConfirm={handleConfirm}
        />
      </div>
    </div>
  );
}
