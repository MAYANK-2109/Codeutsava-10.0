import React, { useEffect, useRef } from 'react';

/**
 * High-performance cursor trail.
 *
 * Strategy: Instead of Framer Motion springs (which drive React re-renders on
 * every animation frame), we move two <div>s directly via style.transform
 * inside a rAF loop — zero React overhead after mount.
 */
export default function CursorTrail() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    // Current mouse position (raw)
    let mx = -200, my = -200;
    // Spring-lagged positions for the outer ring
    let ox = -200, oy = -200;
    // Fast-lagged position for the inner dot
    let ix = -200, iy = -200;

    // Spring constants — tuned for ultra-smooth feel
    const outerStiffness = 0.12; // fraction of distance to close per frame at 60fps
    const innerStiffness = 0.28;

    let rafId: number;
    let active = true;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.body.style.cursor = 'none';

    const loop = () => {
      if (!active) return;

      // Exponential decay smoothing (frame-rate independent via fixed lerp factor)
      ox += (mx - ox) * outerStiffness;
      oy += (my - oy) * outerStiffness;
      ix += (mx - ix) * innerStiffness;
      iy += (my - iy) * innerStiffness;

      // Apply transforms — NO layout, NO paint — compositor only
      outer.style.transform = `translate(${ox - 24}px, ${oy - 24}px)`;
      inner.style.transform = `translate(${ix - 8}px, ${iy - 8}px)`;

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      active = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <>
      {/* Outer frosty aura ring — moved by rAF, never re-rendered */}
      <div
        ref={outerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.35)',
          pointerEvents: 'none',
          zIndex: 100,
          mixBlendMode: 'screen',
          boxShadow: '0 0 12px rgba(180,240,255,0.5)',
          willChange: 'transform',
          // Frost spikes via pseudo would need CSS; use a child div overlay instead
        }}
      >
        {/* Frost spikes */}
        <div style={{ position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)', width: 2, height: 12, background: 'rgba(255,255,255,0.8)', boxShadow: '0 0 5px rgba(0,240,255,1)' }} />
        <div style={{ position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)', width: 2, height: 12, background: 'rgba(255,255,255,0.8)', boxShadow: '0 0 5px rgba(0,240,255,1)' }} />
        <div style={{ position: 'absolute', left: -6, top: '50%', transform: 'translateY(-50%)', width: 12, height: 2, background: 'rgba(255,255,255,0.8)', boxShadow: '0 0 5px rgba(0,240,255,1)' }} />
        <div style={{ position: 'absolute', right: -6, top: '50%', transform: 'translateY(-50%)', width: 12, height: 2, background: 'rgba(255,255,255,0.8)', boxShadow: '0 0 5px rgba(0,240,255,1)' }} />
      </div>

      {/* Inner ice crystal — faster spring, diamond shape */}
      <div
        ref={innerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 16,
          height: 16,
          pointerEvents: 'none',
          zIndex: 101,
          willChange: 'transform',
          background: 'linear-gradient(to bottom, #ffffff, #cffafe, #67e8f9)',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          boxShadow: '0 0 12px rgba(0,240,255,1)',
        }}
      />
    </>
  );
}
