import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { usePerf } from '../lib/perf';

/**
 * Chapter 3 — the flat-rate build model, drawn as a race.
 * Two delivery tracks (Starter 14 days, Pro 10 days) fill left-to-right
 * as you scroll, at the same days-per-scroll rate — so Pro visibly hits
 * its launch flag while Starter is still running. Milestones pop in as
 * each track passes them.
 *
 * Reduced-motion: the DOM's default state IS the finished race (fills at
 * final width, milestones visible), so it degrades to a static diagram.
 */

const TOTAL_DAYS = 14;

const TRACKS = [
  {
    name: 'Starter',
    days: 14,
    price: '$3,000',
    milestones: [
      { day: 1, label: 'Kickoff call' },
      { day: 4, label: 'Design approved' },
      { day: 10, label: 'Build complete' },
      { day: 14, label: 'Launch' },
    ],
  },
  {
    name: 'Pro',
    days: 10,
    price: '$5,500',
    recommended: true,
    milestones: [
      { day: 1, label: 'Kickoff call' },
      { day: 3, label: 'Design approved' },
      { day: 7, label: 'Build complete' },
      { day: 10, label: 'Launch' },
    ],
  },
];

export default function Solution() {
  const root = useRef(null);
  const { reducedMotion } = usePerf();

  useLayoutEffect(() => {
    if (reducedMotion) return undefined;

    const mm = gsap.matchMedia(root);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.sol-head',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: 'top 70%' },
        }
      );
    }, root);

    // One scrubbed timeline measured in "days": both fills advance at the
    // same rate, so the 4-day gap between tracks is literal on screen.
    // Desktop pins the section so the whole race stays on stage while it
    // draws; short mobile viewports scrub in place instead of pinning.
    const buildRace = (pin) => {
      const tl = gsap.timeline({
        scrollTrigger: pin
          ? {
              trigger: root.current,
              start: 'top top',
              end: '+=150%',
              pin: true,
              scrub: 0.5,
            }
          : {
              trigger: '.sol-race',
              start: 'top 70%',
              end: '+=110%',
              scrub: 0.5,
            },
      });

      TRACKS.forEach((track, ti) => {
        tl.fromTo(
          `.sol-fill-${ti}`,
          { scaleX: 0 },
          { scaleX: track.days / TOTAL_DAYS, duration: track.days, ease: 'none' },
          0
        );
        track.milestones.forEach((m) => {
          tl.fromTo(
            `.sol-ms-${ti}-${m.day}`,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
            Math.max(m.day - 0.7, 0)
          );
        });
        tl.fromTo(
          `.sol-flag-${ti}`,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.9, ease: 'back.out(2.5)' },
          track.days - 0.7
        );
      });

      tl.fromTo(
        '.sol-gap-note',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 1.4, ease: 'power2.out' },
        10.4
      );
      tl.to({}, { duration: 1.5 }); // hold the finished race before unpinning
    };

    mm.add('(min-width: 768px)', () => buildRace(true));
    mm.add('(max-width: 767px)', () => buildRace(false));

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section ref={root} className="relative px-6 py-28 sm:py-40">
      <div className="mx-auto max-w-5xl">
        <p className="sol-head mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-mute">
          The build
        </p>
        <h2 className="sol-head max-w-2xl text-4xl font-extrabold tracking-tightest text-ink sm:text-5xl">
          Flat rate. Fixed deadline. <span className="text-accent">No surprises.</span>
        </h2>
        <p className="sol-head mt-5 max-w-md text-mute">
          You pick a track. I build. You launch on the date we set.
        </p>

        <div className="sol-race mt-16 space-y-14 sm:mt-20">
          {TRACKS.map((track, ti) => (
            <div key={track.name}>
              <div className="mb-8 flex items-baseline gap-3">
                <span className="text-lg font-extrabold text-ink">{track.name}</span>
                <span className="text-sm text-mute">
                  {track.days}-day delivery · {track.price}
                </span>
                {track.recommended && (
                  <span className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                    Priority
                  </span>
                )}
              </div>

              <div className="relative">
                {/* Track bed */}
                <div className="h-1.5 w-full rounded-full bg-white/[0.07]" />
                {/* Fill — default (reduced-motion) state is the final width */}
                <div
                  className={`sol-fill-${ti} absolute left-0 top-0 h-1.5 w-full origin-left rounded-full ${
                    track.recommended ? 'bg-accent' : 'bg-key/80'
                  }`}
                  style={{ transform: `scaleX(${track.days / TOTAL_DAYS})` }}
                />
                {/* Launch flag */}
                <div
                  className={`sol-flag-${ti} absolute -top-2 z-10 flex -translate-x-1/2 flex-col items-center`}
                  style={{ left: `${(track.days / TOTAL_DAYS) * 100}%` }}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black ${
                      track.recommended ? 'bg-accent text-[#0A0D12]' : 'bg-key text-[#0A0D12]'
                    }`}
                  >
                    ✓
                  </span>
                </div>

                {/* Milestones */}
                {track.milestones.map((m) => (
                  <div
                    key={m.day}
                    className={`sol-ms-${ti}-${m.day} absolute top-4 flex -translate-x-1/2 flex-col items-center text-center`}
                    style={{ left: `${(m.day / TOTAL_DAYS) * 100}%` }}
                  >
                    <span className="mb-1.5 h-2.5 w-px bg-white/25" />
                    <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-wide text-ink/90 sm:text-[11px]">
                      Day {m.day}
                    </span>
                    <span className="max-w-[72px] text-[10px] leading-tight text-mute sm:max-w-none sm:text-[11px]">
                      {m.label}
                    </span>
                  </div>
                ))}
                <div className="h-16" />
              </div>
            </div>
          ))}

          <p className="sol-gap-note text-lg font-semibold text-ink">
            Pro launches four days sooner. <span className="text-mute">Same flat rate either way — the meter never runs.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
