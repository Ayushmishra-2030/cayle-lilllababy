import React, { useState, useEffect, useRef } from 'react';
import { useProgression } from '../../../context/ProgressionContext';
import { sound } from '../../../utils/audio';
import { ArrowLeft, ArrowRight, ShieldCheck, Flame, RotateCw, Sparkles, Trophy } from 'lucide-react';

interface TrialProps {
  onBack: () => void;
}

export const MidnightTrialGame: React.FC<TrialProps> = ({ onBack }) => {
  const { recordGameCompletion } = useProgression();
  const [stage, setStage] = useState<1 | 2 | 3 | 4>(1); // 1: Dodge, 2: Dials, 3: Infusion, 4: True Ending Victory

  // STAGE 1: Comet Dodge state
  const [dodgeTimer, setDodgeTimer] = useState(20);
  const [playerX, setPlayerX] = useState(50); // percentage 10-90
  const [meteors, setMeteors] = useState<{ id: number; x: number; y: number }[]>([]);
  const [stage1Failed, setStage1Failed] = useState(false);

  // STAGE 2: Moon Dials state (3 rings: target is 0 degrees)
  const [dials, setDials] = useState<[number, number, number]>([90, 180, 270]);
  const [dialsLocked, setDialsLocked] = useState(false);

  // STAGE 3: Crystal Infusion state (0 to 100%)
  const [infusion, setInfusion] = useState(0);

  // Final first-time reward
  const [firstTimeReward, setFirstTimeReward] = useState<number | null>(null);

  // --- STAGE 1 LOOP ---
  useEffect(() => {
    if (stage !== 1 || stage1Failed) return;

    let animId: number;
    let meteorId = 1;

    const timer = setInterval(() => {
      setDodgeTimer((t) => {
        if (t <= 1) {
          clearInterval(timer);
          sound.playStarCatch();
          setStage(2); // Advance to Stage 2!
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    const loop = () => {
      // Spawn meteors
      if (Math.random() < 0.12) {
        setMeteors((prev) => [
          ...prev,
          { id: meteorId++, x: Math.random() * 80 + 10, y: 0 },
        ]);
      }

      // Move meteors down
      setMeteors((prev) => {
        const next: typeof prev = [];
        for (const m of prev) {
          const nextY = m.y + 2.2;
          // Collision check near player (y: 80-92, x: within 10%)
          if (nextY >= 78 && nextY <= 90 && Math.abs(m.x - playerX) < 10) {
            sound.playChime(180, 0.4, 'sawtooth');
            setStage1Failed(true);
            return [];
          }
          if (nextY < 105) {
            next.push({ ...m, y: nextY });
          }
        }
        return next;
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      clearInterval(timer);
      cancelAnimationFrame(animId);
    };
  }, [stage, stage1Failed, playerX]);

  // Stage 1 player controls
  const handleMoveLeft = () => setPlayerX((x) => Math.max(12, x - 8));
  const handleMoveRight = () => setPlayerX((x) => Math.min(88, x + 8));

  // --- STAGE 2 DIAL ROTATION ---
  const rotateDial = (index: 0 | 1 | 2) => {
    sound.playTap();
    setDials((prev) => {
      const next: [number, number, number] = [...prev];
      next[index] = (next[index] + 45) % 360;

      // Check if all 3 aligned at 0 or 360
      if (next.every((deg) => deg === 0)) {
        sound.playStarCatch();
        setDialsLocked(true);
        setTimeout(() => setStage(3), 800);
      }
      return next;
    });
  };

  // --- STAGE 3 INFUSION TAP ---
  const handleInfuse = () => {
    sound.playSparkle();
    setInfusion((prev) => {
      const next = prev + 12;
      if (next >= 100) {
        sound.playLevelUp();
        setStage(4); // Victory!
        const res = recordGameCompletion('game-10-midnight-trial');
        if (res.firstTime) {
          setFirstTimeReward(res.xpAwarded);
        }
        return 100;
      }
      return next;
    });
  };

  const resetStage1 = () => {
    setDodgeTimer(20);
    setMeteors([]);
    setStage1Failed(false);
    setPlayerX(50);
  };

  const handleFullReset = () => {
    setStage(1);
    resetStage1();
    setDials([90, 180, 270]);
    setDialsLocked(false);
    setInfusion(0);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            sound.playTap();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-200 dark:bg-slate-800 text-stone-700 dark:text-purple-200 hover:bg-stone-300 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Arcade</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-400 text-xs font-bold px-3 py-1 rounded-xl text-amber-200 shadow">
            Stage {stage <= 3 ? stage : 3} of 3 • {stage === 1 ? 'Comet Dodge' : stage === 2 ? 'Moon Dial' : stage === 3 ? 'Starlight Infusion' : 'Conquered!'}
          </div>
        </div>
      </div>

      {/* Main Trial Arena */}
      <div className="relative min-h-[440px] rounded-3xl bg-gradient-to-b from-[#090514] via-[#1c0b38] to-[#0b0318] border-4 border-amber-400/50 shadow-2xl overflow-hidden p-6 text-white flex flex-col justify-between select-none">
        {/* STAGE 1: COMET DODGE */}
        {stage === 1 && (
          <div className="relative h-full flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between z-10">
              <span className="text-xs font-bold text-amber-300">
                Stage 1: Comet Dodge
              </span>
              <span className="text-xs font-bold bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/40 text-amber-200">
                Survive: {dodgeTimer}s
              </span>
            </div>

            {/* Falling Meteors */}
            <div className="absolute inset-0 pointer-events-none">
              {meteors.map((m) => (
                <div
                  key={m.id}
                  style={{ left: `${m.x}%`, top: `${m.y}%` }}
                  className="absolute text-xl transform -translate-x-1/2 drop-shadow-[0_0_8px_#f97316]"
                >
                  ☄️
                </div>
              ))}
            </div>

            {/* Player Moth */}
            <div
              style={{ left: `${playerX}%`, bottom: '20px' }}
              className="absolute transform -translate-x-1/2 text-3xl filter drop-shadow-[0_0_12px_#c084fc] transition-all duration-75"
            >
              🦋
            </div>

            {/* Stage 1 Failed Message */}
            {stage1Failed && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-3 z-30 animate-fade-in">
                <div className="text-4xl">💥</div>
                <h4 className="text-xl font-bold text-rose-300">Singed by Comet Tail!</h4>
                <p className="text-xs text-purple-200 max-w-xs">
                  Caylee took a stray meteor spark. Shake off the soot and try again!
                </p>
                <button
                  onClick={resetStage1}
                  className="px-6 py-2 rounded-full bg-amber-400 text-stone-900 font-bold text-xs cursor-pointer shadow"
                >
                  Retry Stage 1
                </button>
              </div>
            )}

            {/* Stage 1 Controls */}
            <div className="z-10 pt-4 flex items-center justify-between sm:justify-center gap-4 mt-auto">
              <button
                onClick={handleMoveLeft}
                className="w-20 h-12 rounded-xl bg-purple-700 active:bg-purple-800 text-white flex items-center justify-center font-bold text-sm shadow cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <span className="text-xs text-purple-300 font-medium hidden sm:inline">
                Weave past falling meteors!
              </span>
              <button
                onClick={handleMoveRight}
                className="w-20 h-12 rounded-xl bg-purple-700 active:bg-purple-800 text-white flex items-center justify-center font-bold text-sm shadow cursor-pointer"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STAGE 2: MOON DIAL ALIGNMENT */}
        {stage === 2 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5 animate-fade-in">
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Stage 2: Celestial Moon Dials
              </span>
              <h4 className="text-xl font-serif-heading font-bold text-purple-100">
                Align the Three Moon Glyphs to North (0°)
              </h4>
              <p className="text-xs text-purple-300 mt-1">
                Tap each celestial ring to rotate it 45 degrees until all three glow gold at the top!
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 sm:gap-8">
              {([0, 1, 2] as const).map((idx) => {
                const deg = dials[idx];
                const isAligned = deg === 0;
                return (
                  <div key={idx} className="flex flex-col items-center space-y-2">
                    <button
                      onClick={() => rotateDial(idx)}
                      disabled={dialsLocked}
                      style={{ transform: `rotate(${deg}deg)` }}
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 flex items-center justify-center text-2xl transition-transform duration-300 cursor-pointer shadow-lg ${
                        isAligned
                          ? 'border-amber-300 bg-amber-400/20 drop-shadow-[0_0_15px_#fde047]'
                          : 'border-purple-500/60 bg-purple-950/40 hover:border-amber-300'
                      }`}
                    >
                      <span>🌙</span>
                    </button>
                    <span className="text-[11px] font-bold text-purple-300">
                      Ring #{idx + 1}: {deg}°
                    </span>
                  </div>
                );
              })}
            </div>

            {dialsLocked && (
              <div className="text-xs font-bold text-amber-300 animate-pulse">
                ✨ Moon Alignment Locked! Advancing to Stage 3...
              </div>
            )}
          </div>
        )}

        {/* STAGE 3: STARLIGHT INFUSION */}
        {stage === 3 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5 animate-fade-in">
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Stage 3: Starlight Infusion
              </span>
              <h4 className="text-xl font-serif-heading font-bold text-purple-100">
                Reignite the Great Bureau Beacon!
              </h4>
              <p className="text-xs text-purple-300 mt-1 max-w-sm">
                Rapidly tap the central crystal to channel your collected starlight energy!
              </p>
            </div>

            {/* Glowing Crystal */}
            <div className="relative">
              <button
                onClick={handleInfuse}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-amber-400 via-rose-400 to-purple-400 border-4 border-amber-200 flex items-center justify-center text-5xl transition-transform active:scale-90 cursor-pointer shadow-[0_0_30px_rgba(251,191,36,0.8)]"
              >
                💎
              </button>
            </div>

            {/* Infusion Progress Bar */}
            <div className="w-full max-w-xs space-y-1">
              <div className="flex justify-between text-xs font-bold text-purple-200">
                <span>Beacon Luminosity:</span>
                <span className="text-amber-300">{infusion}%</span>
              </div>
              <div className="w-full h-3 bg-purple-950 rounded-full overflow-hidden border border-purple-500/40">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-rose-400 rounded-full transition-all duration-150"
                  style={{ width: `${infusion}%` }}
                />
              </div>
            </div>

            <button
              onClick={handleInfuse}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-stone-900 font-rounded font-bold text-sm shadow-xl active:scale-95 cursor-pointer"
            >
              Channel Starlight! (Tap Rapidly)
            </button>
          </div>
        )}

        {/* STAGE 4: TRUE ENDING VICTORY */}
        {stage === 4 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in p-2">
            <div className="text-6xl animate-bounce">👑🦋✨</div>
            <h3 className="text-3xl font-serif-heading font-bold text-amber-300 drop-shadow">
              The Great Bureau Lighthouse Ignites!
            </h3>
            <div className="max-w-md bg-purple-950/80 border border-amber-300/60 p-4 rounded-3xl text-xs sm:text-sm text-purple-200 leading-relaxed space-y-2">
              <p>
                <strong>Celestial Climax:</strong> A magnificent beam of golden starlight arches across
                the entire Dreamland archipelago. Every forgotten wish, every sleepy star, and every
                drifting dream glows in celebration.
              </p>
              <p className="font-handwriting text-lg text-pink-300">
                Caylee hugs her wish satchel tightly: &ldquo;We did it! No wish will ever wander in the dark again!&rdquo;
              </p>
            </div>

            {firstTimeReward && (
              <div className="bg-amber-400/20 border border-amber-400/50 text-amber-200 px-4 py-2 rounded-xl text-xs font-semibold">
                Trial Champion Bonus: +{firstTimeReward} XP Awarded!
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleFullReset}
                className="px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-xs cursor-pointer shadow"
              >
                Relive Trial
              </button>
              <button
                onClick={onBack}
                className="px-6 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-xs cursor-pointer"
              >
                Arcade Menu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
