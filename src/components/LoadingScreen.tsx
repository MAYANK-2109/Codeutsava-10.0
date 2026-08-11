import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Snowflake } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase = 'loading' | 'ready' | 'covering' | 'parting';

interface SnowParticle {
  x: number; y: number; r: number;
  speed: number; drift: number; driftOffset: number; opacity: number;
}

// ─── Palette ──────────────────────────────────────────────────────────────────
// Curated deep-ocean midnight blue — warm enough to feel premium,
// cool enough to read as winter. Accent: soft ice-blue #8ecae6 → #a8dadc.
// No raw neon; everything is muted and purposeful.
const C = {
  bg0:        '#07111d',   // deepest background
  bg1:        '#0b1a2c',   // main background mid
  bg2:        '#0f2238',   // lighter panel / cloud
  auroraA:    'rgba(94, 129, 172, 0.28)',  // muted slate-blue aurora
  auroraB:    'rgba(76, 109, 147, 0.20)',  // deeper blue pool
  auroraC:    'rgba(160, 110, 80, 0.14)',  // warm horizon amber
  iceBlue:    '#8ecae6',   // soft ice-blue — all accents
  iceBlueDim: '#5fa8c8',   // dimmer ice for secondary text
  snowWhite:  'rgba(220,235,248,0.85)', // snow particles — not pure white
  textPrime:  '#d8eaf4',   // soft ice-white for headings
  textMuted:  'rgba(160,200,224,0.55)', // very muted for hints
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
        g.addColorStop(0, `rgba(220,235,248,${p.opacity})`);
        g.addColorStop(1, 'rgba(180,215,240,0)');
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
          <g key={i} stroke="#8ecae6" strokeLinecap="round">
            {/* Main arm */}
            <line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="2" />
            {/* Inner branch pair */}
            <line x1={bx1} y1={by1} x2={bx2} y2={by2} strokeWidth="1.4" opacity="0.75" />
            <line x1={bx3} y1={by3} x2={bx4} y2={by4} strokeWidth="1.4" opacity="0.75" />
            {/* Outer branch pair */}
            <line x1={cx1} y1={cy1} x2={cx2} y2={cy2} strokeWidth="1.2" opacity="0.55" />
            <line x1={cx3} y1={cy3} x2={cx4} y2={cy4} strokeWidth="1.2" opacity="0.55" />
            {/* Tip diamond */}
            <circle cx={x2} cy={y2} r="1.8" fill="#a8dadc" opacity="0.9" />
          </g>
        );
      })}
      {/* Centre circle */}
      <circle cx="44" cy="44" r="4" fill="#8ecae6" opacity="0.9" />
      <circle cx="44" cy="44" r="2" fill="#c8ecf4" />
    </svg>
  );
}

// ─── Mountain silhouette ──────────────────────────────────────────────────────
function Mountains() {
  return (
    <svg viewBox="0 0 1200 200" preserveAspectRatio="none"
      style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '160px', pointerEvents: 'none' }}>
      {/* Far mountains */}
      <path d="M0,200 L0,120 L120,55 L220,110 L350,30 L500,100 L640,40 L780,95 L900,45 L1040,90 L1150,50 L1200,80 L1200,200 Z"
        fill="rgba(10,30,55,0.85)" />
      {/* Near mountains */}
      <path d="M0,200 L0,155 L80,105 L180,140 L280,85 L400,130 L520,75 L640,125 L750,70 L870,120 L980,80 L1100,118 L1200,90 L1200,200 Z"
        fill="rgba(8,22,42,0.95)" />
      {/* Snow caps */}
      <path d="M280,85 L310,105 L350,30 L390,105 L420,90" fill="none" stroke="rgba(180,215,240,0.18)" strokeWidth="1" />
      <path d="M520,75 L552,100 L590,40 L628,100 L660,80" fill="none" stroke="rgba(180,215,240,0.18)" strokeWidth="1" />
    </svg>
  );
}

// ─── Stars field ─────────────────────────────────────────────────────────────
function Stars() {
  const stars = Array.from({ length: 55 }, (_, i) => ({
    cx: `${(i * 17.3 + 5) % 100}%`,
    cy: `${(i * 11.7 + 8) % 55}%`,
    r: i % 4 === 0 ? 1.2 : 0.7,
    op: 0.25 + (i % 5) * 0.1,
  }));
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {stars.map((s, i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="white" opacity={s.op} />
      ))}
    </svg>
  );
}

// ─── Cloud curtain panel ──────────────────────────────────────────────────────
function CloudPanel({ side }: { side: 'left' | 'right' }) {
  const isLeft = side === 'left';
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: isLeft
        ? `linear-gradient(to right, ${C.bg0} 0%, ${C.bg1} 55%, ${C.bg2} 100%)`
        : `linear-gradient(to left,  ${C.bg0} 0%, ${C.bg1} 55%, ${C.bg2} 100%)`,
    }}>
      {/* Stars behind */}
      <Stars />
      {/* Wavy inner edge */}
      <svg viewBox="0 0 100 900" preserveAspectRatio="none"
        style={{ position: 'absolute', top: 0, height: '100%', width: '100px', [isLeft ? 'right' : 'left']: '-1px' }}>
        <path
          d={isLeft
            ? 'M100,0 C65,60 80,130 55,210 C30,290 70,360 45,450 C20,540 65,610 40,700 C15,790 55,860 30,900 L100,900 Z'
            : 'M0,0 C35,60 20,130 45,210 C70,290 30,360 55,450 C80,540 35,610 60,700 C85,790 45,860 70,900 L0,900 Z'
          }
          fill={C.bg1}
        />
      </svg>
      {/* Soft aurora glow near inner edge */}
      <div style={{
        position: 'absolute',
        top: 0, bottom: 0,
        [isLeft ? 'right' : 'left']: 0,
        width: '35%',
        background: `linear-gradient(to ${isLeft ? 'right' : 'left'}, transparent 0%, ${C.auroraA} 100%)`,
        pointerEvents: 'none',
      }} />
    </div>
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
  const coverCount = useRef(0);
  const partCount = useRef(0);

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

  const handleOneCoverDone = useCallback(() => {
    coverCount.current++;
    if (coverCount.current >= 2) {
      coverCount.current = 0;
      onStartTransition();
      setPhase('parting');
    }
  }, [onStartTransition]);

  const handleOnePartDone = useCallback(() => {
    partCount.current++;
    if (partCount.current >= 2) {
      partCount.current = 0;
      onComplete();
    }
  }, [onComplete]);

  const handleContinue = useCallback(() => {
    coverCount.current = 0;
    setPhase('covering');
  }, []);

  const showContent = phase === 'loading' || phase === 'ready';
  const showClouds  = phase === 'covering' || phase === 'parting';

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, overflow: 'hidden' }}>

      {/* ── Background ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(185deg, ${C.bg0} 0%, ${C.bg1} 55%, #091a2e 100%)`,
      }} />

      {/* Aurora bands — soft, painterly, not harsh */}
      <div style={{
        position: 'absolute', top: '-15%', left: '-10%',
        width: '65%', height: '70%',
        background: `radial-gradient(ellipse, ${C.auroraA} 0%, transparent 65%)`,
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '10%', right: '-10%',
        width: '55%', height: '55%',
        background: `radial-gradient(ellipse, ${C.auroraB} 0%, transparent 60%)`,
        filter: 'blur(55px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '20%',
        width: '60%', height: '30%',
        background: `radial-gradient(ellipse, ${C.auroraC} 0%, transparent 65%)`,
        filter: 'blur(45px)', pointerEvents: 'none',
      }} />

      {/* Stars */}
      <Stars />

      {/* Snow */}
      <SnowCanvas count={140} />

      {/* Mountain silhouette */}
      <Mountains />

      {/* ── Central content ── */}
      {showContent && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 5,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          paddingBottom: '100px', // clear the mountains
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
            style={{ marginBottom: '1.6rem', filter: 'drop-shadow(0 0 18px rgba(142,202,230,0.35))' }}
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
                color: C.textPrime,
                textShadow: `0 0 30px rgba(142,202,230,0.35), 0 2px 4px rgba(0,0,0,0.5)`,
              }}
            >
              CODE<br />UTSAVA
            </h1>
            <p
              className="font-sekuya tracking-[0.35em] uppercase"
              style={{ color: C.iceBlueDim, fontSize: 'clamp(0.65rem, 1.8vw, 0.85rem)', marginTop: '0.65rem' }}
            >
              10.0 &nbsp;·&nbsp; Code Innovate Celebrate
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
                  background: 'rgba(142,202,230,0.12)',
                  borderRadius: '99px',
                }}>
                  {/* Fill */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, height: '100%',
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${C.iceBlueDim} 0%, ${C.iceBlue} 100%)`,
                    borderRadius: '99px',
                    boxShadow: `0 0 8px rgba(142,202,230,0.5)`,
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
                      filter: `drop-shadow(0 0 5px rgba(142,202,230,0.7))`,
                    }}
                  >
                    <Snowflake size={18} strokeWidth={1.5} style={{ color: C.iceBlue, display: 'block' }} />
                  </motion.div>
                </div>

                <div style={{ marginTop: '1.1rem', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span className="font-sekuya" style={{ color: C.iceBlue, fontSize: '1rem', letterSpacing: '0.1em' }}>
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
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.9rem' }}
              >
                <motion.button
                  id="winter-continue-btn"
                  onClick={handleContinue}
                  whileHover={{ scale: 1.04, boxShadow: `0 0 28px rgba(142,202,230,0.28)` }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    position: 'relative',
                    padding: '0.72rem 2.6rem',
                    borderRadius: '8px',
                    fontFamily: 'Sekuya, sans-serif',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    fontSize: '0.88rem',
                    color: C.textPrime,
                    background: 'rgba(14, 30, 52, 0.75)',
                    border: `1px solid rgba(142,202,230,0.35)`,
                    boxShadow: `0 0 16px rgba(142,202,230,0.14), 0 4px 20px rgba(0,0,0,0.35)`,
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    cursor: 'none',
                    overflow: 'hidden',
                  }}
                >
                  {/* Soft shimmer sweep */}
                  <motion.span
                    style={{
                      position: 'absolute', inset: 0, pointerEvents: 'none',
                      background: 'linear-gradient(100deg, transparent 25%, rgba(142,202,230,0.08) 50%, transparent 75%)',
                      backgroundSize: '200% 100%',
                    }}
                    animate={{ backgroundPosition: ['200% 0', '-50% 0'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  />
                  Enter Winterland
                </motion.button>

                <p className="font-mono uppercase tracking-widest"
                  style={{ color: C.textMuted, fontSize: '0.58rem' }}>
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
                <Snowflake size={sz} strokeWidth={1} style={{ color: C.iceBlue }} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* ── Cloud Panels ── */}
      {showClouds && (
        <motion.div
          key="cloud-left"
          style={{ position: 'absolute', top: 0, left: 0, width: '52%', height: '100%', zIndex: 30, overflow: 'hidden' }}
          initial={{ x: phase === 'covering' ? '-100%' : '0%' }}
          animate={{ x: phase === 'parting' ? '-101%' : '0%' }}
          transition={{ duration: phase === 'parting' ? 1.2 : 1.05, ease: phase === 'parting' ? [0.55, 0, 1, 0.45] : [0.22, 1, 0.36, 1] }}
          onAnimationComplete={() => {
            if (phase === 'covering') handleOneCoverDone();
            if (phase === 'parting') handleOnePartDone();
          }}
        >
          <CloudPanel side="left" />
        </motion.div>
      )}

      {showClouds && (
        <motion.div
          key="cloud-right"
          style={{ position: 'absolute', top: 0, right: 0, width: '52%', height: '100%', zIndex: 30, overflow: 'hidden' }}
          initial={{ x: phase === 'covering' ? '100%' : '0%' }}
          animate={{ x: phase === 'parting' ? '101%' : '0%' }}
          transition={{ duration: phase === 'parting' ? 1.2 : 1.05, ease: phase === 'parting' ? [0.55, 0, 1, 0.45] : [0.22, 1, 0.36, 1] }}
          onAnimationComplete={() => {
            if (phase === 'covering') handleOneCoverDone();
            if (phase === 'parting') handleOnePartDone();
          }}
        >
          <CloudPanel side="right" />
        </motion.div>
      )}
    </div>
  );
}
