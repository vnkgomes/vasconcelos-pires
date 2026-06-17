import Link from 'next/link';
import type { ParecerEntry } from '@/content/pareceres';

export function ParecerNav({ previous, next }: { previous?: ParecerEntry; next?: ParecerEntry }) {
  return (
    <nav className="container py-section border-t border-ink/15">
      <div className="flex flex-col md:flex-row justify-between gap-8 font-mono text-mono">
        {previous ? (
          <Link href={`/pareceres/${previous.slug}`} className="text-stone hover:text-bordeaux">
            ← Anterior: Parecer nº {previous.number} · {previous.authorName}
          </Link>
        ) : <span />}
        {next && (
          <Link href={`/pareceres/${next.slug}`} className="text-stone hover:text-bordeaux md:text-right">
            Próximo: Parecer nº {next.number} · {next.authorName} →
          </Link>
        )}
      </div>
    </nav>
  );
}
