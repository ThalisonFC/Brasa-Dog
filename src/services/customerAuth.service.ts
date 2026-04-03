import type { CustomerAccount, CustomerRegisterFormData, CustomerSession, CustomerUser } from '@/types';
import { generateId } from '@/utils/generateId';
import { storageService } from './storage.service';

const ACCOUNTS_KEY = 'brasadog_customer_accounts';
const SESSION_KEY = 'brasadog_customer_session';

// Autenticação 100% no navegador (localStorage). TODO: substituir por API + banco seguro.

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function readAccounts(): CustomerAccount[] {
  return storageService.get<CustomerAccount[]>(ACCOUNTS_KEY) ?? [];
}

function writeAccounts(accounts: CustomerAccount[]): void {
  storageService.set(ACCOUNTS_KEY, accounts);
}

function parseExpiresAt(iso: string): number {
  return new Date(iso).getTime();
}

export const customerAuthService = {
  async register(data: CustomerRegisterFormData): Promise<CustomerSession> {
    const accounts = readAccounts();
    const emailNorm = data.email.trim().toLowerCase();
    if (accounts.some((a) => a.email.toLowerCase() === emailNorm)) {
      throw new Error('Este e-mail já está cadastrado');
    }
    const account: CustomerAccount = {
      id: generateId(),
      name: data.name.trim(),
      email: emailNorm,
      phone: data.phone.replace(/\D/g, ''),
      password: data.password,
      createdAt: new Date().toISOString(),
    };
    accounts.push(account);
    writeAccounts(accounts);
    return customerAuthService.login({ email: data.email, password: data.password });
  },

  async login(credentials: { email: string; password: string }): Promise<CustomerSession> {
    const accounts = readAccounts();
    const emailNorm = credentials.email.trim().toLowerCase();
    const found = accounts.find(
      (a) => a.email.toLowerCase() === emailNorm && a.password === credentials.password
    );
    if (!found) {
      throw new Error('E-mail ou senha inválidos');
    }
    const user: CustomerUser = {
      id: found.id,
      name: found.name,
      email: found.email,
      phone: found.phone,
    };
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const token = btoa(`customer:${found.email}:${Date.now()}`);
    const session: CustomerSession = { user, token, expiresAt };
    storageService.set(SESSION_KEY, session);
    return delay(session);
  },

  async logout(): Promise<void> {
    storageService.remove(SESSION_KEY);
    return delay(undefined);
  },

  getSession(): CustomerSession | null {
    const s = storageService.get<CustomerSession>(SESSION_KEY);
    if (!s || !customerAuthService.validateSession(s.token)) return null;
    if (parseExpiresAt(s.expiresAt) <= Date.now()) {
      storageService.remove(SESSION_KEY);
      return null;
    }
    return s;
  },

  validateSession(token: string): boolean {
    const s = storageService.get<CustomerSession>(SESSION_KEY);
    return !!(s && s.token === token && parseExpiresAt(s.expiresAt) > Date.now());
  },
};
