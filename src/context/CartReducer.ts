import type { CartAction, CartItem, CartState } from '@/types';

export const initialCartState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

function recalculate(items: CartItem[]): CartState {
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.totalPrice, 0);
  return { items, totalItems, totalPrice };
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return recalculate(action.payload.items);
    case 'ADD_ITEM': {
      const items = [...state.items, action.payload];
      return recalculate(items);
    }
    case 'REMOVE_ITEM': {
      const items = state.items.filter((i) => i.cartItemId !== action.payload);
      return recalculate(items);
    }
    case 'UPDATE_QUANTITY': {
      const { cartItemId, delta } = action.payload;
      const items = state.items
        .map((item) => {
          if (item.cartItemId !== cartItemId) return item;
          const qty = item.quantity + delta;
          if (qty <= 0) return null;
          const totalPrice = item.unitPrice * qty;
          return { ...item, quantity: qty, totalPrice };
        })
        .filter((x): x is CartItem => x !== null);
      return recalculate(items);
    }
    case 'CLEAR_CART':
      return { ...initialCartState };
    default:
      return state;
  }
}
