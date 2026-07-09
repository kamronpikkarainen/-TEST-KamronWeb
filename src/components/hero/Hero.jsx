import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { usePerf } from '../../lib/perf';
import { scrollToId } from '../../lib/scroll';
import LaptopFrame from './LaptopFrame';

/**
 * Hero — top to bottom: the giant headline; the pitch line and CTA
 * buttons underneath it; then the laptop, which the Problem section
 * renders inside of (LaptopFrame takes it as children). The "Kamron
 * Web" brand moment now lives in the IntroLoader splash that plays
 * once on page load (see components/IntroLoader.jsx) — Nav carries
 * the wordmark for the rest of the visit.
 *
 * The headline/pitch/buttons render as one `.hero-reveal` block. At
 * rest (and always, for reduced-motion) that block sits fully clear of
 * the laptop — nothing is ever permanently hidden. For motion users it
 * *starts* nudged down so its lower edge tucks behind the laptop's
 * chrome bar (a tease), then the moment they scroll even a little, it
 * springs up clear of the laptop — reversible if they scroll back to
 * the very top.
 */
export default function Hero({ children }) {
  const root = useRef(null);
  const { reducedMotion } = usePerf();

  useLayoutEffect(() => {
    if (reducedMotion) return undefined;
    const ctx = gsap.context(() => {
      // The tease: nudge the whole text block down into the laptop's
      // chrome bar on load, then spring it clear the moment the visitor
      // scrolls at all. start is offset 1px past the very top so the
      // "from" (hidden) state is unambiguously what renders before any
      // scrolling happens.
      gsap.from('.hero-reveal', {
        y: 120,
        ease: 'back.out(1.6)',
        duration: 0.9,
        scrollTrigger: {
          trigger: root.current,
          start: 'top top-=1',
          end: '+=140',
          toggleActions: 'play none none reverse',
        },
      });
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={root} className="relative overflow-hidden px-4 pb-0 pt-20 sm:px-6 sm:pt-24">
      {/* Soft prismatic glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 40% at 50% 18%, rgba(53,200,232,0.12), transparent 62%), radial-gradient(ellipse 46% 34% at 30% 45%, rgba(139,124,247,0.09), transparent 60%), radial-gradient(ellipse 42% 30% at 70% 40%, rgba(240,168,200,0.09), transparent 60%)',
        }}
      />

      {/* Headline, pitch, CTA buttons — one block that tucks behind the
          laptop pre-scroll (motion users only) and springs clear on scroll. */}
      <div className="hero-reveal relative z-10 mx-auto mt-8 max-w-5xl text-center sm:mt-10">
        <h1 className="font-extrabold leading-[1.05] tracking-tightest text-ink">
          <span className="block text-[clamp(2rem,6vw,4.25rem)]">The site that wins the job</span>
          <span className="block text-[clamp(2rem,6vw,4.25rem)]">
            before you <span className="text-liquid">pick up the phone.</span>
          </span>
        </h1>
        <div className="mx-auto mt-7 flex max-w-xl flex-col items-center">
          <p className="text-sm text-mute sm:text-base">
            Premium websites for HVAC, lawn care, plumbing, and contractors in the Triangle. One
            client per niche, per city.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => scrollToId('cta')}
              className="btn-liquid btn-sheen rounded-full px-8 py-3.5 text-sm font-extrabold transition-transform hover:scale-[1.04] active:scale-[0.98]"
            >
              Book a call
            </button>
            <button
              type="button"
              onClick={() => scrollToId('work')}
              className="glass rounded-full px-7 py-3.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
            >
              See the work
            </button>
          </div>
        </div>
      </div>

      <div className="h-10 sm:h-14" />

      {/* Laptop — sits above the reveal block in stacking order (so the
          pre-scroll tease reads as "behind the laptop"), and contains
          the Problem section on its screen. */}
      <LaptopFrame className="relative z-20">{children}</LaptopFrame>
    </section>
  );
}
