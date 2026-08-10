import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const sponsors = [
  { name: 'LIC INDIA', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSWbhBljZdHq-LywNk_NaBv-kJOfSRioqLtlkON1dmiA&s=10' },
  { name: 'DEV FOLIO', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrrlKHA1hqab7jx2ftKqk40hGq392CzHJw4iqDycZQ3g&s' },
  { name: 'META',      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJVoN8wMAMjcjFl3MR_hsE-15sJ39SkDTPDnNULMy__oe9ZWoj2gYmOahd&s=10' },
  { name: 'SBI',       img: 'https://static.vecteezy.com/system/resources/previews/020/336/288/non_2x/sbi-logo-sbi-icon-free-free-vector.jpg' },
  { name: 'MLH',       img: 'https://assets.mlh.io/cms/327286443_712889040337850_7309846861434542945_n_2_84b9b3998b.jpg' },
];

export default function Sponsors() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrappersRef  = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const wrappers = wrappersRef.current.filter(Boolean) as HTMLDivElement[];
      if (wrappers.length === 0) return;

      // ─── Stacked-card scroll ─────────────────────────────────────────────
      // Each card scrolls out sequentially, revealing the one below.
      // scrub:1 = one second of smoothing behind the scrollbar.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${wrappers.length * 25}%`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 1,
        },
      });

      // Append each exit sequentially (no stagger position args —
      // they naturally chain one after another in the timeline)
      wrappers.forEach((wrapper, index) => {
        if (index < wrappers.length - 1) {
          tl.to(wrapper, {
            yPercent: -110,
            scale: 0.9,
            opacity: 0,
            ease: 'power2.inOut',
          });
        }
      });

      // ─── Entrance: title slides in ───────────────────────────────────────
      gsap.fromTo(
        '.sponsors-title',
        { x: 80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          },
        },
      );

      // ─── Entrance: cards stagger up ──────────────────────────────────────
      // Use gsap.set first to ensure the starting state is applied
      // before the ScrollTrigger fires (avoids flash-of-hidden-content).
      gsap.set(wrappers, { y: 40, opacity: 0 });
      gsap.to(wrappers, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.07,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          // Once triggered, do not reverse — cards stay visible
          once: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="sponsors"
      ref={containerRef}
      className="h-screen w-full flex flex-col items-center justify-center px-4 md:px-12 relative z-10 overflow-hidden pt-20 md:pt-24"
    >
      <div className="w-full max-w-5xl h-full max-h-[85vh] md:max-h-[80vh] relative flex flex-col items-center justify-center">

        {/* Title */}
        <div className="mb-4 sm:mb-8 md:mb-12 text-center sponsors-title">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-sekuya font-bold text-white mb-2 md:mb-4 tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
            SPONSORS
          </h2>
          <div className="h-1 w-20 md:w-24 mx-auto bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full" />
        </div>

        {/* Stacked cards */}
        <div
          className="relative w-[85%] sm:w-[70%] md:w-full max-w-[280px] sm:max-w-[320px] md:max-w-md aspect-[4/5] md:aspect-square mx-auto mt-4 md:mt-0"
          style={{ perspective: '1200px' }}
        >
          {sponsors.map((sponsor, index) => (
            <div
              key={index}
              ref={el => { wrappersRef.current[index] = el; }}
              // IMPORTANT: no inline `transform` here — let GSAP own the transform
              className="absolute top-0 left-0 w-full h-full will-change-transform"
              style={{
                zIndex: sponsors.length - index,
                marginTop: `${index * 16}px`,
                transformOrigin: 'center bottom',
              }}
            >
              <div className="sponsor-card group w-full h-full rounded-2xl md:rounded-3xl flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative transition-shadow duration-500 hover:shadow-[0_0_40px_rgba(0,240,255,0.25),0_20px_50px_rgba(0,0,0,0.5)] hover:border-white/40">
                {/* Subtle top highlight */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/8 to-transparent pointer-events-none" />
                {/* Hover glow — pure CSS, compositor-only */}
                <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan via-white/10 to-neon-purple opacity-0 group-hover:opacity-25 blur-xl transition-opacity duration-500 pointer-events-none" />

                <div className="w-full h-full flex flex-col items-center justify-center relative z-10 transition-transform duration-400 group-hover:scale-[1.02]">
                  <div className="w-full h-24 sm:h-32 md:h-48 mb-4 sm:mb-6 flex items-center justify-center transition-transform duration-400 group-hover:-translate-y-1">
                    <img
                      src={sponsor.img}
                      alt={sponsor.name}
                      className="w-auto h-full max-w-[80%] max-h-[80%] object-contain drop-shadow-md rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-lg sm:text-xl md:text-2xl font-sekuya text-white tracking-[0.15em] uppercase opacity-90 text-center transition-opacity duration-300 group-hover:opacity-100">
                    {sponsor.name}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
