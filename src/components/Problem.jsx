import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { usePerf } from '../lib/perf';

/**
 * Chapter 2 — the cost of an invisible website. A fast punch, not a
 * cinematic slog: the section pins for ~75vh while five beats land one
 * at a time, each fading up from ~20px below. As each new line lands,
 * the previous one dims to 40% so focus always sits on the newest —
 * until the anchor line ("If that isn't you…"), which holds at 100%.
 * Type escalates beat by beat; the payoff line is the only element
 * that overshoots in (scale 0.9 → 1, ease-back) for the snap.
 *
 * Reduced-motion: no pin, all beats render fully visible.
 */

// dim: whether this line drops to 40% once the next beat lands.
const LINES = [
  {
    text: 'Someone nearby needs exactly what you do. Right now.',
    cls: 'text-lg font-semibold text-mute sm:text-2xl',
    dim: true,
  },
  {
    text: 'They search.',
    cls: 'text-lg font-semibold text-mute sm:text-2xl',
    dim: true,
  },
  {
    text: 'They tap the first result that looks like it won’t waste their time.',
    cls: 'text-xl font-bold text-ink/80 sm:text-3xl',
    dim: true,
  },
  {
    text: 'If that isn’t you, they never knew you existed.',
    cls: 'text-2xl font-extrabold text-ink sm:text-4xl',
    dim: false, // the anchor — holds at full opacity
  },
];

export default function Problem() {
  const root = useRef(null);
  const { reducedMotion } = usePerf();

  useLayoutEffect(() => {
    if (reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray('.pb-line');
      const BEAT = 0.5; // timeline-time per beat; scrub maps it to scroll

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=75%', // short pin — fast punch
          pin: true,
          scrub: 0.4,
        },
      });

      lines.forEach((el, i) => {
        tl.fromTo(
          el,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
          i * BEAT
        );
        // Dim the previous beat as this one lands (anchor never dims).
        if (i > 0 && LINES[i - 1].dim) {
          tl.to(lines[i - 1], { opacity: 0.4, duration: 0.25 }, i * BEAT + 0.05);
        }
      });

      // Payoff: the only entrance with overshoot.
      tl.fromTo(
        '.pb-punch',
        { opacity: 0, y: 24, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)' },
        LINES.length * BEAT
      );
      // Dim the last dimming line (index 2) already handled; anchor holds.
      tl.to({}, { duration: 0.35 }); // brief hold before unpin
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={root}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
    >
      <div className="mx-auto w-full max-w-3xl">
        <p className="mb-10 text-xs font-semibold uppercase tracking-[0.3em] text-mute">
          The problem
        </p>
        <div className="space-y-5">
          {LINES.map((line) => (
            <p key={line.text} className={`pb-line ${line.cls}`} style={{ transformOrigin: 'left center' }}>
              {line.text}
            </p>
          ))}
        </div>
        <p
          className="pb-punch text-liquid mt-12 text-5xl font-extrabold tracking-tightest sm:text-7xl"
          style={{ transformOrigin: 'left center' }}
        >
          Invisible is expensive.
        </p>
      </div>
    </section>
  );
}
