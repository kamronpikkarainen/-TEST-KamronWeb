/**
 * An iPad, rendered like a studio product shot: brushed-aluminum body
 * with a highlight catching light from the upper-left (this site's
 * standing key-light convention) fading to a darker edge lower-right,
 * a thin bevel around the glass, a front camera lens on the top edge,
 * a soft diagonal glass sheen crossing the screen, and a grounded
 * multi-layer drop shadow (plus a faint contact shadow beneath).
 * Everything passed as children renders directly on the screen — here,
 * that's the Problem section — under a slim iOS-Safari-style address
 * pill. The body's rounded sides and bottom grow to fit whatever
 * height the children need.
 *
 * This component sits directly after the hero's text block in normal
 * document flow (see Hero.jsx) — its top edge is what "peeks" into the
 * bottom of the first viewport on load, and scrolling further reveals
 * the rest of it (and the Problem section inside).
 *
 * [PLACEHOLDER — point the address pill at the real domain once it's live.]
 */
export default function IpadFrame({ children, className = '' }) {
  return (
    <div className={`device-pin-target relative mx-auto w-[94%] max-w-[1360px] sm:w-[90%] ${className}`}>
      {/* Contact shadow, grounding the device on the page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-10 -bottom-5 h-8 rounded-full opacity-30 blur-xl sm:-bottom-7 sm:h-10"
        style={{ background: 'radial-gradient(ellipse, rgba(15,25,55,0.55), transparent 72%)' }}
      />

      {/* Body */}
      <div
        className="relative rounded-[2.25rem] p-[10px] sm:rounded-[2.75rem] sm:p-3"
        style={{
          background:
            'linear-gradient(135deg, #f3f4f6 0%, #dde0e4 20%, #c7cad0 42%, #b7bac1 58%, #d6d8dd 78%, #ececed 100%)',
          boxShadow:
            '0 70px 140px -40px rgba(15,25,55,0.45), 0 28px 60px -24px rgba(15,25,55,0.32), inset 0 0 0 1px rgba(255,255,255,0.6), inset 0 1px 1px rgba(255,255,255,0.8)',
        }}
      >
        {/* Camera lens, centered on the top edge */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[5px] z-10 h-[7px] w-[7px] -translate-x-1/2 rounded-full sm:top-2 sm:h-2 sm:w-2"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #4a5460, #0b0e13 70%)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.15)',
          }}
        >
          <span className="absolute left-[22%] top-[22%] h-[2px] w-[2px] rounded-full bg-white/70" />
        </div>

        {/* Screen */}
        <div
          className="relative overflow-hidden rounded-[1.7rem] bg-gradient-to-b from-[#F5F6F8] to-[#E3E5E9] sm:rounded-[2.1rem]"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.14), inset 0 2px 6px rgba(0,0,0,0.12)' }}
        >
          {/* Glass sheen — a soft diagonal highlight sweeping the screen,
              like a studio softbox reflection. Sits above the content but
              stays faint and blend-mode'd so text underneath stays legible. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20"
            style={{
              background:
                'linear-gradient(115deg, transparent 28%, rgba(255,255,255,0.5) 45%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.5) 55%, transparent 72%)',
              mixBlendMode: 'screen',
              opacity: 0.16,
            }}
          />

          {/* Slim address pill, iOS-Safari style */}
          <div className="relative z-10 flex justify-center border-b border-ink/[0.05] bg-white/60 px-5 py-2.5 sm:py-3">
            <div className="flex items-center gap-1.5 rounded-full border border-ink/10 bg-white px-4 py-1.5 sm:px-5 sm:py-2">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-mute">
                <rect x="4" y="10" width="16" height="11" rx="2.5" fill="currentColor" />
                <path d="M7.5 10V7.5a4.5 4.5 0 0 1 9 0V10" stroke="currentColor" strokeWidth="2.6" fill="none" />
              </svg>
              <span className="truncate text-[11px] font-semibold text-ink/80 sm:text-xs">
                www.kamronweb.com
              </span>
            </div>
          </div>

          {/* The "screen" content — the Problem section renders here */}
          <div className="relative z-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
