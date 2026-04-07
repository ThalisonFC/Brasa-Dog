import type { AppSettings } from '@/types';
import { createClient } from '@/utils/supabase/client';

const defaultSettings: AppSettings = {
  maintenanceMode: false,
  deliveryEnabled: true,
  pickupEnabled: true,
  deliveryFee: 10,
  deliveryEstimateText: '45 minutos a 1 hora',
};

type SettingsRow = {
  id: number;
  payload: AppSettings;
};

async function ensureSeededSettings(): Promise<void> {
  const supabase = createClient();
  const { data, error } = await supabase.from('app_settings').select('id').eq('id', 1).maybeSingle();
  if (error) throw new Error(error.message);
  if (data) return;
  const { error: insertError } = await supabase.from('app_settings').insert({
    id: 1,
    payload: defaultSettings,
  });
  if (insertError) throw new Error(insertError.message);
}

export const settingsService = {
  async getSettings(): Promise<AppSettings> {
    await ensureSeededSettings();
    const supabase = createClient();
    const { data, error } = await supabase
      .from('app_settings')
      .select('id, payload')
      .eq('id', 1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    const row = data as SettingsRow | null;
    return { ...defaultSettings, ...(row?.payload ?? {}) };
  },

  async updateSettings(partial: Partial<AppSettings>): Promise<AppSettings> {
    const current = await this.getSettings();
    const next = { ...current, ...partial };
    const supabase = createClient();
    const { error } = await supabase.from('app_settings').upsert({
      id: 1,
      payload: next,
    });
    if (error) throw new Error(error.message);
    return { ...next };
  },
};
