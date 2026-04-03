import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-4xl text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
        404
      </h1>
      <p className="text-muted-foreground">Página não encontrada.</p>
      <Link
        to="/"
        className="rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground hover:bg-primary/90"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
