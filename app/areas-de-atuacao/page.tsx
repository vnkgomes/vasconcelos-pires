import { practiceAreas } from '@/content/practice-areas';
import { SectionLabel } from '@/components/layout/SectionLabel';
import { PracticeAreaRow } from '@/components/page-blocks/PracticeAreaRow';

export const metadata = {
  title: 'Áreas de Atuação',
  description: 'Cinco frentes do direito empresarial: societário e M&A, contratos, tributário, compliance e arbitragem.',
};

export default function Page() {
  return (
    <>
      <section className="container py-section">
        <SectionLabel>Áreas de Atuação</SectionLabel>
        <h1 className="mt-8 font-display text-display-xl text-ink">
          Cinco frentes. Atuação<br />exclusivamente empresarial.
        </h1>
      </section>
      <section className="container pb-section">
        {practiceAreas.map((area, i) => (
          <PracticeAreaRow key={area.slug} area={area} last={i === practiceAreas.length - 1} />
        ))}
      </section>
    </>
  );
}
