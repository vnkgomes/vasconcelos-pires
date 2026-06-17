import { ReactNode } from 'react';

export function ParecerQuote({ children, source }: { children: ReactNode; source?: string }) {
  return (
    <div className="grid grid-cols-12 gap-x-6 my-12">
      <div className="col-span-1" aria-hidden="true" />
      <blockquote className="col-span-11 md:col-span-9 border-l-2 border-bordeaux pl-6 font-display italic text-body-l text-ink">
        {children}
        {source && <footer className="mt-3 font-mono not-italic text-mono text-stone">— {source}</footer>}
      </blockquote>
    </div>
  );
}
