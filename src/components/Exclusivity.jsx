import { useRef } from 'react';
import useReveal from '../lib/useReveal';

/**
 * Chapter 4 — one client per niche, per city. The market is a board of
 * frosted capsules, shown in its resting state: your slot (HVAC ×
 * Raleigh) locked, GreenEdge's Lawn-care × Raleigh slot already taken,
 * the rest open. Calm fade-in, no pinned sequence.
 *
 * [PLACEHOLDER — confirm GreenEdge's locked city]: shown under Raleigh.
 */

const NICHES = ['HVAC', 'Lawn care', 'Plumbing', 'Contractors'];
const CITIES = ['Raleigh', 'Durham', 'Cary', 'Apex', 'Wake Forest'];

const locked = { niche: 'HVAC', city: 'Raleigh' };
const taken = { niche: 'Lawn care', city: 'Raleigh', client: 'GreenEdge Lawn Co.' };

export default function Exclusivity() {
  const root = useRef(null);
  useReveal(root);

  return (
    <section ref={root} className="relative overflow-hidden px-6 py-28 sm:py-36">
      <div className="relative mx-auto w-full max-w-5xl">
        <div className="text-center">
          <p className="reveal mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-mute">
            The rule
          </p>
          <h2 className="reveal text-4xl font-extrabold tracking-tightest text-ink sm:text-5xl">
            One client. Per niche. <span className="text-liquid">Per city.</span>
          </h2>
          <p className="reveal mx-auto mt-5 max-w-md text-mute">
            When you sign, your slot locks for 12 months. Every competitor who calls after you
            hears no.
          </p>
        </div>

        <div className="reveal mt-12 overflow-x-auto pb-2">
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
                <Row key={niche} niche={niche} />
              ))}
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

function Row({ niche }) {
  return (
    <>
      <div className="flex items-center pr-3 text-xs font-bold text-ink sm:text-sm">{niche}</div>
      {CITIES.map((city) => {
        const isLocked = niche === locked.niche && city === locked.city;
        const isTaken = niche === taken.niche && city === taken.city;
        if (isLocked) {
          return (
            <div
              key={city}
              className="btn-liquid relative flex h-16 flex-col items-center justify-center rounded-full text-center sm:h-20"
            >
              <LockIcon />
              <span className="mt-1 text-[9px] font-black uppercase tracking-widest">
                Locked · 12 mo
              </span>
            </div>
          );
        }
        if (isTaken) {
          return (
            <div
              key={city}
              className="glass-lite relative flex h-16 flex-col items-center justify-center rounded-full bg-ink/[0.04] text-center sm:h-20"
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
            className="glass-lite relative flex h-16 flex-col items-center justify-center rounded-full text-center sm:h-20"
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
