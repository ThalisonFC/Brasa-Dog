import { useCallback, useEffect, useState } from 'react';
import { settingsService } from '@/services/settings.service';
import { contentService } from '@/services/content.service';
import { productsService } from '@/services/products.service';
import { ordersService } from '@/services/orders.service';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/hooks/useToast';

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener noreferrer';
  a.click();
  URL.revokeObjectURL(url);
}

export function AdminSettings() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [maintenance, setMaintenance] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(10);
  const [deliveryEstimateText, setDeliveryEstimateText] = useState('45 minutos a 1 hora');
  const [deliveryEnabled, setDeliveryEnabled] = useState(true);
  const [pickupEnabled, setPickupEnabled] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, c] = await Promise.all([
        settingsService.getSettings(),
        contentService.getSiteContent(),
      ]);
      setMaintenance(s.maintenanceMode);
      setDeliveryFee(s.deliveryFee);
      setDeliveryEstimateText(s.deliveryEstimateText);
      setDeliveryEnabled(s.deliveryEnabled);
      setPickupEnabled(s.pickupEnabled);
      setWhatsapp(c.contact.whatsappNumber);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const savePassword = async () => {
    if (password.length < 6) {
      showToast({ type: 'warning', message: 'Senha deve ter pelo menos 6 caracteres.' });
      return;
    }
    if (password !== passwordConfirm) {
      showToast({ type: 'error', message: 'Confirmação não confere.' });
      return;
    }
    await settingsService.updateSettings({ adminPasswordPlain: password });
    setPassword('');
    setPasswordConfirm('');
    showToast({ type: 'success', message: 'Senha atualizada (armazenamento local).' });
  };

  const saveWhatsapp = async () => {
    const digits = whatsapp.replace(/\D/g, '');
    if (digits.length < 10) {
      showToast({ type: 'error', message: 'Número inválido.' });
      return;
    }
    await contentService.updateSiteContent({
      contact: { whatsappNumber: digits },
    });
    window.dispatchEvent(new Event('brasadog:content'));
    showToast({ type: 'success', message: 'WhatsApp atualizado.' });
  };

  const toggleMaintenance = async () => {
    const next = !maintenance;
    await settingsService.updateSettings({ maintenanceMode: next });
    setMaintenance(next);
    window.dispatchEvent(new Event('brasadog:settings'));
    showToast({ type: 'info', message: next ? 'Modo manutenção ativado' : 'Modo manutenção desativado' });
  };

  const saveDeliverySettings = async () => {
    if (!deliveryEnabled && !pickupEnabled) {
      showToast({ type: 'error', message: 'Ative pelo menos uma opção: entrega ou retirada.' });
      return;
    }
    if (deliveryFee < 0) {
      showToast({ type: 'error', message: 'Taxa de entrega inválida.' });
      return;
    }
    await settingsService.updateSettings({
      deliveryEnabled,
      pickupEnabled,
      deliveryFee,
      deliveryEstimateText: deliveryEstimateText.trim() || '45 minutos a 1 hora',
    });
    window.dispatchEvent(new Event('brasadog:settings'));
    showToast({ type: 'success', message: 'Configurações de entrega salvas.' });
  };

  const exportProducts = async () => {
    const list = await productsService.getProducts();
    downloadJson('brasadog-produtos.json', list);
    showToast({ type: 'success', message: 'Exportação concluída.' });
  };

  const exportOrders = async () => {
    const list = await ordersService.getOrders();
    downloadJson('brasadog-pedidos.json', list);
    showToast({ type: 'success', message: 'Exportação concluída.' });
  };

  if (loading) return <Spinner />;

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-primary">Segurança</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Mock local — substitua por autenticação segura em produção.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="set-pass" className="mb-1 block text-sm text-muted-foreground">
              Nova senha
            </label>
            <Input
              id="set-pass"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="set-pass2" className="mb-1 block text-sm text-muted-foreground">
              Confirmar senha
            </label>
            <Input
              id="set-pass2"
              type="password"
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>
        </div>
        <Button type="button" className="mt-4 px-4 py-2" onClick={() => void savePassword()}>
          Salvar senha
        </Button>
      </section>

      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-primary">WhatsApp</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Sincronizado com a área de conteúdo do site (apenas dígitos).
        </p>
        <Input
          id="set-wa"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="5511999999999"
        />
        <Button type="button" className="mt-4 px-4 py-2" onClick={() => void saveWhatsapp()}>
          Salvar número
        </Button>
      </section>

      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-primary">Operação</h2>
        <label className="flex items-center gap-3 text-foreground">
          <input
            type="checkbox"
            checked={maintenance}
            onChange={() => void toggleMaintenance()}
            className="h-4 w-4 rounded"
          />
          Modo manutenção (banner no site público)
        </label>
        <p className="mt-4 text-sm text-muted-foreground">
          {/* TODO: Ordenação das categorias por arrastar e soltar (drag reorder) */}
          Ordenação de categorias: em breve (drag reorder).
        </p>
        <div className="mt-6 rounded-lg border border-border p-4">
          <h3 className="mb-3 text-sm font-semibold text-primary">Atendimento do pedido</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={deliveryEnabled}
                onChange={(e) => setDeliveryEnabled(e.target.checked)}
                className="h-4 w-4 rounded"
              />
              Habilitar entrega
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={pickupEnabled}
                onChange={(e) => setPickupEnabled(e.target.checked)}
                className="h-4 w-4 rounded"
              />
              Habilitar retirada
            </label>
          </div>
          <div className="mt-3 max-w-xs">
            <label htmlFor="set-delivery-fee" className="mb-1 block text-sm text-muted-foreground">
              Taxa de entrega (R$)
            </label>
            <Input
              id="set-delivery-fee"
              type="number"
              step="0.01"
              min={0}
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(Number(e.target.value) || 0)}
            />
          </div>
          <div className="mt-3 max-w-sm">
            <label htmlFor="set-delivery-estimate" className="mb-1 block text-sm text-muted-foreground">
              Tempo de entrega
            </label>
            <Input
              id="set-delivery-estimate"
              value={deliveryEstimateText}
              onChange={(e) => setDeliveryEstimateText(e.target.value)}
              placeholder="Ex.: 45 minutos a 1 hora"
            />
          </div>
          <Button type="button" className="mt-4 px-4 py-2" onClick={() => void saveDeliverySettings()}>
            Salvar atendimento
          </Button>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-primary">Exportação</h2>
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="outline" className="px-4 py-2" onClick={() => void exportProducts()}>
            Exportar produtos (JSON)
          </Button>
          <Button type="button" variant="outline" className="px-4 py-2" onClick={() => void exportOrders()}>
            Exportar pedidos (JSON)
          </Button>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-6 opacity-80">
        <h2 className="mb-4 text-lg font-semibold text-primary">Supabase (futuro)</h2>
        <p className="mb-4 text-sm text-muted-foreground">Status: Usando armazenamento local</p>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            disabled
            placeholder="URL do projeto Supabase"
            className="w-full cursor-not-allowed rounded-lg border border-border bg-muted px-3 py-2 opacity-60"
          />
          <input
            disabled
            placeholder="API Key"
            className="w-full cursor-not-allowed rounded-lg border border-border bg-muted px-3 py-2 opacity-60"
          />
        </div>
        <Button type="button" disabled className="mt-4 px-4 py-2 opacity-60">
          Conectar
        </Button>
        {/* TODO: Integrar Supabase auth e database */}
      </section>
    </div>
  );
}
