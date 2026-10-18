import React, { useState, useEffect } from 'react';
import { useProgression } from '../../../context/ProgressionContext';
import { sound } from '../../../utils/audio';
import { ArrowLeft, RotateCcw, ArrowUp, ArrowDown, ArrowLeft as ArrowL, ArrowRight as ArrowR, Key, DoorClosed, CheckCircle2 } from 'lucide-react';

interface MazeProps {
  onBack: () => void;
}

// 0 = path, 1 = wall, 2 = star key, 3 = moon gate exit
const MAZE_MAP: number[][] = [
  [0, 0, 1, 0, 0, 0, 1, 0, 0],
  [1, 0, 1, 0, 1, 0, 1, 0, 1],
  [0, 0, 0, 2, 1, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 2, 0],
  [1, 1, 1, 0, 1, 1, 1, 1, 1],
  [0, 2, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 0, 1, 1, 0],
  [0, 0, 0, 2, 1, 0, 0, 0, 3], // 3 is Moon Gate exit
];

export const DreamMazeGame: React.FC<MazeProps> = ({ onBack }) => {
  const { recordGameCompletion } = useProgression();
  const [playerPos, setPlayerPos] = useState<{ r: number; c: number }>({ r: 0, c: 0 });
  const [collectedKeys, setCollectedKeys] = useState<{ r: number; c: number }[]>([]);
  const [isWon, setIsWon] = useState(false);
  const [firstTimeReward, setFirstTimeReward] = useState<number | null>(null);

  const TOTAL_KEYS = 4;

  const movePlayer = (dr: number, dc: number) => {
    if (isWon) return;

    const newR = playerPos.r + dr;
    const newC = playerPos.c + dc;

    // Bounds check
    if (newR < 0 || newR >= MAZE_MAP.length || newC < 0 || newC >= MAZE_MAP[0].length) {
      return;
    }

    // Wall check
    if (MAZE_MAP[newR][newC] === 1) {
      sound.playTap();
      return;
    }

    // Valid move!
    setPlayerPos({ r: newR, c: newC });

    // Check Star Key collection
    if (MAZE_MAP[newR][newC] === 2) {
      const already = collectedKeys.some((k) => k.r === newR && k.c === newC);
      if (!already) {
        sound.playStarCatch();
        setCollectedKeys((prev) => [...prev, { r: newR, c: newC }]);
      }
    }

    // Check Moon Gate Exit
    if (MAZE_MAP[newR][newC] === 3) {
      if (collectedKeys.length >= TOTAL_KEYS) {
        // WIN!
        sound.playLevelUp();
        setIsWon(true);
        const res = recordGameCompletion('game-7-dream-maze');
        if (res.firstTime) {
          setFirstTimeReward(res.xpAwarded);
        }
      } else {
        sound.playTap();
      }
    }
  };

  const handleReset = () => {
    sound.playTap();
    setPlayerPos({ r: 0, c: 0 });
    setCollectedKeys([]);
    setIsWon(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') movePlayer(-1, 0);
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') movePlayer(1, 0);
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') movePlayer(0, -1);
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') movePlayer(0, 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
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
          <div className="bg-amber-100 dark:bg-amber-950/70 border border-amber-300 text-xs font-bold px-3 py-1 rounded-xl text-amber-900 dark:text-amber-200 flex items-center gap-1">
            <Key className="w-3.5 h-3.5" />
            <span>Keys: {collectedKeys.length} / {TOTAL_KEYS}</span>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Maze Board */}
      <div className="relative p-3 sm:p-5 rounded-3xl bg-gradient-to-b from-[#120924] to-[#20103c] border-4 border-purple-400/30 shadow-2xl">
        <div className="grid grid-cols-9 gap-1 max-w-sm sm:max-w-md mx-auto aspect-square">
          {MAZE_MAP.map((row, r) =>
            row.map((cell, c) => {
              const isPlayer = playerPos.r === r && playerPos.c === c;
              const isKey = cell === 2;
              const keyCollected = collectedKeys.some((k) => k.r === r && k.c === c);
              const isExit = cell === 3;
              const isWall = cell === 1;

              return (
                <div
                  key={`${r}-${c}`}
                  className={`rounded-lg flex items-center justify-center transition-all duration-150 text-base sm:text-xl select-none ${
                    isWall
                      ? 'bg-purple-950/90 border border-purple-800/60 shadow-inner'
                      : 'bg-white/10 border border-white/5'
                  }`}
                >
                  {isPlayer ? (
                    <span className="animate-bounce drop-shadow-[0_0_8px_#c4b5fd]">🦋</span>
                  ) : isExit ? (
                    <span className="drop-shadow-[0_0_10px_#fde047]">🌙</span>
                  ) : isKey && !keyCollected ? (
                    <span className="animate-pulse drop-shadow-[0_0_8px_#fde047]">⭐</span>
                  ) : null}
                </div>
              );
            })
          )}
        </div>

        {/* Won Overlay */}
        {isWon && (
          <div className="absolute inset-0 bg-purple-950/90 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-6 text-center text-white space-y-3 z-30 animate-fade-in">
            <div className="text-5xl animate-bounce">🚪🌙✨</div>
            <h3 className="text-2xl font-serif-heading font-bold text-amber-300">
              Moon Gate Unlocked!
            </h3>
            <p className="text-sm text-purple-200 max-w-xs">
              Caylee safely navigated the cloud corridors and opened the gate to the deep cosmos!
            </p>
            {firstTimeReward && (
              <div className="bg-amber-400/20 border border-amber-400/50 text-amber-200 px-4 py-2 rounded-xl text-xs font-semibold">
                First Completion Bonus: +{firstTimeReward} XP Awarded!
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-xs cursor-pointer"
              >
                Play Again
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

      {/* D-Pad Controls for mobile / touch */}
      <div className="flex flex-col items-center justify-center gap-1.5 pt-2">
        <button
          onClick={() => movePlayer(-1, 0)}
          className="w-14 h-12 rounded-xl bg-[#a34063] text-white flex items-center justify-center active:bg-[#802a4b] shadow cursor-pointer"
          aria-label="Move Up"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => movePlayer(0, -1)}
            className="w-14 h-12 rounded-xl bg-[#a34063] text-white flex items-center justify-center active:bg-[#802a4b] shadow cursor-pointer"
            aria-label="Move Left"
          >
            <ArrowL className="w-5 h-5" />
          </button>
          <button
            onClick={() => movePlayer(1, 0)}
            className="w-14 h-12 rounded-xl bg-[#a34063] text-white flex items-center justify-center active:bg-[#802a4b] shadow cursor-pointer"
            aria-label="Move Down"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
          <button
            onClick={() => movePlayer(0, 1)}
            className="w-14 h-12 rounded-xl bg-[#a34063] text-white flex items-center justify-center active:bg-[#802a4b] shadow cursor-pointer"
            aria-label="Move Right"
          >
            <ArrowR className="w-5 h-5" />
          </button>
        </div>
        <span className="text-[11px] text-stone-500 mt-1">
          Use buttons or keyboard Arrow / WASD keys
        </span>
      </div>
    </div>
  );
};
