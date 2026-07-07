import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { usePerf } from '../../lib/perf';
import { scrollToId } from '../../lib/scroll';
import LaptopFrame from './LaptopFrame';
import InkSwoosh from './InkSwoosh';

/**
 * Hero — the laptop is no longer a device that cuts off at the fold, it's
 * a screen you scroll inside of. LaptopFrame supplies the bezel + browser
 * chrome (www.kamronweb.com); everything below that chrome bar — this
 * hero's headline and CTA cluster, then the Problem section immediately
 * after (passed in as `children`) — renders as one continuous "screen."
 *
 * A colorful ink swoosh crosses the exact vertical middle of the headline
 * block, edge to edge, and the headline clips behind it. The CTA cluster
 * (chip, pitch line, buttons) starts tucked out of sight below the fold
 * of that block — as if hidden behind the laptop — then rises on load to
 * rest just under the swoosh.
 */
export default function Hero({ children }) {
  const root = useRef(null);
  const { reducedMotion } = usePerf();

  useLayoutEffect(() => {
    if (reducedMotion) return undefined;
    const ctx = gsap.context(() => {
      gsap.from('.hero-el', {
        y: 26,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.1,
        delay: 0.15,
      });
      // The CTA cluster rises up from behind the laptop into its resting
      // spot just under the ink swoosh.
      gsap.from('.hero-cta-cluster', {
        y: 90,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        delay: 0.55,
      });
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={root} className="relative overflow-hidden px-4 pb-24 pt-28 sm:px-6 sm:pt-32">
      {/* Soft prismatic glow behind the whole frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 40% at 50% 22%, rgba(53,200,232,0.16), transparent 62%), radial-gradient(ellipse 46% 34% at 32% 18%, rgba(139,124,247,0.13), transparent 60%), radial-gradient(ellipse 42% 30% at 68% 24%, rgba(240,168,200,0.12), transparent 60%)',
        }}
      />

      <LaptopFrame>
        <div className="relative px-6 pb-14 pt-16 text-center sm:px-14 sm:pb-20 sm:pt-20">
          {/* Headline block. Line 1 reads clean; the swoosh crosses the exact
              vertical middle of line 2 only, so "...the job" is untouched
              and "pick up the phone." sits clipped behind the ink. */}
          <div className="relative mx-auto max-w-4xl">
            <h1 className="hero-el font-extrabold leading-[1.05] tracking-tightest text-ink">
              <span className="relative z-10 block text-[clamp(2rem,6vw,4.25rem)]">
                The site that wins the job
              </span>
              <span className="relative z-10 block text-[clamp(2rem,6vw,4.25rem)]">
                before you <span className="text-liquid">pick up the phone.</span>
                {/* Ink swoosh — spans to the screen's edges, centered on this line */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-16 w-[92vw] max-w-[1260px] -translate-x-1/2 -translate-y-1/2 sm:h-24 sm:w-[88vw]"
                >
                  <InkSwoosh className="h-full w-full" />
                </span>
              </span>
            </h1>
          </div>

          {/* CTA cluster — hidden behind the laptop, rises to hover just under the swoosh */}
          <div className="hero-cta-cluster relative z-30 mx-auto mt-10 flex max-w-xl flex-col items-center sm:mt-14">
            <p className="glass glass-iridescent relative mb-5 inline-block rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide text-mute">
              Raleigh, NC · Websites for local service businesses
            </p>
            <p className="text-sm text-mute sm:text-base">
              Premium websites for HVAC, lawn care, plumbing, and contractors in the Triangle.
              One client per niche, per city.
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

        {/* The Problem section continues on the same screen, no seam */}
        {children}
      </LaptopFrame>
    </section>
  );
}
