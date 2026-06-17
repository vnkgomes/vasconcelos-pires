import Link from 'next/link';

const COLS = [
  { title: 'Escritório', links: [{ href: '/escritorio', label: 'Sobre' }, { href: '/equipe', label: 'Equipe' }] },
  { title: 'Atuação', links: [{ href: '/areas-de-atuacao', label: 'Áreas' }, { href: '/pareceres', label: 'Pareceres' }] },
  { title: 'Contato', links: [{ href: '/contato', label: 'Agendamento' }] },
];

export function Footer() {
  return (
    <footer className="bg-ink text-ivory">
      <div className="container py-section">
        <div className="grid grid-cols-1 md:grid-cols-14 gap-x-6 gap-y-12">
          <div className="md:col-span-5">
            <p className="font-display text-display-m leading-none">VASCONCELOS &amp; PIRES</p>
            <p className="mt-2 flex items-center gap-2 font-mono text-mono-s uppercase text-ivory/60">
              <span className="inline-block h-px w-6 bg-bordeaux" />
              Advogados Associados
            </p>
            <address className="mt-8 not-italic font-sans text-body-m text-ivory/80">
              Av. Brigadeiro Faria Lima, 4221<br />
              19º andar · Itaim Bibi<br />
              São Paulo / SP — CEP 04538-133
            </address>
            <p className="mt-6 font-mono text-mono text-ivory/80">+55 11 3147-8200</p>
            <p className="font-mono text-mono text-ivory/80">contato@vasconcellospires.com.br</p>
          </div>
          {COLS.map((col) => (
            <div key={col.title} className="md:col-span-3">
              <p className="font-mono text-mono-s uppercase tracking-[0.16em] text-ivory/50">{col.title}</p>
              <ul className="mt-6 space-y-3 font-sans text-body-m">
                {col.links.map((l) => (
                  <li key={l.href}><Link className="hover:text-bone" href={l.href}>{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <hr className="mt-section border-0 border-t border-ivory/20" />
        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-between font-mono text-mono-s uppercase text-ivory/50">
          <span>© 2026 Vasconcelos &amp; Pires Advogados Associados · OAB/SP 12.345</span>
          <span>Política de Privacidade · LGPD</span>
        </div>
      </div>
    </footer>
  );
}
