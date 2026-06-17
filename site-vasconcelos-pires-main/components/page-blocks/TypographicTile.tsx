import { InlineRoman } from '@/components/primitives/InlineRoman';
import { GoldRule } from '@/components/primitives/GoldRule';

export function TypographicTile({
  eyebrow,
  body,
  meta,
  roman,
}: {
  eyebrow?: string;
  body: string;
  meta?: string;
  roman?: number;
}) {
  return (
    <article className="border border-ink/10 bg-bone p-8 flex flex-col h-full">
      <div className="flex items-baseline gap-2">
        {roman !== undefined && <InlineRoman n={roman} />}
        {eyebrow && <p className="font-mono text-mono-s uppercase tracking-[0.16em] text-stone">{eyebrow}</p>}
      </div>
      <GoldRule className="mt-4 w-8" />
      <p className="mt-6 font-display text-display-m text-ink">{body}</p>
      {meta && <p className="mt-auto pt-8 font-mono text-mono text-stone">{meta}</p>}
    </article>
  );
}
