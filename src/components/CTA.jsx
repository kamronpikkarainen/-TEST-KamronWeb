import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { usePerf } from '../lib/perf';

/**
 * Chapter 7 — the only door out. One action, zero competing links.
 * [PLACEHOLDER — booking link]: point the button at a real scheduling
 * URL (Calendly/Cal.com) when one exists; until then it's the phone
 * line, which is real and answered.
 */
export default function CTA() {
  const root = useRef(null);
  const { reducedMotion } = usePerf();

  useLayoutEffect(() => {
    if (reducedMotion) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cta-el',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 65%' },
        }
      );
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={root}
      id="cta"
      className="relative flex min-h-[90svh] scroll-mt-24 flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      {/* Prismatic glow pooling behind the final ask */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 45% at 50% 72%, rgba(53,200,232,0.22), transparent 65%), radial-gradient(ellipse 45% 40% at 38% 30%, rgba(139,124,247,0.16), transparent 60%), radial-gradient(ellipse 40% 35% at 65% 40%, rgba(240,168,200,0.14), transparent 60%)',
        }}
      />

      {/* Glass-ring callback to the hero sculpture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
        style={{
          background:
            'conic-gradient(from 210deg, rgba(232,176,106,0.8), rgba(41,184,232,0.8), rgba(46,95,232,0.8), rgba(139,124,247,0.8), rgba(240,168,200,0.8), rgba(232,176,106,0.8))',
          WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 14px), #000 calc(100% - 13px))',
          mask: 'radial-gradient(farthest-side, transparent calc(100% - 14px), #000 calc(100% - 13px))',
          filter: 'blur(5px)',
          transform: 'translate(-50%, -50%) rotate(-8deg) scaleY(0.72)',
        }}
      />

      <div className="relative mx-auto max-w-3xl">
        <h2 className="cta-el text-5xl font-extrabold leading-[1.02] tracking-tightest text-ink sm:text-7xl">
          Your niche is
          <br />
          still open. <span className="text-liquid">For now.</span>
        </h2>
        <p className="cta-el mx-auto mt-7 max-w-md text-base text-mute sm:text-lg">
          One call, fifteen minutes. You’ll know exactly what your site will do and the day
          it ships.
        </p>
        <div className="cta-el mt-10">
          <a
            href="tel:+19194533252"
            className="btn-liquid btn-sheen inline-block rounded-full px-11 py-5 text-base font-black transition-transform hover:scale-[1.05] active:scale-[0.98] sm:text-lg"
          >
            Book a call — (919) 453-3252
          </a>
        </div>
        <p className="cta-el mt-6 text-xs text-mute/80">
          If your slot is already taken, I’ll tell you on the phone. That’s the deal.
        </p>
      </div>
    </section>
  );
}
