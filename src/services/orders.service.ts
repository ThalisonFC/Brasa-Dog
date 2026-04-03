import type { CartState, Order } from '@/types';
import { generateId } from '@/utils/generateId';
import { storageService } from './storage.service';

const KEY = 'brasadog_orders';

// TODO: Substituir implementação por chamadas Supabase

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function readAll(): Order[] {
  return storageService.get<Order[]>(KEY) ?? [];
}

function writeAll(orders: Order[]): void {
  storageService.set(KEY, orders);
}

export const ordersService = {
  async getOrders(): Promise<Order[]> {
    return delay([...readAll()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
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
    const list = readAll();
    list.unshift(order);
    writeAll(list);
    return delay(order);
  },

  async updateOrderStatus(
    id: string,
    status: Order['status']
  ): Promise<Order> {
    const list = readAll();
    const i = list.findIndex((o) => o.id === id);
    if (i === -1) throw new Error('Pedido não encontrado');
    list[i] = { ...list[i], status };
    writeAll(list);
    return delay(list[i]);
  },

  async clearOrders(): Promise<void> {
    writeAll([]);
    return delay(undefined);
  },
};
