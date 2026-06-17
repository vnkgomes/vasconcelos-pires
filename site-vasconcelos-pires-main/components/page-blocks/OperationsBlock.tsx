import type { Operation } from '@/content/operations';
import { SectionLabel } from '@/components/layout/SectionLabel';
import { GoldRule } from '@/components/primitives/GoldRule';

export function OperationsBlock({
  operations,
  representativePractice,
  label = 'Operações Representativas',
}: {
  operations: Operation[];
  representativePractice?: string;
  label?: string;
}) {
  if (operations.length === 0 && representativePractice) {
    return (
      <section className="container py-section">
        <SectionLabel>Atuação Representativa</SectionLabel>
        <p className="mt-8 max-w-editorial font-sans text-body-l text-ink">{representativePractice}</p>
      </section>
    );
  }
  return (
    <section className="container py-section">
      <SectionLabel>{label}</SectionLabel>
      <div className="mt-12 space-y-12">
        {operations.map((op) => (
          <article key={op.id} className="grid grid-cols-14 gap-x-6">
            <div className="col-span-14 md:col-span-2">
              <p className="font-mono text-mono-s uppercase tracking-[0.16em] text-bordeaux">{op.sector}</p>
            </div>
            <div className="col-span-14 md:col-span-9">
              <h3 className="font-display text-display-m text-ink">{op.title}</h3>
              <GoldRule className="mt-4 w-12" />
              <p className="mt-6 font-sans text-body-l text-stone max-w-editorial">{op.summary}</p>
            </div>
            <div className="col-span-14 md:col-span-3 md:text-right">
              <p className="font-mono text-mono text-stone">{op.meta}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
