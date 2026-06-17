'use client';
import Link from 'next/link';
import { useState } from 'react';
import { MobileMenu } from './MobileMenu';

const NAV = [
  { href: '/escritorio', label: 'Escritório' },
  { href: '/areas-de-atuacao', label: 'Áreas' },
  { href: '/equipe', label: 'Equipe' },
  { href: '/pareceres', label: 'Pareceres' },
  { href: '/contato', label: 'Contato' },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

export function Header({ pathname }: { pathname: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <header className="sticky top-0 z-50 bg-ink/90 backdrop-blur-md text-ivory">
        <div className="container flex items-center justify-between py-5">
          <Link href="/" className="leading-none">
            <span className="block font-display text-display-m">VASCONCELOS &amp; PIRES</span>
            <span className="mt-1 flex items-center gap-2 font-mono text-mono-s uppercase text-ivory/60">
              <span className="inline-block h-px w-6 bg-bordeaux" aria-hidden="true" />
              Advogados Associados
            </span>
          </Link>
          <nav className="hidden md:block">
            <ul className="flex gap-8 font-sans text-body-m">
              {NAV.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={`relative inline-block transition-colors hover:text-bone ${active ? 'text-bone after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:bg-gold' : ''}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <button
            className="md:hidden h-6 w-8 flex items-center"
            aria-label="Menu"
            onClick={() => setMenuOpen(true)}
          >
            <span className="block h-px w-full bg-gold" />
          </button>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} pathname={pathname} />
    </>
  );
}
