import { useRef } from 'react';
import useReveal from '../lib/useReveal';

/**
 * Chapter 5 — the work. Calm frosted cards with a gentle hover-lift
 * (no 3D tilt). GreenEdge is the real featured build; the other two are
 * clearly marked placeholders.
 */

export default function Portfolio() {
  const root = useRef(null);
  useReveal(root);

  return (
    <section ref={root} id="work" className="relative scroll-mt-24 px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="reveal mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-mute">
            The work
          </p>
          <h2 className="reveal text-4xl font-extrabold tracking-tightest text-ink sm:text-5xl">
            Built to win work. <span className="text-mute">Not design awards.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {/* Featured: GreenEdge — the real one */}
          <div className="reveal glass glass-iridescent relative overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_40px_80px_-30px_rgba(50,70,110,0.35)] lg:col-span-2">
            <div className="grid gap-0 md:grid-cols-2">
              {/* [PLACEHOLDER — swap for a real screenshot of the live site] */}
              <div className="relative min-h-[260px] overflow-hidden bg-gradient-to-b from-[#F2F6EE] to-[#E4EDE0] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-base font-extrabold text-[#20402A]">GreenEdge</div>
                    <div className="text-[9px] font-semibold tracking-widest text-[#4E8F5C]">
                      LAWN CO.
                    </div>
                  </div>
                  <div className="rounded-full bg-[#3E7C4F] px-3 py-1 text-[10px] font-bold text-white">
                    Get a quote
                  </div>
                </div>
                <div className="mt-6 text-2xl font-extrabold leading-tight text-[#1C3524]">
                  A sharper lawn,
                  <br />
                  handled.
                </div>
                <div className="mt-4 inline-block rounded-full bg-[#3E7C4F] px-4 py-1.5 text-[10px] font-bold text-white">
                  Book my yard
                </div>
                <div
                  aria-hidden="true"
                  className="absolute -bottom-6 -right-6 h-36 w-44 rounded-xl opacity-90"
                  style={{ background: 'repeating-linear-gradient(100deg, #7FB88A 0 14%, #6BA877 14% 28%)' }}
                />
              </div>

              <div className="flex flex-col justify-between p-7 sm:p-9">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-extrabold text-ink">GreenEdge Lawn Co.</h3>
                    <span className="btn-liquid rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      Live client
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-mute">Lawn care · Triangle, NC</p>
                  <p className="mt-5 text-sm leading-relaxed text-mute">
                    Design and build, end to end. Made to turn “lawn care near me” into scheduled
                    quotes.
                  </p>
                  <p className="mt-4 rounded-xl border border-dashed border-ink/20 px-3 py-2 text-xs text-mute/80">
                    [PLACEHOLDER — real GreenEdge performance numbers]
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex h-16 w-24 items-center justify-center rounded-lg border border-dashed border-ink/20 text-center text-[9px] leading-tight text-mute/70">
                    [PLACEHOLDER —<br />
                    before screenshot]
                  </div>
                  <p className="text-xs text-mute">
                    The before/after tells the story. Old site screenshot coming.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {[
            { title: 'Carolina Climate Elite', tag: 'HVAC' },
            { title: 'AERLUME', tag: 'Contractor' },
          ].map((p) => (
            <div
              key={p.title}
              className="reveal glass glass-iridescent relative overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_40px_80px_-30px_rgba(50,70,110,0.35)]"
            >
              <div className="flex h-full min-h-[240px] flex-col justify-between p-7 sm:p-9">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-extrabold text-ink">{p.title}</h3>
                    <span className="rounded-full border border-ink/15 bg-white/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-mute">
                      Placeholder
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-mute">{p.tag}</p>
                </div>
                <div className="mt-8 flex h-28 items-center justify-center rounded-2xl border border-dashed border-ink/20 text-xs text-mute/70">
                  [PLACEHOLDER — {p.title} case study]
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
