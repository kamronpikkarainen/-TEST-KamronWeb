/**
 * The laptop as a screen you scroll inside of. A dark bezel frames a
 * browser chrome bar (traffic lights + "Kamron Web" tab + address bar
 * reading www.kamronweb.com), and everything passed as children renders
 * on the "screen" beneath it — the hero content first, then the Problem
 * section immediately after, with no seam between them. The bezel's
 * rounded sides and bottom simply grow to fit whatever height the
 * children need, so this stays robust if that content changes later.
 *
 * [PLACEHOLDER — point the address bar at the real domain once it's live.]
 */
export default function LaptopFrame({ children }) {
  return (
    <div className="relative mx-auto w-[94%] max-w-[1360px] sm:w-[90%]">
      {/* Webcam notch, sitting on the bezel above the screen's top edge */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-2 z-10 h-2 w-2 -translate-x-1/2 rounded-full bg-[#2A2F36] sm:top-2.5"
      >
        <span className="absolute inset-0 m-auto h-[3px] w-[3px] rounded-full bg-accent/60" />
      </div>

      {/* Bezel */}
      <div className="rounded-[1.75rem] bg-gradient-to-b from-[#171A1F] to-[#0C0F13] p-2.5 shadow-[0_50px_120px_-40px_rgba(30,40,70,0.45)] sm:rounded-[2.25rem] sm:p-3.5">
        {/* Screen */}
        <div className="overflow-hidden rounded-[1.35rem] bg-gradient-to-b from-[#EFF1F4] to-[#DFE1E5] sm:rounded-[1.75rem]">
          {/* Browser chrome bar */}
          <div className="flex items-center gap-4 border-b border-ink/[0.06] bg-white/70 px-5 py-3.5 sm:gap-6 sm:px-8 sm:py-4">
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57] sm:h-3 sm:w-3" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E] sm:h-3 sm:w-3" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28C840] sm:h-3 sm:w-3" />
            </div>
            <div className="hidden shrink-0 items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-ink shadow-sm sm:flex">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Kamron Web
            </div>
            <div className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 sm:px-5 sm:py-2.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-mute">
                <rect x="4" y="10" width="16" height="11" rx="2.5" fill="currentColor" />
                <path d="M7.5 10V7.5a4.5 4.5 0 0 1 9 0V10" stroke="currentColor" strokeWidth="2.6" fill="none" />
              </svg>
              <span className="truncate text-xs font-semibold text-ink/80 sm:text-sm">
                www.kamronweb.com
              </span>
            </div>
          </div>

          {/* The "screen" — hero content, then the Problem section, no seam */}
          <div className="relative">{children}</div>
        </div>
      </div>
    </div>
  );
}
