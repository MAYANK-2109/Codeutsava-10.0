import React from 'react';
import { motion } from 'motion/react';
import { Users, Building2, Code2, Navigation } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { year: '2016', teams: 120 },
  { year: '2018', teams: 200 },
  { year: '2020', teams: 450 },
  { year: '2022', teams: 580 },
  { year: '2023', teams: 640 },
  { year: '2024', teams: 840 },
  { year: '2025', teams: 1000 },
];

const stats = [
  { label: 'Teams', value: '1000+', icon: Users, color: 'text-neon-cyan', border: 'border-neon-cyan/50' },
  { label: 'Colleges', value: '100+', icon: Building2, color: 'text-neon-purple', border: 'border-neon-purple/50' },
  { label: 'Developers', value: '2000+', icon: Code2, color: 'text-neon-orange', border: 'border-neon-orange/50' },
  { label: 'Visitors', value: '3000+', icon: Navigation, color: 'text-neon-cyan', border: 'border-neon-cyan/50' },
];

export default function Stats() {
  return (
    <section id="stats" className="py-12 md:py-16 px-4 md:px-12 max-w-7xl mx-auto relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-8 md:mb-12 text-center"
      >
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-sekuya font-bold text-white mb-2 md:mb-4 tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
          PAST LEGACY
        </h2>
        <div className="h-1 w-20 md:w-24 mx-auto bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full" />
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`glass-card p-6 md:p-8 rounded-2xl border ${stat.border} flex flex-col items-center justify-center text-center group hover:-translate-y-2 transition-all duration-300`}
            >
              <div className="mb-4 p-4 rounded-full bg-black/40 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="text-3xl md:text-4xl font-black text-white mb-2 tracking-wider">
                {stat.value}
              </div>
              <div className="text-frost text-sm md:text-base uppercase tracking-widest">
                {stat.label}
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass-card p-4 sm:p-6 md:p-10 rounded-2xl md:rounded-3xl border border-white/10"
      >
        <h3 className="text-xl md:text-2xl font-sekuya font-bold text-arctic mb-6 md:mb-8 text-center tracking-widest">TEAM PARTICIPATION GROWTH</h3>
        <div className="h-[250px] md:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="year" stroke="#8794a8" tick={{ fill: '#8794a8' }} />
              <YAxis stroke="#8794a8" tick={{ fill: '#8794a8' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(15, 25, 44, 0.9)', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#00f0ff' }}
              />
              <Line 
                type="monotone" 
                dataKey="teams" 
                stroke="#00f0ff" 
                strokeWidth={3} 
                dot={{ fill: '#0f192c', stroke: '#00f0ff', strokeWidth: 2, r: 6 }} 
                activeDot={{ r: 8, fill: '#ff007f', stroke: '#0f192c' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </section>
  );
}
