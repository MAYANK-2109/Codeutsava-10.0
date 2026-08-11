import React, { useEffect, useState } from 'react';

const MUSIC_URL =
  'https://raw.githubusercontent.com/MAYANK-2109/inviti/main/src/assets/cubg.m4a';

// Create a single global audio instance, loop it, and set volume to 0.4 by default.
export const globalAudio = typeof window !== 'undefined' ? new Audio(MUSIC_URL) : null;
if (globalAudio) {
  globalAudio.loop = true;
  globalAudio.volume = 0.4;
}

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [showVol, setShowVol] = useState(false);

  // Sync state on mount and when globalAudio changes state
  useEffect(() => {
    if (!globalAudio) return;

    // Set initial playing state
    setPlaying(!globalAudio.paused);
    setVolume(globalAudio.volume);

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onVolumeChange = () => setVolume(globalAudio.volume);

    globalAudio.addEventListener('play', onPlay);
    globalAudio.addEventListener('pause', onPause);
    globalAudio.addEventListener('volumechange', onVolumeChange);

    // Auto-play fallback if not already playing
    const startAudio = () => {
      if (globalAudio.paused) {
        globalAudio.play()
          .then(() => {
            setPlaying(true);
            removeListeners();
          })
          .catch(() => {
            // Autoplay blocked — wait for interaction
          });
      }
    };

    const removeListeners = () => {
      window.removeEventListener('click', startAudio);
      window.removeEventListener('touchstart', startAudio);
      window.removeEventListener('keydown', startAudio);
      window.removeEventListener('scroll', startAudio);
    };

    if (globalAudio.paused) {
      window.addEventListener('click', startAudio);
      window.addEventListener('touchstart', startAudio, { passive: true });
      window.addEventListener('keydown', startAudio);
      window.addEventListener('scroll', startAudio, { passive: true });
    }

    return () => {
      globalAudio.removeEventListener('play', onPlay);
      globalAudio.removeEventListener('pause', onPause);
      globalAudio.removeEventListener('volumechange', onVolumeChange);
      removeListeners();
    };
  }, []);

  // Sync volume changes to globalAudio
  useEffect(() => {
    if (globalAudio) {
      globalAudio.volume = volume;
    }
  }, [volume]);

  const toggle = () => {
    if (!globalAudio) return;
    if (playing) {
      globalAudio.pause();
    } else {
      globalAudio.play().catch(err => {
        console.log("Play failed:", err);
      });
    }
  };

  return (
    <>
      {/* ── Fixed music button ──────────────────────────────────────────── */}
      <div
        className="fixed bottom-6 right-6 flex flex-col items-end gap-2"
        style={{ zIndex: 9998, pointerEvents: 'auto' }}
        onMouseEnter={() => setShowVol(true)}
        onMouseLeave={() => setShowVol(false)}
      >
        {/* Volume slider — reveals on hover */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/15 transition-all duration-300"
          style={{
            background: 'rgba(11,20,43,0.85)',
            backdropFilter: 'blur(8px)',
            opacity: showVol ? 1 : 0,
            transform: showVol ? 'translateY(0) scale(1)' : 'translateY(6px) scale(0.96)',
            pointerEvents: showVol ? 'auto' : 'none',
            boxShadow: '0 4px 24px rgba(143,171,227,0.15)',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8FABE3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.02"
            value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            className="music-vol-slider"
            style={{ width: 72 }}
          />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8FABE3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        </div>

        {/* Main toggle button */}
        <button
          id="music-toggle-btn"
          onClick={toggle}
          aria-label={playing ? 'Mute background music' : 'Play background music'}
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            border: playing
              ? '1.5px solid rgba(143,171,227,0.7)'
              : '1.5px solid rgba(255,255,255,0.2)',
            background: playing
              ? 'rgba(143,171,227,0.08)'
              : 'rgba(11,20,43,0.85)',
            backdropFilter: 'blur(10px)',
            cursor: 'none',
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: playing
              ? '0 0 18px rgba(143,171,227,0.35), 0 4px 24px rgba(0,0,0,0.5)'
              : '0 4px 24px rgba(0,0,0,0.5)',
            transition: 'border-color 0.3s, box-shadow 0.3s, background 0.3s',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Pulse ring when playing */}
          {playing && (
            <span
              style={{
                position: 'absolute',
                inset: -4,
                borderRadius: '50%',
                border: '1.5px solid rgba(143,171,227,0.35)',
                animation: 'music-pulse 1.8s ease-out infinite',
              }}
            />
          )}

          {playing ? <SoundwaveIcon /> : <MutedIcon />}
        </button>

        {/* Label */}
        <span
          style={{
            fontSize: 9,
            letterSpacing: '0.12em',
            color: playing ? 'rgba(143,171,227,0.8)' : 'rgba(255,255,255,0.35)',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            textTransform: 'uppercase',
            textAlign: 'center',
            transition: 'color 0.3s',
            userSelect: 'none',
          }}
        >
          {playing ? 'MUSIC ON' : 'MUSIC OFF'}
        </span>
      </div>
    </>
  );
}

// ── Animated soundwave bars (playing state) ────────────────────────────────
function SoundwaveIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      {[
        { x: 2, h: 6, delay: '0s' },
        { x: 6, h: 14, delay: '0.15s' },
        { x: 10, h: 20, delay: '0.05s' },
        { x: 14, h: 14, delay: '0.2s' },
        { x: 18, h: 6, delay: '0.1s' },
      ].map((bar, i) => (
        <rect
          key={i}
          x={bar.x}
          y={(24 - bar.h) / 2}
          width="3"
          height={bar.h}
          rx="1.5"
          fill="#8FABE3"
          style={{
            transformOrigin: `${bar.x + 1.5}px 12px`,
            animation: `soundbar 0.8s ease-in-out infinite alternate`,
            animationDelay: bar.delay,
          }}
        />
      ))}
    </svg>
  );
}

// ── Static muted icon (off state) ─────────────────────────────────────────
function MutedIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}
