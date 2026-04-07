const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

function assertEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Variável obrigatória ausente: ${name}`);
  }
  return value;
}

function assertSupabaseUrl(value: string): string {
  if (!/^https:\/\/.+\.supabase\.co$/i.test(value)) {
    throw new Error(
      'VITE_SUPABASE_URL inválida. Use o formato: https://<project-ref>.supabase.co'
    );
  }
  return value;
}

export const supabaseConfig = {
  url: assertSupabaseUrl(assertEnv(supabaseUrl, 'VITE_SUPABASE_URL')),
  publishableKey: assertEnv(
    supabasePublishableKey,
    'VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY'
  ),
};
