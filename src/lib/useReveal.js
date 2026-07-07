import { useLayoutEffect } from 'react';
import { gsap } from './gsap';
import { usePerf } from './perf';

/**
 * The whole site's only motion now: elements marked `.reveal` calmly
 * fade + rise in when they enter the viewport. No pins, no scrubs, no
 * 3D — just the quiet entrance that matches the hero/CTA aesthetic.
 * Under reduced-motion nothing runs and everything is simply visible.
 */
export default function useReveal(rootRef, opts = {}) {
  const { selector = '.reveal', y = 32, stagger = 0.09, start = 'top 82%' } = opts;
  const { reducedMotion } = usePerf();

  useLayoutEffect(() => {
    if (reducedMotion || !rootRef.current) return undefined;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray(selector);
      items.forEach((el) => {
        gsap.from(el, {
          y,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, [reducedMotion, rootRef, selector, y, stagger, start]);
}
