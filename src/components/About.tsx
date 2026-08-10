import React from 'react';
import { Terminal, Cpu, Snowflake } from 'lucide-react';
import { motion } from 'motion/react';

export default function About() {
  return (
    <section id="about" className="py-20 md:py-24 px-4 md:px-12 max-w-7xl mx-auto flex flex-col justify-center relative z-10 overflow-hidden">
      {/* Background Frost Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-neon-cyan/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-80 h-80 bg-neon-purple/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-12 md:mb-16 text-center relative"
      >
        {/* Floating snowflake decoration */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-20 animate-pulse">
          <Snowflake className="w-8 h-8 text-cyan-300" />
        </div>
        
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-sekuya font-bold text-white mb-2 md:mb-4 tracking-widest drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]">
          ABOUT US
        </h2>
        <div className="h-1 w-24 md:w-28 mx-auto bg-gradient-to-r from-neon-purple via-cyan-400 to-neon-cyan rounded-full shadow-[0_0_8px_rgba(0,240,255,0.3)]" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Child Section 1 - Cyan Ice */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-neon-cyan/60 hover:-translate-y-2 transition-all duration-500 will-change-transform"
        >
          {/* Ice glare sweep on hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-out pointer-events-none" />
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/10 rounded-full blur-3xl group-hover:bg-neon-cyan/20 transition-colors duration-500 -z-10" />
          
          {/* Subtle icicle decoration top left */}
          <div className="absolute top-0 left-8 flex gap-1 pointer-events-none">
            <span className="w-1 h-3 bg-cyan-300/30 rounded-b-sm" />
            <span className="w-0.5 h-5 bg-cyan-300/20 rounded-b-sm" />
            <span className="w-1 h-2 bg-cyan-300/30 rounded-b-sm" />
          </div>

          <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center mb-8 relative">
            <Terminal className="w-7 h-7 text-neon-cyan" />
            <Snowflake className="w-4 h-4 text-neon-cyan/30 absolute -top-1 -right-1" />
          </div>
          
          <h3 className="text-2xl md:text-3xl font-sekuya text-white mb-4 tracking-wider">THE VISION</h3>
          <p className="text-frost text-base md:text-lg leading-relaxed mb-4">
            Welcome to CodeUtsava, the flagship annual national-level hackathon organized by the Turing Club of Programmers (TCP) at NIT Raipur.
          </p>
          <p className="text-frost text-base md:text-lg leading-relaxed">
            TCP is the official coding club of NITRR, aiming to cultivate a robust coding culture. Our mission is to nurture an engaging environment for competitive programming, algorithmic excellence, and real-world problem-solving.
          </p>
        </motion.div>

        {/* Child Section 2 - Purple Ice */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-card p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-neon-purple/60 hover:-translate-y-2 transition-all duration-500 will-change-transform"
        >
          {/* Ice glare sweep on hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-out pointer-events-none" />
          
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-neon-purple/10 rounded-full blur-3xl group-hover:bg-neon-purple/20 transition-colors duration-500 -z-10" />
          
          {/* Subtle icicle decoration top right */}
          <div className="absolute top-0 right-8 flex gap-1 pointer-events-none">
            <span className="w-1 h-2 bg-purple-300/30 rounded-b-sm" />
            <span className="w-0.5 h-5 bg-purple-300/20 rounded-b-sm" />
            <span className="w-1 h-3 bg-purple-300/30 rounded-b-sm" />
          </div>

          <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center mb-8 relative">
            <Cpu className="w-7 h-7 text-neon-purple" />
            <Snowflake className="w-4 h-4 text-neon-purple/30 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '10s' }} />
          </div>
          
          <h3 className="text-2xl md:text-3xl font-sekuya text-white mb-4 tracking-wider">THE EXPERIENCE</h3>
          <p className="text-frost text-base md:text-lg leading-relaxed mb-4">
            Expect an intense 28-hour long competition that attracts participants from across India, offering substantial prize pools, innovation, and networking opportunities.
          </p>
          <p className="text-frost text-base md:text-lg leading-relaxed">
            Join us as we redefine the technological frontier, shatter boundaries, and build the decentralized web of tomorrow.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
