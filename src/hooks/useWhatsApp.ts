import { useCallback } from 'react';
import { buildWhatsAppMessage } from '@/utils/buildWhatsAppMessage';
import type { CartItem } from '@/types';

export function useWhatsApp() {
  const openOrder = useCallback(
    (
      items: CartItem[],
      total: number,
      whatsappNumber: string,
      options?: {
        subtotal?: number;
        deliveryFee?: number;
        deliveryMode?: 'entrega' | 'retirada';
        deliveryAddress?: string;
      }
    ) => {
      const url = buildWhatsAppMessage(items, total, whatsappNumber, options);
      const popup = window.open(url, '_blank', 'noopener,noreferrer');
      if (!popup) {
        window.location.href = url;
      }
    },
    []
  );

  return { openOrder };
}
