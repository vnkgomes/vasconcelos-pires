export interface Partner {
  id: string;
  slug: string;
  name: string;
  role: string;
  practice: string;
  bioShort: string;
  bioLong: string;
  education: string[];
  photoSrc: string;
}

export const partners: Partner[] = [
  {
    id: 'eduardo-vasconcelos',
    slug: 'eduardo-vasconcelos',
    name: 'Eduardo Vasconcelos',
    role: 'Sócio-Fundador',
    practice: 'M&A · Direito Societário',
    bioShort: 'Mestre em Direito Comercial (USP), LLM em Corporate Law (Columbia Law School). 27 anos de carreira.',
    bioLong:
      'Mestre em Direito Comercial pela Universidade de São Paulo (USP). LLM em Corporate Law pela Columbia Law School. Foi general counsel de grupo industrial brasileiro de capital aberto entre 1992 e 1998, antes de fundar o escritório. Atuação destacada em operações de M&A de capital aberto desde 2003, com transações recorrentes na faixa de R$ 50M a R$ 2B.',
    education: ['Mestre em Direito Comercial — USP', 'LLM Corporate Law — Columbia Law School'],
    photoSrc: '/photos/partners/eduardo-vasconcelos.webp',
  },
  {
    id: 'helena-pires',
    slug: 'helena-pires',
    name: 'Helena Pires',
    role: 'Sócia-Fundadora',
    practice: 'Direito Tributário',
    bioShort: 'Doutora em Direito Tributário (USP), ex-Conselheira do CARF (2014–2018). Reconhecida por Chambers Brazil em Tax desde 2016.',
    bioLong:
      'Doutora em Direito Tributário pela Universidade de São Paulo (USP). Conselheira do Conselho Administrativo de Recursos Fiscais (CARF) entre 2014 e 2018. Reconhecida pelo Chambers Brazil em Tax desde 2016. Coordena a prática de Direito Tributário do escritório, com atuação em contencioso administrativo e judicial em matéria federal, estadual e municipal.',
    education: ['Doutora em Direito Tributário — USP', 'Conselheira CARF (2014–2018)'],
    photoSrc: '/photos/partners/helena-pires.webp',
  },
  {
    id: 'rafael-almeida-costa',
    slug: 'rafael-almeida-costa',
    name: 'Rafael Almeida Costa',
    role: 'Sócio',
    practice: 'Compliance · Governança',
    bioShort: 'Mestre em Direito Penal Econômico (PUC-SP), ex-Procurador da República (2008–2015). Lidera investigações internas de companhias listadas.',
    bioLong:
      'Mestre em Direito Penal Econômico pela PUC-SP. Procurador da República entre 2008 e 2015, antes de integrar o escritório. Lidera investigações internas de companhias listadas, programas de integridade (Lei 12.846), políticas anticorrupção e adequação à LGPD em ambientes corporativos complexos.',
    education: ['Mestre em Direito Penal Econômico — PUC-SP', 'ex-Procurador da República (2008–2015)'],
    photoSrc: '/photos/partners/rafael-almeida-costa.webp',
  },
  {
    id: 'patricia-bernardes',
    slug: 'patricia-bernardes',
    name: 'Patrícia Bernardes',
    role: 'Sócia',
    practice: 'Arbitragem · Disputas',
    bioShort: 'Mestre em Arbitragem Internacional (Queen Mary, Londres), Árbitra listada no CAM-CCBC. Atuou em arbitragens com valor agregado superior a R$ 4B.',
    bioLong:
      'Mestre em Arbitragem Internacional pela Queen Mary University of London. Árbitra listada no Centro de Arbitragem e Mediação da Câmara de Comércio Brasil-Canadá (CAM-CCBC). Atuou como advogada e árbitra em disputas com valor agregado superior a R$ 4 bilhões, em foros como CAM-CCBC, CCI e LCIA.',
    education: ['Mestre em Arbitragem Internacional — Queen Mary, Londres', 'Árbitra listada no CAM-CCBC'],
    photoSrc: '/photos/partners/patricia-bernardes.webp',
  },
];

export function getPartnerBySlug(slug: string): Partner | undefined {
  return partners.find((p) => p.slug === slug);
}
