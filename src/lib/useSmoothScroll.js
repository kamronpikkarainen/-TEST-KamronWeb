import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';
import { usePerf } from './perf';
import { setLenis } from './scroll';

/**
 * Lenis smooth scroll, driven by the GSAP ticker so ScrollTrigger and the
 * scroll position never disagree by a frame. Disabled entirely under
 * prefers-reduced-motion — the page then scrolls natively.
 */
export default function useSmoothScroll() {
  const { reducedMotion } = usePerf();

  useEffect(() => {
    if (reducedMotion) return undefined;

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
