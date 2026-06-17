import { pareceres, getYearsWithPareceres } from '@/content/pareceres';
import { SectionLabel } from '@/components/layout/SectionLabel';
import { ParecerListItem } from '@/components/page-blocks/ParecerListItem';

export const metadata = {
  title: 'Pareceres',
  description: 'Análises e comentários do escritório sobre decisões e legislação relevante para o direito empresarial. Publicação periódica desde 2003.',
};

export default function Page() {
  const years = getYearsWithPareceres();

  return (
    <>
      <section className="container py-section">
        <SectionLabel>Pareceres</SectionLabel>
        <h1 className="mt-8 font-display text-display-xl text-ink">
          Análises e comentários sobre<br />decisões e legislação relevante<br />para o direito empresarial.
        </h1>
        <p className="mt-8 max-w-editorial font-sans text-body-l text-stone">
          Publicação periódica do escritório desde 2003.
        </p>
      </section>

      <section className="container pb-section space-y-16">
        {years.map((year) => {
          const yearEntries = pareceres.filter((p) => p.year === year);
          return (
            <div key={year}>
              <p className="font-mono text-mono uppercase tracking-[0.16em] text-stone">{year}</p>
              <hr className="mt-2 mb-8 border-0 border-t border-ink/15 w-12" />
              <ul>
                {yearEntries.map((entry, i) => (
                  <li key={entry.slug}>
                    <ParecerListItem entry={entry} last={i === yearEntries.length - 1} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>
    </>
  );
}
