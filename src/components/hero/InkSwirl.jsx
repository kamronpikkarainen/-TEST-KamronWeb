/**
 * The hero's brand moment: a big, thick, curvy swirl of colored ink with
 * the "KAMRON WEB" wordmark intertwined in it. Built from several long
 * brush-stroke paths (thick strokes with round caps, not filled shapes)
 * so they read as flowing ink ribbons rather than blobs, each roughened
 * by a turbulence/displacement filter for organic, painterly edges.
 *
 * Exported as two layers so the wordmark can sandwich between them:
 * InkSwirlBack (the main colorful mass, behind the text) and
 * InkSwirlFront (one accent ribbon that crosses back over the text),
 * which is what actually sells "intertwined" rather than "text on top
 * of a background."
 *
 * Realism cues: multiply-blended secondary strokes so overlaps deepen
 * like real ink layering, a soft ground shadow for lift, and a thin
 * bright sheen path tracing the main stroke's upper edge for a wet-ink
 * highlight.
 */
function Filters() {
  return (
    <defs>
      <filter id="ink1" x="-20%" y="-100%" width="140%" height="300%">
        <feTurbulence type="fractalNoise" baseFrequency="0.008 0.014" numOctaves="3" seed="7" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="70" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="ink2" x="-20%" y="-100%" width="140%" height="300%">
        <feTurbulence type="fractalNoise" baseFrequency="0.007 0.012" numOctaves="3" seed="23" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="85" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="ink3" x="-20%" y="-100%" width="140%" height="300%">
        <feTurbulence type="fractalNoise" baseFrequency="0.009 0.015" numOctaves="2" seed="41" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="60" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="inkFront" x="-20%" y="-100%" width="140%" height="300%">
        <feTurbulence type="fractalNoise" baseFrequency="0.01 0.017" numOctaves="3" seed="59" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="55" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <linearGradient id="gradA" x1="0" y1="0" x2="1" y2="0.3">
        <stop offset="0" stopColor="#E8B06A" />
        <stop offset="0.3" stopColor="#F2879E" />
        <stop offset="0.62" stopColor="#F0A8C8" />
        <stop offset="1" stopColor="#8B7CF7" />
      </linearGradient>
      <linearGradient id="gradB" x1="0" y1="0.2" x2="1" y2="0.7">
        <stop offset="0" stopColor="#F0A8C8" />
        <stop offset="0.3" stopColor="#8B7CF7" />
        <stop offset="0.65" stopColor="#5B6EF5" />
        <stop offset="1" stopColor="#3E6FF0" />
      </linearGradient>
      <linearGradient id="gradC" x1="0" y1="0.3" x2="1" y2="0">
        <stop offset="0" stopColor="#5B6EF5" />
        <stop offset="0.35" stopColor="#3E6FF0" />
        <stop offset="0.7" stopColor="#29B8E8" />
        <stop offset="1" stopColor="#2FD9C4" />
      </linearGradient>
      <linearGradient id="gradFront" x1="0" y1="0" x2="1" y2="0.4">
        <stop offset="0" stopColor="#8B7CF7" />
        <stop offset="0.5" stopColor="#3E6FF0" />
        <stop offset="1" stopColor="#35C8E8" />
      </linearGradient>
    </defs>
  );
}

export function InkSwirlBack({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 1600 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <Filters />
      {/* soft ground shadow for lift */}
      <ellipse cx="800" cy="380" rx="720" ry="70" fill="#3A4260" opacity="0.14" filter="url(#ink3)" />
      {/* main sweep */}
      <path
        d="M -100 260 C 200 80, 380 420, 650 300 C 900 190, 1050 430, 1300 280 C 1450 190, 1550 260, 1700 300"
        fill="none"
        stroke="url(#gradA)"
        strokeWidth="150"
        strokeLinecap="round"
        filter="url(#ink1)"
      />
      {/* secondary sweep, multiply-blended so overlaps deepen like layered ink */}
      <path
        d="M -100 420 C 250 520, 450 200, 700 380 C 950 540, 1150 220, 1400 380 C 1500 430, 1600 400, 1700 420"
        fill="none"
        stroke="url(#gradB)"
        strokeWidth="128"
        strokeLinecap="round"
        opacity="0.88"
        filter="url(#ink2)"
        style={{ mixBlendMode: 'multiply' }}
      />
      {/* tertiary sweep, cool end */}
      <path
        d="M -100 340 C 300 250, 500 480, 800 340 C 1050 220, 1250 460, 1500 340 C 1580 300, 1650 320, 1700 340"
        fill="none"
        stroke="url(#gradC)"
        strokeWidth="108"
        strokeLinecap="round"
        opacity="0.85"
        filter="url(#ink3)"
        style={{ mixBlendMode: 'multiply' }}
      />
      {/* wet-ink sheen along the main stroke's upper edge */}
      <path
        d="M -100 230 C 200 55, 380 390, 650 270 C 900 165, 1050 400, 1300 250 C 1450 165, 1550 235, 1700 270"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="16"
        strokeLinecap="round"
        opacity="0.4"
        filter="url(#ink1)"
        style={{ mixBlendMode: 'screen' }}
      />
    </svg>
  );
}

export function InkSwirlFront({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 1600 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <Filters />
      {/* one accent ribbon that crosses back in front of the wordmark —
          this is what sells "intertwined" rather than "text on a background" */}
      <path
        d="M -50 460 C 300 380, 550 180, 850 260 C 1100 330, 1300 160, 1650 240"
        fill="none"
        stroke="url(#gradFront)"
        strokeWidth="92"
        strokeLinecap="round"
        opacity="0.94"
        filter="url(#inkFront)"
      />
    </svg>
  );
}
