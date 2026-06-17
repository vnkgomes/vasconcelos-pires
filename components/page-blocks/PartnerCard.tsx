import Link from 'next/link';
import type { Partner } from '@/content/partners';
import { DocArrow } from '@/components/primitives/DocArrow';
import { GoldRule } from '@/components/primitives/GoldRule';
import { PlaceholderPhoto } from '@/components/primitives/PlaceholderPhoto';

export function PartnerCard({ partner, reverse = false }: { partner: Partner; reverse?: boolean }) {
  return (
    <article className={`flex flex-col md:flex-row gap-12 py-section ${reverse ? 'md:flex-row-reverse' : ''}`}>
      <div className="md:w-2/5">
        <div className="relative aspect-[3/4] overflow-hidden">
          <PlaceholderPhoto name={partner.name} className="absolute inset-0 h-full w-full" />
        </div>
      </div>
      <div className="md:w-3/5">
        <h2 className="font-display text-display-l text-ink">{partner.name}</h2>
        <p className="mt-2 font-sans text-body-m text-stone">{partner.role}</p>
        <p className="mt-1 font-sans text-body-m text-bordeaux">{partner.practice}</p>
        <GoldRule className="mt-6 w-12" />
        <p className="mt-6 font-sans text-body-l text-ink max-w-editorial">{partner.bioLong}</p>
        <Link href={`/equipe/${partner.slug}`} className="mt-8 inline-flex items-center gap-3 font-sans text-body-m text-ink hover:text-bordeaux">
          <DocArrow />
          Página completa
        </Link>
      </div>
    </article>
  );
}
