import { SectionLabel } from '@/components/layout/SectionLabel';
import { TypographicTile } from '@/components/page-blocks/TypographicTile';
import { InlineRoman } from '@/components/primitives/InlineRoman';
import { GoldRule } from '@/components/primitives/GoldRule';

export const metadata = {
  title: 'O Escritório',
  description: 'Vinte e sete anos de direito empresarial em São Paulo. História, filosofia e princípios do escritório.',
};

const PRINCIPIOS = [
  'Confidencialidade absoluta como pré-condição.',
  'Substância jurídica acima de retórica processual.',
  'Senioridade no atendimento. Sócios participam de toda operação relevante.',
  'Recusa a casos com conflito ético, independentemente do valor envolvido.',
];

const TILES = [
  { eyebrow: 'Sede', body: 'Avenida Brigadeiro Faria Lima, 4221 — 19º andar', meta: 'Itaim Bibi · São Paulo', roman: 1 },
  { eyebrow: 'Fundação', body: '1998 — Eduardo Vasconcelos e Helena Pires', meta: '27 anos de atuação contínua', roman: 2 },
  { eyebrow: 'Estrutura', body: '24 advogados em quadro fixo', meta: '4 sócios fundadores e gestores', roman: 3 },
  { eyebrow: 'Atuação', body: 'Direito empresarial em foros brasileiros e internacionais', meta: 'CAM-CCBC · CCI · LCIA', roman: 4 },
  { eyebrow: 'Clientela', body: 'Companhias listadas, multinacionais, family offices', meta: 'Não atendemos pessoa física', roman: 5 },
  { eyebrow: 'Idioma', body: 'Atendimento em português, inglês e espanhol', meta: 'Documentação internacional', roman: 6 },
];

export default function Page() {
  return (
    <>
      <section className="container py-section">
        <SectionLabel>O Escritório</SectionLabel>
        <h1 className="mt-8 font-display text-display-xl text-ink">
          Vinte e sete anos de<br />direito empresarial.
        </h1>
        <GoldRule className="mt-12 w-12" />
        <div className="mt-12 max-w-editorial space-y-6 font-sans text-body-l text-ink">
          <p>
            Vasconcelos &amp; Pires foi fundado em 1998 pelos advogados Eduardo Vasconcelos e Helena Pires, após mais de uma década atuando como conselheiros internos de companhias industriais brasileiras de capital aberto. A decisão de fundar um escritório boutique veio da convicção de que companhias de grande porte precisam de assessoria jurídica com a mesma senioridade que esperam de seus próprios conselhos.
          </p>
          <p>
            Desde então, a banca consolidou-se em torno de cinco frentes do direito empresarial: societário, contratual, tributário, compliance e arbitragem. Atendemos exclusivamente pessoas jurídicas — companhias listadas, multinacionais de médio porte, family offices e fundos de investimento — e cultivamos uma estrutura intencionalmente enxuta, com quatro sócios e vinte e quatro advogados em quadro fixo.
          </p>
          <p>
            A escolha pela escala enxuta é institucional. Toda operação relevante recebe atenção direta de um dos sócios, em todas as etapas. Nenhum cliente é atendido apenas por equipe júnior. A senioridade que oferecemos é a mesma que nossos clientes esperam internamente quando recorrem a seus comitês de auditoria ou conselhos de administração.
          </p>
          <p>
            Em 2025, a banca completa 27 anos de atuação ininterrupta. A clientela inclui empresas brasileiras com receita superior a R$ 10 bilhões e grupos estrangeiros estabelecidos no país. Não publicamos lista de clientes. A discrição faz parte da prática.
          </p>
        </div>
      </section>

      <section className="container py-section">
        <SectionLabel>Princípios de Atuação</SectionLabel>
        <ol className="mt-12 space-y-12 max-w-editorial">
          {PRINCIPIOS.map((p, i) => (
            <li key={i} className="flex gap-6">
              <InlineRoman n={i + 1} className="shrink-0 pt-2" />
              <div>
                <p className="font-display text-display-m text-ink">{p}</p>
                <GoldRule className="mt-6 w-8" />
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="container py-section">
        <SectionLabel>Escritório Físico</SectionLabel>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {TILES.map((t, i) => <TypographicTile key={i} {...t} />)}
        </div>
        <p className="mt-12 font-mono text-mono text-stone">
          Av. Brigadeiro Faria Lima, 4221 · 19º andar · Itaim Bibi · São Paulo / SP · CEP 04538-133
        </p>
      </section>
    </>
  );
}
