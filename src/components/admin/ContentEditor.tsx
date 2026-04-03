import type { ChangeEventHandler } from 'react';
import type { SiteContent } from '@/types';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

type ContentEditorProps = {
  value: SiteContent;
  onChange: (next: SiteContent) => void;
  errors?: Partial<Record<string, string>>;
};

export function ContentEditor({ value, onChange, errors = {} }: ContentEditorProps) {
  const patch = (section: keyof SiteContent, field: string, v: string) => {
    onChange({
      ...value,
      [section]: { ...value[section], [field]: v },
    } as SiteContent);
  };

  const onUploadAboutImage: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (result) {
        patch('about', 'imageUrl', result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-border bg-card p-4">
        <h2 className="mb-4 text-lg font-semibold text-primary">Hero</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-muted-foreground" htmlFor="ce-hero-head">
              Headline
            </label>
            <Input
              id="ce-hero-head"
              value={value.hero.headline}
              onChange={(e) => patch('hero', 'headline', e.target.value)}
              error={errors['hero.headline']}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted-foreground" htmlFor="ce-hero-sub">
              Subheadline
            </label>
            <Input
              id="ce-hero-sub"
              value={value.hero.subheadline}
              onChange={(e) => patch('hero', 'subheadline', e.target.value)}
              error={errors['hero.subheadline']}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted-foreground" htmlFor="ce-hero-cta">
              Texto do CTA
            </label>
            <Input
              id="ce-hero-cta"
              value={value.hero.ctaText}
              onChange={(e) => patch('hero', 'ctaText', e.target.value)}
              error={errors['hero.ctaText']}
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm text-muted-foreground" htmlFor="ce-hero-bg">
              URL imagem de fundo
            </label>
            <Input
              id="ce-hero-bg"
              value={value.hero.backgroundImageUrl}
              onChange={(e) => patch('hero', 'backgroundImageUrl', e.target.value)}
              error={errors['hero.backgroundImageUrl']}
            />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-4">
        <h2 className="mb-4 text-lg font-semibold text-primary">Sobre</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-muted-foreground" htmlFor="ce-about-title">
              Título
            </label>
            <Input
              id="ce-about-title"
              value={value.about.title}
              onChange={(e) => patch('about', 'title', e.target.value)}
              error={errors['about.title']}
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm text-muted-foreground" htmlFor="ce-about-desc">
              Descrição
            </label>
            <Textarea
              id="ce-about-desc"
              value={value.about.description}
              onChange={(e) => patch('about', 'description', e.target.value)}
              error={errors['about.description']}
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm text-muted-foreground" htmlFor="ce-about-img">
              URL da imagem
            </label>
            <Input
              id="ce-about-img"
              value={value.about.imageUrl}
              onChange={(e) => patch('about', 'imageUrl', e.target.value)}
              error={errors['about.imageUrl']}
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm text-muted-foreground" htmlFor="ce-about-upload">
              Upload de imagem
            </label>
            <input
              id="ce-about-upload"
              type="file"
              accept="image/*"
              onChange={onUploadAboutImage}
              className="w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Ao enviar, a imagem substitui o campo URL acima.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-4">
        <h2 className="mb-4 text-lg font-semibold text-primary">Contato</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-muted-foreground" htmlFor="ce-wa">
              WhatsApp (5511999999999)
            </label>
            <Input
              id="ce-wa"
              value={value.contact.whatsappNumber}
              onChange={(e) => patch('contact', 'whatsappNumber', e.target.value)}
              error={errors['contact.whatsappNumber']}
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm text-muted-foreground" htmlFor="ce-addr">
              Endereço
            </label>
            <Input
              id="ce-addr"
              value={value.contact.address}
              onChange={(e) => patch('contact', 'address', e.target.value)}
              error={errors['contact.address']}
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm text-muted-foreground" htmlFor="ce-hours">
              Horário
            </label>
            <Input
              id="ce-hours"
              value={value.contact.openingHours}
              onChange={(e) => patch('contact', 'openingHours', e.target.value)}
              error={errors['contact.openingHours']}
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm text-muted-foreground" htmlFor="ce-ig">
              Instagram (URL)
            </label>
            <Input
              id="ce-ig"
              value={value.contact.instagram}
              onChange={(e) => patch('contact', 'instagram', e.target.value)}
              error={errors['contact.instagram']}
            />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-4">
        <h2 className="mb-4 text-lg font-semibold text-primary">Rodapé</h2>
        <div>
          <label className="mb-1 block text-sm text-muted-foreground" htmlFor="ce-foot">
            Tagline
          </label>
          <Textarea
            id="ce-foot"
            value={value.footer.tagline}
            onChange={(e) => patch('footer', 'tagline', e.target.value)}
            error={errors['footer.tagline']}
          />
        </div>
      </section>
    </div>
  );
}
