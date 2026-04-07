import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';
import { supabaseConfig } from '@/config/supabase';

let browserClient: SupabaseClient | undefined;

/**
 * Cliente Supabase para o browser (Vite + React).
 * Em SPA não há refresh automático de sessão via middleware do Next; o SDK renova via `autoRefreshToken` (padrão).
 */
export function createClient(): SupabaseClient {
  if (browserClient) return browserClient;
  browserClient = createSupabaseClient(supabaseConfig.url, supabaseConfig.publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return browserClient;
}
