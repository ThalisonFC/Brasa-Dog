import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import type { AdminAction, AdminSession, AdminState, LoginFormData } from '@/types';
import { authService } from '@/services/auth.service';

const initialState: AdminState = {
  session: null,
  isAuthenticated: false,
  isLoading: true,
};

function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        session: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        session: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
}

type AdminContextValue = {
  session: AdminSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (c: LoginFormData) => Promise<void>;
  logout: () => Promise<void>;
};

export const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true });
    const session = authService.getSession();
    if (session && authService.validateSession(session.token)) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: session });
    } else {
      dispatch({ type: 'LOGOUT' });
    }
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  const login = useCallback(async (credentials: LoginFormData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const session = await authService.login(credentials);
      dispatch({ type: 'LOGIN_SUCCESS', payload: session });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    dispatch({ type: 'LOGOUT' });
  }, []);

  const value = useMemo(
    () => ({
      session: state.session,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      login,
      logout,
    }),
    [state.session, state.isAuthenticated, state.isLoading, login, logout]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}
