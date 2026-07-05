import { createContext, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Capability detection for the genuine reduced-motion / low-power fallback.
 *
 * - reducedMotion: user asked for it (prefers-reduced-motion). All GSAP
 *   animation and smooth scroll are disabled; every section renders its
 *   final, fully-visible state (that's the default DOM state everywhere —
 *   animations use fromTo and only ever run when allowed).
 * - full: whether the WebGL hero scene runs. Requires WebGL, no
 *   reduced-motion request, and a device that isn't clearly low-power.
 *   When false, the hero renders a CSS-only 3D mockup instead.
 */
function detect() {
  if (typeof window === 'undefined') {
    return { reducedMotion: false, full: false };
  }
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const nav = navigator;
  const saveData = !!(nav.connection && nav.connection.saveData);
  const lowMemory = nav.deviceMemory !== undefined && nav.deviceMemory <= 2;
  const lowCpu = nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 2;
  const lowPower = saveData || lowMemory || lowCpu;

  let webgl = false;
  try {
    const c = document.createElement('canvas');
    webgl = !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    webgl = false;
  }

  return { reducedMotion, full: webgl && !reducedMotion && !lowPower };
}

const PerfContext = createContext({ reducedMotion: false, full: false });

export function PerfProvider({ children }) {
  const [caps, setCaps] = useState(detect);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setCaps(detect());
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const value = useMemo(() => caps, [caps]);
  return <PerfContext.Provider value={value}>{children}</PerfContext.Provider>;
}

export function usePerf() {
  return useContext(PerfContext);
}
