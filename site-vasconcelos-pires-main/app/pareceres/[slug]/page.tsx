import { Children, isValidElement, cloneElement, ReactNode, ReactElement } from 'react';
import { notFound } from 'next/navigation';
import { pareceres, getParecerBySlug, getParecerNeighbors } from '@/content/pareceres';
import { ParecerHeader } from '@/components/page-blocks/ParecerHeader';
import { ParecerParagraph } from '@/components/page-blocks/ParecerParagraph';
import { ParecerQuote } from '@/components/page-blocks/ParecerQuote';
import { ParecerNav } from '@/components/page-blocks/ParecerNav';
import { GoldRule } from '@/components/primitives/GoldRule';
import { PrintActions } from '@/components/page-blocks/PrintActions';
import { articleLd, ldScript } from '@/lib/jsonld';

import Parecer047 from '@/content/pareceres/047-stf-tributacao-software.mdx';
import Parecer046 from '@/content/pareceres/046-lei-do-carf-14689.mdx';
import Parecer045 from '@/content/pareceres/045-acordo-leniencia-cgu.mdx';

const FULL_BODIES: Record<string, (props: any) => ReactElement> = {
  'stf-tributacao-software': Parecer047,
  'lei-do-carf-14689': Parecer046,
  'acordo-leniencia-cgu': Parecer045,
};

export function generateStaticParams() {
  return pareceres.filter((p) => p.kind === 'full').map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = getParecerBySlug(params.slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.subtitle || `Parecer Nº ${p.number} · ${p.authorName} · ${p.practice}`,
  };
}

function transformParagraphs(node: ReactNode, next: () => number): ReactNode {
  return Children.map(node, (child) => {
    if (!isValidElement(child)) return child;
    if (child.type === 'p') {
      return <ParecerParagraph n={next()}>{(child.props as any).children}</ParecerParagraph>;
    }
    if ((child.props as any)?.children !== undefined) {
      return cloneElement(
        child,
        child.props as any,
        transformParagraphs((child.props as any).children, next)
      );
    }
    return child;
  });
}

function NumberedMDX({ children }: { children: ReactNode }) {
  let counter = 0;
  return <>{transformParagraphs(children, () => ++counter)}</>;
}

export default function Page({ params }: { params: { slug: string } }) {
  const parecer = getParecerBySlug(params.slug);
  if (!parecer || parecer.kind !== 'full') notFound();
  const Body = FULL_BODIES[params.slug];
  if (!Body) notFound();
  const { previous, next } = getParecerNeighbors(parecer.slug);

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldScript(articleLd(parecer)) }} />
      <ParecerHeader
        number={parecer.number}
        title={parecer.title}
        authorName={parecer.authorName}
        practice={parecer.practice}
        dateLabel={parecer.dateLabel}
      />

      <section className="container py-section container-narrow">
        <NumberedMDX>
          <Body components={{ Quote: ParecerQuote }} />
        </NumberedMDX>

        <GoldRule className="my-section w-12 mx-auto" />

        <footer className="text-center font-mono text-mono text-stone">
          <p>Vasconcelos &amp; Pires Advogados Associados</p>
          <p className="mt-2">Parecer Nº {parecer.number} · {parecer.dateLabel}</p>
        </footer>

        <PrintActions />
      </section>

      <ParecerNav previous={previous} next={next} />
    </article>
  );
}
