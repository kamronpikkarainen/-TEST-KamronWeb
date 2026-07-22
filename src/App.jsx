import { useEffect } from 'react';
import { PerfProvider } from './lib/perf';
import useSmoothScroll from './lib/useSmoothScroll';
import { ScrollTrigger } from './lib/gsap';

import Backdrop from './components/Backdrop';
import IntroLoader from './components/IntroLoader';
import Nav from './components/Nav';
import Hero from './components/hero/Hero';
import Problem from './components/Problem';
import Solution from './components/Solution';
import Portfolio from './components/Portfolio';
import Operator from './components/Operator';
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
      <a
        href="#main"
        className="sr-only z-[60] rounded-full focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
      >
        Skip to content
      </a>
      <IntroLoader />
      <Backdrop />
      <Nav />
      <main id="main">
        <Hero>
          <Problem />
        </Hero>
        <Solution />
        <Portfolio />
        <Operator />
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
