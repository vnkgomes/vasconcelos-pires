export interface PracticeArea {
  id: string;
  slug: string;
  number: string;
  title: string;
  summary: string;
  description: string;
  services: string[];
  partnerSlugs: string[];
  /** Used for areas without operations: descriptive "representative practice" copy */
  representativePractice?: string;
}

export const practiceAreas: PracticeArea[] = [
  {
    id: 'societario-ma',
    slug: 'societario-ma',
    number: '1.1',
    title: 'Direito Societário e M&A',
    summary:
      'Estruturação de operações de fusões e aquisições, joint ventures, reorganizações societárias, due diligence legal e negociação de acordos de acionistas.',
    description:
      'Atuação recorrente em transações de R$ 50M a R$ 2B. A prática combina senioridade institucional dos sócios em toda etapa relevante — diligência, negociação, fechamento — com discrição absoluta no trato de informações sensíveis. Atendemos companhias listadas, multinacionais e fundos de investimento em transações domésticas e cross-border.',
    services: [
      'Fusões e aquisições (M&A)',
      'Reorganizações societárias',
      'Joint ventures e parcerias estratégicas',
      'Due diligence legal',
      'Acordos de acionistas',
      'Estruturação de holdings',
      'Operações de private equity e venture capital',
    ],
    partnerSlugs: ['eduardo-vasconcelos'],
  },
  {
    id: 'contratos-empresariais',
    slug: 'contratos-empresariais',
    number: '1.2',
    title: 'Contratos Empresariais',
    summary:
      'Negociação e redação de contratos comerciais complexos — fornecimento de longo prazo, distribuição, licenciamento de tecnologia, parcerias estratégicas.',
    description:
      'Atuação consultiva em contratos de longo prazo entre companhias industriais, fornecedores estratégicos e licenciantes de tecnologia. A prática concentra-se em alocação eficiente de risco, mecanismos de adequação econômica e estruturas de resolução de impasses contratuais antes de chegar a disputa.',
    services: [
      'Contratos de fornecimento de longo prazo',
      'Distribuição e representação comercial',
      'Licenciamento de tecnologia e propriedade industrial',
      'Parcerias estratégicas e cooperação industrial',
      'Cláusulas de resolução de disputas',
      'Revisão e renegociação contratual',
    ],
    partnerSlugs: ['eduardo-vasconcelos'],
    representativePractice:
      'A prática atua com frequência em contratos plurianuais de fornecimento industrial, licenciamento de tecnologia entre matriz estrangeira e subsidiária brasileira e parcerias entre companhias listadas para projetos conjuntos.',
  },
  {
    id: 'tributario-empresarial',
    slug: 'tributario-empresarial',
    number: '1.3',
    title: 'Direito Tributário Empresarial',
    summary:
      'Consultoria preventiva, planejamento tributário, contencioso administrativo e judicial em matéria federal, estadual e municipal.',
    description:
      'Prática consolidada em contencioso tributário de alta complexidade, com atuação recorrente no CARF e tribunais superiores. A consultoria preventiva concentra-se em planejamento de operações societárias, regime de tributação de grupos econômicos e impactos tributários de reorganizações.',
    services: [
      'Consultoria tributária preventiva',
      'Planejamento tributário corporativo',
      'Contencioso administrativo (CARF)',
      'Contencioso judicial em matéria federal, estadual e municipal',
      'Recuperação de tributos',
      'Pareceres técnicos em matéria tributária',
    ],
    partnerSlugs: ['helena-pires'],
    representativePractice:
      'A prática atua de forma recorrente em recuperação de créditos tributários para companhias listadas, defesa de autuações em matéria de IRPJ/CSLL e teses de exclusão do ICMS da base de PIS/COFINS em reflexos posteriores ao Tema 69.',
  },
  {
    id: 'compliance-governanca',
    slug: 'compliance-governanca',
    number: '1.4',
    title: 'Compliance e Governança Corporativa',
    summary:
      'Implementação de programas de integridade (Lei 12.846), políticas anticorrupção, investigações internas, due diligence de terceiros e adequação à LGPD.',
    description:
      'A prática atende, com frequência, companhias com obrigações específicas decorrentes de acordos de leniência ou compromissos com órgãos reguladores. Desenho de controles, treinamento, canais de denúncia e investigações internas conduzidas com rigor probatório e sigilo absoluto.',
    services: [
      'Programas de integridade (Lei Anticorrupção 12.846)',
      'Investigações internas',
      'Adequação à LGPD em ambiente corporativo',
      'Due diligence de terceiros',
      'Treinamento de alta administração',
      'Acompanhamento de acordos de leniência',
    ],
    partnerSlugs: ['rafael-almeida-costa'],
  },
  {
    id: 'arbitragem-disputas',
    slug: 'arbitragem-disputas',
    number: '1.5',
    title: 'Arbitragem e Resolução de Disputas',
    summary:
      'Representação em arbitragens domésticas e internacionais (CAM-CCBC, CCI, LCIA), mediação empresarial e contencioso estratégico.',
    description:
      'Atuação em arbitragens com valor agregado superior a R$ 4 bilhões, em foros brasileiros e internacionais. A prática combina estratégia probatória rigorosa com defesa especializada em disputas societárias, contratuais e regulatórias entre companhias de grande porte.',
    services: [
      'Arbitragem doméstica (CAM-CCBC)',
      'Arbitragem internacional (CCI, LCIA)',
      'Mediação empresarial',
      'Contencioso estratégico em tribunais brasileiros',
      'Anulação e execução de sentença arbitral',
      'Disputas societárias entre acionistas',
    ],
    partnerSlugs: ['patricia-bernardes'],
  },
];

export function getPracticeAreaBySlug(slug: string): PracticeArea | undefined {
  return practiceAreas.find((a) => a.slug === slug);
}
