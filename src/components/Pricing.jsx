import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { usePerf } from '../lib/perf';
import { scrollToId } from '../lib/scroll';

/**
 * Chapter 6 — pricing on frosted glass. Two tiers (Pro carries the
 * iridescent edge and the liquid gradient), add-ons as a supporting
 * strip rather than a competing box, and the exclusivity reminder
 * where it stings: right next to the money.
 */

const TIERS = [
  {
    name: 'Starter',
    price: '$3,000',
    delivery: '14-day delivery',
    blurb: 'The core marketing site, done right.',
    features: [
      'Conversion-focused layout',
      'Mobile-optimized, fast',
      'Copy that sounds like you',
      'Launch on day 14, guaranteed',
    ],
    cta: 'Start with Starter',
  },
  {
    name: 'Pro',
    price: '$5,500',
    delivery: '10-day delivery',
    blurb: 'More site, less waiting.',
    recommended: true,
    features: [
      'Everything in Starter',
      'More custom sections',
      'Priority build queue',
      'Launch on day 10, guaranteed',
    ],
    cta: 'Go Pro',
  },
];

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
        <div className="pr-head">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-mute">
            Pricing
          </p>
          <h2 className="text-4xl font-extrabold tracking-tightest text-ink sm:text-5xl">
            Two ways in. <span className="text-mute">Both flat.</span>
          </h2>
          <p className="mt-5 max-w-md text-mute">
            No hourly billing, no scope creep, no invoice surprises. The price is the price.
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
              <div className="mt-4 text-5xl font-extrabold tracking-tightest text-ink">
                {tier.price}
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
