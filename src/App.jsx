import { useEffect } from 'react';
import { PerfProvider } from './lib/perf';
import useSmoothScroll from './lib/useSmoothScroll';
import { ScrollTrigger } from './lib/gsap';

import Nav from './components/Nav';
import Hero from './components/hero/Hero';
import Problem from './components/Problem';
import Solution from './components/Solution';
import Exclusivity from './components/Exclusivity';
import Portfolio from './components/Portfolio';
import Pricing from './components/Pricing';
import CTA from './components/CTA';
import Footer from './components/Footer';

function Page() {
  useSmoothScroll();

  // Re-measure pin distances once fonts/layout settle.
  useEffect(() => {
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Exclusivity />
        <Portfolio />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <PerfProvider>
      <Page />
    </PerfProvider>
  );
}
