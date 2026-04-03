import type { AdminSession, AppSettings, LoginFormData } from '@/types';
import { storageService } from './storage.service';

const SESSION_KEY = 'brasadog_admin_session';
const SETTINGS_KEY = 'brasadog_settings';

// AVISO: credenciais mock apenas para desenvolvimento. NUNCA usar senha real em produção sem backend seguro.
// TODO: Substituir por supabase.auth.signInWithPassword()
const MOCK_EMAIL = 'admin@brasadog.com';
const MOCK_PASSWORD = 'BrasaDog@2024';

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function parseExpiresAt(iso: string): number {
  return new Date(iso).getTime();
}

export const authService = {
  async login(credentials: LoginFormData): Promise<AdminSession> {
    const settings = storageService.get<AppSettings>(SETTINGS_KEY);
    const expectedPassword = settings?.adminPasswordPlain ?? MOCK_PASSWORD;
    if (credentials.email !== MOCK_EMAIL || credentials.password !== expectedPassword) {
      throw new Error('E-mail ou senha inválidos');
    }
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
    const token = btoa(`${credentials.email}:${Date.now()}`);
    const session: AdminSession = {
      user: {
        id: 'admin-1',
        email: credentials.email,
        name: 'Administrador BrasaDog',
        role: 'owner',
      },
      token,
      expiresAt,
    };
    storageService.set(SESSION_KEY, session);
    return delay(session);
  },

  async logout(): Promise<void> {
    storageService.remove(SESSION_KEY);
    return delay(undefined);
  },

  getSession(): AdminSession | null {
    const s = storageService.get<AdminSession>(SESSION_KEY);
    if (!s || !this.validateSession(s.token)) return null;
    if (parseExpiresAt(s.expiresAt) <= Date.now()) {
      storageService.remove(SESSION_KEY);
      return null;
    }
    return s;
  },

  validateSession(token: string): boolean {
    const s = storageService.get<AdminSession>(SESSION_KEY);
    if (!s || s.token !== token) return false;
    return parseExpiresAt(s.expiresAt) > Date.now();
  },
};
