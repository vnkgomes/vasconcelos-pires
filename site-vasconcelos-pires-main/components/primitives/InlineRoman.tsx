const ROMAN = ['', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];

export function InlineRoman({ n, className = '' }: { n: number; className?: string }) {
  const r = ROMAN[n] ?? String(n);
  return <span className={`font-mono text-mono text-gold ${className}`}>{r}.</span>;
}
