import type { AppSettings } from '@/types';
import { storageService } from './storage.service';

const KEY = 'brasadog_settings';

const defaultSettings: AppSettings = {
  maintenanceMode: false,
  deliveryEnabled: true,
  pickupEnabled: true,
  deliveryFee: 10,
  deliveryEstimateText: '45 minutos a 1 hora',
};

// TODO: Substituir por Supabase quando integrado

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const settingsService = {
  async getSettings(): Promise<AppSettings> {
    const s = storageService.get<AppSettings>(KEY);
    return delay({ ...defaultSettings, ...s });
  },

  async updateSettings(partial: Partial<AppSettings>): Promise<AppSettings> {
    const current = { ...defaultSettings, ...storageService.get<AppSettings>(KEY) };
    const next = { ...current, ...partial };
    storageService.set(KEY, next);
    return delay({ ...next });
  },
};
