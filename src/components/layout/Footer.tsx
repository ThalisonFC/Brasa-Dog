import { Link } from 'react-router-dom';
import { Instagram, MessageCircle } from 'lucide-react';
import { useSiteContent } from '@/context/SiteContentContext';

export function Footer() {
  const { content } = useSiteContent();
  const wa = content.contact.whatsappNumber.replace(/\D/g, '');
  const whatsappHref = wa ? `https://wa.me/${wa}` : '#';

  return (
    <footer className="border-t border-border bg-card px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3
              className="mb-4 text-2xl text-primary"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {content.hero.headline}
            </h3>
            <p className="text-sm text-muted-foreground">{content.footer.tagline}</p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Contato</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-primary"
              >
                <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
                <span>WhatsApp</span>
              </a>
              <a
                href={content.contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-primary"
              >
                <Instagram className="h-4 w-4 shrink-0" aria-hidden />
                <span>Instagram</span>
              </a>
              <p className="pt-1">{content.contact.address}</p>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Horário</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              {content.contact.openingHours.split('|').map((line) => (
                <p key={line.trim()}>{line.trim()}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p className="mb-3">
            <Link
              to="/login"
              className="text-muted-foreground/90 underline-offset-2 transition-colors hover:text-primary hover:underline"
            >
              Área de acesso
            </Link>
          </p>
          <p>&copy; {new Date().getFullYear()} BrasaDog Atelier. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
