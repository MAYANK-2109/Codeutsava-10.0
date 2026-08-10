import React, { useRef, useLayoutEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Pre-build geometry once outside the component so it's never recreated
const buildSnowflakeGeometry = (): THREE.ExtrudeGeometry => {
  const shape = new THREE.Shape();

  const profile = [
    { x: 0.0866, y: 0.05 },
    { x: 0.2,    y: 0.05 },
    { x: 0.2,    y: 0.02 },
    { x: 0.3,    y: 0.02 },
    { x: 0.45,   y: 0.17 },
    { x: 0.5,    y: 0.12 },
    { x: 0.4,    y: 0.02 },
    { x: 0.6,    y: 0.02 },
    { x: 0.8,    y: 0.22 },
    { x: 0.85,   y: 0.17 },
    { x: 0.7,    y: 0.02 },
    { x: 0.9,    y: 0.02 },
    { x: 1.0,    y: 0.0  },
  ];

  const fullProfile: { x: number; y: number }[] = [];
  for (const p of profile) fullProfile.push(p);
  for (let i = profile.length - 2; i >= 0; i--) {
    fullProfile.push({ x: profile[i].x, y: -profile[i].y });
  }

  let isFirst = true;
  for (let b = 0; b < 6; b++) {
    const angle = -b * (Math.PI / 3);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    for (const pt of fullProfile) {
      const rx = pt.x * cos - pt.y * sin;
      const ry = pt.x * sin + pt.y * cos;
      if (isFirst) { shape.moveTo(rx, ry); isFirst = false; }
      else          { shape.lineTo(rx, ry); }
    }
  }
  shape.closePath();

  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.05,
    bevelEnabled: false, // Removed bevel — was very expensive
    steps: 1,
  });
};

const cachedGeometry = buildSnowflakeGeometry();

// Shared material so it's only created once
const snowflakeMaterial = new THREE.MeshStandardMaterial({
  color: '#e0f7fa',
  emissive: '#00f0ff',
  emissiveIntensity: 0.4,
  roughness: 0.3,
  metalness: 0.7,
  transparent: true,
  opacity: 0.85,
});

function StarMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  useLayoutEffect(() => {
    const el = meshRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.set(el.position, { x: -3, y: -0.5, z: 0 });
      gsap.set(el.scale,    { x: 2,  y: 2,    z: 2  });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 3,           // Higher scrub = smoother, less jank
          invalidateOnRefresh: true,
        },
      });

      tl.to(el.position, { x: 3,    y: -1, z: -1, ease: 'power1.inOut' }, 0);
      tl.to(el.scale,    { x: 1.86, y: 1.86, z: 1.86, ease: 'power1.inOut' }, 0);
      tl.to(el.position, { x: -3.5, y: -1, z: -2, ease: 'power1.inOut' }, 1);
      tl.to(el.position, { x: 2,    y: -5, z: -3, ease: 'power1.inOut' }, 2);
      tl.to(el.scale,    { x: 0.4,  y: 0.4,  z: 0.4,  ease: 'power1.inOut' }, 2);
      tl.to(el.material as THREE.MeshStandardMaterial, { opacity: 0, ease: 'power1.inOut' }, 3);
    });

    return () => ctx.revert();
  }, []);

  // Slow, smooth rotation using a clock delta accumulator for frame-rate independence
  const rotZ = useRef(0);
  const rotY = useRef(0);
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    rotZ.current += delta * 0.15;        // ~0.15 rad/s — gentle
    rotY.current += delta * 0.4;
    meshRef.current.rotation.z = rotZ.current;
    meshRef.current.rotation.y = Math.sin(rotY.current) * 0.15;
  });

  return (
    <mesh
      ref={meshRef}
      geometry={cachedGeometry}
      material={snowflakeMaterial}
    />
  );
}

// ─────────────────────────────────────────────────────────
// Falling snowflakes — GPU-only points, no JS per-particle
// ─────────────────────────────────────────────────────────
const SNOW_COUNT = 250; // Reduced from 500

function FallingSnowflakes() {
  const mesh = useRef<THREE.Points>(null);

  const [positions, velocities, colors] = useMemo(() => {
    const pos = new Float32Array(SNOW_COUNT * 3);
    const vel = new Float32Array(SNOW_COUNT * 3);
    const col = new Float32Array(SNOW_COUNT * 3);

    for (let i = 0; i < SNOW_COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;

      vel[i * 3]     = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 1] = -Math.random() * 0.02 - 0.01; // Slower fall
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;

      const t = Math.random();
      if (t > 0.8) {
        col[i * 3] = 0.75; col[i * 3 + 1] = 0.52; col[i * 3 + 2] = 0.99;
      } else if (t > 0.6) {
        col[i * 3] = 0.0;  col[i * 3 + 1] = 0.94; col[i * 3 + 2] = 1.0;
      } else {
        col[i * 3] = 1.0;  col[i * 3 + 1] = 1.0;  col[i * 3 + 2] = 1.0;
      }
    }
    return [pos, vel, col];
  }, []);

  // Use delta for frame-rate independent movement
  useFrame((_, delta) => {
    if (!mesh.current?.geometry) return;
    const p = mesh.current.geometry.attributes.position.array as Float32Array;
    const dt = Math.min(delta, 0.05) * 60; // normalise to ~60fps units

    for (let i = 0; i < SNOW_COUNT; i++) {
      p[i * 3]     += velocities[i * 3]     * dt;
      p[i * 3 + 1] += velocities[i * 3 + 1] * dt;
      p[i * 3 + 2] += velocities[i * 3 + 2] * dt;

      if (p[i * 3 + 1] < -10) p[i * 3 + 1] += 20;
      if (p[i * 3]     >  10) p[i * 3]     -= 20;
      if (p[i * 3]     < -10) p[i * 3]     += 20;
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={SNOW_COUNT} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color"    count={SNOW_COUNT} array={colors}    itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        vertexColors
        transparent
        opacity={0.55}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} color="#e879f9" />
      <pointLight position={[-10, -10, -5]} intensity={1.5} color="#00f0ff" />

      <FallingSnowflakes />
      <StarMotif />
    </>
  );
}

export default function ThreeBackground() {
  return (
    <div className="w-full h-full">
      {/*
       * dpr capped at 1 to halve GPU fill-rate work on HiDPI screens.
       * antialias off — big perf win with barely-noticeable quality loss.
       * powerPreference high-performance stays.
       * frameloop="always" is the default — fine here.
       */}
      <Canvas
        dpr={[1, 1]}
        gl={{
          powerPreference: 'high-performance',
          antialias: false,
          alpha: true,
          precision: 'mediump', // drop from highp → mediump
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

export function StarMotif() {
  return <StarMesh />;
}
