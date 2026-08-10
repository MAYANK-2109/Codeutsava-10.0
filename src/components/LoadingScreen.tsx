import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Code, Snowflake } from 'lucide-react';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("INITIALIZING PROTOCOLS...");

  useEffect(() => {
    let isMounted = true;

    const assetsToLoad = [
      'https://www.nitrr.ac.in/images/nitrr_new_logo_new.png',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTa4r-FvnJb0n0mSYig2njinB_Ds0xvvi8BoNF1d8oTCQm16HKzC853liA&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSWbhBljZdHq-LywNk_NaBv-kJOfSRioqLtlkON1dmiA&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrrlKHA1hqab7jx2ftKqk40hGq392CzHJw4iqDycZQ3g&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJVoN8wMAMjcjFl3MR_hsE-15sJ39SkDTPDnNULMy__oe9ZWoj2gYmOahd&s=10',
      'https://static.vecteezy.com/system/resources/previews/020/336/288/non_2x/sbi-logo-sbi-icon-free-free-vector.jpg',
      'https://assets.mlh.io/cms/327286443_712889040337850_7309846861434542945_n_2_84b9b3998b.jpg'
    ];

    const totalAssets = assetsToLoad.length;
    let loadedAssets = 0;

    const bootTexts = [
      "MOUNTING CYBER-FUNK MODULES...",
      "DECRYPTING WINTERLAND ASSETS...",
      "ESTABLISHING SECURE CONNECTION...",
      "SYSTEM READY."
    ];

    let textInterval = setInterval(() => {
      if (isMounted) {
        setLoadingText(bootTexts[Math.floor(Math.random() * (bootTexts.length - 1))]);
      }
    }, 800);

    const updateProgress = () => {
      loadedAssets++;
      const percent = Math.round((loadedAssets / totalAssets) * 90); // Cap at 90% until done
      if (isMounted) setProgress(percent);
    };

    // Preload images
    assetsToLoad.forEach(src => {
      const img = new Image();
      img.onload = updateProgress;
      img.onerror = updateProgress; // Increment even on error to avoid hanging
      img.src = src;
    });

    // Fallback timer and wait for document ready
    let minTimePassed = false;
    setTimeout(() => { minTimePassed = true; }, 1500);

    const checkCompletion = setInterval(() => {
      if ((loadedAssets >= totalAssets || document.readyState === 'complete') && minTimePassed) {
        clearInterval(checkCompletion);
        clearInterval(textInterval);
        if (isMounted) {
          setProgress(100);
          setLoadingText(bootTexts[3]); // SYSTEM READY
          setTimeout(onComplete, 600);
        }
      }
    }, 100);

    return () => {
      isMounted = false;
      clearInterval(textInterval);
      clearInterval(checkCompletion);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] overflow-hidden"
    >
      {/* Cyber Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,127,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />
      
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+Cjwvc3ZnPg==')] opacity-30 mix-blend-overlay" />

      {/* Central Icon */}
      <div className="relative mb-16 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 text-neon-purple/40"
        >
          <Code size={140} strokeWidth={0.5} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </motion.div>
        
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative text-white z-10 drop-shadow-[0_0_20px_rgba(0,240,255,1)]"
        >
          <Snowflake size={72} strokeWidth={1} className="text-neon-cyan" />
        </motion.div>
      </div>

      <div className="relative w-[80%] max-w-md h-[2px] bg-white/5 overflow-hidden">
        {/* Progress bar fill */}
        <div 
          className="h-full bg-gradient-to-r from-neon-purple via-neon-cyan to-white transition-all duration-300 ease-out shadow-[0_0_15px_rgba(0,240,255,1)]"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="mt-6 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-neon-cyan font-mono text-xs md:text-sm tracking-[0.2em] uppercase">
          <Terminal size={14} />
          <span>{loadingText}</span>
        </div>
        <div className="text-white font-sekuya text-lg tracking-widest font-bold">
          {progress}%
        </div>
      </div>
    </motion.div>
  );
}
