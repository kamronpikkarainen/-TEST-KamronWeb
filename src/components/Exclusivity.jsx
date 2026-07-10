import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { usePerf } from '../lib/perf';
import useReveal from '../lib/useReveal';
import PowerLineScene from './exclusivity/PowerLineScene';

/**
 * Chapter 4 — one client per niche, per city. The market is a board of
 * frosted capsules: your slot (HVAC × Raleigh) locked, GreenEdge's
 * Lawn-care × Raleigh slot already taken, the rest open.
 *
 * The grid is pinned in place for a scroll stretch while a narrative
 * beat plays out behind and on it: a small power-line scene parallaxes
 * past, and the HVAC × Raleigh cell — shown open at rest — flips to
 * "Locked · 12 mo" partway through. Reduced motion skips all of it:
 * that cell simply renders already locked, no pin.
 *
 * [PLACEHOLDER — confirm GreenEdge's locked city]: shown under Raleigh.
 */

const NICHES = ['HVAC', 'Lawn care', 'Plumbing', 'Contractors'];
const CITIES = ['Raleigh', 'Durham', 'Cary', 'Apex', 'Wake Forest'];

const locked = { niche: 'HVAC', city: 'Raleigh' };
const taken = { niche: 'Lawn care', city: 'Raleigh', client: 'GreenEdge Lawn Co.' };

// Fraction of the pin's scroll range at which the slot flips.
const FLIP_AT = 0.55;

export default function Exclusivity() {
  const root = useRef(null);
  const pinRef = useRef(null);
  const sceneRef = useRef(null);
  const openRef = useRef(null);
  const lockedRef = useRef(null);
  const { reducedMotion } = usePerf();

  useReveal(root);

  useLayoutEffect(() => {
    if (reducedMotion || !pinRef.current) return undefined;
    const ctx = gsap.context(() => {
      const scene = sceneRef.current;

      // Continuous idle sway on the pole layers, independent of scroll,
      // so the scene doesn't read as static art while at rest.
      scene?.layers.forEach((layer, i) => {
        gsap.to(layer, {
          skewX: 0.5,
          duration: 4 + i * 0.6,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: 'top top',
          end: `+=${window.innerHeight * 1.15}`,
          scrub: 0.6,
          pin: pinRef.current,
          pinSpacing: true,
        },
      });

      // Parallax: nearer layers drift further per unit of scroll. Given
      // an explicit duration of 1 here (GSAP timeline position params
      // are absolute seconds, not fractions) so FLIP_AT below can mean
      // "55% of the way through" as intended.
      scene?.layers.forEach((layer, i) => {
        tl.to(layer, { xPercent: -(i + 1) * 5, duration: 1, ease: 'none' }, 0);
      });
      if (scene?.sky) {
        tl.to(scene.sky, { opacity: 1, duration: 1, ease: 'none' }, 0);
      }

      // The flip, keyed to the same timeline.
      tl.to(openRef.current, { opacity: 0, scale: 0.85, duration: 0.12, ease: 'power1.in' }, FLIP_AT)
        .to(lockedRef.current, { opacity: 1, scale: 1, duration: 0.14, ease: 'back.out(2)' }, FLIP_AT + 0.02);
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={root} className="relative overflow-hidden px-6 py-20 sm:py-28">
      <div className="relative mx-auto w-full max-w-5xl">
        <div className="text-center">
          <p className="reveal mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-mute">
            The rule
          </p>
          <h2 className="reveal text-3xl font-extrabold tracking-tightest text-ink sm:text-4xl">
            One client. Per niche. <span className="text-liquid">Per city.</span>
          </h2>
          <p className="reveal mx-auto mt-3 max-w-md text-sm text-mute">
            When you sign, your slot locks for 12 months. Every competitor who calls after you
            hears no.
          </p>
        </div>

        <div
          ref={pinRef}
          className="relative mt-6 flex min-h-screen items-start justify-center pb-6 pt-24 sm:mt-8 sm:pt-28"
        >
          <PowerLineScene ref={sceneRef} reducedMotion={reducedMotion} />

          <div className="w-full overflow-x-auto pb-2">
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
                  <Row
                    key={niche}
                    niche={niche}
                    reducedMotion={reducedMotion}
                    openRef={openRef}
                    lockedRef={lockedRef}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="reveal mt-8 space-y-3 text-center">
          <p className="text-lg font-semibold text-ink">
            Say you run HVAC in Raleigh. <span className="text-mute">This slot is yours.</span>
          </p>
          <p className="text-lg font-semibold text-ink">
            And every other Raleigh HVAC company that calls for 12 months?{' '}
            <span className="text-liquid font-bold">They hear no.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

function Row({ niche, reducedMotion, openRef, lockedRef }) {
  return (
    <>
      <div className="flex items-center pr-3 text-xs font-bold text-ink sm:text-sm">{niche}</div>
      {CITIES.map((city) => {
        const isLocked = niche === locked.niche && city === locked.city;
        const isTaken = niche === taken.niche && city === taken.city;

        if (isLocked) {
          // Reduced motion: skip the narrative entirely, render already
          // locked — the resolved state, no "before" to show.
          if (reducedMotion) {
            return (
              <div
                key={city}
                className="btn-liquid relative flex h-14 flex-col items-center justify-center rounded-full text-center sm:h-16"
              >
                <LockIcon />
                <span className="mt-1 text-[9px] font-black uppercase tracking-widest">
                  Locked · 12 mo
                </span>
              </div>
            );
          }
          return (
            <div key={city} className="relative h-14 sm:h-16">
              {/* Open — visible at rest, fades out at the flip. */}
              <div
                ref={openRef}
                className="glass-lite absolute inset-0 flex flex-col items-center justify-center rounded-full text-center"
              >
                <span className="text-[10px] font-semibold uppercase tracking-wider text-mute">
                  Open
                </span>
              </div>

              {/* Locked — hidden at rest, pops in at the flip (see the
                  gsap.to(lockedRef, ...) tween in the effect above). */}
              <div
                ref={lockedRef}
                className="btn-liquid absolute inset-0 flex scale-90 flex-col items-center justify-center rounded-full text-center opacity-0"
              >
                <LockIcon />
                <span className="mt-1 text-[9px] font-black uppercase tracking-widest">
                  Locked · 12 mo
                </span>
              </div>
            </div>
          );
        }

        if (isTaken) {
          return (
            <div
              key={city}
              className="glass-lite relative flex h-14 flex-col items-center justify-center rounded-full bg-ink/[0.04] text-center sm:h-16"
            >
              <span className="text-[9px] font-bold uppercase tracking-wider text-mute">Taken</span>
              <span className="mt-0.5 px-1 text-[9px] leading-tight text-mute/80 sm:text-[10px]">
                {taken.client}
              </span>
            </div>
          );
        }

        return (
          <div
            key={city}
            className="glass-lite relative flex h-14 flex-col items-center justify-center rounded-full text-center sm:h-16"
          >
            <span className="text-[10px] font-semibold uppercase tracking-wider text-mute">Open</span>
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
      <path d="M7.5 10V7.5a4.5 4.5 0 0 1 9 0V10" stroke="currentColor" strokeWidth="2.6" fill="none" />
    </svg>
  );
}
