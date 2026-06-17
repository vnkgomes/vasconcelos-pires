import { notFound } from 'next/navigation';
import Link from 'next/link';
import { practiceAreas, getPracticeAreaBySlug } from '@/content/practice-areas';
import { getPartnerBySlug } from '@/content/partners';
import { getOperationsForArea } from '@/content/operations';
import { SectionLabel } from '@/components/layout/SectionLabel';
import { SectionNumber } from '@/components/primitives/SectionNumber';
import { GoldRule } from '@/components/primitives/GoldRule';
import { OperationsBlock } from '@/components/page-blocks/OperationsBlock';
import { DocArrow } from '@/components/primitives/DocArrow';

export function generateStaticParams() {
  return practiceAreas.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const area = getPracticeAreaBySlug(params.slug);
  if (!area) return {};
  return { title: area.title, description: area.summary };
}

export default function Page({ params }: { params: { slug: string } }) {
  const area = getPracticeAreaBySlug(params.slug);
  if (!area) notFound();
  const partners = area.partnerSlugs.map(getPartnerBySlug).filter(Boolean);
  const operations = getOperationsForArea(area.slug);

  return (
    <>
      <section className="container py-section">
        <p className="font-mono text-mono-s uppercase tracking-[0.16em] text-stone">
          <SectionNumber>{area.number}</SectionNumber> · Áreas de Atuação
        </p>
        <h1 className="mt-6 font-display text-display-xl text-ink">{area.title}</h1>
        <GoldRule className="mt-12 w-12" />
        <p className="mt-12 max-w-editorial font-sans text-body-l text-ink">{area.summary}</p>
        <p className="mt-6 max-w-editorial font-sans text-body-l text-stone">{area.description}</p>
      </section>

      <section className="container py-section">
        <SectionLabel>Serviços</SectionLabel>
        <ul className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 max-w-4xl">
          {area.services.map((s) => (
            <li key={s} className="font-sans text-body-l text-ink flex gap-3 before:content-['·'] before:text-gold">
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </section>

      <OperationsBlock operations={operations} representativePractice={area.representativePractice} />

      <section className="container py-section">
        <SectionLabel>Sócios Responsáveis</SectionLabel>
        <div className="mt-12 space-y-12">
          {partners.map((p) => p && (
            <article key={p.slug}>
              <h3 className="font-display text-display-m text-ink">{p.name}</h3>
              <p className="mt-2 font-sans text-body-m text-bordeaux">{p.practice}</p>
              <GoldRule className="mt-4 w-8" />
              <p className="mt-4 max-w-editorial font-sans text-body-m text-stone">{p.bioShort}</p>
              <Link href={`/equipe/${p.slug}`} className="mt-6 inline-flex items-center gap-3 font-sans text-body-m text-ink hover:text-bordeaux">
                <DocArrow />
                Conhecer {p.name.split(' ')[0]}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
