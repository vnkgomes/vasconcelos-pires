export function PlaceholderPhoto({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const label = `RETRATO · ${name.toUpperCase()}`;
  return (
    <svg
      viewBox="0 0 300 400"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Retrato de ${name}`}
    >
      <rect x="0" y="0" width="300" height="400" fill="#0C1220" />
      <rect
        x="0.5"
        y="0.5"
        width="299"
        height="399"
        fill="none"
        stroke="#B89968"
        strokeOpacity="0.22"
      />
      <text
        x="150"
        y="206"
        textAnchor="middle"
        fill="#B89968"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, monospace"
        fontSize="10"
        letterSpacing="2"
      >
        {label}
      </text>
    </svg>
  );
}
