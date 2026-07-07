/**
 * A colorful swoosh of inks that runs edge-to-edge across the middle of
 * the laptop screen. The headline clips behind it (the swoosh sits in
 * front). Built with feTurbulence + feDisplacementMap so the band has
 * organic, painterly ink edges rather than a hard bar — inline SVG, so
 * it's crisp at any density and self-contained.
 */
export default function InkSwoosh({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1600 420"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="inkFilter" x="-12%" y="-70%" width="124%" height="240%">
          <feTurbulence type="fractalNoise" baseFrequency="0.009 0.016" numOctaves="2" seed="14" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="78" xChannelSelector="R" yChannelSelector="G" result="disp" />
          <feGaussianBlur in="disp" stdDeviation="6" />
        </filter>
        <linearGradient id="inkGrad" x1="0" y1="0.2" x2="1" y2="0.8">
          <stop offset="0" stopColor="#E8B06A" />
          <stop offset="0.2" stopColor="#F0A8C8" />
          <stop offset="0.44" stopColor="#8B7CF7" />
          <stop offset="0.66" stopColor="#3E6FF0" />
          <stop offset="0.85" stopColor="#29B8E8" />
          <stop offset="1" stopColor="#35C8E8" />
        </linearGradient>
      </defs>
      <g filter="url(#inkFilter)" fill="url(#inkGrad)">
        {/* main band */}
        <rect x="-80" y="150" width="1760" height="120" rx="60" />
        {/* painterly thickness variation */}
        <ellipse cx="330" cy="200" rx="360" ry="95" />
        <ellipse cx="820" cy="225" rx="420" ry="80" />
        <ellipse cx="1290" cy="200" rx="360" ry="98" />
      </g>
      {/* soft highlight sweep for a wet-ink sheen */}
      <g filter="url(#inkFilter)" opacity="0.35">
        <rect x="-80" y="168" width="1760" height="26" rx="13" fill="#ffffff" />
      </g>
    </svg>
  );
}
