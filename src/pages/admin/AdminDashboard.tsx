import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns/format';
import { ptBR } from 'date-fns/locale/pt-BR';
import type { Order, Product } from '@/types';
import { productsService } from '@/services/products.service';
import { ordersService } from '@/services/orders.service';
import { contentService } from '@/services/content.service';
import { formatCurrency } from '@/utils/formatCurrency';
import { Spinner } from '@/components/ui/Spinner';

export function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, o, c] = await Promise.all([
        productsService.getProducts(),
        ordersService.getOrders(),
        contentService.getSiteContent(),
      ]);
      setProducts(p);
      setOrders(o);
      setWhatsapp(c.contact.whatsappNumber);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const today = useMemo(() => format(new Date(), 'yyyy-MM-dd'), []);
  const ordersToday = useMemo(
    () =>
      orders.filter((o) => o.createdAt.slice(0, 10) === today).length,
    [orders, today]
  );

  const unavailable = useMemo(
    () => products.filter((p) => !p.available).length,
    [products]
  );

  const lastFive = useMemo(() => orders.slice(0, 5), [orders]);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Produtos cadastrados" value={String(products.length)} />
        <DashboardCard title="Indisponíveis" value={String(unavailable)} />
        <DashboardCard title="Pedidos hoje" value={String(ordersToday)} />
        <DashboardCard title="WhatsApp" value={whatsapp || '—'} small />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link
          to="/admin/products"
          className="rounded-lg border border-border bg-card p-4 text-primary hover:bg-muted"
        >
          Gerenciar produtos →
        </Link>
        <Link
          to="/admin/content"
          className="rounded-lg border border-border bg-card p-4 text-primary hover:bg-muted"
        >
          Editar conteúdo →
        </Link>
        <Link
          to="/admin/orders"
          className="rounded-lg border border-border bg-card p-4 text-primary hover:bg-muted"
        >
          Ver pedidos →
        </Link>
        <Link
          to="/admin/settings"
          className="rounded-lg border border-border bg-card p-4 text-primary hover:bg-muted"
        >
          Configurações →
        </Link>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Últimos pedidos</h2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th scope="col" className="p-3">
                  Data
                </th>
                <th scope="col" className="p-3">
                  Total
                </th>
                <th scope="col" className="p-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {lastFive.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-muted-foreground">
                    Nenhum pedido ainda.
                  </td>
                </tr>
              ) : (
                lastFive.map((o) => (
                  <tr key={o.id} className="border-t border-border odd:bg-card even:bg-background">
                    <td className="p-3">
                      {format(new Date(o.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </td>
                    <td className="p-3">{formatCurrency(o.totalPrice)}</td>
                    <td className="p-3 capitalize">{o.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  small,
}: {
  title: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className={`mt-1 font-bold text-primary ${small ? 'truncate text-sm' : 'text-2xl'}`}>
        {value}
      </p>
    </div>
  );
}
