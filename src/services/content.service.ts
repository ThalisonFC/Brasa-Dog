import { siteContent as defaultContent } from '@/data/siteContent';
import type { SiteContent } from '@/types';
import { createClient } from '@/utils/supabase/client';

export type SiteContentUpdate = {
  hero?: Partial<SiteContent['hero']>;
  about?: Partial<SiteContent['about']>;
  contact?: Partial<SiteContent['contact']>;
  footer?: Partial<SiteContent['footer']>;
};

type SiteContentRow = {
  id: number;
  payload: SiteContent;
};

async function ensureSeededContent(): Promise<void> {
  const supabase = createClient();
  const { data, error } = await supabase.from('app_site_content').select('id').eq('id', 1).maybeSingle();
  if (error) throw new Error(error.message);
  if (data) return;
  const { error: insertError } = await supabase.from('app_site_content').insert({
    id: 1,
    payload: defaultContent,
  });
  if (insertError) throw new Error(insertError.message);
}

export const contentService = {
  async getSiteContent(): Promise<SiteContent> {
    await ensureSeededContent();
    const supabase = createClient();
    const { data, error } = await supabase
      .from('app_site_content')
      .select('id, payload')
      .eq('id', 1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    const row = data as SiteContentRow | null;
    return row?.payload ?? { ...defaultContent };
  },

  async updateSiteContent(data: SiteContentUpdate): Promise<SiteContent> {
    const current = await this.getSiteContent();
    const next: SiteContent = {
      hero: { ...current.hero, ...data.hero },
      about: { ...current.about, ...data.about },
      contact: { ...current.contact, ...data.contact },
      footer: { ...current.footer, ...data.footer },
    };
    const supabase = createClient();
    const { error } = await supabase.from('app_site_content').upsert({
      id: 1,
      payload: next,
    });
    if (error) throw new Error(error.message);
    return { ...next };
  },

  async resetSiteContent(): Promise<SiteContent> {
    const supabase = createClient();
    const { error } = await supabase.from('app_site_content').upsert({
      id: 1,
      payload: defaultContent,
    });
    if (error) throw new Error(error.message);
    return { ...defaultContent };
  },
};
