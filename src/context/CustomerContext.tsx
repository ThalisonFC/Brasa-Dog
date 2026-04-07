import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import type {
  CustomerAction,
  CustomerRegisterFormData,
  CustomerSession,
  CustomerState,
} from '@/types';
import { customerAuthService } from '@/services/customerAuth.service';

const initialState: CustomerState = {
  session: null,
  isAuthenticated: false,
  isLoading: true,
};

function customerReducer(state: CustomerState, action: CustomerAction): CustomerState {
  switch (action.type) {
    case 'CUSTOMER_SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'CUSTOMER_LOGIN_SUCCESS':
      return {
        session: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'CUSTOMER_LOGOUT':
      return {
        session: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
}

type CustomerContextValue = {
  session: CustomerSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: CustomerRegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
};

export const CustomerContext = createContext<CustomerContextValue | null>(null);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(customerReducer, initialState);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      dispatch({ type: 'CUSTOMER_SET_LOADING', payload: true });
      try {
        const session = await customerAuthService.getSession();
        if (!mounted) return;
        if (session) {
          dispatch({ type: 'CUSTOMER_LOGIN_SUCCESS', payload: session });
        } else {
          dispatch({ type: 'CUSTOMER_LOGOUT' });
        }
      } finally {
        if (mounted) dispatch({ type: 'CUSTOMER_SET_LOADING', payload: false });
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'CUSTOMER_SET_LOADING', payload: true });
    try {
      const session = await customerAuthService.login({ email, password });
      dispatch({ type: 'CUSTOMER_LOGIN_SUCCESS', payload: session });
    } catch (e) {
      dispatch({ type: 'CUSTOMER_SET_LOADING', payload: false });
      throw e;
    }
  }, []);

  const register = useCallback(async (data: CustomerRegisterFormData) => {
    dispatch({ type: 'CUSTOMER_SET_LOADING', payload: true });
    try {
      const session = await customerAuthService.register(data);
      dispatch({ type: 'CUSTOMER_LOGIN_SUCCESS', payload: session });
    } catch (e) {
      dispatch({ type: 'CUSTOMER_SET_LOADING', payload: false });
      throw e;
    }
  }, []);

  const logout = useCallback(async () => {
    await customerAuthService.logout();
    dispatch({ type: 'CUSTOMER_LOGOUT' });
  }, []);

  const value = useMemo(
    () => ({
      session: state.session,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      login,
      register,
      logout,
    }),
    [state.session, state.isAuthenticated, state.isLoading, login, register, logout]
  );

  return (
    <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>
  );
}
