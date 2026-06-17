import { partners } from '@/content/partners';
import { SectionLabel } from '@/components/layout/SectionLabel';
import { PartnerCard } from '@/components/page-blocks/PartnerCard';
import { Hairline } from '@/components/layout/Hairline';

export const metadata = {
  title: 'Equipe',
  description: 'Quatro sócios. Atuação direta em cada caso. Bios e formação dos sócios fundadores e gestores.',
};

export default function Page() {
  return (
    <>
      <section className="container py-section">
        <SectionLabel>Equipe</SectionLabel>
        <h1 className="mt-8 font-display text-display-xl text-ink">
          Quatro sócios.<br />Atuação direta em cada caso.
        </h1>
      </section>
      <section className="container">
        {partners.map((p, i) => (
          <div key={p.slug}>
            <PartnerCard partner={p} reverse={i % 2 === 1} />
            {i < partners.length - 1 && <Hairline className="border-ink/15" />}
          </div>
        ))}
      </section>
    </>
  );
}
