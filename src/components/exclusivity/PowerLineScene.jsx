import { forwardRef, useImperativeHandle, useRef } from 'react';

/**
 * Atmospheric background for the exclusivity grid: 3 depth layers of
 * utility poles strung with sagging cable, parallaxing behind the grid
 * as the section is pinned (see Exclusivity.jsx, which drives these
 * layers' transforms + the sky tint from a scrubbed GSAP timeline).
 *
 * Kept as flat, single-color silhouettes at low opacity on purpose —
 * this is set dressing for the "your slot locks" narrative beat, not a
 * focal point, so it must never compete with the grid's pill buttons.
 *
 * Reduced motion gets a single static, non-parallaxed pole graphic (via
 * the `reducedMotion` prop) instead of the layered scene.
 */
const PowerLineScene = forwardRef(function PowerLineScene({ reducedMotion }, ref) {
  const farRef = useRef(null);
  const midRef = useRef(null);
  const nearRef = useRef(null);
  const skyRef = useRef(null);

  useImperativeHandle(ref, () => ({
    layers: [farRef.current, midRef.current, nearRef.current].filter(Boolean),
    sky: skyRef.current,
  }));

  if (reducedMotion) {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 overflow-hidden opacity-[0.12]">
        <PoleRow gap={280} />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 -top-6 -z-10 h-48 overflow-hidden sm:h-56"
      style={{ perspective: '900px' }}
    >
      <div
        ref={skyRef}
        className="absolute inset-0 opacity-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(46,95,232,0.10), rgba(41,184,232,0.05) 55%, transparent 85%)',
        }}
      />
      <div
        ref={farRef}
        className="absolute inset-x-0 top-0 opacity-[0.09]"
        style={{ transformStyle: 'preserve-3d', transform: 'translateZ(-600px) scale(1.9)' }}
      >
        <PoleRow gap={360} />
      </div>
      <div
        ref={midRef}
        className="absolute inset-x-0 top-6 opacity-[0.13]"
        style={{ transformStyle: 'preserve-3d', transform: 'translateZ(-300px) scale(1.4)' }}
      >
        <PoleRow gap={300} />
      </div>
      <div
        ref={nearRef}
        className="absolute inset-x-0 -top-2 opacity-[0.18] blur-[2px]"
        style={{ transformStyle: 'preserve-3d', transform: 'translateZ(-50px) scale(1.05)' }}
      >
        <PoleRow gap={250} />
      </div>
    </div>
  );
});

export default PowerLineScene;

function PoleRow({ gap }) {
  const poles = [50, 50 + gap, 50 + gap * 2, 50 + gap * 3, 50 + gap * 4, 50 + gap * 5];
  const w = 50 + gap * 5 + 50;
  return (
    <svg width="100%" height="150" viewBox={`0 0 ${w} 150`} preserveAspectRatio="none" className="block w-full">
      {poles.slice(0, -1).map((x, i) => {
        const x2 = poles[i + 1];
        const mid = (x + x2) / 2;
        const sag = 34 + (x2 - x) * 0.22;
        return (
          <path
            key={x}
            d={`M ${x - 16} 34 Q ${mid} ${sag} ${x2 - 16} 34`}
            stroke="#1B2230"
            strokeWidth="1.5"
            fill="none"
          />
        );
      })}
      {poles.map((x) => (
        <g key={x}>
          <rect x={x - 2} y="34" width="4" height="90" fill="#1B2230" />
          <rect x={x - 20} y="34" width="40" height="4" fill="#1B2230" />
        </g>
      ))}
    </svg>
  );
}
