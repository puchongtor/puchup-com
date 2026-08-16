export function LogoMark({ className = "w-8 h-8", light = false }: { className?: string; light?: boolean }) {
  const hole = light ? "#0D182C" : "#FCFAF5";
  const gid = light ? "rgl" : "rgd";
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <linearGradient id={gid} x1="20" y1="180" x2="170" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7C3AED" />
          <stop offset="0.45" stopColor="#F0553C" />
          <stop offset="1" stopColor="#FBBF24" />
        </linearGradient>
      </defs>
      <g>
        <circle cx="112" cy="72" r="42" fill={`url(#${gid})`} />
        <circle cx="112" cy="72" r="23" fill={hole} />
        <path
          d="M99 70 L125 70 L125 158 C 125 164 120 169 113 169 L111 169 C 104 169 99 164 99 158 Z"
          fill={`url(#${gid})`}
        />
        <path d="M112 56 L124 70 L116 70 L116 88 L108 88 L108 70 L100 70 Z" fill={`url(#${gid})`} />
        <path d="M99 140 C 78 144 62 156 52 174 C 72 174 88 166 99 154 Z" fill="#7C3AED" />
        <path d="M104 156 C 90 166 82 180 79 196 C 96 190 105 178 111 164 Z" fill="#F0553C" />
      </g>
    </svg>
  );
}

export function BrandWordmark({ light = false }: { light?: boolean }) {
  return (
    <span className={`text-lg font-bold ${light ? "text-base" : "text-ink"}`}>
      Puch<span className="grad-text">Up</span>
    </span>
  );
}
