import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { usePerf } from '../lib/perf';

/**
 * Chapter 2 — the cost of an invisible website. The beats escalate in
 * weight to the two anchor lines, the payoff glows.
 *
 * The iPad is pinned in place for the length of this section (see the
 * scrollTrigger below — it targets the nearest `.device-pin-target`
 * ancestor, which is IpadFrame's outer wrapper) so the screen holds
 * still while each line scrubs into view, staying centered the whole
 * time instead of scrolling past. Reduced-motion gets no pin and no
 * scrub — everything is simply visible, in normal document flow.
 */
const LINES = [
  { text: 'Someone nearby needs exactly what you do. Right now.', cls: 'text-lg text-mute sm:text-2xl' },
  { text: 'They search.', cls: 'text-lg text-mute sm:text-2xl' },
  { text: 'They tap the first result that looks like it won’t waste their time.', cls: 'text-xl font-semibold text-ink/70 sm:text-3xl' },
  { text: 'If that isn’t you, they never knew you existed.', cls: 'text-2xl font-extrabold text-ink sm:text-4xl' },
  { text: 'And you’re not getting seen.', cls: 'text-2xl font-extrabold text-ink sm:text-4xl' },
];

export default function Problem() {
  const root = useRef(null);
  const { reducedMotion } = usePerf();

  useLayoutEffect(() => {
    if (reducedMotion || !root.current) return undefined;
    const ctx = gsap.context(() => {
      const pinTarget = root.current.closest('.device-pin-target') || root.current;
      const items = gsap.utils.toArray('.reveal', root.current);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: `+=${window.innerHeight * 1.6}`,
          scrub: 0.6,
          pin: pinTarget,
          pinSpacing: true,
        },
      });

      items.forEach((el, i) => {
        tl.from(el, { y: 32, opacity: 0, duration: 0.9, ease: 'power3.out' }, i * 0.55);
      });
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={root}
      className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-6 py-28 text-center"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 45% at 50% 62%, rgba(139,124,247,0.12), transparent 62%)',
        }}
      />
      <div className="relative mx-auto max-w-3xl">
        <p className="reveal mb-10 text-xs font-semibold uppercase tracking-[0.3em] text-mute">
          The problem
        </p>
        <div className="space-y-5">
          {LINES.map((line) => (
            <p key={line.text} className={`reveal leading-snug tracking-tight ${line.cls}`}>
              {line.text}
            </p>
          ))}
        </div>
        <p className="reveal text-liquid mt-14 text-5xl font-extrabold tracking-tightest sm:text-7xl">
          Invisible is expensive.
        </p>
      </div>
    </section>
  );
}
