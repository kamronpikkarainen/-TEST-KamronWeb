/**
 * The laptop that rises from the bottom of the hero — only its top shows
 * (the browser bar with the live URL), the rest cuts off below the fold,
 * occluding the lower part of the headline like the dunes in the
 * reference. Built as inline SVG so it stays razor-sharp at any pixel
 * density (resolution-independent — crisper than a 4K raster) and fully
 * self-contained.
 *
 * The address bar reads www.kamronweb.com. [PLACEHOLDER — point the real
 * domain here once it's live.]
 */
export default function Laptop({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMax meet"
      role="img"
      aria-label="A laptop showing www.kamronweb.com"
    >
      <defs>
        <linearGradient id="lidMetal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EEF1F5" />
          <stop offset="0.5" stopColor="#D5DAE1" />
          <stop offset="1" stopColor="#BFC5CE" />
        </linearGradient>
        <linearGradient id="pageBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EFF1F4" />
          <stop offset="1" stopColor="#DFE1E5" />
        </linearGradient>
        <linearGradient id="urlAccent" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2E5FE8" />
          <stop offset="0.55" stopColor="#29B8E8" />
          <stop offset="1" stopColor="#7C6BF0" />
        </linearGradient>
        <clipPath id="screenClip">
          <rect x="44" y="70" width="1512" height="886" rx="12" />
        </clipPath>
      </defs>

      {/* Aluminium lid */}
      <rect x="8" y="12" width="1584" height="976" rx="30" fill="url(#lidMetal)" />
      <rect
        x="8"
        y="12"
        width="1584"
        height="976"
        rx="30"
        fill="none"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="2"
      />
      {/* Dark bezel */}
      <rect x="30" y="34" width="1540" height="932" rx="20" fill="#0C0F13" />
      {/* Webcam */}
      <circle cx="800" cy="52" r="5" fill="#2A2F36" />
      <circle cx="800" cy="52" r="2" fill="#3E6FF0" opacity="0.5" />

      {/* Screen content */}
      <g clipPath="url(#screenClip)">
        {/* Browser toolbar */}
        <rect x="44" y="70" width="1512" height="120" fill="#F4F5F7" />
        {/* traffic-light dots */}
        <circle cx="96" cy="132" r="12" fill="#FF5F57" />
        <circle cx="140" cy="132" r="12" fill="#FEBC2E" />
        <circle cx="184" cy="132" r="12" fill="#28C840" />
        {/* active tab */}
        <rect x="250" y="96" width="330" height="70" rx="14" fill="#FFFFFF" />
        <circle cx="286" cy="131" r="9" fill="#2E5FE8" />
        <text
          x="312"
          y="140"
          fontFamily="Inter, system-ui, sans-serif"
          fontSize="28"
          fontWeight="700"
          fill="#0F1520"
        >
          Kamron Web
        </text>
        {/* address bar */}
        <rect x="620" y="102" width="760" height="60" rx="30" fill="#FFFFFF" stroke="#E2E5EA" strokeWidth="2" />
        {/* lock icon */}
        <g transform="translate(654, 118)">
          <rect x="0" y="12" width="26" height="18" rx="4" fill="#4C5866" />
          <path d="M4 12 V7 a9 9 0 0 1 18 0 V12" fill="none" stroke="#4C5866" strokeWidth="4" />
        </g>
        <text
          x="700"
          y="142"
          fontFamily="Inter, system-ui, sans-serif"
          fontSize="30"
          fontWeight="600"
          fill="#3A4250"
        >
          www.kamronweb.com
        </text>

        {/* Page — a hint of the real site, mostly below the fold */}
        <rect x="44" y="190" width="1512" height="766" fill="url(#pageBg)" />
        {/* nav pill */}
        <rect x="560" y="236" width="480" height="60" rx="30" fill="#FFFFFF" opacity="0.85" />
        <text x="596" y="274" fontFamily="Inter, system-ui, sans-serif" fontSize="26" fontWeight="800" fill="#0F1520">
          Kamron Web
        </text>
        <rect x="912" y="248" width="96" height="36" rx="18" fill="url(#urlAccent)" />
        {/* mini headline */}
        <text
          x="800"
          y="430"
          textAnchor="middle"
          fontFamily="Inter, system-ui, sans-serif"
          fontSize="76"
          fontWeight="800"
          letterSpacing="-2"
          fill="#0F1520"
        >
          The site that wins the job
        </text>
        <text
          x="800"
          y="520"
          textAnchor="middle"
          fontFamily="Inter, system-ui, sans-serif"
          fontSize="76"
          fontWeight="800"
          letterSpacing="-2"
          fill="url(#urlAccent)"
        >
          before you pick up the phone.
        </text>
      </g>
    </svg>
  );
}
