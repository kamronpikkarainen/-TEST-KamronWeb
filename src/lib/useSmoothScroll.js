import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';
import { usePerf } from './perf';
import { setLenis } from './scroll';

/**
 * Lenis smooth scroll, driven by the GSAP ticker so ScrollTrigger and the
 * scroll position never disagree by a frame. Disabled entirely under
 * prefers-reduced-motion — the page then scrolls natively. Also skipped
 * on touch devices: Lenis only smooths wheel input (syncTouch is off),
 * so on a phone it buys nothing but a permanent per-frame rAF loop —
 * one more continuously-running cost stacked on top of scroll-linked
 * GSAP/ScrollTrigger work and the .glass panels' backdrop-filter, which
 * is already the more likely source of mobile jank. Native touch
 * scrolling is what mobile visitors get instead.
 */
export default function useSmoothScroll() {
  const { reducedMotion } = usePerf();

  useEffect(() => {
    if (reducedMotion) return undefined;
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches) {
      return undefined;
    }

    const lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, [reducedMotion]);
}
