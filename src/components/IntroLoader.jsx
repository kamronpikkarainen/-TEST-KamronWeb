import { useEffect, useState } from 'react';
import { usePerf } from '../lib/perf';

/**
 * The one-time "Kamron Web" brand moment: a full-screen boot sequence
 * shown the instant the page loads, then dismissed on its own. Built
 * from the same liquid-glass vocabulary as the rest of the site
 * (`.glass`, `.glass-iridescent`, `.text-liquid`) instead of a
 * separate visual system, so it reads as the site's own first frame
 * rather than a splash bolted on front of it.
 *
 * Timings are held in JS (not just CSS) so reduced-motion visitors get
 * a much shorter dwell — the global reduced-motion rule in index.css
 * already collapses the entrance animations themselves to instant, but
 * without shortening the hold too we'd still force everyone to wait
 * out a ~2.6s brand beat they can't see animate.
 */
// Exported so Hero.jsx can time its automatic reveal to start right as
// this splash begins clearing, instead of the two running on unrelated
// clocks.
export const HOLD_MS = 2650;
const HOLD_MS_REDUCED = 450;
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

      <div className="loader-card glass glass-iridescent noise relative flex flex-col items-center rounded-[2rem] px-12 py-11 sm:px-16 sm:py-14">
        <h1 className="text-liquid m-0 text-[clamp(2rem,6.5vw,3.4rem)] font-extrabold tracking-tightest">
          Kamron Web
          <span aria-hidden="true" className="ml-2 inline-block h-2 w-2 rounded-full bg-accent align-middle" />
        </h1>
        <p className="loader-tag mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-mute sm:text-xs">
          Premium sites for <span className="text-ink/80">Triangle</span> service businesses
        </p>

        <div className="loader-track relative mt-8 h-[3px] w-40 overflow-hidden rounded-full bg-ink/10 sm:w-52">
          <div className="loader-fill absolute inset-0 rounded-full" />
        </div>
      </div>
    </div>
  );
}
