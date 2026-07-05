import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { usePerf } from '../lib/perf';

/**
 * Chapter 5 — the work, on frosted glass cards.
 *
 * Tilt is CSS 3D (perspective + rotateX/rotateY), not R3F: at card size
 * a full WebGL context per card costs far more than it shows. The glare
 * that sweeps the card obeys the page's key light — a white gloss that
 * always enters from the upper-left (see src/lib/lighting.js).
 */

const PROJECTS = [
  {
    title: 'GreenEdge Lawn Co.',
    tag: 'Lawn care · Triangle, NC',
    featured: true,
    body: 'Design and build, end to end. Made to turn “lawn care near me” into scheduled quotes.',
    // [PLACEHOLDER — real GreenEdge performance numbers go here]
    metrics: '[PLACEHOLDER — real GreenEdge performance numbers]',
  },
  {
    // [PLACEHOLDER — Carolina Climate Elite case study]
    title: 'Carolina Climate Elite',
    tag: 'HVAC',
    placeholder: true,
  },
  {
    // [PLACEHOLDER — AERLUME case study]
    title: 'AERLUME',
    tag: 'Contractor',
    placeholder: true,
  },
];

function TiltCard({ children, className = '' }) {
  const wrap = useRef(null);
  const inner = useRef(null);
  const glare = useRef(null);
  const { reducedMotion } = usePerf();

  useLayoutEffect(() => {
    if (reducedMotion) return undefined;
    // Skip tilt on touch devices — hover doesn't exist there.
    if (window.matchMedia('(pointer: coarse)').matches) return undefined;

    const el = wrap.current;
    const card = inner.current;
    const sheen = glare.current;

    const xTo = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3.out' });

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      xTo(px * 14);
      yTo(-py * 10);
      if (sheen) {
        sheen.style.opacity = '1';
        sheen.style.background = `radial-gradient(circle at ${(px + 0.5) * 100}% ${
          (py + 0.5) * 100
        }%, rgba(255,255,255,0.65), transparent 55%)`;
      }
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
      if (sheen) sheen.style.opacity = '0';
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [reducedMotion]);

  return (
    <div ref={wrap} className={className} style={{ perspective: '1100px' }}>
      <div
        ref={inner}
        className="glass glass-iridescent noise relative h-full overflow-hidden rounded-3xl"
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        <div
          ref={glare}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300"
        />
        {children}
      </div>
    </div>
  );
}

export default function Portfolio() {
  const root = useRef(null);
  const { reducedMotion } = usePerf();

  useLayoutEffect(() => {
    if (reducedMotion) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.pf-head',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 72%' },
        }
      );
      gsap.fromTo(
        '.pf-card',
        { y: 70, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.pf-grid', start: 'top 78%' },
        }
      );
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  const [featured, ...rest] = PROJECTS;

  return (
    <section ref={root} id="work" className="relative scroll-mt-24 px-6 py-28 sm:py-40">
      <div className="mx-auto max-w-5xl">
        <div className="pf-head">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-mute">
            The work
          </p>
          <h2 className="text-4xl font-extrabold tracking-tightest text-ink sm:text-5xl">
            Built to win work. <span className="text-mute">Not design awards.</span>
          </h2>
        </div>

        <div className="pf-grid mt-14 grid gap-6 lg:grid-cols-2">
          {/* Featured: GreenEdge — the real one */}
          <TiltCard className="pf-card lg:col-span-2">
            <div className="grid gap-0 md:grid-cols-2">
              {/* Mini live-style preview of the GreenEdge homepage.
                  [PLACEHOLDER — swap for a real screenshot of the live site] */}
              <div className="relative min-h-[260px] overflow-hidden rounded-r-none bg-gradient-to-b from-[#F2F6EE] to-[#E4EDE0] p-6">
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
                  style={{
                    background:
                      'repeating-linear-gradient(100deg, #7FB88A 0 14%, #6BA877 14% 28%)',
                  }}
                />
              </div>

              <div className="flex flex-col justify-between p-7 sm:p-9">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-extrabold text-ink">{featured.title}</h3>
                    <span className="btn-liquid rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      Live client
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-mute">{featured.tag}</p>
                  <p className="mt-5 text-sm leading-relaxed text-mute">{featured.body}</p>
                  <p className="mt-4 rounded-xl border border-dashed border-ink/20 px-3 py-2 text-xs text-mute/80">
                    {featured.metrics}
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
          </TiltCard>

          {rest.map((p) => (
            <TiltCard key={p.title} className="pf-card">
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
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
