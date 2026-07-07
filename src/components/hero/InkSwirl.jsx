/**
 * The hero's brand moment: smooth, silky folds of grey-blue ink — like
 * satin or folded paper catching studio light — with the "KAMRON WEB"
 * wordmark woven through them. Unlike a rough brush-stroke ink, these
 * are clean filled wave shapes (no turbulence texture) shaded with
 * gradients that simulate light rolling across a curved surface: a
 * pale highlight near each fold's crest, deepening to slate and
 * blue-grey in the troughs. Each fold's fill extends past the viewBox
 * on every side, so there is no visible edge within the artwork itself
 * — combined with a full-viewport-width container in Hero.jsx, the
 * ink bleeds past the screen rather than sitting in a bounded box.
 *
 * Exported as two layers so the wordmark can sandwich between them:
 * InkSwirlBack (the folds, behind the text) and InkSwirlFront (one
 * fold rendered again in front, which is what sells "intertwined"
 * rather than "text on top of a background").
 */
function Defs() {
  return (
    <defs>
      <linearGradient id="foldA" x1="0" y1="0" x2="0.85" y2="0.7">
        <stop offset="0" stopColor="#EDE4CE" />
        <stop offset="0.38" stopColor="#CBC0A6" />
        <stop offset="0.7" stopColor="#98A2AC" />
        <stop offset="1" stopColor="#647287" />
      </linearGradient>
      <linearGradient id="foldB" x1="0" y1="0.15" x2="0.9" y2="0.85">
        <stop offset="0" stopColor="#C3C7CC" />
        <stop offset="0.35" stopColor="#8B96A5" />
        <stop offset="0.7" stopColor="#586A85" />
        <stop offset="1" stopColor="#374B63" />
      </linearGradient>
      <linearGradient id="foldC" x1="0" y1="0" x2="0.8" y2="0.6">
        <stop offset="0" stopColor="#8189A0" />
        <stop offset="0.4" stopColor="#5B6B85" />
        <stop offset="0.75" stopColor="#3A4658" />
        <stop offset="1" stopColor="#232B38" />
      </linearGradient>
      <linearGradient id="foldFront" x1="0" y1="0" x2="0.85" y2="0.65">
        <stop offset="0" stopColor="#B7BDC7" />
        <stop offset="0.45" stopColor="#79879C" />
        <stop offset="0.8" stopColor="#4B5A73" />
        <stop offset="1" stopColor="#2E3745" />
      </linearGradient>
      <radialGradient id="vignette" cx="0.5" cy="0.45" r="0.75">
        <stop offset="0" stopColor="#000000" stopOpacity="0" />
        <stop offset="0.7" stopColor="#000000" stopOpacity="0" />
        <stop offset="1" stopColor="#10141C" stopOpacity="0.22" />
      </radialGradient>
      <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
    </defs>
  );
}

export function InkSwirlBack({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 1600 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <Defs />
      {/* Fold A — topmost, warmest, largest bleed on every side */}
      <path
        d="M -100 60 C 200 -40, 380 260, 650 120 C 900 0, 1100 260, 1400 100 C 1550 20, 1650 60, 1750 100 L 1750 620 L -100 620 Z"
        fill="url(#foldA)"
      />
      <path
        d="M -100 60 C 200 -40, 380 260, 650 120 C 900 0, 1100 260, 1400 100 C 1550 20, 1650 60, 1750 100"
        fill="none"
        stroke="#F7F1E0"
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.55"
        filter="url(#softBlur)"
      />

      {/* Fold B — middle */}
      <path
        d="M -100 200 C 280 300, 480 60, 780 220 C 1030 340, 1280 80, 1550 230 L 1750 260 L 1750 620 L -100 620 Z"
        fill="url(#foldB)"
        opacity="0.96"
      />
      <path
        d="M -100 200 C 280 300, 480 60, 780 220 C 1030 340, 1280 80, 1550 230 L 1750 260"
        fill="none"
        stroke="#DCE0E4"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.4"
        filter="url(#softBlur)"
      />

      {/* Fold C — front-most, deepest blue-grey */}
      <path
        d="M -100 340 C 320 440, 520 200, 820 340 C 1080 460, 1330 220, 1750 360 L 1750 620 L -100 620 Z"
        fill="url(#foldC)"
      />
      <path
        d="M -100 340 C 320 440, 520 200, 820 340 C 1080 460, 1330 220, 1750 360"
        fill="none"
        stroke="#B7C0CC"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.35"
        filter="url(#softBlur)"
      />

      {/* Soft vignette for depth */}
      <rect x="-100" y="-100" width="1800" height="720" fill="url(#vignette)" />
    </svg>
  );
}

export function InkSwirlFront({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 1600 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <Defs />
      {/* One fold rendered again in front of the wordmark — this is what
          sells "intertwined" rather than text-on-a-background */}
      <path
        d="M -80 420 C 300 340, 560 160, 860 260 C 1110 340, 1320 150, 1680 260"
        fill="none"
        stroke="url(#foldFront)"
        strokeWidth="86"
        strokeLinecap="round"
        opacity="0.95"
      />
      <path
        d="M -80 420 C 300 340, 560 160, 860 260 C 1110 340, 1320 150, 1680 260"
        fill="none"
        stroke="#E4E8EC"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.4"
        filter="url(#softBlur)"
        transform="translate(0,-30)"
      />
    </svg>
  );
}
