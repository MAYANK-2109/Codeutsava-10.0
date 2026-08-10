import React from 'react';
import { Github, Twitter, Linkedin, Mail, MapPin, Code, Cpu } from 'lucide-react';
import { motion } from 'motion/react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#030712]/60 backdrop-blur-md border-t border-white/10 py-10 md:py-16 px-4 md:px-12 relative z-10 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-neon-purple/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
        
        {/* Brand Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="col-span-1 md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left"
        >
          <div className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan via-white to-neon-purple mb-4 flex items-center gap-3">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTa4r-FvnJb0n0mSYig2njinB_Ds0xvvi8BoNF1d8oTCQm16HKzC853liA&s=10" 
              alt="TCP Logo" 
              className="w-10 h-10 object-contain rounded-md"
            />
            TCP
          </div>
          <p className="text-frost text-sm mb-6 max-w-xs">
            Forging the future of decentralized systems, AI, and creative engineering. Join the revolution.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="w-10 h-10 rounded-full glass-card border border-white/10 flex items-center justify-center text-frost hover:text-neon-cyan hover:border-neon-cyan/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all duration-300">
              <Github size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full glass-card border border-white/10 flex items-center justify-center text-frost hover:text-neon-cyan hover:border-neon-cyan/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all duration-300">
              <Twitter size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full glass-card border border-white/10 flex items-center justify-center text-frost hover:text-neon-cyan hover:border-neon-cyan/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all duration-300">
              <Linkedin size={18} />
            </a>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="col-span-1 flex flex-col items-center md:items-start"
        >
          <h4 className="text-white font-sekuya text-xl tracking-widest mb-6">EXPLORE</h4>
          <ul className="space-y-3 text-center md:text-left">
            <li><a href="#about" className="text-frost hover:text-white hover:underline underline-offset-4 decoration-neon-cyan/50 transition-all text-sm uppercase tracking-wider">About</a></li>
            <li><a href="#timeline" className="text-frost hover:text-white hover:underline underline-offset-4 decoration-neon-cyan/50 transition-all text-sm uppercase tracking-wider">Timeline</a></li>
            <li><a href="#sponsors" className="text-frost hover:text-white hover:underline underline-offset-4 decoration-neon-cyan/50 transition-all text-sm uppercase tracking-wider">Sponsors</a></li>
            <li><a href="#faq" className="text-frost hover:text-white hover:underline underline-offset-4 decoration-neon-cyan/50 transition-all text-sm uppercase tracking-wider">FAQ</a></li>
          </ul>
        </motion.div>

        {/* Resources */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="col-span-1 flex flex-col items-center md:items-start"
        >
          <h4 className="text-white font-sekuya text-xl tracking-widest mb-6">RESOURCES</h4>
          <ul className="space-y-3 text-center md:text-left">
            <li><a href="#" className="text-frost hover:text-white hover:underline underline-offset-4 decoration-neon-purple/50 transition-all text-sm uppercase tracking-wider">Devpost</a></li>
            <li><a href="#" className="text-frost hover:text-white hover:underline underline-offset-4 decoration-neon-purple/50 transition-all text-sm uppercase tracking-wider">Code of Conduct</a></li>
            <li><a href="#" className="text-frost hover:text-white hover:underline underline-offset-4 decoration-neon-purple/50 transition-all text-sm uppercase tracking-wider">Privacy Policy</a></li>
            <li><a href="#" className="text-frost hover:text-white hover:underline underline-offset-4 decoration-neon-purple/50 transition-all text-sm uppercase tracking-wider">Terms of Service</a></li>
          </ul>
        </motion.div>

        {/* Contact Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="col-span-1 flex flex-col items-center md:items-start text-center md:text-left"
        >
          <h4 className="text-white font-sekuya text-xl tracking-widest mb-6">CONTACT</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-frost text-sm justify-center md:justify-start">
              <Mail className="w-4 h-4 text-neon-purple" />
              <span>hello@codeutsava.com</span>
            </div>
            <div className="flex items-center gap-3 text-frost text-sm justify-center md:justify-start">
              <MapPin className="w-4 h-4 text-neon-cyan" />
              <span>NIT Raipur, CG, India</span>
            </div>
            <div className="flex items-center gap-3 text-frost text-sm justify-center md:justify-start">
              <Code className="w-4 h-4 text-neon-cyan" />
              <span>Built with ☕ & Code</span>
            </div>
          </div>
        </motion.div>

      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.9 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="max-w-7xl mx-auto mt-10 md:mt-16 pt-6 md:pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left"
      >
        <p className="text-white/40 text-xs tracking-wider">
          © {new Date().getFullYear()} CODEUTSAVA 10.0. ALL SYSTEMS ONLINE.
        </p>
        <p className="text-white/40 text-xs tracking-wider">
          DESIGNED FOR THE FUTURE.
        </p>
      </motion.div>
    </footer>
  );
}
