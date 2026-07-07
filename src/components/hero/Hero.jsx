import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { usePerf } from '../../lib/perf';
import { scrollToId } from '../../lib/scroll';
import { InkSwirlBack, InkSwirlFront } from './InkSwirl';
import LaptopPeek from './LaptopPeek';

/**
 * Hero — top to bottom: a big colorful ink swirl with the "KAMRON WEB"
 * wordmark intertwined in it (one ink ribbon behind the text, one in
 * front, so it reads as woven through rather than text-on-background);
 * the location chip / pitch / CTA buttons; the giant headline sentence;
 * and the laptop peeking up over the bottom edge of the viewport, its
 * top chrome bar occluding the headline's last line.
 *
 * The headline sits BEHIND the laptop (lower z-index) and bounces up
 * into place on load (elastic ease) rather than just fading in — every
 * other element does a calm fade-up.
 */
export default function Hero() {
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
        delay: 0.1,
      });
      // The headline bounces up from behind the laptop — a springy
      // overshoot, distinct from the calm fade everything else uses.
      gsap.from('.hero-headline', {
        y: 130,
        opacity: 0,
        duration: 1.3,
        ease: 'elastic.out(1, 0.65)',
        delay: 0.5,
      });
      gsap.from('.hero-laptop', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.3,
      });
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] flex-col overflow-hidden px-4 pb-0 pt-24 sm:px-6 sm:pt-28"
    >
      {/* Soft prismatic glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 40% at 50% 20%, rgba(53,200,232,0.14), transparent 62%), radial-gradient(ellipse 46% 34% at 30% 50%, rgba(139,124,247,0.1), transparent 60%), radial-gradient(ellipse 42% 30% at 70% 45%, rgba(240,168,200,0.1), transparent 60%)',
        }}
      />

      {/* Ink swirl + massive "Kamron Web" wordmark, intertwined.
          Full-bleed: breaks out of the section's padding to span the
          true viewport width, so the ink runs past the screen's edges
          rather than sitting in a bounded, centered box. */}
      <div className="hero-el relative left-1/2 z-10 h-44 w-screen -translate-x-1/2 sm:h-60 md:h-80 lg:h-[22rem]">
        <InkSwirlBack className="absolute inset-0 h-full w-full" />
        <h2
          className="absolute inset-0 flex items-center justify-center text-center font-extrabold uppercase tracking-tightest text-white"
          style={{
            fontSize: 'clamp(2.75rem, 9vw, 7.5rem)',
            WebkitTextStroke: '1.5px rgba(15,21,32,0.22)',
            textShadow: '0 10px 34px rgba(15,21,32,0.35)',
          }}
        >
          Kamron Web
        </h2>
        <InkSwirlFront className="pointer-events-none absolute inset-0 z-20 h-full w-full" />
      </div>

      {/* Location chip, one-line pitch, CTA buttons */}
      <div className="hero-el relative z-10 mx-auto mt-8 flex max-w-xl flex-col items-center text-center sm:mt-10">
        <p className="glass glass-iridescent relative mb-5 inline-block rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide text-mute">
          Raleigh, NC · Websites for local service businesses
        </p>
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

      <div className="flex-1" />

      {/* Giant headline — sits behind the laptop, bounces up on load.
          Bottom margin reserves the room the laptop overlaps into. */}
      <h1 className="hero-headline relative z-10 mx-auto mb-14 max-w-5xl text-center font-extrabold leading-[1.05] tracking-tightest text-ink sm:mb-16">
        <span className="block text-[clamp(2rem,6vw,4.25rem)]">The site that wins the job</span>
        <span className="block text-[clamp(2rem,6vw,4.25rem)]">
          before you <span className="text-liquid">pick up the phone.</span>
        </span>
      </h1>

      {/* Laptop peeking up over the bottom edge — in front of the
          headline (higher z-index), anchored to the section's bottom
          and pushed mostly below the fold so only its chrome bar shows. */}
      <div
        className="hero-laptop pointer-events-none absolute bottom-0 left-1/2 z-20 w-[112%] max-w-[1320px]"
        style={{ transform: 'translate(-50%, 60%)' }}
      >
        <LaptopPeek />
      </div>
    </section>
  );
}
