import Link from 'next/link';
import type { ParecerEntry } from '@/content/pareceres';
import { Hairline } from '@/components/layout/Hairline';

export function ParecerListItem({ entry, last = false }: { entry: ParecerEntry; last?: boolean }) {
  const body = (
    <div className="grid grid-cols-14 gap-x-6 py-6">
      <p className="col-span-3 md:col-span-2 font-mono text-mono text-bordeaux">Nº {entry.number}</p>
      <div className="col-span-11 md:col-span-9">
        <p className="font-display text-display-m text-ink">{entry.title}</p>
        <p className="mt-2 font-mono text-mono-s uppercase tracking-[0.16em] text-stone">por {entry.authorName}</p>
      </div>
      <p className="hidden md:block col-span-3 text-right font-mono text-mono text-stone self-end">{entry.dateLabel}</p>
    </div>
  );

  return (
    <>
      {entry.kind === 'full' ? (
        <Link
          href={`/pareceres/${entry.slug}`}
          className="block group hover:bg-bone/50 -mx-6 px-6 transition-colors"
        >
          {body}
        </Link>
      ) : (
        <div
          className="opacity-60 cursor-default -mx-6 px-6"
          aria-disabled="true"
          title="Disponível apenas no arquivo do escritório"
        >
          {body}
        </div>
      )}
      {!last && <Hairline className="border-ink/15" />}
    </>
  );
}
