import type { CustomerRegisterFormData, CustomerSession, CustomerUser } from '@/types';
import { createClient } from '@/utils/supabase/client';
import { getProfileByUserId, upsertProfile } from './supabase.service';

function mapToCustomerSession(input: {
  user: CustomerUser;
  token: string;
  expiresAt?: number;
}): CustomerSession {
  const expiresAt = input.expiresAt
    ? new Date(input.expiresAt * 1000).toISOString()
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  return { user: input.user, token: input.token, expiresAt };
}

export const customerAuthService = {
  async register(data: CustomerRegisterFormData): Promise<CustomerSession> {
    const supabase = createClient();
    const email = data.email.trim().toLowerCase();
    const phone = data.phone.replace(/\D/g, '');
    const { data: signUpData, error } = await supabase.auth.signUp({
      email,
      password: data.password,
      options: {
        data: {
          name: data.name.trim(),
          phone,
          role: 'customer',
        },
      },
    });
    if (error) {
      if (error.message.toLowerCase().includes('already')) {
        throw new Error('Este e-mail já está cadastrado');
      }
      throw new Error(error.message);
    }
    if (!signUpData.user) {
      throw new Error('Não foi possível cadastrar no momento');
    }
    await upsertProfile({
      user_id: signUpData.user.id,
      email,
      name: data.name.trim(),
      phone,
      role: 'customer',
    });
    if (!signUpData.session) {
      return customerAuthService.login({ email, password: data.password });
    }
    return mapToCustomerSession({
      user: {
        id: signUpData.user.id,
        name: data.name.trim(),
        email,
        phone,
      },
      token: signUpData.session.access_token,
      expiresAt: signUpData.session.expires_at,
    });
  },

  async login(credentials: { email: string; password: string }): Promise<CustomerSession> {
    const supabase = createClient();
    const email = credentials.email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: credentials.password,
    });
    if (error || !data.session || !data.user) {
      throw new Error('E-mail ou senha inválidos');
    }
    const profile = await getProfileByUserId(data.user.id);
    if (profile?.role === 'admin') {
      await supabase.auth.signOut();
      throw new Error('Use o acesso administrativo para esta conta');
    }
    const name = profile?.name || (data.user.user_metadata.name as string) || 'Cliente BrasaDog';
    const phone = profile?.phone || (data.user.user_metadata.phone as string) || '';
    await upsertProfile({
      user_id: data.user.id,
      email: profile?.email || data.user.email || email,
      name,
      phone,
      role: 'customer',
    });
    return mapToCustomerSession({
      user: {
        id: data.user.id,
        name,
        email: profile?.email || data.user.email || email,
        phone,
      },
      token: data.session.access_token,
      expiresAt: data.session.expires_at,
    });
  },

  async logout(): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  async getSession(): Promise<CustomerSession | null> {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session?.user) return null;
    const profile = await getProfileByUserId(data.session.user.id);
    if (profile?.role === 'admin') return null;
    const user: CustomerUser = {
      id: data.session.user.id,
      name: profile?.name || (data.session.user.user_metadata.name as string) || 'Cliente BrasaDog',
      email: profile?.email || data.session.user.email || '',
      phone: profile?.phone || (data.session.user.user_metadata.phone as string) || '',
    };
    return mapToCustomerSession({
      user,
      token: data.session.access_token,
      expiresAt: data.session.expires_at,
    });
  },
};
