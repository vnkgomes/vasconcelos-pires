import { notFound } from 'next/navigation';
import Link from 'next/link';
import { partners, getPartnerBySlug } from '@/content/partners';
import { practiceAreas } from '@/content/practice-areas';
import { pareceres } from '@/content/pareceres';
import { SectionLabel } from '@/components/layout/SectionLabel';
import { GoldRule } from '@/components/primitives/GoldRule';
import { DocArrow } from '@/components/primitives/DocArrow';
import { PlaceholderPhoto } from '@/components/primitives/PlaceholderPhoto';
import { personLd, ldScript } from '@/lib/jsonld';

export function generateStaticParams() {
  return partners.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = getPartnerBySlug(params.slug);
  if (!p) return {};
  return { title: p.name, description: p.bioShort };
}

export default function Page({ params }: { params: { slug: string } }) {
  const partner = getPartnerBySlug(params.slug);
  if (!partner) notFound();
  const areas = practiceAreas.filter((a) => a.partnerSlugs.includes(partner.slug));
  const parecesAuthored = pareceres.filter((p) => p.authorSlug === partner.slug);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldScript(personLd(partner)) }} />
      <section className="container py-section">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <div className="relative aspect-[3/4] overflow-hidden">
              <PlaceholderPhoto name={partner.name} className="absolute inset-0 h-full w-full" />
            </div>
          </div>
          <div className="md:col-span-7">
            <p className="font-mono text-mono-s uppercase tracking-[0.16em] text-stone">{partner.role}</p>
            <h1 className="mt-4 font-display text-display-xl text-ink">{partner.name}</h1>
            <p className="mt-4 font-display text-display-m text-bordeaux">{partner.practice}</p>
            <GoldRule className="mt-8 w-12" />
            <p className="mt-8 font-sans text-body-l text-ink max-w-editorial">{partner.bioLong}</p>
          </div>
        </div>
      </section>

      <section className="container py-section">
        <SectionLabel>Formação</SectionLabel>
        <ul className="mt-12 space-y-4 max-w-editorial">
          {partner.education.map((e, i) => (
            <li key={i} className="font-sans text-body-l text-ink flex gap-3 before:content-['·'] before:text-gold">{e}</li>
          ))}
        </ul>
      </section>

      {areas.length > 0 && (
        <section className="container py-section">
          <SectionLabel>Áreas em que atua</SectionLabel>
          <ul className="mt-12 space-y-6">
            {areas.map((a) => (
              <li key={a.slug}>
                <Link href={`/areas-de-atuacao/${a.slug}`} className="group flex items-baseline gap-6 hover:text-bordeaux">
                  <span className="font-mono text-mono text-bordeaux">{a.number}</span>
                  <span className="font-display text-display-m text-ink group-hover:text-bordeaux transition-colors">{a.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {parecesAuthored.length > 0 && (
        <section className="container py-section">
          <SectionLabel>Pareceres recentes</SectionLabel>
          <ul className="mt-12 space-y-6">
            {parecesAuthored.slice(0, 3).map((p) => (
              <li key={p.slug}>
                {p.kind === 'full' ? (
                  <Link href={`/pareceres/${p.slug}`} className="group block">
                    <p className="font-mono text-mono text-bordeaux">Parecer Nº {p.number}</p>
                    <p className="mt-2 font-display text-display-m text-ink group-hover:text-bordeaux transition-colors">{p.title}</p>
                    <p className="mt-2 font-mono text-mono text-stone">{p.dateLabel}</p>
                  </Link>
                ) : (
                  <div className="opacity-60">
                    <p className="font-mono text-mono text-bordeaux">Parecer Nº {p.number}</p>
                    <p className="mt-2 font-display text-display-m text-ink">{p.title}</p>
                    <p className="mt-2 font-mono text-mono text-stone">{p.dateLabel} · arquivo</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <Link href="/pareceres" className="mt-8 inline-flex items-center gap-3 font-sans text-body-m text-ink hover:text-bordeaux">
            <DocArrow />
            Arquivo completo
          </Link>
        </section>
      )}
    </>
  );
}
