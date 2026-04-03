import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { SiteContent } from '@/types';
import { siteContent as defaultContent } from '@/data/siteContent';
import { contentService } from '@/services/content.service';

type SiteContentContextValue = {
  content: SiteContent;
  refresh: () => Promise<void>;
};

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);

  const refresh = useCallback(async () => {
    const c = await contentService.getSiteContent();
    setContent(c);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const onEvt = () => {
      void refresh();
    };
    window.addEventListener('brasadog:content', onEvt);
    return () => window.removeEventListener('brasadog:content', onEvt);
  }, [refresh]);

  const value = useMemo(() => ({ content, refresh }), [content, refresh]);

  return (
    <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    throw new Error('useSiteContent deve ser usado dentro de SiteContentProvider');
  }
  return ctx;
}
