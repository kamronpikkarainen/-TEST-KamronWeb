import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { usePerf } from '../../lib/perf';
import { scrollToId } from '../../lib/scroll';
import LaptopFrame from './LaptopFrame';

// 1 CSS reference inch == 96px. The tease should leave less than this
// much of the block poking into view before any scroll happens.
const MAX_TEASE_VISIBLE_PX = 2.5 * 96;

/**
 * Hero — top to bottom: the giant headline; the pitch line and CTA
 * buttons underneath it; then the laptop, which the Problem section
 * renders inside of (LaptopFrame takes it as children). The "Kamron
 * Web" brand moment now lives in the IntroLoader splash that plays
 * once on page load (see components/IntroLoader.jsx) — Nav carries
 * the wordmark for the rest of the visit.
 *
 * Headline, pitch, CTA buttons, and the laptop all render inside one
 * `.hero-reveal` block that moves as a single unit. At rest (and
 * always, for reduced-motion) that block sits at its normal in-flow
 * position — nothing is ever permanently hidden. For motion users it
 * *starts* pushed down far enough that under 2.5in of it pokes up from
 * the bottom of the viewport, then the moment they scroll even a
 * little, the whole thing springs up into view — reversible if they
 * scroll back to the very top.
 */
export default function Hero({ children }) {
  const root = useRef(null);
  const revealRef = useRef(null);
  const { reducedMotion } = usePerf();

  useLayoutEffect(() => {
    if (reducedMotion) return undefined;
    const ctx = gsap.context(() => {
      const rect = revealRef.current.getBoundingClientRect();
      const offset = Math.max(0, window.innerHeight - MAX_TEASE_VISIBLE_PX - rect.top);

      // The tease: push the whole headline+laptop block down near the
      // bottom of the viewport on load, then spring it fully into view
      // the moment the visitor scrolls at all. start is offset 1px past
      // the very top so the "from" (hidden) state is unambiguously what
      // renders before any scrolling happens.
      gsap.from(revealRef.current, {
        y: offset,
        ease: 'back.out(1.6)',
        duration: 1,
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

      {/* Headline, pitch, CTA buttons, and the laptop — all one block
          that sits mostly below the fold pre-scroll (motion users
          only) and jumps fully into view on scroll. */}
      <div ref={revealRef} className="hero-reveal relative z-10">
        <div className="mx-auto mt-8 max-w-5xl text-center sm:mt-10">
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

        <LaptopFrame>{children}</LaptopFrame>
      </div>
    </section>
  );
}
