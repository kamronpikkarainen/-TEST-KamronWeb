import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { usePerf } from '../lib/perf';
import SectionEyebrow from './SectionEyebrow';

/**
 * Chapter 2 — the cost of an invisible website. The beats escalate in
 * weight to the two anchor lines, the payoff glows.
 *
 * The iPad is pinned in place for the length of this section so the
 * screen holds still while each line scrubs into view, staying
 * centered the whole time instead of scrolling past. Reduced-motion
 * gets no pin and no scrub — everything is simply visible, in normal
 * document flow.
 *
 * The scrollTrigger below triggers off — and pins — the nearest
 * `.device-pin-target` ancestor (IpadFrame's outer wrapper) rather than
 * this section's own root: that wrapper's top sits higher up the page
 * (above the camera notch + address pill), so triggering off this
 * inner section instead would let the pin engage only after the
 * device's own top edge had already scrolled past, cutting it off.
 *
 * The "The problem" eyebrow label is deliberately NOT part of the
 * scrubbed `.reveal` set below — it's plain, permanently-visible
 * content, so it's already sitting on the iPad's screen the moment the
 * page loads, before any scrolling.
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
          trigger: pinTarget,
          // +=88 so the pinned device's top (camera + address pill)
          // clears the site's own fixed nav bar (70px tall) instead of
          // locking flush with it and getting covered.
          start: 'top top+=88',
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
        <SectionEyebrow reveal={false} className="!mb-10">
          The problem
        </SectionEyebrow>
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
