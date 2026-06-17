export function DocArrow({ className = '' }: { className?: string }) {
  return <span className={`font-mono text-gold ${className}`} aria-hidden="true">→</span>;
}
