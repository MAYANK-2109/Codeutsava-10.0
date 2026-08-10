import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Code, Users, Box, Zap, Shield } from 'lucide-react';
import { cn } from '../lib/utils';

const guidelines = [
  { icon: Users, title: "TEAM FORMATION", text: "Teams can consist of 1-4 members. Solo wolves are also welcome!" },
  { icon: Code, title: "ORIGINAL CODE", text: "All code must be written during the hackathon. No pre-written projects." },
  { icon: Box, title: "OPEN SOURCE", text: "Use of open-source libraries, APIs, and frameworks is highly encouraged." },
  { icon: Zap, title: "THEME ADHERENCE", text: "Respect the Winterland x Cyber-funk theme in presentations and vibe." },
  { icon: Shield, title: "CODE OF CONDUCT", text: "Maintain respect, inclusivity, and modular clean architecture." },
];

const faqs = [
  { q: "Who can participate?", a: "Any student with a passion for coding, design, or building cool tech." },
  { q: "Is it free to attend?", a: "Yes, CodeUtsava 10 is completely free for all selected participants." },
  { q: "What if I don't have a team?", a: "We will have team-building sessions before the hacking begins." },
  { q: "What should I bring?", a: "Your laptop, charger, student ID, and your cyber-funk energy." },
];

export default function GuidelinesFaq() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="w-full relative z-10">
      {/* Guidelines Section */}
      <section id="guidelines" className="py-12 md:py-16 px-4 md:px-12 max-w-7xl mx-auto flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-12 text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-sekuya font-bold text-white mb-2 md:mb-4 tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
            GUIDELINES
          </h2>
          <div className="h-1 w-20 md:w-24 mx-auto circuit-line-gradient rounded-full" />
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {guidelines.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                key={idx} 
                className="glass-card p-6 md:p-8 rounded-2xl border-t-2 border-neon-cyan/60 hover:border-neon-purple/80 transition-all duration-500 hover:shadow-[0_0_20px_rgba(255,0,127,0.3)] hover:-translate-y-2 hover:scale-[1.02] group will-change-transform"
              >
                <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-neon-cyan group-hover:text-neon-purple transition-colors" />
                </div>
                <h3 className="text-xl font-sekuya text-arctic mb-3 tracking-wider">{item.title}</h3>
                <p className="text-frost text-sm md:text-base leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 md:py-16 px-4 md:px-12 max-w-4xl mx-auto flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-12 text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-sekuya font-bold text-white mb-2 md:mb-4 tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
            FAQ
          </h2>
          <div className="h-1 w-20 md:w-24 mx-auto bg-gradient-to-r from-neon-orange to-neon-purple rounded-full" />
        </motion.div>

        <div className="space-y-4 md:space-y-6">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                key={idx} 
                className={cn(
                  "glass-card rounded-2xl overflow-hidden transition-all duration-500 border will-change-transform",
                  isOpen ? "border-neon-orange/60 shadow-[0_0_15px_rgba(255,107,0,0.2)] bg-black/40 scale-[1.01]" : "border-white/10 hover:border-white/30 hover:-translate-y-1 hover:scale-[1.01]"
                )}
              >
                <button 
                  className="w-full flex justify-between items-center text-left p-6 md:p-8 focus:outline-none group"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                >
                  <span className={cn(
                    "font-sekuya text-lg md:text-xl tracking-wider transition-colors", 
                    isOpen ? "text-neon-orange drop-shadow-[0_0_5px_rgba(255,107,0,0.8)]" : "text-arctic group-hover:text-white"
                  )}>
                    {faq.q}
                  </span>
                  <div className={cn(
                    "w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center transition-colors border",
                    isOpen ? "border-neon-orange text-neon-orange" : "border-white/20 text-frost group-hover:border-white/50 group-hover:text-white"
                  )}>
                    <ChevronDown className={cn("w-5 h-5 transition-transform duration-300", isOpen && "rotate-180")} />
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="px-6 md:px-8 pb-8 pt-0">
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
                        <p className="text-frost text-base md:text-lg leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
