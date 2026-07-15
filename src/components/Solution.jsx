import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { usePerf } from '../lib/perf';
import useReveal from '../lib/useReveal';
import SectionEyebrow from './SectionEyebrow';

/**
 * Chapter 3 — the flat-rate build model. The two delivery tracks are
 * drawn in their finished state (Pro's fill visibly stops four days
 * short of Starter's) on a calm glass panel that fades in via
 * useReveal. Layered on top of that, once each track scrolls into
 * view, its progress bar draws itself left-to-right and its milestone
 * markers pop in in sequence — the panel arrives calmly, then the
 * timeline itself plays out like a build actually happening. Reduced-
 * motion skips this second layer entirely; the bars simply sit at
 * their finished width and the markers are already visible (their
 * natural, unanimated state).
 */

const TOTAL_DAYS = 14;

const TRACKS = [
  {
    name: 'Starter',
    days: 14,
    price: '$3,000',
    fill: 'linear-gradient(90deg, #E8B06A, #F0A8C8)',
    flag: '#E8B06A',
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
    fill: 'linear-gradient(90deg, #3E6FF0, #35C8E8)',
    flag: '#2E5FE8',
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
  useReveal(root);
  const { reducedMotion } = usePerf();

  useLayoutEffect(() => {
    if (reducedMotion || !root.current) return undefined;
    const ctx = gsap.context(() => {
      const tracks = gsap.utils.toArray('.solution-track', root.current);
      tracks.forEach((trackEl) => {
        const fill = trackEl.querySelector('.solution-fill');
        const flag = trackEl.querySelector('.solution-flag');
        const milestones = gsap.utils.toArray('.solution-milestone', trackEl);

        const tl = gsap.timeline({
          scrollTrigger: { trigger: trackEl, start: 'top 78%' },
        });
        tl.fromTo(
          fill,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.1, ease: 'power3.out', transformOrigin: 'left center', clearProps: 'transform' }
        );
        tl.fromTo(
          flag,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(3)', clearProps: 'transform' },
          '-=0.15'
        );
        tl.fromTo(
          milestones,
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out', clearProps: 'transform' },
          '-=0.75'
        );
      });
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={root} className="relative px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-5xl text-center">
        <SectionEyebrow>The build</SectionEyebrow>
        <h2 className="reveal mx-auto max-w-2xl text-4xl font-extrabold tracking-tightest text-ink sm:text-5xl">
          Flat rate. Fixed deadline. <span className="text-liquid">No surprises.</span>
        </h2>
        <p className="reveal mx-auto mt-5 max-w-md text-mute">
          You pick a track. I build. You launch on the date we set.
        </p>

        <div className="reveal glass mt-14 space-y-14 rounded-3xl p-8 text-left sm:mt-16 sm:p-12">
          {TRACKS.map((track) => (
            <div key={track.name} className="solution-track">
              <div className="mb-8 flex items-baseline gap-3">
                <span className="text-lg font-extrabold text-ink">{track.name}</span>
                <span className="text-sm text-mute">
                  {track.days}-day delivery · {track.price}
                </span>
                {track.recommended && (
                  <span className="btn-liquid rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    Priority
                  </span>
                )}
              </div>

              <div className="relative">
                <div className="h-1.5 w-full rounded-full bg-ink/[0.08]" />
                {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map((day) => (
                  <span
                    key={day}
                    aria-hidden="true"
                    className="absolute -top-1 h-1 w-px bg-ink/15"
                    style={{ left: `${(day / TOTAL_DAYS) * 100}%` }}
                  />
                ))}
                {/* Final fill width — Pro stops four days short of Starter */}
                <div
                  className="solution-fill absolute left-0 top-0 h-1.5 rounded-full"
                  style={{ width: `${(track.days / TOTAL_DAYS) * 100}%`, background: track.fill }}
                />
                <div
                  className="solution-flag absolute -top-2 z-10 flex -translate-x-1/2 flex-col items-center"
                  style={{ left: `${(track.days / TOTAL_DAYS) * 100}%` }}
                >
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black text-white shadow-lg"
                    style={{ background: track.flag }}
                  >
                    ✓
                  </span>
                </div>
                {track.milestones.map((m) => (
                  <div
                    key={m.day}
                    className="solution-milestone absolute top-4 flex -translate-x-1/2 flex-col items-center text-center"
                    style={{ left: `${(m.day / TOTAL_DAYS) * 100}%` }}
                  >
                    <span className="mb-1.5 h-2.5 w-px bg-ink/25" />
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

          <p className="text-lg font-semibold text-ink">
            Pro launches four days sooner.{' '}
            <span className="text-mute">Same flat rate either way — the meter never runs.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
