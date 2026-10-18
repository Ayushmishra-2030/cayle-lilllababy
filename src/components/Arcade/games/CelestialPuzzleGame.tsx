import React, { useState, useEffect } from 'react';
import { useProgression } from '../../../context/ProgressionContext';
import { sound } from '../../../utils/audio';
import { ArrowLeft, RotateCcw, Wand2 } from 'lucide-react';

interface PuzzleProps {
  onBack: () => void;
}

const SOLVED_TILES = [1, 2, 3, 4, 5, 6, 7, 8, 0]; // 0 is empty slot

const TILE_SYMBOLS: Record<number, { icon: string; name: string }> = {
  1: { icon: '🌙', name: 'Moon' },
  2: { icon: '⭐', name: 'Star' },
  3: { icon: '🦋', name: 'Moth' },
  4: { icon: '✨', name: 'Spark' },
  5: { icon: '🏮', name: 'Lantern' },
  6: { icon: '📜', name: 'Scroll' },
  7: { icon: '🍶', name: 'Bottle' },
  8: { icon: '👑', name: 'Crown' },
  0: { icon: '', name: 'Empty' },
};

function getShuffledTiles(): number[] {
  // Start solved and make 14 valid random moves to ensure solvability
  let current = [...SOLVED_TILES];
  for (let step = 0; step < 18; step++) {
    const emptyIdx = current.indexOf(0);
    const validMoves: number[] = [];
    const r = Math.floor(emptyIdx / 3);
    const c = emptyIdx % 3;

    if (r > 0) validMoves.push(emptyIdx - 3); // Up
    if (r < 2) validMoves.push(emptyIdx + 3); // Down
    if (c > 0) validMoves.push(emptyIdx - 1); // Left
    if (c < 2) validMoves.push(emptyIdx + 1); // Right

    const chosen = validMoves[Math.floor(Math.random() * validMoves.length)];
    // Swap
    const temp = current[emptyIdx];
    current[emptyIdx] = current[chosen];
    current[chosen] = temp;
  }
  return current;
}

export const CelestialPuzzleGame: React.FC<PuzzleProps> = ({ onBack }) => {
  const { recordGameCompletion } = useProgression();
  const [tiles, setTiles] = useState<number[]>(getShuffledTiles);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [firstTimeReward, setFirstTimeReward] = useState<number | null>(null);

  const checkWin = (arr: number[]) => {
    return arr.every((val, idx) => val === SOLVED_TILES[idx]);
  };

  const handleTileClick = (index: number) => {
    if (isWon) return;

    const emptyIdx = tiles.indexOf(0);
    const r1 = Math.floor(index / 3);
    const c1 = index % 3;
    const r2 = Math.floor(emptyIdx / 3);
    const c2 = emptyIdx % 3;

    // Check adjacency
    const isAdjacent = Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
    if (!isAdjacent) {
      sound.playTap();
      return;
    }

    sound.playTap();
    const newTiles = [...tiles];
    newTiles[emptyIdx] = tiles[index];
    newTiles[index] = 0;
    setTiles(newTiles);
    setMoves((m) => m + 1);

    if (checkWin(newTiles)) {
      sound.playLevelUp();
      setIsWon(true);
      const res = recordGameCompletion('game-8-celestial-puzzle');
      if (res.firstTime) {
        setFirstTimeReward(res.xpAwarded);
      }
    }
  };

  const handleMagicSolve = () => {
    sound.playSparkle();
    setTiles([...SOLVED_TILES]);
    setIsWon(true);
    const res = recordGameCompletion('game-8-celestial-puzzle');
    if (res.firstTime) {
      setFirstTimeReward(res.xpAwarded);
    }
  };

  const handleReset = () => {
    sound.playTap();
    setTiles(getShuffledTiles());
    setMoves(0);
    setIsWon(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Top Bar */}
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
          <div className="bg-amber-100 dark:bg-amber-950/70 border border-amber-300 text-xs font-bold px-3 py-1 rounded-xl text-amber-900 dark:text-amber-200">
            Moves: {moves}
          </div>
          <button
            onClick={handleMagicSolve}
            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 border border-purple-300 cursor-pointer"
            title="Use Bureau Magic to align tiles"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Magic Align</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 dark:bg-slate-800 border border-stone-300 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Shuffle</span>
          </button>
        </div>
      </div>

      {/* 3x3 Puzzle Board */}
      <div className="relative p-4 sm:p-6 rounded-3xl bg-gradient-to-b from-[#190a34] to-[#2b1250] border-4 border-amber-400/40 shadow-2xl">
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 max-w-xs sm:max-w-sm mx-auto aspect-square">
          {tiles.map((num, idx) => {
            const isEmpty = num === 0;
            const item = TILE_SYMBOLS[num];

            return (
              <button
                key={idx}
                onClick={() => handleTileClick(idx)}
                disabled={isEmpty}
                className={`rounded-2xl flex flex-col items-center justify-center transition-all duration-200 select-none shadow ${
                  isEmpty
                    ? 'bg-purple-950/40 border-2 border-dashed border-purple-700/50 cursor-default'
                    : 'bg-gradient-to-br from-amber-100 to-rose-100 dark:from-purple-900 dark:to-pink-900 border-2 border-amber-300/80 hover:scale-103 cursor-pointer'
                }`}
              >
                {!isEmpty && (
                  <>
                    <span className="text-2xl sm:text-3xl">{item.icon}</span>
                    <span className="text-[10px] font-bold text-stone-700 dark:text-amber-200 mt-1">
                      #{num} {item.name}
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Won Overlay */}
        {isWon && (
          <div className="absolute inset-0 bg-purple-950/90 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-6 text-center text-white space-y-3 z-30 animate-fade-in">
            <div className="text-5xl animate-bounce">🧩👑✨</div>
            <h3 className="text-2xl font-serif-heading font-bold text-amber-300">
              Bureau Seal Restored!
            </h3>
            <p className="text-sm text-purple-200 max-w-xs">
              All celestial fresco tiles have aligned perfectly in the sacred Bureau emblem!
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

      <div className="text-center text-xs text-stone-500">
        Tap adjacent tiles to slide them into the empty slot and arrange them in order 1-8.
      </div>
    </div>
  );
};
