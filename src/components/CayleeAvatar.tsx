import React, { useState, useEffect, useRef } from 'react';
import { CayleeExpression } from '../types';
import { useProgression } from '../context/ProgressionContext';
import { sound } from '../utils/audio';

interface CayleeAvatarProps {
  expression?: CayleeExpression;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  onPet?: () => void;
  className?: string;
  showDialogue?: boolean;
  dialogueText?: string;
}

export const CayleeAvatar: React.FC<CayleeAvatarProps> = ({
  expression = 'happy',
  size = 'md',
  interactive = true,
  onPet,
  className = '',
  showDialogue = false,
  dialogueText = '',
}) => {
  const { discoverEasterEgg, progress } = useProgression();
  const [currentExpression, setCurrentExpression] = useState<CayleeExpression>(expression);
  const [blinking, setBlinking] = useState(false);
  const [antennaeClicks, setAntennaeClicks] = useState(0);
  const [antennaeWiggle, setAntennaeWiggle] = useState(false);

  // Eye tracking & head tilt states
  const [pupilOffset, setPupilOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [headTilt, setHeadTilt] = useState<number>(0);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentExpression(expression);
  }, [expression]);

  // Periodic natural blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 220);
    }, 4500 + Math.random() * 3000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Smooth Eye tracking following mouse pointer / touch
  useEffect(() => {
    if (!interactive || typeof window === 'undefined') return;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let rafId: number;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!avatarRef.current) return;
      const rect = avatarRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        return;
      }

      const dx = clientX - centerX;
      const dy = clientY - centerY;
      const dist = Math.hypot(dx, dy);

      // Clamp pupil offset between -3.5 and +3.5 pixels
      const maxOffset = 3.5;
      const angle = Math.atan2(dy, dx);
      const intensity = Math.min(1, dist / 280);

      const targetX = Math.cos(angle) * maxOffset * intensity;
      const targetY = Math.sin(angle) * maxOffset * intensity;

      // Gentle head tilt (max +/- 4 degrees)
      const targetTilt = Math.max(-4, Math.min(4, (dx / 300) * 4));

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setPupilOffset({ x: targetX, y: targetY });
        setHeadTilt(targetTilt);
      });
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      cancelAnimationFrame(rafId);
    };
  }, [interactive]);

  const handleAntennaeClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    sound.playSparkle();
    setAntennaeWiggle(true);
    setCurrentExpression('giggle');
    const newCount = antennaeClicks + 1;
    setAntennaeClicks(newCount);

    setTimeout(() => {
      setAntennaeWiggle(false);
      setCurrentExpression(expression);
    }, 1500);

    // Easter Egg #4: Caylee's Antennae
    discoverEasterEgg('egg-4-caylee-antennae');
  };

  const handleBodyClick = () => {
    if (!interactive) return;
    sound.playTap();
    setCurrentExpression('proud');
    if (onPet) onPet();
    setTimeout(() => setCurrentExpression(expression), 1200);
  };

  const sizeDimensions = {
    sm: 'w-20 h-20',
    md: 'w-36 h-36',
    lg: 'w-52 h-52',
    xl: 'w-72 h-72',
  }[size];

  // In night mode, eyes glow softly
  const isNight = progress.theme === 'night';

  return (
    <div ref={avatarRef} className={`relative inline-block select-none ${className}`}>
      {/* Speech bubble if dialogue requested */}
      {showDialogue && dialogueText && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-30 bg-white/95 dark:bg-slate-800/95 text-[#5c4033] dark:text-amber-100 text-xs md:text-sm font-medium px-4 py-2 rounded-2xl shadow-lg border border-[#a34063]/20 whitespace-nowrap animate-gentle-float">
          <span>{dialogueText}</span>
          <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-slate-800 rotate-45 border-r border-b border-[#a34063]/20" />
        </div>
      )}

      <div
        className={`${sizeDimensions} relative cursor-pointer group transition-transform duration-300 hover:scale-105`}
        onClick={handleBodyClick}
        title="Caylee the Moon-Moth (Click to pet, click antennae for secrets!)"
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-md overflow-visible"
          style={{
            transform: `rotate(${headTilt}deg)`,
            transition: 'transform 0.15s ease-out',
            transformOrigin: '100px 100px',
          }}
        >
          <defs>
            {/* Iridescent Star Wing Gradient */}
            <linearGradient id="starWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fdf4ff" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#e0e7ff" stopOpacity="0.75" />
              <stop offset="80%" stopColor="#fef08a" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fbcfe8" stopOpacity="0.7" />
            </linearGradient>

            {/* Lavender Fluff Gradient */}
            <radialGradient id="bodyFluff" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#e9d5ff" />
              <stop offset="70%" stopColor="#c4b5fd" />
              <stop offset="100%" stopColor="#a78bfa" />
            </radialGradient>

            {/* Amber Eyes Gradient */}
            <radialGradient id="amberEye" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor={isNight ? '#fef08a' : '#fef08a'} />
              <stop offset="35%" stopColor={isNight ? '#f59e0b' : '#f59e0b'} />
              <stop offset="100%" stopColor={isNight ? '#92400e' : '#b45309'} />
            </radialGradient>

            {/* Glow Filter */}
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Translucent Star Wings (Left & Right) */}
          <g className="animate-wing-flutter" style={{ transformOrigin: '100px 110px' }}>
            {/* Left Upper Wing */}
            <path
              d="M 90,105 Q 40,40 25,65 Q 15,90 55,115 Q 85,120 90,105 Z"
              fill="url(#starWingGrad)"
              stroke="#e0e7ff"
              strokeWidth="1.5"
              className="drop-shadow-sm"
            />
            {/* Left Wing Star Veins */}
            <path
              d="M 85,105 Q 45,70 30,68 M 80,107 Q 48,88 38,98"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="1"
              strokeDasharray="2 2"
              opacity="0.85"
            />

            {/* Right Upper Wing */}
            <path
              d="M 110,105 Q 160,40 175,65 Q 185,90 145,115 Q 115,120 110,105 Z"
              fill="url(#starWingGrad)"
              stroke="#e0e7ff"
              strokeWidth="1.5"
              className="drop-shadow-sm"
            />
            {/* Right Wing Star Veins */}
            <path
              d="M 115,105 Q 155,70 170,68 M 120,107 Q 152,88 162,98"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="1"
              strokeDasharray="2 2"
              opacity="0.85"
            />

            {/* Lower cute underwings */}
            <path
              d="M 92,120 Q 55,145 65,165 Q 85,170 96,130 Z"
              fill="url(#starWingGrad)"
              opacity="0.75"
            />
            <path
              d="M 108,120 Q 145,145 135,165 Q 115,170 104,130 Z"
              fill="url(#starWingGrad)"
              opacity="0.75"
            />
          </g>

          {/* Golden Antennae (Clickable Easter Egg!) */}
          <g
            onClick={handleAntennaeClick}
            className={`cursor-pointer transition-transform duration-300 ${
              antennaeWiggle ? 'animate-bounce' : 'group-hover:scale-105'
            }`}
          >
            {/* Left Antenna */}
            <path
              d="M 88,65 Q 60,35 48,22 Q 42,16 40,24 Q 45,34 78,60"
              fill="#fbbf24"
              stroke="#d97706"
              strokeWidth="1.5"
            />
            {/* Left Star Tip */}
            <circle cx="44" cy="20" r="5" fill="#fef08a" filter="url(#goldGlow)" />
            <polygon
              points="44,14 45.5,18.5 50,20 45.5,21.5 44,26 42.5,21.5 38,20 42.5,18.5"
              fill="#f59e0b"
            />

            {/* Right Antenna */}
            <path
              d="M 112,65 Q 140,35 152,22 Q 158,16 160,24 Q 155,34 122,60"
              fill="#fbbf24"
              stroke="#d97706"
              strokeWidth="1.5"
            />
            {/* Right Star Tip */}
            <circle cx="156" cy="20" r="5" fill="#fef08a" filter="url(#goldGlow)" />
            <polygon
              points="156,14 157.5,18.5 162,20 157.5,21.5 156,26 154.5,21.5 150,20 154.5,18.5"
              fill="#f59e0b"
            />
          </g>

          {/* Fluffy Lavender Body */}
          {/* Main Abdomen */}
          <ellipse cx="100" cy="135" rx="28" ry="36" fill="url(#bodyFluff)" />
          {/* Fluff texture rings */}
          <path
            d="M 82,125 Q 100,132 118,125"
            stroke="#c4b5fd"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M 80,140 Q 100,148 120,140"
            stroke="#a78bfa"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M 84,155 Q 100,162 116,155"
            stroke="#8b5cf6"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Caylee's Little Satchel for Wishes */}
          <g>
            {/* Satchel Strap */}
            <path
              d="M 82,98 Q 102,125 118,145"
              fill="none"
              stroke="#78350f"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Satchel Pouch */}
            <rect
              x="110"
              y="132"
              width="24"
              height="20"
              rx="4"
              fill="#92400e"
              stroke="#451a03"
              strokeWidth="1.5"
              transform="rotate(12, 122, 142)"
            />
            {/* Satchel Star Clasp */}
            <polygon
              points="123,139 124.5,142 128,142.5 125,145 126,148.5 123,147 120,148.5 121,145 118,142.5 121.5,142"
              fill="#fbbf24"
            />
          </g>

          {/* Fluffy Head */}
          <circle cx="100" cy="85" r="32" fill="url(#bodyFluff)" />
          {/* Fur tufts on cheeks */}
          <path d="M 68,88 Q 62,84 66,78 Q 71,84 72,89" fill="#e9d5ff" />
          <path d="M 132,88 Q 138,84 134,78 Q 129,84 128,89" fill="#e9d5ff" />
          {/* Forehead fluff tuft */}
          <path d="M 95,58 Q 100,50 105,58 Q 100,62 95,58 Z" fill="#faf5ff" />

          {/* Soft Cheek Blush */}
          <ellipse cx="80" cy="94" rx="7" ry="4" fill="#f472b6" opacity="0.6" />
          <ellipse cx="120" cy="94" rx="7" ry="4" fill="#f472b6" opacity="0.6" />

          {/* Warm Amber Eyes with Dynamic Pupil Tracking */}
          {blinking || currentExpression === 'sleepy' ? (
            /* Closed / Happy curved eyelids */
            <g>
              <path
                d="M 78,86 Q 86,92 94,86"
                fill="none"
                stroke="#5c4033"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 106,86 Q 114,92 122,86"
                fill="none"
                stroke="#5c4033"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>
          ) : currentExpression === 'giggle' ? (
            /* Joyful laughing arcs */
            <g>
              <path
                d="M 78,88 Q 86,81 94,88"
                fill="none"
                stroke="#5c4033"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M 106,88 Q 114,81 122,88"
                fill="none"
                stroke="#5c4033"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>
          ) : (
            /* Open Large Amber Eyes with Pupil Follow */
            <g>
              {/* Left Eye Sclera / Base */}
              <circle cx="86" cy="84" r="8" fill="url(#amberEye)" />
              {/* Left Pupil (Moves with cursor offset) */}
              <circle
                cx={88 + pupilOffset.x}
                cy={85 + pupilOffset.y}
                r="4.5"
                fill="#451a03"
              />
              {/* Left Star pupil sparkle */}
              <circle
                cx={84 + pupilOffset.x * 0.7}
                cy={82 + pupilOffset.y * 0.7}
                r="2.2"
                fill="#ffffff"
              />
              <circle
                cx={88.5 + pupilOffset.x * 0.7}
                cy={86.5 + pupilOffset.y * 0.7}
                r="1.1"
                fill="#ffffff"
              />

              {/* Right Eye Sclera / Base */}
              <circle cx="114" cy="84" r="8" fill="url(#amberEye)" />
              {/* Right Pupil (Moves with cursor offset) */}
              <circle
                cx={112 + pupilOffset.x}
                cy={85 + pupilOffset.y}
                r="4.5"
                fill="#451a03"
              />
              {/* Right Star pupil sparkle */}
              <circle
                cx={112 + pupilOffset.x * 0.7}
                cy={82 + pupilOffset.y * 0.7}
                r="2.2"
                fill="#ffffff"
              />
              <circle
                cx={116.5 + pupilOffset.x * 0.7}
                cy={86.5 + pupilOffset.y * 0.7}
                r="1.1"
                fill="#ffffff"
              />
            </g>
          )}

          {/* Cute Mouth based on Expression */}
          {currentExpression === 'happy' || currentExpression === 'proud' ? (
            <path
              d="M 96,96 Q 100,101 104,96"
              fill="none"
              stroke="#5c4033"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : currentExpression === 'surprised' ? (
            <ellipse cx="100" cy="98" rx="3.5" ry="4" fill="#a34063" stroke="#5c4033" strokeWidth="1" />
          ) : currentExpression === 'curious' ? (
            <path
              d="M 96,96 Q 101,99 106,94"
              fill="none"
              stroke="#5c4033"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : currentExpression === 'giggle' ? (
            <path
              d="M 95,95 Q 100,103 105,95 Z"
              fill="#a34063"
              stroke="#5c4033"
              strokeWidth="1.5"
            />
          ) : (
            <path
              d="M 97,97 Q 100,99 103,97"
              fill="none"
              stroke="#5c4033"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}

          {/* Little Moth Paws resting */}
          <circle cx="92" cy="112" r="5" fill="#e9d5ff" />
          <circle cx="108" cy="112" r="5" fill="#e9d5ff" />
        </svg>
      </div>
    </div>
  );
};
