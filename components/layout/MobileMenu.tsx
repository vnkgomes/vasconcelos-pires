'use client';
import Link from 'next/link';
import { InlineRoman } from '@/components/primitives/InlineRoman';

const NAV = [
  { href: '/escritorio', label: 'Escritório' },
  { href: '/areas-de-atuacao', label: 'Áreas' },
  { href: '/equipe', label: 'Equipe' },
  { href: '/pareceres', label: 'Pareceres' },
  { href: '/contato', label: 'Contato' },
];

export function MobileMenu({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-ink/95 backdrop-blur-md text-ivory md:hidden" role="dialog" aria-modal="true" aria-label="Menu de navegação">
      <div className="flex items-center justify-end p-6">
        <button
          aria-label="Fechar menu"
          onClick={onClose}
          className="text-gold font-mono text-body-l"
        >
          ×
        </button>
      </div>
      <nav className="container mt-12">
        <ul className="space-y-6">
          {NAV.map((item, i) => (
            <li key={item.href} className="flex items-baseline gap-4">
              <InlineRoman n={i + 1} />
              <Link
                href={item.href}
                onClick={onClose}
                aria-current={pathname.startsWith(item.href) ? 'page' : undefined}
                className="font-display text-display-m hover:text-gold transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
