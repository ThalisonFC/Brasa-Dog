import { useCallback, useState } from 'react';
import type { Product } from '@/types';
import { useSiteContent } from '@/context/SiteContentContext';
import { CustomizationModal } from '@/components/customization/CustomizationModal';
import { MenuSection } from '@/components/menu/MenuSection';
import { ProductGrid } from '@/components/menu/ProductGrid';

export function Home() {
  const { content } = useSiteContent();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const scrollToMenu = useCallback(() => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleCustomize = useCallback((product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  }, []);

  return (
    <>
      <section className="relative flex h-screen items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${content.hero.backgroundImageUrl}')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        </div>

        <div className="relative z-10 max-w-4xl px-4 text-center">
          <h1
            className="mb-4 text-6xl text-primary md:text-8xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {content.hero.headline}
          </h1>
          <p className="mb-2 text-2xl italic text-foreground md:text-3xl">{content.hero.subheadline}</p>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Experiência gourmet única, onde ingredientes premium se encontram com técnicas artesanais
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={scrollToMenu}
              className="rounded-lg bg-primary px-8 py-4 text-lg font-bold text-primary-foreground transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/50"
            >
              {content.hero.ctaText}
            </button>
          </div>
        </div>
      </section>

      <MenuSection
        title="Nosso Cardápio"
        subtitle="Criações artesanais que elevam o hot dog a uma experiência gourmet"
      >
        <ProductGrid onCustomize={handleCustomize} />
      </MenuSection>

      <section className="bg-card px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2
            className="mb-6 text-4xl text-primary"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {content.about.title}
          </h2>
          <div className="mx-auto mb-8 h-1 w-24 bg-primary" />
          <p className="mb-4 text-lg leading-relaxed text-foreground">{content.about.description}</p>
        </div>
      </section>

      <CustomizationModal
        product={selectedProduct}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedProduct(null);
        }}
      />
    </>
  );
}
