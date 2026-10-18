import React, { useState, useEffect } from 'react';
import { useProgression } from '../context/ProgressionContext';

interface NightlightCursorProps {
  enabled: boolean;
}

export const NightlightCursor: React.FC<NightlightCursorProps> = ({ enabled }) => {
  const { progress } = useProgression();
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: -500, y: -500 });
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check touch device or reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouch(isTouchDevice || prefersReducedMotion);

    if (!enabled || isTouchDevice || prefersReducedMotion) return;

    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setPos({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  // If disabled or on touch device, don't render overlay
  if (!enabled || isTouch || pos.x < 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 transition-opacity duration-300"
      style={{
        background: `radial-gradient(circle 160px at ${pos.x}px ${pos.y}px, rgba(254, 240, 138, 0.16) 0%, rgba(253, 224, 71, 0.06) 60%, transparent 100%)`,
      }}
    />
  );
};
