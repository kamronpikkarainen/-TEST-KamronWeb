import { scrollToId } from '../lib/scroll';

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <div className="flex items-baseline gap-1 font-extrabold tracking-tight text-ink">
              Kamron Web
              <span className="h-1 w-1 rounded-full bg-accent" />
            </div>
            <p className="mt-1 text-xs text-mute">
              One client per niche, per city — locked for 12 months.
            </p>
          </div>
          <nav className="flex items-center gap-5 text-xs font-semibold text-mute">
            <button type="button" onClick={() => scrollToId('work')} className="transition-colors hover:text-ink">
              Work
            </button>
            <button type="button" onClick={() => scrollToId('pricing')} className="transition-colors hover:text-ink">
              Pricing
            </button>
            <button type="button" onClick={() => scrollToId('cta')} className="transition-colors hover:text-ink">
              Book a call
            </button>
          </nav>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-ink/[0.07] pt-6 text-xs text-mute sm:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <span>Raleigh, NC</span>
            <a href="tel:+19194533252" className="font-semibold transition-colors hover:text-ink">
              (919) 453-3252
            </a>
          </div>
          <span>© {new Date().getFullYear()} Kamron Web</span>
        </div>
      </div>
    </footer>
  );
}
