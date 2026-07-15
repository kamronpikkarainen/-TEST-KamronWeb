import { useEffect, useState } from 'react';
import { usePerf } from '../lib/perf';

/**
 * The one-time "Kamron Web" brand moment, and the whole joke of it: a
 * web studio's loading screen is a tiny browser window loading a web
 * page. The address bar types "kamronweb.com," the page below paints
 * in as a stack of skeleton blocks assembling, then that skeleton
 * dissolves into the real shimmering wordmark — built entirely from
 * the site's own liquid-glass language (`.glass`, `.glass-iridescent`,
 * `.text-liquid`, the browser-chrome dots already used on the
 * Portfolio cards) instead of a separate visual system.
 *
 * Timings are held in JS (not just CSS) so reduced-motion visitors get
 * a much shorter dwell — the global reduced-motion rule in index.css
 * already collapses the entrance animations themselves to instant, but
 * without shortening the hold too we'd still force everyone to wait
 * out a multi-beat brand sequence they can't see animate. Under
 * reduced motion the skeleton "build" is skipped entirely (see the
 * index.css override) — visitors just see the browser chrome, the
 * full URL, and the wordmark, all immediately.
 */
// Exported so Hero.jsx can time its automatic reveal to start right as
// this splash begins clearing, instead of the two running on unrelated
// clocks.
export const HOLD_MS = 3400;
const HOLD_MS_REDUCED = 500;
const EXIT_MS = 600;
const EXIT_MS_REDUCED = 200;

export default function IntroLoader() {
  const { reducedMotion } = usePerf();
  const [exiting, setExiting] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const hold = reducedMotion ? HOLD_MS_REDUCED : HOLD_MS;
    const exit = reducedMotion ? EXIT_MS_REDUCED : EXIT_MS;
    const toExit = setTimeout(() => setExiting(true), hold);
    const toUnmount = setTimeout(() => {
      setMounted(false);
      document.body.style.overflow = prevOverflow;
    }, hold + exit);

    return () => {
      clearTimeout(toExit);
      clearTimeout(toUnmount);
      document.body.style.overflow = prevOverflow;
    };
  }, [reducedMotion]);

  if (!mounted) return null;

  return (
    <div className={`loader-sheet${exiting ? ' loader-sheet--out' : ''}`} aria-hidden="true">
      <div aria-hidden="true" className="loader-ring pointer-events-none absolute" />

      <div className="loader-browser glass glass-iridescent noise relative w-[22rem] max-w-[86vw] overflow-hidden rounded-[1.5rem] sm:w-[26rem]">
        {/* Browser-chrome bar — same traffic-light + address-pill
            language as the Portfolio case-study frames. */}
        <div className="relative z-10 flex items-center gap-1.5 border-b border-ink/10 bg-white/70 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#F0A8C8]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#E8B06A]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#8FD6A8]/80" />
          <div className="ml-2 flex flex-1 items-center gap-1.5 rounded-full border border-ink/10 bg-white px-3 py-1.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-mute">
              <rect x="4" y="10" width="16" height="11" rx="2.5" fill="currentColor" />
              <path d="M7.5 10V7.5a4.5 4.5 0 0 1 9 0V10" stroke="currentColor" strokeWidth="2.6" fill="none" />
            </svg>
            <span className="flex text-[11px] font-semibold text-ink/80 sm:text-xs">
              <span className="loader-url-text">kamronweb.com</span>
              <span className="loader-caret" />
            </span>
          </div>
        </div>

        {/* The "page" — skeleton blocks assemble, then dissolve into
            the wordmark occupying the same space. */}
        <div className="relative flex h-40 flex-col items-center justify-center gap-3 px-8 sm:h-44">
          <div className="loader-block loader-block-1 h-2.5 w-3/5 rounded-full bg-ink/[0.09]" />
          <div className="loader-block loader-block-2 h-3.5 w-4/5 rounded-full bg-ink/[0.09]" />
          <div className="loader-block loader-block-3 h-2.5 w-2/5 rounded-full bg-ink/[0.09]" />
          <div className="loader-block loader-block-4 mt-1 h-6 w-1/3 rounded-full bg-ink/[0.09]" />

          <div className="loader-wordmark">
            <h1 className="text-liquid m-0 text-[clamp(1.7rem,5.5vw,2.4rem)] font-extrabold tracking-tightest">
              Kamron Web
              <span aria-hidden="true" className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />
            </h1>
            <p className="loader-tag mt-2 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-mute sm:text-[11px]">
              Premium sites for Triangle service businesses
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
