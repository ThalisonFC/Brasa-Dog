import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Order } from '@/types';
import { ordersService } from '@/services/orders.service';
import { OrderList } from '@/components/admin/OrderList';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { formatCurrency } from '@/utils/formatCurrency';
import { format } from 'date-fns/format';
import { ptBR } from 'date-fns/locale/pt-BR';

const PAGE_SIZE = 10;

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'todos'>('todos');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [detail, setDetail] = useState<Order | null>(null);
  const [clearOpen, setClearOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await ordersService.getOrders();
      setOrders(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    let list = orders;
    if (statusFilter !== 'todos') {
      list = list.filter((o) => o.status === statusFilter);
    }
    if (dateFrom) {
      const from = new Date(dateFrom).getTime();
      list = list.filter((o) => new Date(o.createdAt).getTime() >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      list = list.filter((o) => new Date(o.createdAt).getTime() <= to.getTime());
    }
    return list;
  }, [orders, statusFilter, dateFrom, dateTo]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, pageCount - 1);
  const slice = useMemo(() => {
    const start = pageSafe * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, pageSafe]);

  const handleStatusChange = async (id: string, status: Order['status']) => {
    await ordersService.updateOrderStatus(id, status);
    await load();
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col flex-wrap gap-4 md:flex-row md:items-end">
        <div>
          <label htmlFor="ord-status" className="mb-1 block text-sm text-muted-foreground">
            Status
          </label>
          <select
            id="ord-status"
            value={statusFilter}
            onChange={(e) => {
              setPage(0);
              setStatusFilter(e.target.value as Order['status'] | 'todos');
            }}
            className="rounded-lg border border-border bg-input-background px-3 py-2 text-foreground"
          >
            <option value="todos">Todos</option>
            <option value="pending">Pendente</option>
            <option value="confirmed">Confirmado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
        <div>
          <label htmlFor="ord-from" className="mb-1 block text-sm text-muted-foreground">
            De
          </label>
          <input
            id="ord-from"
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setPage(0);
              setDateFrom(e.target.value);
            }}
            className="rounded-lg border border-border bg-input-background px-3 py-2 text-foreground"
          />
        </div>
        <div>
          <label htmlFor="ord-to" className="mb-1 block text-sm text-muted-foreground">
            Até
          </label>
          <input
            id="ord-to"
            type="date"
            value={dateTo}
            onChange={(e) => {
              setPage(0);
              setDateTo(e.target.value);
            }}
            className="rounded-lg border border-border bg-input-background px-3 py-2 text-foreground"
          />
        </div>
        <button
          type="button"
          className="rounded-lg border border-destructive px-4 py-2 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 md:ml-auto"
          onClick={() => setClearOpen(true)}
        >
          Limpar histórico
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">Nenhum pedido encontrado.</p>
      ) : (
        <>
          <OrderList
            orders={slice}
            onView={setDetail}
            onStatusChange={(id, s) => void handleStatusChange(id, s)}
          />
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              disabled={pageSafe <= 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-40"
            >
              Anterior
            </button>
            <span className="text-sm text-muted-foreground">
              Página {pageSafe + 1} de {pageCount}
            </span>
            <button
              type="button"
              disabled={pageSafe >= pageCount - 1}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              className="rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        </>
      )}

      <Modal
        isOpen={!!detail}
        onClose={() => setDetail(null)}
        title="Detalhes do pedido"
        className="max-w-lg"
      >
        {detail ? (
          <div className="space-y-4 text-sm">
            <p>
              <span className="text-muted-foreground">Data: </span>
              {format(new Date(detail.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </p>
            <p>
              <span className="text-muted-foreground">Atendimento: </span>
              {detail.deliveryMode === 'entrega' ? 'Entrega' : 'Retirada'}
            </p>
            {detail.deliveryMode === 'entrega' && detail.deliveryAddress ? (
              <p>
                <span className="text-muted-foreground">Endereço: </span>
                {detail.deliveryAddress}
              </p>
            ) : null}
            <p>
              <span className="text-muted-foreground">Subtotal: </span>
              {formatCurrency(detail.subtotalPrice ?? detail.totalPrice)}
            </p>
            <p>
              <span className="text-muted-foreground">Taxa entrega: </span>
              {detail.deliveryMode === 'entrega'
                ? formatCurrency(detail.deliveryFee ?? 0)
                : 'Retirada'}
            </p>
            <p>
              <span className="text-muted-foreground">Total: </span>
              {formatCurrency(detail.totalPrice)}
            </p>
            <ul className="space-y-3 border-t border-border pt-3">
              {detail.items.map((i) => (
                <li key={i.cartItemId} className="rounded border border-border bg-background p-3">
                  <p className="font-semibold text-foreground">
                    {i.quantity}x {i.product.name}
                  </p>
                  <p className="text-muted-foreground">Pão: {i.customization.bread.label}</p>
                  <p className="text-muted-foreground">Salsicha: {i.customization.sausage.label}</p>
                  {i.customization.addons.length > 0 && (
                    <p className="text-muted-foreground">
                      Adicionais: {i.customization.addons.map((a) => a.label).join(', ')}
                    </p>
                  )}
                  {i.customization.notes.trim() ? (
                    <p className="text-muted-foreground">Obs: {i.customization.notes}</p>
                  ) : null}
                  <p className="text-primary">{formatCurrency(i.totalPrice)}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        isOpen={clearOpen}
        title="Limpar histórico de pedidos?"
        description="Todos os pedidos salvos localmente serão apagados."
        confirmLabel="Limpar"
        variant="danger"
        onConfirm={() => {
          void ordersService.clearOrders().then(() => load());
        }}
        onCancel={() => setClearOpen(false)}
      />
    </div>
  );
}
