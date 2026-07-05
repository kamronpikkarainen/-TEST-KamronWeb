import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { usePerf } from '../lib/perf';

/**
 * Chapter 4 — scarcity you can watch happen.
 *
 * The market is drawn as a board of frosted glass capsules — one pill
 * per niche × city combination, straight off the liquid-glass reference
 * board. The section pins and runs a scripted sequence: a targeting
 * ring hunts to an open capsule, the capsule floods with the prismatic
 * gradient and locks, and the rest of the board frosts over — because
 * that's exactly what signing does to your competitors. One capsule
 * (Lawn care × Raleigh) is already marked Taken by GreenEdge, the real
 * client.
 *
 * [PLACEHOLDER — confirm GreenEdge's locked city]: the Taken slot is
 * shown under Raleigh; move `taken` below if GreenEdge's exclusivity is
 * held in a different Triangle city.
 *
 * Reduced-motion: renders the end state as a static board — demo slot
 * locked, captions visible, no pin.
 */

const NICHES = ['HVAC', 'Lawn care', 'Plumbing', 'Contractors'];
const CITIES = ['Raleigh', 'Durham', 'Cary', 'Apex', 'Wake Forest'];

// Slot the animation locks in front of the visitor.
const demo = { niche: 'HVAC', city: 'Raleigh' };
// Real, already-claimed slot.
const taken = { niche: 'Lawn care', city: 'Raleigh', client: 'GreenEdge Lawn Co.' };

export default function Exclusivity() {
  const root = useRef(null);
  const { reducedMotion } = usePerf();

  useLayoutEffect(() => {
    if (reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      const cells = gsap.utils.toArray('.x-cell');
      const others = cells.filter(
        (c) => !c.classList.contains('x-demo') && !c.classList.contains('x-taken')
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=280%',
          pin: true,
          scrub: 0.5,
        },
      });

      // 1 — the board assembles.
      tl.fromTo('.x-head', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.5 }, 0);
      tl.fromTo(
        cells,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 1.6, stagger: { each: 0.06, from: 'start' } },
        0.6
      );
      tl.fromTo('.x-cap-a', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.2 }, 2.2);

      // 2 — targeting ring locks onto the demo slot.
      tl.fromTo(
        '.x-ring',
        { opacity: 0, scale: 2.4 },
        { opacity: 1, scale: 1, duration: 1.6, ease: 'power3.inOut' },
        4
      );
      tl.to('.x-cap-a', { opacity: 0, duration: 0.8 }, 4.4);
      tl.fromTo('.x-cap-b', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.2 }, 4.9);

      // 3 — the slot locks.
      tl.fromTo(
        '.x-lock',
        { opacity: 0, scale: 1.35 },
        { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.8)' },
        6.6
      );
      tl.to('.x-ring', { opacity: 0, duration: 0.6 }, 7);

      // 4 — everyone else frosts over.
      tl.to(others, { opacity: 0.3, duration: 1.6, stagger: { each: 0.03, from: 'random' } }, 7.6);
      tl.to('.x-cap-b', { opacity: 0, duration: 0.8 }, 7.8);
      tl.fromTo('.x-cap-c', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.4 }, 8.4);

      // 5 — nod to the slot that's already gone.
      tl.fromTo(
        '.x-taken',
        { scale: 1 },
        { scale: 1.06, duration: 0.7, yoyo: true, repeat: 1, ease: 'power2.inOut' },
        9.6
      );
      tl.to({}, { duration: 1.2 }); // hold before unpin

      // Triangle constellation drifts slightly for depth.
      gsap.to('.x-map', {
        y: -40,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: '+=280%', scrub: 0.8 },
      });
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={root}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-24"
    >
      {/* Faint Triangle constellation — Raleigh/Durham/Chapel Hill nodes */}
      <svg
        aria-hidden="true"
        className="x-map pointer-events-none absolute left-1/2 top-1/2 h-[130%] w-auto -translate-x-1/2 -translate-y-1/2 opacity-[0.07]"
        viewBox="0 0 600 520"
        fill="none"
      >
        <path d="M300 80 L120 400 L480 400 Z" stroke="#3E6FF0" strokeWidth="1.5" />
        <circle cx="300" cy="80" r="6" fill="#3E6FF0" />
        <circle cx="120" cy="400" r="6" fill="#3E6FF0" />
        <circle cx="480" cy="400" r="6" fill="#3E6FF0" />
      </svg>

      <div className="relative mx-auto w-full max-w-5xl">
        <div className="x-head">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-mute">
            The rule
          </p>
          <h2 className="text-4xl font-extrabold tracking-tightest text-ink sm:text-5xl">
            One client. Per niche. <span className="text-liquid">Per city.</span>
          </h2>
          <p className="mt-5 max-w-md text-mute">
            When you sign, your slot locks for 12 months. Every competitor who calls after
            you hears no.
          </p>
        </div>

        {/* The board */}
        <div className="mt-12 overflow-x-auto pb-2">
          <div className="min-w-[640px]">
            <div className="grid grid-cols-[110px_repeat(5,1fr)] gap-2.5 sm:grid-cols-[140px_repeat(5,1fr)]">
              <div />
              {CITIES.map((city) => (
                <div
                  key={city}
                  className="pb-2 text-center text-[10px] font-bold uppercase tracking-wider text-mute sm:text-xs"
                >
                  {city}
                </div>
              ))}

              {NICHES.map((niche) => (
                <FragmentRow key={niche} niche={niche} />
              ))}
            </div>
          </div>
        </div>

        {/* Captions: rotate in place while pinned; stack statically under reduced-motion */}
        {reducedMotion ? (
          <div className="mt-8 space-y-3">
            <p className="text-lg font-semibold text-ink">
              Say you run HVAC in Raleigh. <span className="text-mute">This slot is yours.</span>
            </p>
            <p className="text-lg font-semibold text-ink">
              And every other Raleigh HVAC company that calls for 12 months?{' '}
              <span className="text-liquid font-bold">They hear no.</span>
            </p>
          </div>
        ) : (
          <div className="relative mt-8 h-16">
            <p className="x-cap-a absolute inset-0 text-lg font-semibold text-ink opacity-0">
              Four niches. Five cities. One slot each — that’s the whole market.
            </p>
            <p className="x-cap-b absolute inset-0 text-lg font-semibold text-ink opacity-0">
              Say you run HVAC in Raleigh. <span className="text-mute">This slot is yours.</span>
            </p>
            <p className="x-cap-c absolute inset-0 text-lg font-semibold text-ink opacity-0">
              And every other Raleigh HVAC company that calls me for 12 months?{' '}
              <span className="text-liquid font-bold">They hear no.</span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function FragmentRow({ niche }) {
  return (
    <>
      <div className="flex items-center pr-3 text-xs font-bold text-ink sm:text-sm">{niche}</div>
      {CITIES.map((city) => {
        const isDemo = niche === demo.niche && city === demo.city;
        const isTaken = niche === taken.niche && city === taken.city;
        return (
          <div
            key={city}
            className={`x-cell glass-lite relative flex h-16 flex-col items-center justify-center rounded-full text-center sm:h-20 ${
              isTaken ? 'x-taken !bg-ink/[0.05]' : isDemo ? 'x-demo' : ''
            }`}
          >
            {isTaken ? (
              <>
                <span className="text-[9px] font-bold uppercase tracking-wider text-mute">
                  Taken
                </span>
                <span className="mt-0.5 px-1 text-[9px] leading-tight text-mute/80 sm:text-[10px]">
                  {taken.client}
                </span>
              </>
            ) : isDemo ? (
              <>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-mute">
                  Open
                </span>
                {/* Targeting ring (animated in) */}
                <span className="x-ring pointer-events-none absolute -inset-1.5 rounded-full border-2 border-accent opacity-0" />
                {/* Locked overlay — visible by default so reduced-motion shows the end state */}
                <span className="x-lock btn-liquid absolute inset-0 flex flex-col items-center justify-center rounded-full">
                  <LockIcon />
                  <span className="mt-1 text-[9px] font-black uppercase tracking-widest">
                    Locked · 12 mo
                  </span>
                </span>
              </>
            ) : (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-mute">
                Open
              </span>
            )}
          </div>
        );
      })}
    </>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="10" width="16" height="11" rx="2.5" fill="currentColor" />
      <path
        d="M7.5 10V7.5a4.5 4.5 0 0 1 9 0V10"
        stroke="currentColor"
        strokeWidth="2.6"
        fill="none"
      />
    </svg>
  );
}
