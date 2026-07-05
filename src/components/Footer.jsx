export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-xs text-mute sm:flex-row">
        <div className="flex items-baseline gap-1 font-extrabold tracking-tight text-ink">
          Kamron Web
          <span className="h-1 w-1 rounded-full bg-accent" />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <span>Raleigh, NC</span>
          <a href="tel:+19194533252" className="transition-colors hover:text-ink">
            (919) 453-3252
          </a>
          {/* [PLACEHOLDER — real Instagram handle] */}
          <span className="text-mute/60">[PLACEHOLDER — Instagram]</span>
        </div>
        <span>© {new Date().getFullYear()} Kamron Web</span>
      </div>
    </footer>
  );
}
