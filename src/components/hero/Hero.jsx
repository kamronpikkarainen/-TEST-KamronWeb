import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { usePerf } from '../../lib/perf';
import { scrollToId } from '../../lib/scroll';

/**
 * Hero — the calm, centered, glow-behind aesthetic of the CTA section,
 * used as the opening beat. No 3D, no scroll scrub: a soft prismatic
 * glow and a faint iridescent ring sit behind a big gradient headline,
 * which fades up on load.
 */
export default function Hero() {
  const root = useRef(null);
  const { reducedMotion } = usePerf();

  useLayoutEffect(() => {
    if (reducedMotion) return undefined;
    const ctx = gsap.context(() => {
      gsap.from('.hero-el', {
        y: 34,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.1,
      });
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      {/* Soft prismatic glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 44% at 50% 46%, rgba(53,200,232,0.16), transparent 62%), radial-gradient(ellipse 46% 40% at 35% 40%, rgba(139,124,247,0.14), transparent 60%), radial-gradient(ellipse 42% 36% at 66% 54%, rgba(240,168,200,0.12), transparent 60%)',
        }}
      />
      {/* Faint iridescent ring, echoing the CTA */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[42rem] w-[48rem] max-w-[94vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
        style={{
          background:
            'conic-gradient(from 210deg, rgba(232,176,106,0.7), rgba(41,184,232,0.7), rgba(46,95,232,0.7), rgba(139,124,247,0.7), rgba(240,168,200,0.7), rgba(232,176,106,0.7))',
          WebkitMask:
            'radial-gradient(farthest-side, transparent calc(100% - 12px), #000 calc(100% - 11px))',
          mask: 'radial-gradient(farthest-side, transparent calc(100% - 12px), #000 calc(100% - 11px))',
          filter: 'blur(4px)',
          transform: 'translate(-50%, -50%) rotate(-8deg) scaleY(0.66)',
        }}
      />

      <div className="relative mx-auto max-w-4xl">
        <p className="hero-el glass glass-iridescent relative mb-6 inline-block rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide text-mute">
          Raleigh, NC · Websites for local service businesses
        </p>
        <h1 className="hero-el text-5xl font-extrabold leading-[1.02] tracking-tightest text-ink sm:text-7xl">
          The site that wins the job
          <br />
          before you <span className="text-liquid">pick up the phone.</span>
        </h1>
        <p className="hero-el mx-auto mt-7 max-w-xl text-base text-mute sm:text-lg">
          Premium websites for HVAC, lawn care, plumbing, and contractors in the Triangle. One
          client per niche, per city — your competitors get a no.
        </p>
        <div className="hero-el mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => scrollToId('cta')}
            className="btn-liquid btn-sheen rounded-full px-9 py-4 text-sm font-extrabold transition-transform hover:scale-[1.04] active:scale-[0.98]"
          >
            Book a call
          </button>
          <button
            type="button"
            onClick={() => scrollToId('work')}
            className="glass rounded-full px-8 py-4 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
          >
            See the work
          </button>
        </div>
      </div>

      <div className="hero-el pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex">
        <span className="text-[10px] uppercase tracking-[0.25em] text-mute/80">Scroll</span>
        <span className="h-8 w-px bg-gradient-to-b from-mute/60 to-transparent" />
      </div>
    </section>
  );
}
