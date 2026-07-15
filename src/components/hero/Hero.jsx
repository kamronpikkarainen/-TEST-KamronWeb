import { scrollToId } from '../../lib/scroll';
import IpadFrame from './IpadFrame';

/**
 * Hero — top to bottom: the giant headline; the pitch line and CTA
 * buttons underneath it; then the iPad, which the Problem section
 * renders inside of (IpadFrame takes it as children). No opening
 * animation — everything here is visible in its final position the
 * instant the page renders.
 */
export default function Hero({ children }) {
  return (
    <section className="relative overflow-hidden px-4 pb-0 pt-20 sm:px-6 sm:pt-24">
      {/* Soft prismatic glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 40% at 50% 18%, rgba(53,200,232,0.12), transparent 62%), radial-gradient(ellipse 46% 34% at 30% 45%, rgba(139,124,247,0.09), transparent 60%), radial-gradient(ellipse 42% 30% at 70% 40%, rgba(240,168,200,0.09), transparent 60%)',
        }}
      />

      <div className="relative z-10">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="mt-8 font-extrabold leading-[1.05] tracking-tightest text-ink sm:mt-10">
            <span className="block text-[clamp(2rem,6vw,4.25rem)]">The site that wins the job</span>
            <span className="block text-[clamp(2rem,6vw,4.25rem)]">
              before you <span className="text-liquid">pick up the phone.</span>
            </span>
          </h1>
          <div className="mx-auto mt-7 flex max-w-xl flex-col items-center">
            <p className="text-sm text-mute sm:text-base">
              Premium websites for HVAC, lawn care, plumbing, and contractors in the Triangle. One
              client per niche, per city.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => scrollToId('cta')}
                className="btn-liquid btn-sheen rounded-full px-8 py-3.5 text-sm font-extrabold transition-transform hover:scale-[1.04] active:scale-[0.98]"
              >
                Book a call
              </button>
              <button
                type="button"
                onClick={() => scrollToId('work')}
                className="glass rounded-full px-7 py-3.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
              >
                See the work
              </button>
            </div>
          </div>
        </div>

        <div className="h-10 sm:h-14" />

        <IpadFrame>{children}</IpadFrame>
      </div>
    </section>
  );
}
