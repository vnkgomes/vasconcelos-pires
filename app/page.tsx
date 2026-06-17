import Link from 'next/link';
import { practiceAreas } from '@/content/practice-areas';
import { partners } from '@/content/partners';
import { getFullPareceres } from '@/content/pareceres';
import { legalServiceLd, ldScript } from '@/lib/jsonld';
import { Hero } from '@/components/page-blocks/Hero';
import { StatsRow } from '@/components/page-blocks/StatsRow';
import { SectionLabel } from '@/components/layout/SectionLabel';
import { PracticeAreaRow } from '@/components/page-blocks/PracticeAreaRow';
import { ParecerListItem } from '@/components/page-blocks/ParecerListItem';
import { GoldRule } from '@/components/primitives/GoldRule';
import { DocArrow } from '@/components/primitives/DocArrow';

const STATS = [
  { value: '27', label: 'anos de atuação' },
  { value: '24', label: 'advogados em quadro fixo' },
  { value: '4', label: 'sócios fundadores' },
  { value: 'R$ 4B+', label: 'em arbitragens' },
];

export default function Home() {
  const fullPareceres = getFullPareceres().slice(0, 3);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldScript(legalServiceLd()) }} />
      <Hero />
      <StatsRow items={STATS} />

      <section className="container py-section">
        <SectionLabel>Áreas de Atuação</SectionLabel>
        <div className="mt-12">
          {practiceAreas.map((a, i) => (
            <PracticeAreaRow key={a.slug} area={a} last={i === practiceAreas.length - 1} />
          ))}
        </div>
      </section>

      <section className="container py-section">
        <SectionLabel>Sócios</SectionLabel>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          {partners.map((p) => (
            <Link key={p.slug} href={`/equipe/${p.slug}`} className="group">
              <h3 className="font-display text-display-m text-ink group-hover:text-bordeaux transition-colors">{p.name}</h3>
              <p className="mt-2 font-mono text-mono-s uppercase tracking-[0.16em] text-bordeaux">{p.practice}</p>
              <GoldRule className="mt-4 w-8" />
              <p className="mt-6 font-sans text-body-m text-stone max-w-editorial">{p.bioShort}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container py-section">
        <SectionLabel>Pareceres Recentes</SectionLabel>
        <div className="mt-12">
          {fullPareceres.map((p, i) => (
            <ParecerListItem key={p.slug} entry={p} last={i === fullPareceres.length - 1} />
          ))}
        </div>
        <Link href="/pareceres" className="mt-12 inline-flex items-center gap-3 font-sans text-body-m text-ink hover:text-bordeaux">
          <DocArrow /> Arquivo completo
        </Link>
      </section>
    </>
  );
}
