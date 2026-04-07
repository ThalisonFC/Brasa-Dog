import type { AdminSession, LoginFormData } from '@/types';
import { createClient } from '@/utils/supabase/client';
import { getProfileByUserId } from './supabase.service';

function mapToAdminSession(input: {
  userId: string;
  email: string;
  name: string;
  token: string;
  expiresAt?: number;
}): AdminSession {
  const expiresAt = input.expiresAt
    ? new Date(input.expiresAt * 1000).toISOString()
    : new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
  return {
    user: {
      id: input.userId,
      email: input.email,
      name: input.name || 'Administrador BrasaDog',
      role: 'owner',
    },
    token: input.token,
    expiresAt,
  };
}

export const authService = {
  async login(credentials: LoginFormData): Promise<AdminSession> {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
    });
    if (error || !data.session || !data.user) {
      throw new Error('E-mail ou senha inválidos');
    }
    const profile = await getProfileByUserId(data.user.id);
    if (!profile || profile.role !== 'admin') {
      await supabase.auth.signOut();
      throw new Error('Usuário sem permissão administrativa');
    }
    return mapToAdminSession({
      userId: data.user.id,
      email: profile.email || data.user.email || credentials.email,
      name: profile.name,
      token: data.session.access_token,
      expiresAt: data.session.expires_at,
    });
  },

  async logout(): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  async getSession(): Promise<AdminSession | null> {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session?.user) return null;
    const profile = await getProfileByUserId(data.session.user.id);
    if (!profile || profile.role !== 'admin') return null;
    return mapToAdminSession({
      userId: data.session.user.id,
      email: profile.email || data.session.user.email || '',
      name: profile.name,
      token: data.session.access_token,
      expiresAt: data.session.expires_at,
    });
  },

  async updatePassword(newPassword: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw new Error(error.message);
  },
};
