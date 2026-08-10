import React, { useRef, useLayoutEffect, useState } from 'react';
import { cn } from '../lib/utils';
import { Snowflake } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const timelineEvents = [
  { time: 'Day 1 - 09:00', title: 'Registration & Check-in',  desc: 'Welcome to the Winterland.' },
  { time: 'Day 1 - 11:00', title: 'Opening Ceremony',         desc: 'The Cyber-funk begins.' },
  { time: 'Day 1 - 12:30', title: 'Hacking Starts',           desc: 'Code your way through the ice.' },
  { time: 'Day 2 - 18:00', title: 'Submission Deadline',      desc: 'Freeze your repositories.' },
  { time: 'Day 2 - 20:00', title: 'Closing & Awards',         desc: 'Glory to the champions.' },
];

export default function Timeline() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const titleRef      = useRef<HTMLHeadingElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Title entrance
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: titleRef.current, start: 'top 85%' },
        },
      );

      // Card entrances
      const cards = gsap.utils.toArray<HTMLElement>('.timeline-card');
      gsap.fromTo(
        cards,
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          force3D: true,
          scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
        },
      );

      // Active-index tracking
      cards.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'top center',
          end:   'bottom center',
          onEnter:     () => setActiveIndex(i),
          onEnterBack: () => setActiveIndex(i),
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="timeline"
      ref={containerRef}
      className="py-12 md:py-16 relative px-4 md:px-24 flex flex-col justify-center items-center"
    >
      <h2
        ref={titleRef}
        className="text-3xl sm:text-4xl md:text-5xl font-bitcount font-bold text-arctic mb-8 text-center z-10 relative opacity-0"
      >
        TIMELINE
      </h2>

      <div className="relative w-full max-w-3xl z-10">
        {/* Glowing Cyber-Glacial Conduit Path Ribbon */}
        <div className="absolute left-[1.125rem] md:left-8 top-0 bottom-0 w-[6px] md:w-2 bg-gradient-to-b from-purple-950/40 via-cyan-950/40 to-blue-950/40 rounded-full border border-white/5 overflow-hidden shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)]">
          {/* Hardware-Accelerated Flowing Neon Light Packet */}
          <div className="absolute inset-x-0 w-full h-[150px] bg-gradient-to-b from-transparent via-cyan-400/60 to-transparent animate-conduit-pulse" />
        </div>

        <div className="flex flex-col space-y-8 md:space-y-12">
          {timelineEvents.map((event, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={index}
                className="timeline-card relative pl-16 md:pl-24 flex items-center"
                style={{ willChange: 'opacity, transform' }}
              >
                {/* Node: Premium Ice Crystal Snowflake */}
                <div
                  className={cn(
                    'absolute left-[7px] md:left-[22px] w-7 h-7 rounded-full bg-[#0b0914] border flex items-center justify-center transition-all duration-500 z-20',
                    isActive
                      ? 'border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.5)] scale-110'
                      : 'border-white/10 opacity-60',
                  )}
                >
                  <Snowflake
                    className={cn(
                      'w-4 h-4 transition-all duration-750 ease-out',
                      isActive ? 'text-cyan-300 animate-spin scale-110' : 'text-cyan-800/40',
                    )}
                    style={isActive ? { animationDuration: '7s' } : undefined}
                  />
                </div>

                {/* Card — pure CSS transitions, no Framer animate loop */}
                <div
                  className={cn(
                    'p-5 md:p-6 rounded-xl w-full origin-center border transition-all duration-400 ease-out',
                    // Hover via CSS — zero JS overhead
                    'hover:scale-[1.03] hover:-translate-y-1',
                    isActive
                      ? 'scale-[1.03] opacity-100 border-neon-cyan shadow-[0_0_18px_rgba(0,240,255,0.18)] wood-texture-active'
                      : 'border-white/10 opacity-60 wood-texture',
                  )}
                >
                  <h3 className={cn('text-sm font-mono mb-2', isActive ? 'text-neon-orange' : 'text-frost')}>
                    {event.time}
                  </h3>
                  <h4 className="text-xl font-sekuya font-bold text-arctic mb-2">{event.title}</h4>
                  <p className="text-frost text-sm">{event.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
