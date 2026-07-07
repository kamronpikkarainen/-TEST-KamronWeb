import { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/gsap';
import { usePerf } from '../../lib/perf';
import { scrollToId } from '../../lib/scroll';
import HeroFallback from './HeroFallback';

// The entire three.js stack lives in this lazy chunk — it never loads for
// reduced-motion / low-power visitors.
const HeroScene = lazy(() => import('./HeroScene'));

export default function Hero() {
  const root = useRef(null);
  const stage = useRef(null);
  const { reducedMotion, full } = usePerf();

  // Whether the 3D stage is on screen. When it scrolls away the canvas
  // frameloop halts, so the (expensive) transmission passes stop entirely
  // while the visitor reads the rest of the page.
  const [sceneActive, setSceneActive] = useState(true);

  // Mutable channel into the 3D scene: pointer + scroll, no re-renders.
  const motion = useRef({ mouse: { x: 0, y: 0 }, scroll: 0 });

  useEffect(() => {
    if (!full || !stage.current) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setSceneActive(entry.isIntersecting),
      { rootMargin: '200px 0px' } // resume just before it scrolls back in
    );
    io.observe(stage.current);
    return () => io.disconnect();
  }, [full]);

  // Pointer parallax only matters while the scene is on screen — skip the
  // per-move work entirely once it's paused.
  useEffect(() => {
    if (reducedMotion || !sceneActive) return undefined;
    const onPointer = (e) => {
      motion.current.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      motion.current.mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    return () => window.removeEventListener('pointermove', onPointer);
  }, [reducedMotion, sceneActive]);

  useLayoutEffect(() => {
    if (reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      // Entrance: staggered rise for copy, canvas fades up after.
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(
        '.hero-line',
        { y: 48, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.12 },
        0.15
      )
        .fromTo(
          '.hero-sub, .hero-ctas',
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.1 },
          0.7
        )
        .fromTo('.hero-stage', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.3 }, 0.5)
        .fromTo('.hero-scroll-hint', { opacity: 0 }, { opacity: 1, duration: 0.8 }, 1.6);

      // Scroll: copy parallaxes out, 3D scene receives scroll progress.
      gsap.to('.hero-copy', {
        y: -110,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '75% top',
          scrub: 0.4,
          onUpdate: (self) => {
            motion.current.scroll = self.progress;
          },
        },
      });
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={root} className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <div className="hero-copy relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 pt-32 text-center sm:pt-36">
        <p className="hero-line glass glass-iridescent relative mb-5 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide text-mute">
          Raleigh, NC · Websites for local service businesses
        </p>
        <h1 className="font-sans text-4xl font-extrabold leading-[1.05] tracking-tightest text-ink sm:text-6xl lg:text-7xl">
          <span className="hero-line block">The site that wins the job</span>
          <span className="hero-line block">
            before you <span className="text-liquid">pick up the phone.</span>
          </span>
        </h1>
        <p className="hero-sub mt-6 max-w-xl text-base text-mute sm:text-lg">
          Premium websites for HVAC, lawn care, plumbing, and contractors in the
          Triangle. One client per niche, per city — your competitors get a no.
        </p>
        <div className="hero-ctas mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => scrollToId('cta')}
            className="btn-liquid btn-sheen rounded-full px-8 py-4 text-sm font-extrabold transition-transform hover:scale-[1.04] active:scale-[0.98]"
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

      {/* 3D stage */}
      <div ref={stage} className="hero-stage relative z-0 mx-auto h-[46svh] w-full max-w-6xl sm:h-[52svh]">
        {full ? (
          <Suspense fallback={<HeroFallback />}>
            <HeroScene motion={motion} active={sceneActive} />
          </Suspense>
        ) : (
          <HeroFallback />
        )}
      </div>

      <div className="hero-scroll-hint pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex">
        <span className="text-[10px] uppercase tracking-[0.25em] text-mute/80">Scroll</span>
        <span className="h-8 w-px bg-gradient-to-b from-mute/60 to-transparent" />
      </div>
    </section>
  );
}
