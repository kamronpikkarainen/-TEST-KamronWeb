import { useEffect, useState } from 'react';
import { usePerf } from '../lib/perf';

/**
 * The one-time "Kamron Web" brand moment: a blueprint/technical-drawing
 * take on the wordmark, shown as a full-screen splash the instant the
 * page loads, then dismissed on its own. This replaces the old inline
 * ink-splash + wordmark that used to sit in the Hero — that brand
 * introduction now happens here, once, before the site itself appears.
 *
 * Timings are held in JS (not just CSS) so reduced-motion visitors get a
 * much shorter dwell — the global reduced-motion rule in index.css
 * already collapses the entrance/exit animations themselves to instant,
 * but without shortening the hold too we'd still force everyone to wait
 * out a ~2s brand beat they can't see animate.
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
      <div className="loader-grid" />

      <span className="loader-reg loader-reg-tl" />
      <span className="loader-reg loader-reg-tr" />
      <span className="loader-reg loader-reg-bl" />
      <span className="loader-reg loader-reg-br" />

      <div className="loader-anno loader-anno-tl">
        SHEET&nbsp;01&nbsp;/&nbsp;WORDMARK
        <br />
        SCALE&nbsp;1&nbsp;:&nbsp;1
      </div>
      <div className="loader-anno loader-anno-tr">
        RALEIGH,&nbsp;NC
        <br />
        35.7796°&nbsp;N, 78.6382°&nbsp;W
      </div>
      <div className="loader-anno loader-anno-br">
        DRAWN&nbsp;FLAT&nbsp;RATE
        <br />
        FIXED&nbsp;DEADLINE
      </div>

      <div className="loader-dim">
        <div className="loader-dim-line" />
        <div className="loader-dim-label">14-DAY BUILD</div>
      </div>

      <div className="loader-mark-wrap">
        <h1 className="loader-mark">Kamron Web</h1>
        <p className="loader-tagline">
          Premium sites for <b>Triangle</b> service businesses
        </p>
      </div>

      <div className="loader-stamp">
        <span>
          <b>1 / CITY</b>PER&nbsp;NICHE
        </span>
      </div>
    </div>
  );
}
