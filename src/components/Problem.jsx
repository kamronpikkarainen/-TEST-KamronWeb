import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { usePerf } from '../lib/perf';

/**
 * Chapter 2 — the cost of an invisible website.
 * Pure typography under tension: the section pins and each word inks in
 * from pale silver as you scroll, ending on the prismatic punchline.
 * Under reduced-motion it renders as plain, fully-visible text (no pin).
 */
const LINES = [
  'Right now, someone nearby needs exactly what you do.',
  'They search. They tap the first site that looks like it won’t waste their time.',
  'If that isn’t you, they never knew you existed.',
];

export default function Problem() {
  const root = useRef(null);
  const { reducedMotion } = usePerf();

  useLayoutEffect(() => {
    if (reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray('.pw');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=230%',
          pin: true,
          scrub: 0.4,
        },
      });
      tl.fromTo(
        words,
        { opacity: 0.14 },
        { opacity: 1, ease: 'none', stagger: 0.35, duration: 2 },
        0
      );
      tl.fromTo(
        '.problem-punch',
        { opacity: 0, y: 60, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 4, ease: 'power2.out' },
        '>+1'
      );
      tl.to({}, { duration: 2 }); // hold the punchline before unpinning
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={root}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
    >
      <div className="mx-auto max-w-3xl">
        <p className="mb-10 text-xs font-semibold uppercase tracking-[0.3em] text-mute">
          The problem
        </p>
        <div className="space-y-7">
          {LINES.map((line) => (
            <p
              key={line}
              className="text-2xl font-bold leading-snug tracking-tight text-ink sm:text-4xl"
            >
              {line.split(' ').map((word, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <span key={i} className="pw">
                  {word}{' '}
                </span>
              ))}
            </p>
          ))}
        </div>
        <p className="problem-punch text-liquid mt-16 text-5xl font-extrabold tracking-tightest sm:text-7xl">
          Invisible is expensive.
        </p>
      </div>
    </section>
  );
}
