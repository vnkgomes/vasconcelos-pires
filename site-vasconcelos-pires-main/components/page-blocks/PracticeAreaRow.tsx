import Link from 'next/link';
import type { PracticeArea } from '@/content/practice-areas';
import { SectionNumber } from '@/components/primitives/SectionNumber';
import { DocArrow } from '@/components/primitives/DocArrow';
import { Hairline } from '@/components/layout/Hairline';

export function PracticeAreaRow({ area, last = false }: { area: PracticeArea; last?: boolean }) {
  return (
    <article>
      <Link href={`/areas-de-atuacao/${area.slug}`} className="group block py-12">
        <div className="grid grid-cols-14 gap-x-6">
          <div className="col-span-2 md:col-span-1 pt-2">
            <SectionNumber>{area.number}</SectionNumber>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h3 className="font-display text-display-l text-ink group-hover:text-bordeaux transition-colors">
              {area.title}
            </h3>
            <p className="mt-4 font-sans text-body-l text-stone max-w-editorial">{area.summary}</p>
          </div>
          <div className="hidden md:flex md:col-span-3 md:col-start-12 justify-end items-start pt-4">
            <DocArrow className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
          </div>
        </div>
      </Link>
      {!last && <Hairline className="border-ink/15" />}
    </article>
  );
}
