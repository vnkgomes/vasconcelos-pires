import { SectionLabel } from '@/components/layout/SectionLabel';
import { ContactForm } from '@/components/page-blocks/ContactForm';
import { GoldRule } from '@/components/primitives/GoldRule';

export const metadata = {
  title: 'Contato',
  description: 'Atendimento exclusivamente por agendamento prévio. Av. Brigadeiro Faria Lima, 4221, Itaim Bibi, São Paulo.',
};

const INFO = [
  { label: 'Endereço', body: ['Av. Brigadeiro Faria Lima, 4221', '19º andar · Itaim Bibi', 'São Paulo / SP — CEP 04538-133'] },
  { label: 'Telefone', body: ['+55 11 3147-8200'] },
  { label: 'Email', body: ['contato@vasconcellospires.com.br'] },
  { label: 'Horário', body: ['Segunda a sexta', '9h às 18h'] },
];

export default function Page() {
  return (
    <>
      <section className="container py-section">
        <SectionLabel>Contato</SectionLabel>
        <h1 className="mt-8 font-display text-display-xl text-ink">
          Atendimento exclusivo<br />por agendamento.
        </h1>
      </section>
      <section className="container pb-section">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <aside className="md:col-span-5 space-y-12">
            {INFO.map((b) => (
              <div key={b.label}>
                <p className="font-mono text-mono-s uppercase tracking-[0.16em] text-stone">{b.label}</p>
                <GoldRule className="mt-4 w-8" />
                <div className="mt-4 font-sans text-body-m text-ink space-y-1">
                  {b.body.map((line, i) => <p key={i}>{line}</p>)}
                </div>
              </div>
            ))}
          </aside>
          <div className="md:col-span-7 md:col-start-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
