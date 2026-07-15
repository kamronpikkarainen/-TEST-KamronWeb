import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { usePerf } from '../../lib/perf';
import { scrollToId } from '../../lib/scroll';
import { HOLD_MS as LOADER_HOLD_MS } from '../IntroLoader';
import IpadFrame from './IpadFrame';

// 1 CSS reference inch == 96px. The tease should leave less than this
// much of the block poking into view before it rises.
const MAX_TEASE_VISIBLE_PX = 2.5 * 96;

/**
 * Hero — top to bottom: the giant headline; the pitch line and CTA
 * buttons underneath it; then the iPad, which the Problem section
 * renders inside of (IpadFrame takes it as children). The "Kamron
 * Web" brand moment now lives in the IntroLoader splash that plays
 * once on page load (see components/IntroLoader.jsx) — Nav carries
 * the wordmark for the rest of the visit.
 *
 * Headline, pitch, CTA buttons, and the iPad all render inside one
 * `.hero-reveal` block. At rest (and always, for reduced-motion) that
 * block sits at its normal in-flow position — nothing is ever
 * permanently hidden. For motion users it *starts* pushed down far
 * enough that under 2.5in of it (just the headline and the top of the
 * iPad) pokes up from the bottom of the viewport.
 *
 * The moment the IntroLoader splash begins clearing (no scrolling
 * required), the whole block rises as one firm, decisive snap — then,
 * just as it lands, the headline, the pitch/buttons, and the iPad each
 * get their own quick individual "click into place" settle, staggered
 * a beat apart, so the page reads as separate pieces locking in rather
 * than one soft float.
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

      const tl = gsap.timeline({
        delay: LOADER_HOLD_MS / 1000,
        // The Problem section's pin measures its trigger position on
        // mount, while this block still sits in its tucked-down tease
        // position — window's own 'load' refresh (see App.jsx) fires
        // before this timeline ever finishes, so it just re-measures
        // the same wrong, mid-tease layout. Refreshing again here, once
        // the page is truly at its final settled layout, is what
        // actually fixes those pins' start/end positions.
        onComplete: () => ScrollTrigger.refresh(),
      });

      // The tease: push the whole headline+iPad block down near the
      // bottom of the viewport on load, then rise — a firm, snappy
      // deceleration rather than a soft float.
      tl.from(revealRef.current, {
        y: offset,
        ease: 'power3.out',
        duration: 0.6,
        // Otherwise the leftover inline transform (even an identity
        // matrix) would make this a containing block for the ipad's
        // pin later on, breaking its position:fixed while pinned.
        clearProps: 'transform',
      });

      // The click: each piece pops down into its final spot with a
      // firm little overshoot-and-settle, staggered so they read as
      // individually clicking into place as the block lands.
      tl.from(
        ['.hero-headline', '.hero-pitch', '.hero-ipad'],
        {
          y: 16,
          scale: 0.97,
          ease: 'back.out(3)',
          duration: 0.4,
          stagger: 0.09,
          clearProps: 'transform',
        },
        '-=0.22',
      );
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

      {/* Headline, pitch, CTA buttons, and the iPad — all one block
          that sits mostly below the fold at first (motion users only)
          and automatically jumps fully into view a beat later. */}
      <div ref={revealRef} className="hero-reveal relative z-10">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="hero-headline mt-8 font-extrabold leading-[1.05] tracking-tightest text-ink sm:mt-10">
            <span className="block text-[clamp(2rem,6vw,4.25rem)]">The site that wins the job</span>
            <span className="block text-[clamp(2rem,6vw,4.25rem)]">
              before you <span className="text-liquid">pick up the phone.</span>
            </span>
          </h1>
          <div className="hero-pitch mx-auto mt-7 flex max-w-xl flex-col items-center">
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

        <IpadFrame className="hero-ipad">{children}</IpadFrame>
      </div>
    </section>
  );
}
