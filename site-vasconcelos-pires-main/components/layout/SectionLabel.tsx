import { ReactNode } from 'react';

export function SectionLabel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-mono text-mono-s uppercase tracking-[0.16em] text-stone ${className}`}>
      <span aria-hidden="true">── </span>
      <span>{typeof children === 'string' ? children.toUpperCase() : children}</span>
    </p>
  );
}
