import { ReactNode } from 'react';

export function ParecerParagraph({ n, children }: { n: number; children: ReactNode }) {
  return (
    <div className="grid grid-cols-12 gap-x-6 my-8">
      <div className="col-span-2 md:col-span-1 pt-2">
        <span className="font-mono text-mono text-bordeaux">{n}</span>
      </div>
      <p className="col-span-10 md:col-span-9 font-sans text-body-l text-ink leading-[1.8]">{children}</p>
    </div>
  );
}
