'use client';
import { DocArrow } from '@/components/primitives/DocArrow';

export function PrintActions() {
  return (
    <div className="no-print mt-12 flex items-center justify-center gap-8 font-mono text-mono uppercase tracking-[0.16em] text-stone">
      <button onClick={() => window.print()} className="hover:text-bordeaux flex items-center gap-2">
        <DocArrow /> Imprimir
      </button>
      <button onClick={() => window.print()} className="hover:text-bordeaux flex items-center gap-2">
        <DocArrow /> Salvar PDF
      </button>
    </div>
  );
}
