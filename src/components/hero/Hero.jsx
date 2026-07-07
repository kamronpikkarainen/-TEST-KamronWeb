import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { usePerf } from '../../lib/perf';
import { scrollToId } from '../../lib/scroll';
import Laptop from './Laptop';

/**
 * Hero — the reference composition: a giant headline anchored low, with a
 * laptop rising from the bottom that shows only its browser bar
 * (www.kamronweb.com) and cuts off, occluding the lower half of the
 * headline the way the dunes cut "DESERT VIEW". The supporting cluster
 * (chip, one-line pitch, CTAs) sits above the headline so nothing is
 * hidden behind the device. Calm fade-up on load; no scroll scrub.
 */
export default function Hero() {
  const root = useRef(null);
  const { reducedMotion } = usePerf();

  useLayoutEffect(() => {
    if (reducedMotion) return undefined;
    const ctx = gsap.context(() => {
      gsap.from('.hero-el', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.1,
        delay: 0.1,
      });
      gsap.from('.hero-laptop', {
        y: 80,
        opacity: 0,
        duration: 1.3,
        ease: 'power3.out',
        delay: 0.5,
      });
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] flex-col items-center overflow-hidden px-6"
    >
      {/* Soft prismatic glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 42% at 50% 30%, rgba(53,200,232,0.15), transparent 62%), radial-gradient(ellipse 46% 38% at 34% 26%, rgba(139,124,247,0.13), transparent 60%), radial-gradient(ellipse 42% 34% at 66% 36%, rgba(240,168,200,0.11), transparent 60%)',
        }}
      />

      {/* Supporting cluster — above the headline, always visible */}
      <div className="relative z-30 flex flex-col items-center pt-28 text-center sm:pt-32">
        <p className="hero-el glass glass-iridescent relative mb-6 inline-block rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide text-mute">
          Raleigh, NC · Websites for local service businesses
        </p>
        <p className="hero-el max-w-xl text-base text-mute sm:text-lg">
          Premium websites for HVAC, lawn care, plumbing, and contractors in the Triangle. One
          client per niche, per city.
        </p>
        <div className="hero-el mt-7 flex flex-wrap items-center justify-center gap-4">
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

      {/* Spacer pushes the headline down toward the laptop */}
      <div className="flex-1" />

      {/* Giant headline, anchored low — the laptop cuts only the bottom of
          the last line, so both lines still read. */}
      <h1 className="hero-el relative z-10 mx-auto mb-[7.5rem] max-w-6xl text-center font-extrabold leading-[1.0] tracking-tightest text-ink sm:mb-[10.5rem]">
        <span className="block text-[clamp(2.25rem,6.6vw,5rem)]">The site that wins the job</span>
        <span className="block text-[clamp(2.25rem,6.6vw,5rem)]">
          before you <span className="text-liquid">pick up the phone.</span>
        </span>
      </h1>

      {/* Laptop rising from the bottom — only the browser bar shows, then it
          cuts off, occluding the headline's lower edge. In front of the text. */}
      <div
        className="hero-laptop pointer-events-none absolute bottom-0 left-1/2 z-20 w-[126%] max-w-[1440px]"
        style={{ transform: 'translate(-50%, 77%)' }}
      >
        {/* soft grounding glow along the top edge */}
        <div
          aria-hidden="true"
          className="absolute inset-x-[8%] top-0 h-24 -translate-y-1/2 rounded-[50%] opacity-60"
          style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.9), transparent 70%)', filter: 'blur(16px)' }}
        />
        <Laptop className="relative w-full drop-shadow-[0_-24px_50px_rgba(60,72,104,0.28)]" />
      </div>
    </section>
  );
}
