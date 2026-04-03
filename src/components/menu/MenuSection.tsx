import type { ReactNode } from 'react';

type MenuSectionProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function MenuSection({ title, subtitle, children }: MenuSectionProps) {
  return (
    <section id="menu" className="px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2
            className="mb-4 text-4xl text-primary"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {title}
          </h2>
          <div className="mx-auto mb-4 h-1 w-24 bg-primary" />
          {subtitle ? <p className="text-muted-foreground">{subtitle}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}
