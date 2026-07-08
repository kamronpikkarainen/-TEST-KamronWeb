/**
 * A compact, glossy ink splash — a main blob with a few droplets
 * radiating off it, shaded to read as a rendered 3D object rather than
 * a flat shape: a bright specular hotspot where the key light (upper
 * left, matching the rest of the site's lighting convention) catches
 * the surface, a soft mid-tone body, and a darker ambient-occlusion
 * rim where the surface turns away from the light. A blurred cast
 * shadow grounds it. Grey-blue-cream palette throughout.
 *
 * This sits entirely BEHIND the "Kamron Web" wordmark now (the
 * wordmark is a separate, higher DOM layer in Hero.jsx) — no ribbon
 * crosses back in front of the text anymore.
 */
function Defs() {
  return (
    <defs>
      <radialGradient id="blobShade" cx="0.32" cy="0.26" r="0.9">
        <stop offset="0" stopColor="#F6F8F9" />
        <stop offset="0.22" stopColor="#DDE2E6" />
        <stop offset="0.48" stopColor="#AEB7C2" />
        <stop offset="0.75" stopColor="#69788F" />
        <stop offset="1" stopColor="#333E4D" />
      </radialGradient>
      <radialGradient id="dropShade" cx="0.3" cy="0.28" r="0.95">
        <stop offset="0" stopColor="#F2F5F7" />
        <stop offset="0.3" stopColor="#C7CFD6" />
        <stop offset="0.65" stopColor="#8592A3" />
        <stop offset="1" stopColor="#414D5E" />
      </radialGradient>
      <radialGradient id="specular" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
        <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="castShadow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#1B2230" stopOpacity="0.32" />
        <stop offset="1" stopColor="#1B2230" stopOpacity="0" />
      </radialGradient>
      <filter id="blurS" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="4" />
      </filter>
      <filter id="blurM" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="9" />
      </filter>
    </defs>
  );
}

const DROPLETS = [
  { cx: 118, cy: 178, r: 20 },
  { cx: 470, cy: 60, r: 16 },
  { cx: 500, cy: 150, r: 11 },
  { cx: 90, cy: 90, r: 12 },
  { cx: 430, cy: 210, r: 9 },
];

export default function InkSplash({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 600 260" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <Defs />

      {/* Cast shadow, grounding the splash */}
      <ellipse cx="300" cy="205" rx="210" ry="34" fill="url(#castShadow)" filter="url(#blurM)" />

      {/* Ambient occlusion where the droplets/blob crowd together */}
      <ellipse cx="255" cy="150" rx="90" ry="46" fill="#232B38" opacity="0.28" filter="url(#blurM)" style={{ mixBlendMode: 'multiply' }} />

      {/* Main blob — an organic splash silhouette */}
      <path
        d="M300 40 C360 20 430 35 460 90 C490 145 470 200 410 225
           C350 250 280 245 240 210 C205 180 178 192 152 220
           C130 245 96 235 100 205 C104 176 138 166 150 140
           C128 120 110 96 130 70 C150 46 190 55 210 76
           C226 46 266 26 300 40 Z"
        fill="url(#blobShade)"
      />
      {/* Specular hotspot, upper-left, matching the site's key-light direction */}
      <ellipse cx="230" cy="95" rx="70" ry="46" fill="url(#specular)" opacity="0.75" filter="url(#blurS)" />
      {/* Soft rim light lower-right for a touch of bounce light */}
      <path
        d="M410 225 C350 250 280 245 240 210"
        fill="none"
        stroke="#DCE6EE"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.35"
        filter="url(#blurS)"
      />

      {/* Droplets, each shaded the same way for consistency */}
      {DROPLETS.map((d) => (
        <g key={`${d.cx}-${d.cy}`}>
          <circle cx={d.cx} cy={d.cy} r={d.r} fill="url(#dropShade)" />
          <ellipse
            cx={d.cx - d.r * 0.32}
            cy={d.cy - d.r * 0.34}
            rx={d.r * 0.42}
            ry={d.r * 0.3}
            fill="url(#specular)"
            opacity="0.8"
          />
        </g>
      ))}
    </svg>
  );
}
