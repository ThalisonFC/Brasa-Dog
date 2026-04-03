import { useCallback, useContext } from 'react';
import { CartContext } from '@/context/CartContext';
import type { CartItemCustomization, Product } from '@/types';
import { calculateUnitPrice } from '@/utils/calculatePrice';
import { generateId } from '@/utils/generateId';

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart deve ser usado dentro de CartProvider');
  }

  const { dispatch, items, totalItems, totalPrice, isOpen, openCart, closeCart } = ctx;

  const addItem = useCallback(
    (product: Product, customization: CartItemCustomization, quantity: number) => {
      const unitPrice = calculateUnitPrice(
        product.basePrice,
        customization.bread,
        customization.sausage,
        customization.addons
      );
      const cartItemId = generateId();
      const totalPrice = unitPrice * quantity;
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          cartItemId,
          product,
          customization,
          quantity,
          unitPrice,
          totalPrice,
        },
      });
    },
    [dispatch]
  );

  const removeItem = useCallback(
    (cartItemId: string) => {
      dispatch({ type: 'REMOVE_ITEM', payload: cartItemId });
    },
    [dispatch]
  );

  const updateQuantity = useCallback(
    (cartItemId: string, delta: number) => {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { cartItemId, delta } });
    },
    [dispatch]
  );

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, [dispatch]);

  return {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isOpen,
    openCart,
    closeCart,
  };
}
