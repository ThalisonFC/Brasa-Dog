import { siteContent as defaultContent } from '@/data/siteContent';
import type { SiteContent } from '@/types';
import { storageService } from './storage.service';

const KEY = 'brasadog_content';

// TODO: Substituir implementação por chamadas Supabase

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function read(): SiteContent {
  const stored = storageService.get<SiteContent>(KEY);
  if (!stored) {
    storageService.set(KEY, defaultContent);
    return { ...defaultContent };
  }
  return stored;
}

function write(c: SiteContent): void {
  storageService.set(KEY, c);
}

export type SiteContentUpdate = {
  hero?: Partial<SiteContent['hero']>;
  about?: Partial<SiteContent['about']>;
  contact?: Partial<SiteContent['contact']>;
  footer?: Partial<SiteContent['footer']>;
};

export const contentService = {
  async getSiteContent(): Promise<SiteContent> {
    return delay({ ...read() });
  },

  async updateSiteContent(data: SiteContentUpdate): Promise<SiteContent> {
    const current = read();
    const next: SiteContent = {
      hero: { ...current.hero, ...data.hero },
      about: { ...current.about, ...data.about },
      contact: { ...current.contact, ...data.contact },
      footer: { ...current.footer, ...data.footer },
    };
    write(next);
    return delay({ ...next });
  },

  async resetSiteContent(): Promise<SiteContent> {
    write({ ...defaultContent });
    return delay({ ...defaultContent });
  },
};
