import React, { useRef, useEffect } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import Stats from './Stats';
import Prizes from './Prizes';
import Sponsors from './Sponsors';
import Timeline from './Timeline';
import GuidelinesFaq from './GuidelinesFaq';
import Footer from './Footer';
import ThreeBackground from './ThreeBackground';
import CursorTrail from './CursorTrail';
import ClickEffect from './ClickEffect';
import MusicPlayer from './MusicPlayer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Global GSAP defaults — prevent layout thrash
gsap.defaults({ force3D: true });

export default function MainSite() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Defer refresh until after paint so the pinned Sponsors section
    // can correctly measure DOM heights.
    const id = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div ref={containerRef} id="main-scroll-container" className="relative w-full overflow-hidden">
      <CursorTrail />
      <ClickEffect />
      <MusicPlayer />

      {/* Video Background — lower opacity to reduce GPU blend cost */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-black">
        <video
          className="w-full h-full object-cover"
          style={{ opacity: 0.45 }}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          src="https://raw.githubusercontent.com/MAYANK-2109/inviti/main/src/assets/codeutsava.mp4"
        />
      </div>

      {/* 3D Background — fixed, pointer-events-none, its own layer */}
      <div className="fixed inset-0 z-10 pointer-events-none" style={{ willChange: 'transform' }}>
        <ThreeBackground />
      </div>

      <Navbar />

      {/* Main Content — sections use layout containment to limit reflow scope */}
      <main className="relative z-20">
        <Hero />
        <About />
        <Stats />
        <Prizes />
        <Sponsors />
        <Timeline />
        <GuidelinesFaq />
        <Footer />
      </main>
    </div>
  );
}
