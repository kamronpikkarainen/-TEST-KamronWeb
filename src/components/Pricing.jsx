import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { usePerf } from '../lib/perf';
import { scrollToId } from '../lib/scroll';

/**
 * Chapter 6 — pricing on frosted glass. Three packages, matching the
 * contract's exact deliverables per tier (not generic marketing bullet
 * points) — this section's job is to inform, not persuade. Pro still
 * carries the iridescent edge as the recommended tier; Custom has no
 * fixed price or feature checklist since its scope is quoted per
 * project. Add-ons stay a supporting strip, and the exclusivity
 * reminder sits where it stings: right next to the money.
 */

const TIERS = [
  {
    name: 'Starter',
    price: '$3,000',
    priceNote: 'flat rate',
    delivery: '14-day delivery',
    blurb: 'A single high-conversion landing page, built for emergency/urgent-need service calls.',
    features: [
      'Mobile-first design',
      'Sticky click-to-call bar',
      'Contact form',
      'Google Maps integration',
      'Basic local search setup',
    ],
    cta: 'Start with Starter',
  },
  {
    name: 'Pro',
    price: '$5,500',
    priceNote: 'flat rate',
    delivery: '10-day delivery',
    blurb: 'A full conversion-optimized site — 10+ pages and sections.',
    recommended: true,
    features: [
      'Interactive diagnostic / lead tool',
      'Working quote request form',
      'Service area section',
      'Review section',
      'Dispatch-style trust statistics',
      'Full local SEO setup',
      'Google Analytics',
    ],
    cta: 'Go Pro',
  },
];

const CUSTOM = {
  name: 'Custom',
  price: 'Quoted in writing',
  delivery: 'Timeline scoped per project',
  blurb: 'For multi-location sites, e-commerce, or custom integrations.',
  cta: 'Request a custom quote',
};

const ADDONS = [
  { name: 'Care Plan', price: '$250/mo', blurb: 'Hosting, updates, monitoring. Your site stays fast and never breaks quietly.' },
  { name: 'Local SEO', price: '$500/mo', blurb: 'Own your city’s searches. The site wins the click; this wins the ranking.' },
];

export default function Pricing() {
  const root = useRef(null);
  const { reducedMotion } = usePerf();

  useLayoutEffect(() => {
    if (reducedMotion) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.pr-head',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 72%' },
        }
      );
      gsap.fromTo(
        '.pr-card',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.pr-grid', start: 'top 80%' },
        }
      );
      gsap.fromTo(
        '.pr-callout',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.pr-callout', start: 'top 88%' },
        }
      );
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={root} id="pricing" className="relative scroll-mt-24 px-6 py-28 sm:py-40">
      <div className="relative mx-auto max-w-5xl">
        <div className="pr-head text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-mute">
            Pricing
          </p>
          <h2 className="text-4xl font-extrabold tracking-tightest text-ink sm:text-5xl">
            What's included. <span className="text-mute">At each price.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-mute">
            Flat rate, scope spelled out up front. No hourly billing, no invoice surprises.
          </p>
        </div>

        <div className="pr-grid mt-14 grid gap-6 md:grid-cols-2">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`pr-card glass noise relative rounded-3xl p-8 sm:p-10 ${
                tier.recommended
                  ? 'glass-iridescent shadow-[0_36px_90px_-30px_rgba(62,111,240,0.5)] md:-translate-y-3'
                  : ''
              }`}
            >
              {tier.recommended && (
                <span className="btn-liquid absolute -top-3 left-8 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider">
                  Recommended
                </span>
              )}
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-extrabold text-ink">{tier.name}</h3>
                <span className="text-xs font-semibold text-mute">{tier.delivery}</span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold tracking-tightest text-ink">{tier.price}</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-mute">
                  {tier.priceNote}
                </span>
              </div>
              <p className="mt-2 text-sm text-mute">{tier.blurb}</p>
              <ul className="mt-7 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm font-medium text-ink/90">
                    <span
                      className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-black text-white"
                      style={{
                        background: tier.recommended
                          ? 'linear-gradient(120deg, #2E5FE8, #29B8E8)'
                          : 'linear-gradient(120deg, #E8B06A, #F0A8C8)',
                      }}
                    >
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => scrollToId('cta')}
                className={`mt-9 w-full rounded-full py-3.5 text-sm font-extrabold transition-transform hover:scale-[1.02] active:scale-[0.98] ${
                  tier.recommended
                    ? 'btn-liquid btn-sheen'
                    : 'border-2 border-ink/25 text-ink hover:border-ink/50'
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Custom — no fixed price or checklist, since scope varies by
            project. A slim informative row, not a third pricing box. */}
        <div className="pr-card glass noise relative mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:p-7">
          <div>
            <div className="flex items-baseline gap-3">
              <h3 className="text-lg font-extrabold text-ink">{CUSTOM.name}</h3>
              <span className="text-xs font-semibold text-mute">{CUSTOM.delivery}</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-ink/80">{CUSTOM.price}</p>
            <p className="mt-1 text-sm text-mute">{CUSTOM.blurb}</p>
          </div>
          <button
            type="button"
            onClick={() => scrollToId('cta')}
            className="w-full shrink-0 rounded-full border-2 border-ink/25 px-6 py-3 text-sm font-extrabold text-ink transition-transform hover:scale-[1.02] hover:border-ink/50 active:scale-[0.98] sm:w-auto"
          >
            {CUSTOM.cta}
          </button>
        </div>

        {/* Add-ons — supporting strip, deliberately not a third box */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {ADDONS.map((addon) => (
            <div
              key={addon.name}
              className="pr-card glass noise flex items-start justify-between gap-4 rounded-2xl p-5"
            >
              <div>
                <div className="text-sm font-bold text-ink">
                  {addon.name}{' '}
                  <span className="text-liquid ml-1 font-extrabold">{addon.price}</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-mute">{addon.blurb}</p>
              </div>
              <span className="mt-0.5 shrink-0 rounded-full border border-ink/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-mute">
                Add-on
              </span>
            </div>
          ))}
        </div>

        {/* Exclusivity reminder, next to the money */}
        <div className="pr-callout glass glass-iridescent relative mt-10 flex items-center gap-4 rounded-2xl p-5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-accent">
            <rect x="4" y="10" width="16" height="11" rx="2.5" fill="currentColor" />
            <path d="M7.5 10V7.5a4.5 4.5 0 0 1 9 0V10" stroke="currentColor" strokeWidth="2.6" fill="none" />
          </svg>
          <p className="text-sm text-ink/90">
            Once a niche is locked in a city, it’s locked for 12 months.{' '}
            <span className="text-mute">Pricing won’t matter if a competitor gets there first.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
