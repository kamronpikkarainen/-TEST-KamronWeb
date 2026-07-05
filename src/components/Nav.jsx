import { scrollToId } from '../lib/scroll';

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="noise mx-auto mt-4 flex w-[calc(100%-2rem)] max-w-5xl items-center justify-between rounded-full border border-white/10 bg-panel/60 py-2.5 pl-5 pr-2.5 backdrop-blur-xl">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-baseline gap-1 text-sm font-extrabold tracking-tight text-ink"
          aria-label="Kamron Web — back to top"
        >
          Kamron Web
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        </button>
        <nav className="hidden items-center gap-6 text-xs font-medium text-mute md:flex">
          <button type="button" onClick={() => scrollToId('work')} className="transition-colors hover:text-ink">
            Work
          </button>
          <button type="button" onClick={() => scrollToId('pricing')} className="transition-colors hover:text-ink">
            Pricing
          </button>
        </nav>
        <button
          type="button"
          onClick={() => scrollToId('cta')}
          className="rounded-full bg-accent px-5 py-2 text-xs font-bold text-[#0A0D12] transition-transform hover:scale-[1.05] active:scale-[0.97]"
        >
          Book a call
        </button>
      </div>
    </header>
  );
}
