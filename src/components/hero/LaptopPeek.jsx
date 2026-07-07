/**
 * The laptop as it was originally: peeking up over the bottom edge of
 * the hero, showing only its top bezel and browser chrome bar
 * (traffic lights, "Kamron Web" tab, address bar reading
 * www.kamronweb.com) before it's cropped off by the section's bottom
 * edge. It sits in front of the headline, so its top edge occludes the
 * headline's last line.
 *
 * [PLACEHOLDER — point the address bar at the real domain once it's live.]
 */
export default function LaptopPeek({ className = '' }) {
  return (
    <div className={className}>
      <div className="rounded-[1.75rem] bg-gradient-to-b from-[#171A1F] to-[#0C0F13] p-2.5 shadow-[0_-30px_80px_-30px_rgba(30,40,70,0.4)] sm:rounded-[2.25rem] sm:p-3.5">
        <div className="overflow-hidden rounded-[1.35rem] bg-gradient-to-b from-[#EFF1F4] to-[#DFE1E5] sm:rounded-[1.75rem]">
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
          {/* A sliver of screen body, just enough to read as a laptop before it crops off */}
          <div className="h-24 sm:h-40" />
        </div>
      </div>
    </div>
  );
}
