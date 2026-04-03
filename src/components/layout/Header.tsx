import { Link } from 'react-router-dom';
import { useSiteContent } from '@/context/SiteContentContext';
import { useCart } from '@/hooks/useCart';
import { useCustomer } from '@/hooks/useCustomer';
import { CartIcon } from '@/components/cart/CartIcon';

export function Header() {
  const { content } = useSiteContent();
  const { totalItems, openCart } = useCart();
  const { isAuthenticated, session } = useCustomer();

  return (
    <header className="fixed left-0 right-0 top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="min-w-0 text-left">
          <h1
            className="text-3xl text-primary"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {content.hero.headline}
          </h1>
          <p className="text-xs italic text-muted-foreground">{content.hero.subheadline}</p>
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          {isAuthenticated && session ? (
            <Link
              to="/conta"
              className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {session.user.name.split(' ')[0]}
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Entrar
              </Link>
              <Link
                to="/cadastro"
                className="rounded-lg border border-primary/50 px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
              >
                Cadastrar
              </Link>
            </>
          )}
          <CartIcon totalItems={totalItems} onClick={openCart} />
        </div>
      </div>
    </header>
  );
}
