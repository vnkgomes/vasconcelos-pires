import { GoldRule } from '@/components/primitives/GoldRule';

export function ParecerHeader({
  number,
  title,
  authorName,
  practice,
  dateLabel,
  city = 'São Paulo',
}: {
  number: string;
  title: string;
  authorName: string;
  practice: string;
  dateLabel: string;
  city?: string;
}) {
  return (
    <header className="container py-section text-center">
      <p className="font-mono text-mono uppercase tracking-[0.16em] text-bordeaux">PARECER Nº {number}</p>
      <GoldRule className="mt-4 w-12 mx-auto" />
      <h1 className="mt-12 font-display text-display-xl text-ink container-narrow text-balance">
        {title}
      </h1>
      <p className="mt-12 font-mono text-mono uppercase tracking-[0.16em] text-stone">
        por <span className="text-ink">{authorName}</span> · {practice}
      </p>
      <p className="mt-4 font-mono text-mono text-stone">
        {city}, {dateLabel}
      </p>
    </header>
  );
}
