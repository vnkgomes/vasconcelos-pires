export type ParecerKind = 'full' | 'stub';

export interface ParecerEntry {
  slug: string;
  number: string;
  year: number;
  date: string;
  dateLabel: string;
  title: string;
  subtitle: string;
  authorSlug: string;
  authorName: string;
  practice: string;
  kind: ParecerKind;
}

export const pareceres: ParecerEntry[] = [
  {
    slug: 'stf-tributacao-software',
    number: '047/2025',
    year: 2025,
    date: '2025-03-15',
    dateLabel: '15 mar 2025',
    title: 'STF e a tributação de software: o que muda após o RE 688.223',
    subtitle: 'Análise da tese firmada pelo Supremo Tribunal Federal e suas consequências práticas.',
    authorSlug: 'helena-pires',
    authorName: 'Helena Pires',
    practice: 'Direito Tributário',
    kind: 'full',
  },
  {
    slug: 'lei-do-carf-14689',
    number: '046/2025',
    year: 2025,
    date: '2025-02-28',
    dateLabel: '28 fev 2025',
    title: 'Lei do Carf: o efeito prático da Lei 14.689 no contencioso tributário',
    subtitle: 'Como a retomada do voto de qualidade pró-fisco redesenha a estratégia em CARF.',
    authorSlug: 'helena-pires',
    authorName: 'Helena Pires',
    practice: 'Direito Tributário',
    kind: 'full',
  },
  {
    slug: 'acordo-leniencia-cgu',
    number: '045/2024',
    year: 2024,
    date: '2024-12-12',
    dateLabel: '12 dez 2024',
    title: 'Acordo de leniência: limites do poder discricionário da CGU',
    subtitle: 'Os contornos da margem de avaliação da Controladoria-Geral da União após decisões recentes.',
    authorSlug: 'rafael-almeida-costa',
    authorName: 'Rafael Almeida Costa',
    practice: 'Compliance',
    kind: 'full',
  },
  {
    slug: 'arbitragem-acionistas-empresas-familiares',
    number: '044/2024',
    year: 2024,
    date: '2024-10-22',
    dateLabel: '22 out 2024',
    title: 'Arbitragem entre acionistas em empresas familiares: cláusula compromissória e legitimidade',
    subtitle: '',
    authorSlug: 'patricia-bernardes',
    authorName: 'Patrícia Bernardes',
    practice: 'Arbitragem',
    kind: 'stub',
  },
  {
    slug: 'reforma-tributaria-iva-dual',
    number: '043/2024',
    year: 2024,
    date: '2024-08-30',
    dateLabel: '30 ago 2024',
    title: 'Reforma tributária e IVA dual: o que companhias industriais precisam decidir até 2026',
    subtitle: '',
    authorSlug: 'helena-pires',
    authorName: 'Helena Pires',
    practice: 'Direito Tributário',
    kind: 'stub',
  },
  {
    slug: 'investigacoes-internas-prerrogativas',
    number: '042/2024',
    year: 2024,
    date: '2024-06-18',
    dateLabel: '18 jun 2024',
    title: 'Investigações internas e prerrogativas profissionais: a posição do STF',
    subtitle: '',
    authorSlug: 'rafael-almeida-costa',
    authorName: 'Rafael Almeida Costa',
    practice: 'Compliance',
    kind: 'stub',
  },
  {
    slug: 'm-a-tech-clausulas-earnout',
    number: '041/2024',
    year: 2024,
    date: '2024-04-09',
    dateLabel: '09 abr 2024',
    title: 'M&A em tecnologia: cláusulas de earn-out e disputas sobre realização de metas',
    subtitle: '',
    authorSlug: 'eduardo-vasconcelos',
    authorName: 'Eduardo Vasconcelos',
    practice: 'M&A',
    kind: 'stub',
  },
  {
    slug: 'lgpd-due-diligence-m-a',
    number: '040/2024',
    year: 2024,
    date: '2024-02-14',
    dateLabel: '14 fev 2024',
    title: 'LGPD em due diligence de M&A: o passivo invisível na avaliação de targets',
    subtitle: '',
    authorSlug: 'rafael-almeida-costa',
    authorName: 'Rafael Almeida Costa',
    practice: 'Compliance',
    kind: 'stub',
  },
];

export function getParecerBySlug(slug: string): ParecerEntry | undefined {
  return pareceres.find((p) => p.slug === slug);
}

export function getParecerNeighbors(slug: string): { previous?: ParecerEntry; next?: ParecerEntry } {
  const idx = pareceres.findIndex((p) => p.slug === slug);
  if (idx === -1) return {};
  return {
    next: idx > 0 ? pareceres[idx - 1] : undefined,
    previous: idx < pareceres.length - 1 ? pareceres[idx + 1] : undefined,
  };
}

export function getFullPareceres(): ParecerEntry[] {
  return pareceres.filter((p) => p.kind === 'full');
}

export function getYearsWithPareceres(): number[] {
  return Array.from(new Set(pareceres.map((p) => p.year))).sort((a, b) => b - a);
}
