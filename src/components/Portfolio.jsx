import { useRef } from 'react';
import useReveal from '../lib/useReveal';
import greenedgeShot from '../assets/portfolio/greenedge.webp';

/**
 * Chapter 5 — the work. GreenEdge is the one real, live build, so it's
 * the only card: a calm frosted panel, a real screenshot of the site,
 * and the whole thing links out to the live GreenEdge site.
 */

// [PLACEHOLDER — point this at the real, live GreenEdge Lawn Co. site.]
const GREENEDGE_URL = 'https://greenedgelawnco.com';

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

        <a
          href={GREENEDGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="reveal glass glass-iridescent relative mt-14 block overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_40px_80px_-30px_rgba(50,70,110,0.35)]"
        >
          <div className="grid gap-0 md:grid-cols-2">
            <div className="relative min-h-[260px] overflow-hidden bg-[#0F1A12]">
              <img
                src={greenedgeShot}
                alt="GreenEdge Lawn Co. landing page"
                className="absolute inset-0 h-full w-full object-cover object-top"
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
                  Design and build, end to end. Made to turn "lawn care near me" into scheduled
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
        </a>
      </div>
    </section>
  );
}
