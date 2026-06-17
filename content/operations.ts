export interface Operation {
  id: string;
  areaSlug: string;
  title: string;
  summary: string;
  sector: string;
  meta: string;
}

export const operations: Operation[] = [
  {
    id: 'op-01',
    areaSlug: 'societario-ma',
    title: 'Reorganização societária multinacional pré-IPO',
    summary:
      'Estruturação da reorganização de holding brasileira de grupo multinacional europeu de bens de consumo, envolvendo seis subsidiárias e otimização tributária pré-IPO.',
    sector: 'Bens de consumo',
    meta: 'Valor da operação · confidencial',
  },
  {
    id: 'op-02',
    areaSlug: 'arbitragem-disputas',
    title: 'Defesa em arbitragem CAM-CCBC contra parceiro estrangeiro',
    summary:
      'Representação de companhia de infraestrutura em arbitragem contra parceiro estrangeiro, com pedido de R$ 380M. Decisão favorável ao cliente em 2023.',
    sector: 'Infraestrutura',
    meta: 'Pedido · R$ 380M · Decisão favorável (2023)',
  },
  {
    id: 'op-03',
    areaSlug: 'compliance-governanca',
    title: 'Programa de integridade pós-acordo de leniência',
    summary:
      'Desenho e implementação de programa de compliance de companhia listada, após acordo de leniência com a CGU. Acompanhamento contínuo de 36 meses.',
    sector: 'Construção',
    meta: 'Programa de 36 meses · CGU',
  },
];

export function getOperationsForArea(areaSlug: string): Operation[] {
  return operations.filter((op) => op.areaSlug === areaSlug);
}
