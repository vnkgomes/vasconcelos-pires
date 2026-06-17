import { ReactNode } from 'react';

export function SectionNumber({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`font-mono text-mono text-gold ${className}`}>
      {children}
    </span>
  );
}
