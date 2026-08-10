import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) return; // already scheduled
      rafId = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 50);
        rafId = null;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const links = ['Home', 'About', 'Stats', 'Prizes', 'Sponsors', 'Timeline', 'Guidelines', 'FAQ'];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-black/20 backdrop-blur-md border-b border-white/10 py-3 shadow-lg' : 'bg-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-12 flex items-center justify-between relative">
        <div className="flex items-center gap-2 md:gap-4 shrink-1 min-w-0">
          <img 
            src="https://www.nitrr.ac.in/images/nitrr_new_logo_new.png" 
            alt="NITRR Logo" 
            className="h-7 sm:h-10 md:h-12 w-auto object-contain shrink"
          />
          <div className="h-5 md:h-8 w-px bg-white/20 shrink-0"></div>
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTa4r-FvnJb0n0mSYig2njinB_Ds0xvvi8BoNF1d8oTCQm16HKzC853liA&s=10" 
            alt="TCP Logo" 
            className="h-7 sm:h-10 md:h-12 w-auto object-contain rounded-sm md:rounded-md shrink-0"
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden xl:flex space-x-6">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(' ', '-')}`}
              className="text-sm font-sekuya tracking-widest uppercase text-arctic hover:text-white transition-colors duration-200 drop-shadow-md"
            >
              {link}
            </a>
          ))}
        </div>

        <div className="hidden xl:block w-[100px]"></div>

        {/* Mobile Toggle */}
        <button 
          className="xl:hidden text-white focus:outline-none flex items-center justify-center w-10 h-10 ml-2 shrink-0"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <div className="relative w-6 h-5">
            <span className={cn("absolute left-0 w-6 h-0.5 bg-white transition-all duration-300 ease-in-out", mobileMenuOpen ? "rotate-45 top-2" : "top-0")} />
            <span className={cn("absolute left-0 top-2 w-6 h-0.5 bg-white transition-all duration-300 ease-in-out", mobileMenuOpen ? "opacity-0" : "opacity-100")} />
            <span className={cn("absolute left-0 w-6 h-0.5 bg-white transition-all duration-300 ease-in-out", mobileMenuOpen ? "-rotate-45 top-2" : "top-4")} />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden absolute top-full left-0 right-0 bg-black/40 backdrop-blur-xl border-t border-white/10 p-6 flex flex-col items-center space-y-6">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(' ', '-')}`}
              className="text-lg font-sekuya tracking-widest uppercase text-arctic hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
