import Link from 'next/link';
import { DocArrow } from '@/components/primitives/DocArrow';

export default function NotFound() {
  return (
    <section className="container py-section min-h-[60vh] flex flex-col justify-center">
      <p className="font-mono text-mono-s uppercase tracking-[0.16em] text-stone">404 · Página não encontrada</p>
      <h1 className="mt-8 font-display text-display-xl text-ink">
        O documento solicitado<br />não foi localizado.
      </h1>
      <Link href="/" className="mt-12 inline-flex items-center gap-3 font-sans text-body-l text-ink hover:text-bordeaux">
        <DocArrow /> Voltar ao sumário
      </Link>
    </section>
  );
}
