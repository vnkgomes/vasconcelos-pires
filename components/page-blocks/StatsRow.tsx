import { SectionLabel } from '@/components/layout/SectionLabel';

interface Stat {
  value: string;
  label: string;
}

export function StatsRow({ items, label = 'Em números' }: { items: Stat[]; label?: string }) {
  return (
    <section className="container py-section">
      <SectionLabel>{label}</SectionLabel>
      <dl className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
        {items.map((s) => (
          <div key={s.label}>
            <dt className="font-display text-display-l text-ink">{s.value}</dt>
            <dd className="mt-3 font-mono text-mono-s uppercase tracking-[0.12em] text-stone">{s.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
