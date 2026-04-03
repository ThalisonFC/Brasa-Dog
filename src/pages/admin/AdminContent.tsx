import { useCallback, useEffect, useState } from 'react';
import type { SiteContent } from '@/types';
import { siteContentSchema } from '@/schemas/contentSchema';
import { contentService } from '@/services/content.service';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/hooks/useToast';

export function AdminContent() {
  const { showToast } = useToast();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resetOpen, setResetOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const c = await contentService.getSiteContent();
      setContent(c);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    if (!content) return;
    setErrors({});
    const parsed = siteContentSchema.safeParse(content);
    if (!parsed.success) {
      const e: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        e[i.path.join('.')] = i.message;
      });
      setErrors(e);
      showToast({ type: 'error', message: 'Corrija os campos destacados.' });
      return;
    }
    await contentService.updateSiteContent(parsed.data);
    window.dispatchEvent(new Event('brasadog:content'));
    showToast({ type: 'success', message: 'Conteúdo salvo.' });
    await load();
  };

  const resetDefaults = async () => {
    await contentService.resetSiteContent();
    window.dispatchEvent(new Event('brasadog:content'));
    showToast({ type: 'info', message: 'Conteúdo restaurado ao padrão.' });
    setResetOpen(false);
    await load();
  };

  if (loading || !content) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={() => void save()} className="px-4 py-2">
          Salvar alterações
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setResetOpen(true)}
          className="px-4 py-2"
        >
          Restaurar padrões
        </Button>
      </div>
      <ContentEditor value={content} onChange={setContent} errors={errors} />
      <ConfirmDialog
        isOpen={resetOpen}
        title="Restaurar conteúdo padrão?"
        description="As personalizações atuais serão substituídas."
        confirmLabel="Restaurar"
        variant="warning"
        onConfirm={() => void resetDefaults()}
        onCancel={() => setResetOpen(false)}
      />
    </div>
  );
}
