import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Snowflake } from 'lucide-react';
import { globalAudio } from './MusicPlayer';
// @ts-expect-error - Vite compiles JPEG assets automatically
import loadingImg from './loadingimg.jpeg';

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase = 'loading' | 'ready' | 'exiting';

interface SnowParticle {
  x: number; y: number; r: number;
  speed: number; drift: number; driftOffset: number; opacity: number;
}

// ─── Palette ──────────────────────────────────────────────────────────────────
// Derived from user's sunset-over-winter-city image:
// Base: Deep Blue, highlights in Lavender, Pale Pink, and Warm White.
const C = {
  skyTop: '#6D8ED6', // Blue
  skyMid1: '#8FABE3', // Soft Blue
  skyMid2: '#B5BAE6', // Lavender
  skyBot: '#DDCAE3', // Pale Pink/Lavender
  skyGlow: '#F7E8E5', // Warm White

  mountainFar: 'rgba(32, 82, 179, 0.45)',  // Deep Blue #2052B3 with opacity
  mountainNear: 'rgba(32, 82, 179, 0.75)',  // Deep Blue #2052B3 with opacity
  groundIce: '#2052B3',                 // Deep Blue

  iceBlue: '#8FABE3',   // Soft Blue
  iceBlueDim: '#6D8ED6',   // Blue
  snowWhite: 'rgba(247, 232, 229, 0.85)', // Warm White
  textPrime: '#F7E8E5',   // Warm White
  textMuted: 'rgba(181, 186, 230, 0.85)', // Lavender

  deepBlue: '#2052B3',   // Deep Blue
  lavender: '#B5BAE6',   // Lavender
  palePink: '#DDCAE3',   // Pale Pink/Lavender
  warmWhite: '#F7E8E5',   // Warm White
};

// ─── Snow Canvas ──────────────────────────────────────────────────────────────
function SnowCanvas({ count = 140 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<SnowParticle[]>([]);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2.8 + 0.8,
      speed: Math.random() * 0.45 + 0.12,
      drift: Math.random() * 0.35 + 0.08,
      driftOffset: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.45 + 0.15,
    }));

    const draw = (ts: number) => {
      const dt = Math.min(ts - timeRef.current, 50);
      timeRef.current = ts;
      const t = ts / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particlesRef.current) {
        p.y += p.speed * (dt / 16);
        p.x += Math.sin(t * p.drift + p.driftOffset) * 0.3;
        if (p.y > canvas.height + 8) { p.y = -8; p.x = Math.random() * canvas.width; }
        if (p.x > canvas.width + 8) p.x -= canvas.width + 16;
        if (p.x < -8) p.x += canvas.width + 16;

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2);
        // Fall warm-white snow particles with pale pink glow
        g.addColorStop(0, `rgba(247, 232, 229, ${p.opacity})`);
        g.addColorStop(1, 'rgba(221, 202, 227, 0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); };
  }, [count]);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
}

// ─── Decorative large snowflake SVG ──────────────────────────────────────────
function BigSnowflake({ opacity = 1 }: { opacity?: number }) {
  return (
    <svg width="88" height="88" viewBox="0 0 88 88" fill="none" style={{ opacity }}>
      {/* 6 main arms */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i * 60 * Math.PI) / 180;
        const cos = Math.cos(angle), sin = Math.sin(angle);
        const tx = (x: number, y: number) => [44 + x * cos - y * sin, 44 + x * sin + y * cos];
        const [x1, y1] = tx(0, 0); const [x2, y2] = tx(38, 0);
        // Sub-branches at 40%, 65%
        const [bx1, by1] = tx(15, 0); const [bx2, by2] = tx(23, 8);
        const [bx3, by3] = tx(15, 0); const [bx4, by4] = tx(23, -8);
        const [cx1, cy1] = tx(25, 0); const [cx2, cy2] = tx(33, 9);
        const [cx3, cy3] = tx(25, 0); const [cx4, cy4] = tx(33, -9);
        return (
          <g key={i} stroke={C.iceBlue} strokeLinecap="round">
            {/* Main arm */}
            <line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="2" />
            {/* Inner branch pair */}
            <line x1={bx1} y1={by1} x2={bx2} y2={by2} strokeWidth="1.4" opacity="0.75" stroke={C.lavender} />
            <line x1={bx3} y1={by3} x2={bx4} y2={by4} strokeWidth="1.4" opacity="0.75" stroke={C.lavender} />
            {/* Outer branch pair */}
            <line x1={cx1} y1={cy1} x2={cx2} y2={cy2} strokeWidth="1.2" opacity="0.55" stroke={C.palePink} />
            <line x1={cx3} y1={cy3} x2={cx4} y2={cy4} strokeWidth="1.2" opacity="0.55" stroke={C.palePink} />
            {/* Tip diamond */}
            <circle cx={x2} cy={y2} r="1.8" fill={C.warmWhite} opacity="0.9" />
          </g>
        );
      })}
      {/* Centre circle */}
      <circle cx="44" cy="44" r="4" fill={C.iceBlue} opacity="0.9" />
      <circle cx="44" cy="44" r="2" fill={C.warmWhite} />
    </svg>
  );
}



// ─── Main LoadingScreen ───────────────────────────────────────────────────────
export default function LoadingScreen({
  onComplete,
  onStartTransition,
}: {
  onComplete: () => void;
  onStartTransition: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<Phase>('loading');

  // ── Asset loading ─────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    const assets = [
      'https://www.nitrr.ac.in/images/nitrr_new_logo_new.png',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTa4r-FvnJb0n0mSYig2njinB_Ds0xvvi8BoNF1d8oTCQm16HKzC853liA&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSWbhBljZdHq-LywNk_NaBv-kJOfSRioqLtlkON1dmiA&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrrlKHA1hqab7jx2ftKqk40hGq392CzHJw4iqDycZQ3g&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJVoN8wMAMjcjFl3MR_hsE-15sJ39SkDTPDnNULMy__oe9ZWoj2gYmOahd&s=10',
      'https://static.vecteezy.com/system/resources/previews/020/336/288/non_2x/sbi-logo-sbi-icon-free-free-vector.jpg',
      'https://assets.mlh.io/cms/327286443_712889040337850_7309846861434542945_n_2_84b9b3998b.jpg',
    ];
    let loaded = 0;
    const onLoad = () => {
      loaded++;
      if (mounted) setProgress(Math.round((loaded / assets.length) * 90));
    };
    assets.forEach(src => { const i = new Image(); i.onload = onLoad; i.onerror = onLoad; i.src = src; });

    let minDone = false;
    const minT = setTimeout(() => { minDone = true; }, 1800);
    const check = setInterval(() => {
      if ((loaded >= assets.length || document.readyState === 'complete') && minDone) {
        clearInterval(check);
        if (mounted) {
          setProgress(100);
          setTimeout(() => { if (mounted) setPhase('ready'); }, 700);
        }
      }
    }, 100);
    return () => { mounted = false; clearInterval(check); clearTimeout(minT); };
  }, []);

  const handleContinue = useCallback(() => {
    // Start music playback on click event (direct user interaction triggers autoplay bypass)
    if (globalAudio) {
      globalAudio.play().catch(err => {
        console.log("Music play blocked or failed:", err);
      });
    }
    // Trigger transition in the parent component to mount MainSite underneath
    onStartTransition();
    // Begin fade & submerge exit transition on LoadingScreen
    setPhase('exiting');
  }, [onStartTransition]);

  const showContent = phase === 'loading' || phase === 'ready';

  return (
    <motion.div
      initial={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      animate={
        phase === 'exiting'
          ? { opacity: 0, y: '100vh', scale: 0.96, filter: 'blur(8px)' }
          : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
      }
      transition={{
        duration: 1.4,
        ease: [0.22, 1, 0.36, 1], // Custom ease-out transition
      }}
      onAnimationComplete={() => {
        if (phase === 'exiting') {
          onComplete();
        }
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        overflow: 'hidden',
        willChange: 'transform, opacity, filter',
      }}
    >
      {/* ── Background Blurred Image ── */}
      <div style={{
        position: 'absolute', inset: 0,
        overflow: 'hidden',
        background: '#0B132B',
      }}>
        <img
          src={loadingImg}
          alt="Loading Background"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(80px) brightness(0.6) saturate(1.2)',
            transform: 'scale(1.25)',
          }}
        />
      </div>

      {/* Aurora glow bands reflecting pink/lavender and soft blue */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-10%',
        width: '65%', height: '70%',
        background: `radial-gradient(ellipse, rgba(143, 171, 227, 0.35) 0%, transparent 65%)`,
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '10%', right: '-10%',
        width: '55%', height: '55%',
        background: `radial-gradient(ellipse, rgba(181, 186, 230, 0.25) 0%, transparent 60%)`,
        filter: 'blur(55px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', left: '20%',
        width: '60%', height: '30%',
        background: `radial-gradient(ellipse, rgba(221, 202, 227, 0.2) 0%, transparent 65%)`,
        filter: 'blur(45px)', pointerEvents: 'none',
      }} />

      {/* Snow */}
      <SnowCanvas count={140} />

      {/* ── Central content ── */}
      {showContent && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 5,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          paddingBottom: '0px',
        }}>

          {/* Large decorative snowflake */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1, rotate: 360 }}
            transition={{
              opacity: { duration: 0.9, ease: 'easeOut' },
              scale: { duration: 0.9, ease: 'easeOut' },
              rotate: { duration: 60, repeat: Infinity, ease: 'linear' },
            }}
            style={{ marginBottom: '1.6rem', filter: `drop-shadow(0 0 18px ${C.skyMid1})` }}
          >
            <BigSnowflake />
          </motion.div>

          {/* Brand name */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            style={{ textAlign: 'center', marginBottom: '2.8rem', userSelect: 'none' }}
          >
            <h1
              className="font-bitcount font-semibold leading-none tracking-tighter"
              style={{
                fontSize: 'clamp(2.8rem, 9vw, 6.5rem)',
                color: '#d4fdf6ff',
                textShadow: `0 0 25px rgba(134, 101, 172, 0.64), 0 0 45px rgba(53, 121, 205, 0.45), 0 2px 4px rgba(32, 82, 179, 0.35)`,
              }}
            >
              CODE<br />UTSAVA 10.0
            </h1>
            <p
              className="font-sekuya tracking-[0.35em] uppercase"
              style={{ color: C.iceBlueDim, fontSize: 'clamp(0.65rem, 1.8vw, 0.85rem)', marginTop: '0.65rem' }}
            >
              &nbsp;·&nbsp; Code Innovate Celebrate
            </p>
          </motion.div>

          {/* Progress bar / Continue button */}
          <AnimatePresence mode="wait">
            {phase === 'loading' && (
              <motion.div
                key="progress"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
                transition={{ duration: 0.4 }}
                style={{ width: '100%', maxWidth: '380px', padding: '0 28px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                {/* Track */}
                <div style={{
                  position: 'relative', width: '100%', height: '4px',
                  background: 'rgba(32, 82, 179, 0.12)',
                  borderRadius: '99px',
                }}>
                  {/* Fill */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, height: '100%',
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${C.iceBlueDim} 0%, ${C.iceBlue} 100%)`,
                    borderRadius: '99px',
                    boxShadow: `0 0 8px ${C.iceBlue}, 0 0 16px ${C.iceBlueDim}`,
                    transition: 'width 0.35s ease-out',
                  }} />
                  {/* Snowflake thumb */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    style={{
                      position: 'absolute', top: '50%',
                      left: `${progress}%`,
                      transform: 'translate(-50%, -50%)',
                      filter: `drop-shadow(0 0 6px ${C.warmWhite})`,
                    }}
                  >
                    <Snowflake size={18} strokeWidth={1.5} style={{ color: C.warmWhite, display: 'block' }} />
                  </motion.div>
                </div>

                <div style={{ marginTop: '1.1rem', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span className="font-sekuya" style={{ color: C.deepBlue, fontSize: '1rem', letterSpacing: '0.1em' }}>
                    {progress}%
                  </span>
                  <span className="font-mono uppercase tracking-widest" style={{ color: C.textMuted, fontSize: '0.6rem' }}>
                    Loading…
                  </span>
                </div>
              </motion.div>
            )}

            {phase === 'ready' && (
              <motion.div
                key="ready"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem', position: 'relative' }}
              >
                {/* Glowing neon ring pulse around the platform button */}
                <div style={{ position: 'relative' }}>
                  <motion.div
                    animate={{ scale: [1, 1.16, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute',
                      inset: -6,
                      borderRadius: '50px',
                      border: `1.5px solid ${C.palePink}`,
                      filter: 'blur(4px)',
                      pointerEvents: 'none',
                    }}
                  />

                  <motion.button
                    id="winter-continue-btn"
                    onClick={handleContinue}
                    whileHover={{ scale: 1.04, boxShadow: `0 0 30px rgba(143,171,227,0.45), 0 0 15px rgba(221,202,227,0.3)` }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      position: 'relative',
                      padding: '0.85rem 3.2rem',
                      borderRadius: '50px',
                      fontFamily: 'Sekuya, sans-serif',
                      letterSpacing: '0.25em',
                      textTransform: 'uppercase',
                      fontSize: '0.9rem',
                      color: C.warmWhite,
                      background: 'rgba(32, 82, 179, 0.85)', // Deep Blue platform base
                      border: `1.5px solid ${C.iceBlue}`,    // Soft Blue glowing ring outline
                      boxShadow: `0 0 20px rgba(32, 82, 179, 0.3), 0 4px 16px rgba(0,0,0,0.3)`,
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      cursor: 'none',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Soft shimmer sweep using Warm White */}
                    <motion.span
                      style={{
                        position: 'absolute', inset: 0, pointerEvents: 'none',
                        background: `linear-gradient(100deg, transparent 25%, rgba(247, 232, 229, 0.15) 50%, transparent 75%)`,
                        backgroundSize: '200% 100%',
                      }}
                      animate={{ backgroundPosition: ['200% 0', '-50% 0'] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                    />
                    Enter Winterland
                  </motion.button>
                </div>

                <p className="font-mono uppercase tracking-widest"
                  style={{ color: C.textMuted, fontSize: '0.6rem' }}>
                  All systems ready
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Subtle bottom row of small snowflakes */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 1 }}
            style={{ position: 'absolute', bottom: '120px', display: 'flex', gap: '1.6rem', alignItems: 'center' }}
          >
            {[10, 7, 14, 7, 10].map((sz, i) => (
              <motion.div key={i}
                animate={{ rotate: i % 2 === 0 ? [0, 360] : [0, -360], opacity: [0.12, 0.32, 0.12] }}
                transition={{
                  rotate: { duration: 15 + i * 4, repeat: Infinity, ease: 'linear' },
                  opacity: { duration: 4 + i, repeat: Infinity },
                }}
              >
                <Snowflake size={sz} strokeWidth={1} style={{ color: i % 2 === 0 ? C.iceBlue : C.palePink }} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
