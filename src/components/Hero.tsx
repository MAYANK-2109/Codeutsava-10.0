import React from 'react';

export default function Hero() {
  return (
    <section id="home" className="min-h-[100dvh] flex items-center justify-center px-4 md:px-12 lg:px-24">
      <div className="w-full text-center flex flex-col items-center mt-12 md:mt-0">
        <h1 className="text-[4.5rem] sm:text-[5.5rem] md:text-[7rem] lg:text-[9rem] font-bitcount font-semibold text-white tracking-tighter [text-shadow:0_0_15px_rgba(255,255,255,0.4),3px_4px_15px_rgba(255,0,127,0.7),-3px_-3px_15px_rgba(0,240,255,0.7)] leading-none relative flex flex-col items-center">
          <span>CODE</span>
          <span>UTSAVA</span>
          <span className="text-[5rem] sm:text-[6.5rem] md:text-[8rem] lg:text-[10rem] mt-2 md:mt-4">10.0</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mt-8 md:mt-10 text-arctic font-sekuya tracking-[0.3em] uppercase drop-shadow-lg">
          Code Innovate Celebrate
        </p>
      </div>
    </section>
  );
}
