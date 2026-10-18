import React, { useState, useEffect } from 'react';
import { useProgression } from '../../../context/ProgressionContext';
import { sound } from '../../../utils/audio';
import { ArrowLeft, RotateCcw, Lightbulb, Sparkles, CheckCircle2 } from 'lucide-react';

interface ConstellationProps {
  onBack: () => void;
}

interface StarPoint {
  id: number;
  label: string;
  x: number; // percentage
  y: number; // percentage
  noteFreq: number;
}

// 7 stars forming "The Celestial Moon-Moth"
const STARS_SEQUENCE: StarPoint[] = [
  { id: 1, label: '1: Head of Light', x: 50, y: 22, noteFreq: 523.25 }, // C5
  { id: 2, label: '2: Left Antenna', x: 26, y: 16, noteFreq: 587.33 }, // D5
  { id: 3, label: '3: Right Antenna', x: 74, y: 16, noteFreq: 659.25 }, // E5
  { id: 4, label: '4: Heart Clasp', x: 50, y: 46, noteFreq: 698.46 }, // F5
  { id: 5, label: '5: Left Star Wing', x: 18, y: 58, noteFreq: 783.99 }, // G5
  { id: 6, label: '6: Right Star Wing', x: 82, y: 58, noteFreq: 880.0 }, // A5
  { id: 7, label: '7: Moonbeam Tail', x: 50, y: 82, noteFreq: 1046.5 }, // C6
];

export const ConstellationGame: React.FC<ConstellationProps> = ({ onBack }) => {
  const { recordGameCompletion, discoverEasterEgg } = useProgression();
  const [connectedIds, setConnectedIds] = useState<number[]>([]);
  const [hintActive, setHintActive] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [firstTimeReward, setFirstTimeReward] = useState<number | null>(null);

  const nextTargetId = connectedIds.length === 0 ? 1 : connectedIds[connectedIds.length - 1] + 1;

  const handleStarClick = (star: StarPoint) => {
    // If already connected, ignore
    if (connectedIds.includes(star.id)) return;

    if (star.id === nextTargetId) {
      sound.playChime(star.noteFreq, 0.4, 'triangle');
      const nextList = [...connectedIds, star.id];
      setConnectedIds(nextList);
      setHintActive(false);

      // Check if won
      if (nextList.length === STARS_SEQUENCE.length) {
        setIsWon(true);
        sound.playLevelUp();
        const res = recordGameCompletion('game-3-constellation-connector');
        if (res.firstTime) {
          setFirstTimeReward(res.xpAwarded);
        }
        // Also trigger Easter egg #7 "Hidden Moth Constellation"
        discoverEasterEgg('egg-7-hidden-constellation');
      }
    } else {
      // Wrong star clicked - gentle error tap
      sound.playTap();
      setHintActive(true);
    }
  };

  const handleReset = () => {
    sound.playTap();
    setConnectedIds([]);
    setIsWon(false);
    setHintActive(false);
  };

  const handleHint = () => {
    sound.playSparkle();
    setHintActive(true);
  };

  // Keyboard support: pressing 1-7 connects stars
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 7) {
        const star = STARS_SEQUENCE.find((s) => s.id === num);
        if (star) handleStarClick(star);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [connectedIds, nextTargetId]);

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
            onClick={handleHint}
            disabled={isWon}
            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border border-amber-300 cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Hint</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Celestial Canvas */}
      <div className="relative w-full h-[400px] sm:h-[460px] rounded-3xl bg-gradient-to-b from-[#090a1f] via-[#16153b] to-[#25153b] border-4 border-amber-300/40 shadow-2xl overflow-hidden p-6 select-none">
        {/* Constellation Title Badge */}
        <div className="absolute top-4 left-6 z-10">
          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300">
            Lost Celestial Chart
          </span>
          <h3 className="font-serif-heading font-bold text-lg text-purple-100">
            The Great Moon-Moth Constellation
          </h3>
          <p className="text-xs text-purple-300 font-medium">
            Step {connectedIds.length} of 7 • {isWon ? 'Complete!' : `Tap Star #${nextTargetId}`}
          </p>
        </div>

        {/* SVG Thread Lines Connecting Stars */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {connectedIds.map((id, index) => {
            if (index === 0) return null;
            const prevStar = STARS_SEQUENCE.find((s) => s.id === connectedIds[index - 1])!;
            const currStar = STARS_SEQUENCE.find((s) => s.id === id)!;
            return (
              <line
                key={`line-${id}`}
                x1={`${prevStar.x}%`}
                y1={`${prevStar.y}%`}
                x2={`${currStar.x}%`}
                y2={`${currStar.y}%`}
                stroke="#fde047"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_#fde047]"
              />
            );
          })}
        </svg>

        {/* Star Nodes */}
        {STARS_SEQUENCE.map((star) => {
          const isConnected = connectedIds.includes(star.id);
          const isNext = star.id === nextTargetId;
          const showHint = hintActive && isNext;

          return (
            <button
              key={star.id}
              onClick={() => handleStarClick(star)}
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`absolute p-2.5 rounded-full transition-all duration-300 cursor-pointer z-20 ${
                isConnected
                  ? 'scale-110 text-amber-200'
                  : isNext
                  ? 'scale-125 text-amber-400 animate-pulse ring-4 ring-amber-400/50'
                  : 'text-stone-400 hover:text-amber-200 hover:scale-110'
              }`}
              title={star.label}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-all ${
                  isConnected
                    ? 'bg-amber-400 text-stone-900 drop-shadow-[0_0_12px_#fbbf24]'
                    : showHint
                    ? 'bg-amber-300 text-stone-900 animate-bounce'
                    : isNext
                    ? 'bg-purple-900 border-2 border-amber-300 text-amber-200'
                    : 'bg-slate-900/80 border border-stone-600 text-stone-300'
                }`}
              >
                {isConnected ? '⭐' : star.id}
              </div>
              <span className="block text-[10px] text-center font-semibold text-purple-200 whitespace-nowrap mt-1 drop-shadow">
                {star.label.split(':')[1]}
              </span>
            </button>
          );
        })}

        {/* Won Overlay with Story Reveal */}
        {isWon && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white space-y-4 z-30 animate-fade-in">
            <div className="text-5xl animate-bounce">🦋✨🌌</div>
            <h3 className="text-2xl font-serif-heading font-bold text-amber-300">
              Constellation Illuminated!
            </h3>
            <div className="max-w-md bg-purple-900/40 border border-purple-400/30 p-4 rounded-2xl text-xs sm:text-sm text-purple-200 leading-relaxed space-y-2">
              <p>
                <strong>Celestial Sky Lore:</strong> According to ancient Star Bureau charts,
                the Celestial Moon-Moth constellation guides all wayward dreamers safely through stormy night skies.
              </p>
              <p className="italic font-handwriting text-base text-pink-300">
                &ldquo;Where the star moth flies, no dream shall ever lose its way.&rdquo;
              </p>
            </div>
            {firstTimeReward && (
              <div className="bg-amber-400/20 border border-amber-400/50 text-amber-200 px-4 py-2 rounded-xl text-xs font-semibold">
                First Completion Bonus: +{firstTimeReward} XP Awarded!
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-xs cursor-pointer"
              >
                Connect Again
              </button>
              <button
                onClick={onBack}
                className="px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-xs cursor-pointer"
              >
                Arcade Menu
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-xs text-stone-500">
        Tip: You can also press number keys 1 through 7 on your keyboard to connect stars!
      </div>
    </div>
  );
};
