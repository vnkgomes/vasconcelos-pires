type Variant = 'default' | 'gold' | 'double';

const VARIANTS: Record<Variant, string> = {
  default: 'border-t border-ivory/30',
  gold: 'border-t border-gold',
  double: 'border-y border-gold py-1',
};

export function Hairline({ variant = 'default', className = '' }: { variant?: Variant; className?: string }) {
  if (variant === 'double') {
    return (
      <div className={`${VARIANTS.double} ${className}`} role="separator">
        <hr className="border-0 border-t border-gold" />
      </div>
    );
  }
  return <hr className={`border-0 ${VARIANTS[variant]} ${className}`} />;
}
