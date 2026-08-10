import React, { useEffect, useRef } from 'react';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const MAX_RIPPLES = 3; // cap simultaneous ripples to avoid DOM explosion

/**
 * Click effect — lightweight DOM-mutation approach.
 * Creates a small pool of divs and animates them with
 * the Web Animations API so the browser can schedule
 * them on the compositor thread without React re-renders.
 */
export default function ClickEffect() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Pool of reusable ring elements to avoid GC pressure
    const pool: HTMLDivElement[] = [];
    const getEl = (): HTMLDivElement => {
      if (pool.length > 0) return pool.pop()!;
      const el = document.createElement('div');
      el.style.cssText = `
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
        border: 2px solid rgba(0,240,255,0.85);
        box-shadow: 0 0 12px rgba(0,240,255,0.6);
        transform: translate(-50%,-50%) scale(0);
        opacity: 1;
      `;
      return el;
    };

    let rippleCount = 0;

    const handleClick = (e: MouseEvent) => {
      if (rippleCount >= MAX_RIPPLES) return;
      rippleCount++;

      const el = getEl();
      el.style.left = `${e.clientX}px`;
      el.style.top  = `${e.clientY}px`;
      el.style.width  = '60px';
      el.style.height = '60px';
      container.appendChild(el);

      const anim = el.animate(
        [
          { transform: 'translate(-50%,-50%) scale(0.2)', opacity: 1 },
          { transform: 'translate(-50%,-50%) scale(3)',   opacity: 0 },
        ],
        { duration: 550, easing: 'ease-out', fill: 'forwards' },
      );

      anim.onfinish = () => {
        container.removeChild(el);
        el.getAnimations().forEach(a => a.cancel());
        pool.push(el);
        rippleCount--;
      };
    };

    window.addEventListener('mousedown', handleClick, true);
    return () => window.removeEventListener('mousedown', handleClick, true);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    />
  );
}
