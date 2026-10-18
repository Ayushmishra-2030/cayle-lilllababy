import React, { useEffect, useState } from 'react';
import { useProgression } from '../context/ProgressionContext';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export const SparkleTrail: React.FC = () => {
  const { progress } = useProgression();
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Check user preference or touch device
    if (!progress.sparklesEnabled) return;
    if (typeof window === 'undefined') return;

    // Detect touch device or reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const colors = ['#fde047', '#f472b6', '#c084fc', '#67e8f9', '#fbcfe8'];
    let lastTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime < 50) return; // Throttle to prevent lag
      lastTime = now;

      const newParticle: Particle = {
        id: Math.random(),
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
      };

      setParticles((prev) => [...prev.slice(-18), newParticle]);
    };

    window.addEventListener('mousemove', handleMouseMove);

    const cleanupInterval = setInterval(() => {
      setParticles((prev) => (prev.length > 0 ? prev.slice(1) : prev));
    }, 120);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(cleanupInterval);
    };
  }, [progress.sparklesEnabled]);

  if (!progress.sparklesEnabled || particles.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="sparkle-particle"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 8px ${p.color}`,
          }}
        />
      ))}
    </div>
  );
};
