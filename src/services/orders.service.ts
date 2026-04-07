import type { CartState, Order } from '@/types';
import { generateId } from '@/utils/generateId';
import { createClient } from '@/utils/supabase/client';

type OrderRow = {
  id: string;
  items: Order['items'];
  subtotal_price: number;
  delivery_fee: number;
  total_price: number;
  delivery_mode: Order['deliveryMode'];
  delivery_address: string;
  status: Order['status'];
  channel: Order['channel'];
  whatsapp_message_sent: boolean;
  created_at: string;
};

function toOrder(row: OrderRow): Order {
  return {
    id: row.id,
    items: row.items,
    subtotalPrice: Number(row.subtotal_price),
    deliveryFee: Number(row.delivery_fee),
    totalPrice: Number(row.total_price),
    deliveryMode: row.delivery_mode,
    deliveryAddress: row.delivery_address,
    status: row.status,
    channel: row.channel,
    createdAt: row.created_at,
    whatsappMessageSent: row.whatsapp_message_sent,
  };
}

export const ordersService = {
  async getOrders(): Promise<Order[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('app_orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data as OrderRow[]).map(toOrder);
  },

  async createOrder(
    cartState: CartState,
    meta?: {
      deliveryMode?: Order['deliveryMode'];
      deliveryAddress?: string;
      deliveryFee?: number;
    }
  ): Promise<Order> {
    const subtotalPrice = cartState.totalPrice;
    const deliveryMode = meta?.deliveryMode ?? 'retirada';
    const deliveryFee = deliveryMode === 'entrega' ? Math.max(0, meta?.deliveryFee ?? 0) : 0;
    const totalPrice = subtotalPrice + deliveryFee;
    const order: Order = {
      id: generateId(),
      items: cartState.items.map((i) => ({ ...i, product: { ...i.product } })),
      subtotalPrice,
      deliveryFee,
      totalPrice,
      deliveryMode,
      deliveryAddress: meta?.deliveryAddress?.trim() ?? '',
      status: 'pending',
      channel: 'whatsapp',
      createdAt: new Date().toISOString(),
      whatsappMessageSent: true,
    };
    const supabase = createClient();
    const { data: authData } = await supabase.auth.getUser();
    const { error } = await supabase.from('app_orders').insert({
      id: order.id,
      items: order.items,
      subtotal_price: order.subtotalPrice,
      delivery_fee: order.deliveryFee,
      total_price: order.totalPrice,
      delivery_mode: order.deliveryMode,
      delivery_address: order.deliveryAddress,
      status: order.status,
      channel: order.channel,
      whatsapp_message_sent: order.whatsappMessageSent,
      created_at: order.createdAt,
      created_by: authData.user?.id ?? null,
    });
    if (error) throw new Error(error.message);
    return order;
  },

  async updateOrderStatus(
    id: string,
    status: Order['status']
  ): Promise<Order> {
    const supabase = createClient();
    const { error } = await supabase.from('app_orders').update({ status }).eq('id', id);
    if (error) throw new Error(error.message);
    const { data, error: readError } = await supabase
      .from('app_orders')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (readError) throw new Error(readError.message);
    if (!data) throw new Error('Pedido não encontrado');
    return toOrder(data as OrderRow);
  },

  async clearOrders(): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from('app_orders').delete().neq('id', '');
    if (error) throw new Error(error.message);
  },
};
