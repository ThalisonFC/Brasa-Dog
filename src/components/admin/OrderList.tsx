import { format } from 'date-fns/format';
import { ptBR } from 'date-fns/locale/pt-BR';
import type { Order } from '@/types';
import { formatCurrency } from '@/utils/formatCurrency';

const statusLabels: Record<Order['status'], string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  cancelled: 'Cancelado',
};

type OrderListProps = {
  orders: Order[];
  onView: (o: Order) => void;
  onStatusChange: (id: string, status: Order['status']) => void;
};

export function OrderList({ orders, onView, onStatusChange }: OrderListProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-muted/80 text-muted-foreground">
          <tr>
            <th scope="col" className="p-3">
              ID
            </th>
            <th scope="col" className="p-3">
              Data/Hora
            </th>
            <th scope="col" className="p-3">
              Itens
            </th>
            <th scope="col" className="p-3">
              Total
            </th>
            <th scope="col" className="p-3">
              Atendimento
            </th>
            <th scope="col" className="p-3">
              Status
            </th>
            <th scope="col" className="p-3">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o, idx) => (
            <tr
              key={o.id}
              className={`border-t border-border hover:bg-muted/20 ${
                idx % 2 === 0 ? 'bg-card' : 'bg-background'
              }`.trim()}
            >
              <td className="max-w-[120px] truncate p-3 font-mono text-xs text-muted-foreground">
                {o.id.slice(0, 8)}…
              </td>
              <td className="p-3 whitespace-nowrap">
                {format(new Date(o.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
              </td>
              <td className="p-3">{o.items.reduce((s, i) => s + i.quantity, 0)}</td>
              <td className="p-3 font-medium text-primary">{formatCurrency(o.totalPrice)}</td>
              <td className="p-3 text-muted-foreground">
                {o.deliveryMode === 'entrega' ? 'Entrega' : 'Retirada'}
              </td>
              <td className="p-3">
                <select
                  value={o.status}
                  onChange={(e) =>
                    onStatusChange(o.id, e.target.value as Order['status'])
                  }
                  className="rounded border border-border bg-input-background px-2 py-1 text-foreground"
                  aria-label={`Status do pedido ${o.id.slice(0, 8)}`}
                >
                  {(Object.keys(statusLabels) as Order['status'][]).map((k) => (
                    <option key={k} value={k}>
                      {statusLabels[k]}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-3">
                <button
                  type="button"
                  onClick={() => onView(o)}
                  className="text-primary hover:underline"
                >
                  Ver detalhes
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
