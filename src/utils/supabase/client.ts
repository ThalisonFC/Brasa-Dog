import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

let browserClient: SupabaseClient | undefined;

/**
 * Cliente Supabase para o browser (Vite + React).
 * Em SPA não há refresh automático de sessão via middleware do Next; o SDK renova via `autoRefreshToken` (padrão).
 */
export function createClient(): SupabaseClient {
  if (browserClient) return browserClient;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Defina VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY no .env.local'
    );
  }
  browserClient = createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return browserClient;
}
