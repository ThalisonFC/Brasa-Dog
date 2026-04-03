import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { CartState } from '@/types';
import { debounce } from '@/utils/debounce';
import { storageService } from '@/services/storage.service';
import { cartReducer, initialCartState } from './CartReducer';

const CART_KEY = 'brasadog_cart';

type CartContextValue = {
  items: CartState['items'];
  totalItems: number;
  totalPrice: number;
  dispatch: React.Dispatch<import('@/types').CartAction>;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

export const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  const [isOpen, setIsOpen] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    const saved = storageService.get<CartState>(CART_KEY);
    if (saved && Array.isArray(saved.items)) {
      dispatch({ type: 'HYDRATE', payload: saved });
    }
    hydrated.current = true;
  }, []);

  const persist = useMemo(
    () =>
      debounce((next: CartState) => {
        storageService.set(CART_KEY, next);
      }, 300),
    []
  );

  useEffect(() => {
    if (!hydrated.current) return;
    persist(state);
  }, [state, persist]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({
      items: state.items,
      totalItems: state.totalItems,
      totalPrice: state.totalPrice,
      dispatch,
      isOpen,
      openCart,
      closeCart,
    }),
    [state.items, state.totalItems, state.totalPrice, dispatch, isOpen, openCart, closeCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
