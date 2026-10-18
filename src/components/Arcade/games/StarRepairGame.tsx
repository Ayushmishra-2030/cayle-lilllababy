import React, { useState, useEffect } from 'react';
import { useProgression } from '../../../context/ProgressionContext';
import { sound } from '../../../utils/audio';
import { ArrowLeft, Sparkles, RotateCcw, CheckCircle2, Star } from 'lucide-react';

interface StarRepairProps {
  onBack: () => void;
}

interface StarNode {
  id: number;
  name: string;
  x: number;
  y: number;
  sootLevel: number; // 0 to 100, 0 is fully clean
  glowLevel: number; // 0 to 100, 100 is fully glowing
  lore: string;
}

const INITIAL_STARS: StarNode[] = [
  { id: 1, name: 'Sirius Minor', x: 20, y: 30, sootLevel: 80, glowLevel: 20, lore: 'Weary from lighting the sailor’s northern harbor.' },
  { id: 2, name: 'Vega Droplet', x: 45, y: 22, sootLevel: 90, glowLevel: 10, lore: 'Smudged by comet tail dust during the autumn meteor shower.' },
  { id: 3, name: 'Altair Spark', x: 75, y: 35, sootLevel: 70, glowLevel: 30, lore: 'Dozing off while waiting for an unsent midnight letter.' },
  { id: 4, name: 'Pollux Petal', x: 30, y: 65, sootLevel: 85, glowLevel: 15, lore: 'Chilled by high altitude nebula clouds.' },
  { id: 5, name: 'Castor Bell', x: 60, y: 60, sootLevel: 95, glowLevel: 5, lore: 'Fell asleep mid-twinkle over the forest canopy.' },
  { id: 6, name: 'Capella Glow', x: 80, y: 75, sootLevel: 75, glowLevel: 25, lore: 'Tangled in stray thread from a dreamer’s tapestry.' },
  { id: 7, name: 'Rigel Blossom', x: 50, y: 82, sootLevel: 80, glowLevel: 20, lore: 'The heart star of the constellation, awaiting gentle care.' },
];

export const StarRepairGame: React.FC<StarRepairProps> = ({ onBack }) => {
  const { recordGameCompletion } = useProgression();
  const [stars, setStars] = useState<StarNode[]>(INITIAL_STARS);
  const [selectedStarId, setSelectedStarId] = useState<number>(1);
  const [toolAction, setToolAction] = useState<'brush' | 'polish'>('brush');
  const [isCompleted, setIsCompleted] = useState(false);
  const [firstTimeReward, setFirstTimeReward] = useState<number | null>(null);

  const selectedStar = stars.find((s) => s.id === selectedStarId) || stars[0];

  const totalGlow = Math.round(
    stars.reduce((acc, s) => acc + s.glowLevel, 0) / stars.length
  );

  useEffect(() => {
    if (totalGlow >= 100 && !isCompleted) {
      setIsCompleted(true);
      sound.playLevelUp();
      const res = recordGameCompletion('game-2-star-repair');
      if (res.firstTime) {
        setFirstTimeReward(res.xpAwarded);
      }
    }
  }, [totalGlow, isCompleted, recordGameCompletion]);

  const handleApplyTool = (starId: number) => {
    sound.playSparkle();
    setStars((prev) =>
      prev.map((s) => {
        if (s.id !== starId) return s;

        let newSoot = s.sootLevel;
        let newGlow = s.glowLevel;

        if (toolAction === 'brush') {
          newSoot = Math.max(0, s.sootLevel - 35);
          newGlow = Math.min(100, s.glowLevel + 25);
        } else {
          // Polish
          newSoot = Math.max(0, s.sootLevel - 20);
          newGlow = Math.min(100, s.glowLevel + 35);
        }

        if (newSoot === 0) {
          newGlow = 100;
        }

        return { ...s, sootLevel: newSoot, glowLevel: newGlow };
      })
    );
  };

  const resetWorkshop = () => {
    sound.playTap();
    setStars(INITIAL_STARS);
    setIsCompleted(false);
    setSelectedStarId(1);
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
          <button
            onClick={resetWorkshop}
            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/80 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 hover:bg-stone-100 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <div className="px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300 text-xs font-bold text-amber-900 dark:text-amber-200">
            Constellation Radiance: {totalGlow}%
          </div>
        </div>
      </div>

      {/* Workshop Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sky View with 7 sleepy stars */}
        <div className="md:col-span-2 relative h-[360px] sm:h-[400px] rounded-3xl bg-gradient-to-b from-[#111827] via-[#1e1b4b] to-[#0f172a] border-4 border-purple-500/30 shadow-2xl overflow-hidden p-4">
          <div className="absolute top-3 left-4 text-xs font-serif-heading font-semibold text-purple-300/80">
            Celestial Workbench • Tap a Star to Inspect &amp; Restore
          </div>

          {/* Celestial connections lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
            <line x1="20%" y1="30%" x2="45%" y2="22%" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="45%" y1="22%" x2="75%" y2="35%" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="20%" y1="30%" x2="30%" y2="65%" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="30%" y1="65%" x2="60%" y2="60%" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="60%" y1="60%" x2="80%" y2="75%" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="60%" y1="60%" x2="50%" y2="82%" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />
          </svg>

          {/* Stars */}
          {stars.map((star) => {
            const isSelected = star.id === selectedStarId;
            const isFullyClean = star.glowLevel >= 100;
            return (
              <button
                key={star.id}
                onClick={() => {
                  sound.playTap();
                  setSelectedStarId(star.id);
                }}
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute p-2 rounded-full transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'ring-4 ring-amber-300 scale-125 z-20'
                    : 'hover:scale-110 z-10'
                }`}
                title={`${star.name} (${star.glowLevel}% restored)`}
              >
                <div className="relative flex items-center justify-center">
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      isFullyClean
                        ? 'fill-amber-300 text-amber-200 drop-shadow-[0_0_12px_#fef08a]'
                        : star.glowLevel > 50
                        ? 'fill-amber-400/80 text-amber-500'
                        : 'fill-stone-600 text-stone-500'
                    }`}
                  />
                  {/* Soot badge */}
                  {!isFullyClean && (
                    <span className="absolute -bottom-2 text-[9px] font-bold px-1 rounded bg-stone-900/80 text-stone-300 border border-stone-600">
                      {star.glowLevel}%
                    </span>
                  )}
                  {isFullyClean && (
                    <span className="absolute -top-1 -right-1 text-xs">✨</span>
                  )}
                </div>
              </button>
            );
          })}

          {/* Completed Overlay */}
          {isCompleted && (
            <div className="absolute inset-0 bg-purple-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white space-y-3 z-30 animate-fade-in">
              <div className="text-5xl animate-bounce">🌟👑🌟</div>
              <h3 className="text-2xl font-serif-heading font-bold text-amber-300">
                Constellation Restored!
              </h3>
              <p className="text-xs sm:text-sm text-purple-200 max-w-sm">
                All seven sleepy stars shine with celestial radiance once more! The sky path is illuminated.
              </p>
              {firstTimeReward && (
                <div className="bg-amber-400/20 border border-amber-400/50 text-amber-200 px-4 py-2 rounded-xl text-xs font-semibold">
                  First Completion Bonus: +{firstTimeReward} XP Awarded!
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={resetWorkshop}
                  className="px-5 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-xs cursor-pointer"
                >
                  Repair Again
                </button>
                <button
                  onClick={onBack}
                  className="px-5 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-xs cursor-pointer"
                >
                  Arcade Menu
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Inspection & Restoration Tool Panel */}
        <div className="paper-card p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="border-b border-[#5c4033]/15 dark:border-purple-400/20 pb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#a34063] dark:text-pink-300">
                Active Star Inspection
              </span>
              <h4 className="font-serif-heading font-bold text-lg text-[#5c4033] dark:text-purple-100">
                {selectedStar.name}
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-snug">
                {selectedStar.lore}
              </p>
            </div>

            {/* Meters */}
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Cosmic Soot:</span>
                  <span className="text-stone-500">{selectedStar.sootLevel}%</span>
                </div>
                <div className="w-full h-2 bg-stone-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-stone-500 rounded-full transition-all duration-300"
                    style={{ width: `${selectedStar.sootLevel}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Starlight Radiance:</span>
                  <span className="text-amber-600 dark:text-amber-300">{selectedStar.glowLevel}%</span>
                </div>
                <div className="w-full h-2 bg-stone-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-300"
                    style={{ width: `${selectedStar.glowLevel}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Tool Selection */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-stone-700 dark:text-purple-200 block mb-1.5">
                Select Bureau Tool:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    sound.playTap();
                    setToolAction('brush');
                  }}
                  className={`p-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                    toolAction === 'brush'
                      ? 'bg-amber-100 dark:bg-amber-950/70 border-amber-400 text-amber-900 dark:text-amber-200'
                      : 'bg-white dark:bg-slate-800 border-stone-200 dark:border-slate-700'
                  }`}
                >
                  <span>🧹 Stardust Brush</span>
                </button>
                <button
                  onClick={() => {
                    sound.playTap();
                    setToolAction('polish');
                  }}
                  className={`p-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                    toolAction === 'polish'
                      ? 'bg-purple-100 dark:bg-purple-950/70 border-purple-400 text-purple-900 dark:text-purple-200'
                      : 'bg-white dark:bg-slate-800 border-stone-200 dark:border-slate-700'
                  }`}
                >
                  <span>✨ Moon Polish</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => handleApplyTool(selectedStar.id)}
            disabled={selectedStar.glowLevel >= 100}
            className={`w-full py-3 rounded-full font-rounded font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${
              selectedStar.glowLevel >= 100
                ? 'bg-emerald-100 text-emerald-800 cursor-not-allowed border border-emerald-300'
                : 'bg-gradient-to-r from-[#a34063] to-[#802a4b] hover:from-[#b54a72] hover:to-[#913256] text-white'
            }`}
          >
            {selectedStar.glowLevel >= 100 ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Star Fully Restored!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>
                  Apply {toolAction === 'brush' ? 'Stardust Brush' : 'Moon Polish'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
