import { createClient } from '@/utils/supabase/client';

export type ProfileRole = 'admin' | 'customer';

export type ProfileRecord = {
  user_id: string;
  email: string;
  name: string;
  phone: string;
  role: ProfileRole;
};

export async function getProfileByUserId(userId: string): Promise<ProfileRecord | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('app_profiles')
    .select('user_id, email, name, phone, role')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as ProfileRecord | null;
}

export async function upsertProfile(input: ProfileRecord): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('app_profiles').upsert(input, { onConflict: 'user_id' });
  if (error) throw new Error(error.message);
}
