import type { CartItem } from '@/types';
import { formatCurrency } from './formatCurrency';

function formatItemBlock(item: CartItem): string {
  const { product, customization, quantity, totalPrice } = item;
  const lines: string[] = [];
  lines.push(
    `${quantity}x *${product.name}* — ${formatCurrency(totalPrice)}`
  );
  lines.push(`   🍞 Pão: ${customization.bread.label}`);
  lines.push(`   🌭 Salsicha: ${customization.sausage.label}`);
  if (customization.addons.length > 0) {
    const names = customization.addons.map((a) => a.label).join(', ');
    lines.push(`   ➕ Adicionais: ${names}`);
  }
  if (customization.notes.trim()) {
    lines.push(`   📝 Obs: ${customization.notes.trim()}`);
  }
  return lines.join('\n');
}

/**
 * Monta a URL completa do WhatsApp com mensagem formatada.
 * @param items Itens do carrinho
 * @param total Total geral (já calculado)
 * @param whatsappNumber Apenas dígitos, ex: 5511999999999
 */
export function buildWhatsAppMessage(
  items: CartItem[],
  total: number,
  whatsappNumber: string,
  options?: {
    subtotal?: number;
    deliveryFee?: number;
    deliveryMode?: 'entrega' | 'retirada';
    deliveryAddress?: string;
    deliveryEstimateText?: string;
  }
): string {
  const header = '🌭 *Pedido BrasaDog Atelier*\n─────────────────────────────\n\n';
  const body = items.map(formatItemBlock).join('\n\n');
  const subtotal = options?.subtotal ?? total;
  const deliveryMode = options?.deliveryMode ?? 'retirada';
  const deliveryFee = options?.deliveryFee ?? 0;
  const address = options?.deliveryAddress?.trim() ?? '';
  const deliveryEstimateText = options?.deliveryEstimateText?.trim() ?? '';
  const deliveryLines: string[] = [];
  if (deliveryMode === 'entrega') {
    deliveryLines.push('🚚 *Entrega*');
    deliveryLines.push(`📍 Endereço: ${address || '(não informado)'}`);
    deliveryLines.push(`💸 Taxa de entrega: ${formatCurrency(deliveryFee)}`);
    if (deliveryEstimateText) {
      deliveryLines.push(`⏱️ Previsão: ${deliveryEstimateText}`);
    }
  } else {
    deliveryLines.push('🏪 *Retirada no local*');
  }
  const footer = `\n\n─────────────────────────────\n${deliveryLines.join('\n')}\n\n🧾 Subtotal: ${formatCurrency(subtotal)}\n💰 *Total: ${formatCurrency(total)}*\n\nOlá! Gostaria de realizar esse pedido. 😊`;
  const text = header + body + footer;
  const encoded = encodeURIComponent(text);
  const digits = whatsappNumber.replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encoded}`;
}
