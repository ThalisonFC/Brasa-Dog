import { useCallback, useEffect, useId, useState } from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { contentService } from '@/services/content.service';
import { ordersService } from '@/services/orders.service';
import { settingsService } from '@/services/settings.service';
import { buildWhatsAppMessage } from '@/utils/buildWhatsAppMessage';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';

export function CartDrawer() {
  const titleId = useId();
  const {
    items,
    totalPrice,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();
  const { showToast } = useToast();
  const [confirmClear, setConfirmClear] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState<'entrega' | 'retirada'>('retirada');
  const [addressForm, setAddressForm] = useState({
    cep: '',
    street: '',
    number: '',
    district: '',
    city: '',
    complement: '',
  });
  const [deliveryFee, setDeliveryFee] = useState(10);
  const [deliveryEstimateText, setDeliveryEstimateText] = useState('45 minutos a 1 hora');
  const [deliveryEnabled, setDeliveryEnabled] = useState(true);
  const [pickupEnabled, setPickupEnabled] = useState(true);

  const handleClear = useCallback(() => {
    clearCart();
    setConfirmClear(false);
  }, [clearCart]);

  const scrollToMenu = useCallback(() => {
    closeCart();
    window.setTimeout(() => {
      document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [closeCart]);

  const loadDeliverySettings = useCallback(async () => {
    const s = await settingsService.getSettings();
    setDeliveryFee(s.deliveryFee);
    setDeliveryEstimateText(s.deliveryEstimateText);
    setDeliveryEnabled(s.deliveryEnabled);
    setPickupEnabled(s.pickupEnabled);
    if (!s.deliveryEnabled && s.pickupEnabled) {
      setDeliveryMode('retirada');
    } else if (s.deliveryEnabled && !s.pickupEnabled) {
      setDeliveryMode('entrega');
    }
  }, []);

  useEffect(() => {
    void loadDeliverySettings();
  }, [loadDeliverySettings]);

  useEffect(() => {
    const onEvt = () => {
      void loadDeliverySettings();
    };
    window.addEventListener('brasadog:settings', onEvt);
    return () => window.removeEventListener('brasadog:settings', onEvt);
  }, [loadDeliverySettings]);

  const handleCheckout = useCallback(async () => {
    if (items.length === 0) return;
    const builtAddress = [
      addressForm.street.trim(),
      addressForm.number.trim() ? `Nº ${addressForm.number.trim()}` : '',
      addressForm.district.trim() ? `Bairro ${addressForm.district.trim()}` : '',
      addressForm.city.trim(),
      addressForm.cep.trim() ? `CEP ${addressForm.cep.trim()}` : '',
      addressForm.complement.trim() ? `Compl.: ${addressForm.complement.trim()}` : '',
    ]
      .filter(Boolean)
      .join(' - ');
    if (
      deliveryMode === 'entrega' &&
      (!addressForm.street.trim() || !addressForm.number.trim() || !addressForm.district.trim())
    ) {
      showToast({
        type: 'warning',
        message: 'Preencha rua, número e bairro para entrega.',
      });
      return;
    }
    const subtotal = totalPrice;
    const fee = deliveryMode === 'entrega' ? deliveryFee : 0;
    const finalTotal = subtotal + fee;
    try {
      const content = await contentService.getSiteContent();
      await ordersService.createOrder({
        items,
        totalItems: items.reduce((s, i) => s + i.quantity, 0),
        totalPrice: subtotal,
      }, {
        deliveryMode,
        deliveryAddress: builtAddress,
        deliveryFee: fee,
      });
      const url = buildWhatsAppMessage(items, finalTotal, content.contact.whatsappNumber, {
        subtotal,
        deliveryFee: fee,
        deliveryMode,
        deliveryAddress: builtAddress,
        deliveryEstimateText,
      });
      const popup = window.open(url, '_blank', 'noopener,noreferrer');
      if (!popup) {
        window.location.href = url;
      }
      showToast({ type: 'success', message: 'WhatsApp aberto com o pedido.' });
      clearCart();
      setAddressForm({
        cep: '',
        street: '',
        number: '',
        district: '',
        city: '',
        complement: '',
      });
      closeCart();
    } catch {
      showToast({ type: 'error', message: 'Não foi possível finalizar. Tente novamente.' });
    }
  }, [items, totalPrice, deliveryMode, deliveryFee, deliveryEstimateText, clearCart, closeCart, showToast, addressForm]);

  return (
    <>
      <Drawer isOpen={isOpen} onClose={closeCart} titleId={titleId} widthClass="w-full max-w-full sm:max-w-[480px]">
        <div className="flex items-center justify-between border-b border-border p-6">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-6 w-6 text-primary" aria-hidden />
            <h2
              id={titleId}
              className="text-foreground"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Seu Pedido
            </h2>
            {items.length > 0 && (
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-bold text-primary">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {items.length > 0 && (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="text-sm text-destructive transition-colors hover:text-destructive/80"
              >
                Limpar
              </button>
            )}
            <button
              type="button"
              onClick={closeCart}
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Fechar carrinho"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground opacity-50" aria-hidden />
              <p className="text-muted-foreground">Seu carrinho está vazio</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Adicione itens do cardápio para começar
              </p>
              <button
                type="button"
                onClick={scrollToMenu}
                className="mt-6 rounded-lg border-2 border-primary px-6 py-3 font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
              >
                Ver cardápio
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem
                    key={item.cartItemId}
                    item={item}
                    onRemove={removeItem}
                    onDelta={updateQuantity}
                  />
                ))}
              </div>
              <div className="mt-4 space-y-4 border-t border-border pt-4">
                <div className="space-y-3 rounded-lg border border-border bg-background p-4">
                  <p className="text-sm font-semibold text-foreground">Forma de atendimento</p>
                  <div className="grid grid-cols-2 gap-2">
                    <label className={`rounded border p-2 text-sm ${pickupEnabled ? 'border-border' : 'border-border opacity-40'}`}>
                      <input
                        type="radio"
                        name="delivery-mode"
                        value="retirada"
                        checked={deliveryMode === 'retirada'}
                        disabled={!pickupEnabled}
                        onChange={() => setDeliveryMode('retirada')}
                        className="mr-2"
                      />
                      Retirada
                    </label>
                    <label className={`rounded border p-2 text-sm ${deliveryEnabled ? 'border-border' : 'border-border opacity-40'}`}>
                      <input
                        type="radio"
                        name="delivery-mode"
                        value="entrega"
                        checked={deliveryMode === 'entrega'}
                        disabled={!deliveryEnabled}
                        onChange={() => setDeliveryMode('entrega')}
                        className="mr-2"
                      />
                      Entrega
                    </label>
                  </div>
                  {deliveryMode === 'entrega' && (
                    <div className="space-y-2">
                      <label className="mb-1 block text-xs text-muted-foreground">
                        Cadastro de endereço para entrega
                      </label>
                      <p className="text-xs text-primary">
                        Previsão de entrega: {deliveryEstimateText}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          value={addressForm.cep}
                          onChange={(e) => setAddressForm((p) => ({ ...p, cep: e.target.value }))}
                          placeholder="CEP"
                          className="rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                        />
                        <input
                          value={addressForm.city}
                          onChange={(e) => setAddressForm((p) => ({ ...p, city: e.target.value }))}
                          placeholder="Cidade"
                          className="rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                        />
                        <input
                          value={addressForm.street}
                          onChange={(e) => setAddressForm((p) => ({ ...p, street: e.target.value }))}
                          placeholder="Rua *"
                          className="col-span-2 rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                        />
                        <input
                          value={addressForm.number}
                          onChange={(e) => setAddressForm((p) => ({ ...p, number: e.target.value }))}
                          placeholder="Número *"
                          className="rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                        />
                        <input
                          value={addressForm.district}
                          onChange={(e) => setAddressForm((p) => ({ ...p, district: e.target.value }))}
                          placeholder="Bairro *"
                          className="rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                        />
                        <input
                          value={addressForm.complement}
                          onChange={(e) =>
                            setAddressForm((p) => ({ ...p, complement: e.target.value }))
                          }
                          placeholder="Complemento"
                          className="col-span-2 rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Campos com * são obrigatórios.</p>
                    </div>
                  )}
                </div>
                <CartSummary
                  subtotal={totalPrice}
                  deliveryFee={deliveryFee}
                  deliveryMode={deliveryMode}
                />
              </div>
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border p-6">
            <button
              type="button"
              onClick={handleCheckout}
              className="w-full rounded-lg bg-primary py-4 font-bold text-primary-foreground transition-all hover:scale-[1.01] hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/50"
            >
              Finalizar pelo WhatsApp
            </button>
          </div>
        )}
      </Drawer>

      <ConfirmDialog
        isOpen={confirmClear}
        title="Limpar carrinho?"
        description="Todos os itens serão removidos."
        confirmLabel="Limpar"
        variant="danger"
        onConfirm={handleClear}
        onCancel={() => setConfirmClear(false)}
      />
    </>
  );
}
