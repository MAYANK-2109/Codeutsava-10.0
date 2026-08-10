import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, Award, Snowflake } from 'lucide-react';

export default function Prizes() {
  const prizes = [
    {
      place: "1st Place",
      title: "GRAND CHAMPION",
      amount: "₹ 35,000",
      icon: Trophy,
      // Winter Gold/Aurora theme
      color: "text-amber-300",
      accentBg: "bg-amber-500/10",
      borderGlow: "border-amber-400/40 hover:border-amber-300/80 shadow-[0_0_25px_rgba(245,158,11,0.15)] hover:shadow-[0_0_40px_rgba(245,158,11,0.35)]",
      delay: 0.1,
      scale: "md:scale-110 md:-translate-y-4",
      glowColor: "from-amber-400/20 via-transparent to-orange-500/10",
      badge: "bg-gradient-to-r from-amber-500/30 to-yellow-500/30 text-amber-200 border-amber-500/50"
    },
    {
      place: "2nd Place",
      title: "GLACIAL RUNNER UP",
      amount: "₹ 25,000",
      icon: Medal,
      // Ice Cyan theme
      color: "text-cyan-300",
      accentBg: "bg-cyan-500/10",
      borderGlow: "border-cyan-400/30 hover:border-cyan-200/80 shadow-[0_0_25px_rgba(6,182,212,0.15)] hover:shadow-[0_0_40px_rgba(6,182,212,0.35)]",
      delay: 0,
      scale: "scale-100",
      glowColor: "from-cyan-400/20 via-transparent to-blue-500/10",
      badge: "bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-cyan-200 border-cyan-500/50"
    },
    {
      place: "3rd Place",
      title: "FROST CONTENDER",
      amount: "₹ 15,000",
      icon: Award,
      // Rose Pink / Northern Light Violet theme
      color: "text-pink-300",
      accentBg: "bg-pink-500/10",
      borderGlow: "border-pink-400/30 hover:border-pink-200/80 shadow-[0_0_25px_rgba(244,63,94,0.15)] hover:shadow-[0_0_40px_rgba(244,63,94,0.35)]",
      delay: 0.2,
      scale: "scale-100",
      glowColor: "from-pink-400/20 via-transparent to-purple-500/10",
      badge: "bg-gradient-to-r from-pink-500/30 to-purple-500/30 text-pink-200 border-pink-500/50"
    }
  ];

  return (
    <section id="prizes" className="py-20 md:py-28 px-4 md:px-12 max-w-7xl mx-auto relative z-10 overflow-hidden">
      {/* Background Winter Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-cyan/5 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-neon-purple/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-16 md:mb-20 text-center relative"
      >
        {/* Floating Snowflake */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-spin" style={{ animationDuration: '25s' }}>
          <Snowflake className="w-10 h-10 text-cyan-300/30" />
        </div>
        
        <h2 className="text-4xl sm:text-5xl md:text-7xl font-sekuya font-bold text-white mb-4 tracking-widest drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]">
          PRIZE POOL
        </h2>
        <p className="text-cyan-200/60 font-mono tracking-widest text-xs sm:text-sm uppercase mb-4">
          ❄️ Worth Lakhs in Rewards & Perks ❄️
        </p>
        <div className="h-1 w-28 md:w-36 mx-auto bg-gradient-to-r from-neon-purple via-cyan-300 to-neon-orange rounded-full shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
      </motion.div>

      <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 md:gap-6 mt-10 md:mt-16">
        {prizes.map((prize, idx) => {
          const Icon = prize.icon;
          
          // Reorder for desktop: 2nd Place (left) | 1st Place (middle) | 3rd Place (right)
          let orderClass = "";
          if (idx === 0) orderClass = "order-1 md:order-2"; // 1st Place
          else if (idx === 1) orderClass = "order-2 md:order-1"; // 2nd Place
          else if (idx === 2) orderClass = "order-3 md:order-3"; // 3rd Place

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: prize.delay, ease: "easeOut" }}
              className={`relative ${orderClass} ${prize.scale} flex flex-col w-full md:w-1/3 max-w-[340px] md:max-w-sm mx-auto group`}
            >
              {/* Frost Card container with gradient border glow */}
              <div className={`w-full h-full rounded-3xl border ${prize.borderGlow} bg-black/45 backdrop-blur-xl p-8 flex flex-col items-center justify-between text-center transition-all duration-500 overflow-hidden relative`}>
                
                {/* Winter Ice Glare Hover sweep effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-out pointer-events-none" />
                
                {/* Colorful auroral gradient aura inside card */}
                <div className={`absolute -inset-2 bg-gradient-to-br ${prize.glowColor} opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700 pointer-events-none`} />

                {/* Frost Icicle Top Corners decoration */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent" />
                <div className="absolute top-1 left-4 right-4 flex justify-between pointer-events-none">
                  <span className="w-1.5 h-3 bg-cyan-200/25 rounded-b-sm" />
                  <span className="w-1 h-5 bg-cyan-200/20 rounded-b-sm" />
                  <span className="w-1.5 h-4 bg-cyan-200/25 rounded-b-sm" />
                  <span className="w-1 h-6 bg-cyan-200/15 rounded-b-sm" />
                  <span className="w-1.5 h-3.5 bg-cyan-200/25 rounded-b-sm" />
                </div>

                <div className="w-full flex flex-col items-center relative z-10">
                  {/* Badge */}
                  <span className={`px-4 py-1.5 rounded-full border text-xs font-bold tracking-widest font-mono mb-6 uppercase ${prize.badge} shadow-inner`}>
                    {prize.place}
                  </span>

                  {/* Icon Container with frozen background */}
                  <div className={`mb-6 p-5 rounded-2xl ${prize.accentBg} border border-white/5 relative group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className={`w-14 h-14 ${prize.color} drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]`} />
                    <Snowflake className="w-5 h-5 text-cyan-200/40 absolute -top-1 -right-1 animate-pulse" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-sekuya font-bold text-white mb-3 tracking-widest">
                    {prize.title}
                  </h3>
                  
                  {/* Divider line */}
                  <div className="w-12 h-0.5 bg-white/10 my-2" />
                </div>

                {/* Amount Section */}
                <div className="w-full mt-6 relative z-10">
                  <div className="text-frost/50 text-xs font-mono tracking-widest uppercase mb-1">
                    CASH PRIZE
                  </div>
                  <div className={`text-4xl sm:text-5xl font-black ${prize.color} tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]`}>
                    {prize.amount}
                  </div>
                  
                  <div className="mt-4 text-cyan-200/40 text-xs font-mono">
                    + Premium Goodies & Swags
                  </div>
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
