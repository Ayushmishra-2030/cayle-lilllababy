import React, { useState, useEffect, useRef } from 'react';
import { useProgression } from '../../../context/ProgressionContext';
import { sound } from '../../../utils/audio';
import { ArrowLeft, RotateCcw } from 'lucide-react';

interface DreamStackerProps {
  onBack: () => void;
}

interface Block {
  level: number;
  left: number; // percentage
  width: number; // percentage
  color: string;
}

const COLORS = [
  '#c4b5fd', '#a78bfa', '#f472b6', '#fb7185',
  '#fde047', '#38bdf8', '#4ade80', '#fb923c',
  '#e879f9', '#818cf8',
];

export const DreamStackerGame: React.FC<DreamStackerProps> = ({ onBack }) => {
  const { recordGameCompletion } = useProgression();
  const [blocks, setBlocks] = useState<Block[]>([
    { level: 0, left: 30, width: 40, color: '#a78bfa' }, // Base block
  ]);
  const [currentBlock, setCurrentBlock] = useState<{
    left: number;
    width: number;
    direction: number; // 1 for right, -1 for left
    speed: number;
  }>({ left: 10, width: 40, direction: 1, speed: 0.9 });

  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [firstTimeReward, setFirstTimeReward] = useState<number | null>(null);

  const TARGET_HEIGHT = 8;
  const currentLevel = blocks.length;

  // Animation frame loop for moving block
  useEffect(() => {
    if (gameState !== 'playing') return;

    let animId: number;
    const loop = () => {
      setCurrentBlock((prev) => {
        let nextLeft = prev.left + prev.direction * prev.speed;
        let nextDir = prev.direction;

        if (nextLeft <= 5) {
          nextLeft = 5;
          nextDir = 1;
        } else if (nextLeft + prev.width >= 95) {
          nextLeft = 95 - prev.width;
          nextDir = -1;
        }

        return { ...prev, left: nextLeft, direction: nextDir };
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState]);

  // Drop block
  const handleDrop = () => {
    if (gameState !== 'playing') return;

    sound.playTap();
    const prevBlock = blocks[blocks.length - 1];
    const currLeft = currentBlock.left;
    const currWidth = currentBlock.width;

    // Calculate overlap with previous block
    const overlapLeft = Math.max(prevBlock.left, currLeft);
    const overlapRight = Math.min(prevBlock.left + prevBlock.width, currLeft + currWidth);
    const overlapWidth = overlapRight - overlapLeft;

    if (overlapWidth <= 3) {
      // Complete miss!
      sound.playChime(220, 0.4, 'sawtooth');
      setGameState('lost');
      return;
    }

    // Success slice!
    sound.playStarCatch();
    const newBlock: Block = {
      level: currentLevel,
      left: overlapLeft,
      width: overlapWidth,
      color: COLORS[currentLevel % COLORS.length],
    };

    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);

    // Check Win
    if (newBlocks.length >= TARGET_HEIGHT) {
      sound.playLevelUp();
      setGameState('won');
      const res = recordGameCompletion('game-4-dream-stacker');
      if (res.firstTime) {
        setFirstTimeReward(res.xpAwarded);
      }
      return;
    }

    // Prepare next higher moving block with slightly higher speed
    setCurrentBlock({
      left: 10,
      width: overlapWidth,
      direction: 1,
      speed: 0.9 + currentLevel * 0.15,
    });
  };

  const handleRestart = () => {
    sound.playTap();
    setBlocks([{ level: 0, left: 30, width: 40, color: '#a78bfa' }]);
    setCurrentBlock({ left: 10, width: 40, direction: 1, speed: 0.9 });
    setGameState('playing');
  };

  // Keyboard Spacebar / Enter support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        handleDrop();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

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
            Tower Height: {blocks.length} / {TARGET_HEIGHT}
          </div>
          <button
            onClick={handleRestart}
            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Game Tower Stage */}
      <div
        onClick={handleDrop}
        className="relative w-full h-[440px] rounded-3xl bg-gradient-to-b from-[#180b2b] via-[#2c1254] to-[#0c051a] border-4 border-purple-500/30 shadow-2xl overflow-hidden cursor-pointer select-none p-4"
      >
        <div className="absolute top-4 left-6 text-xs text-purple-300 font-medium">
          Click screen or press Spacebar to drop block!
        </div>

        {/* Moving Block at current level */}
        {gameState === 'playing' && (
          <div
            style={{
              left: `${currentBlock.left}%`,
              bottom: `${40 + currentLevel * 36}px`,
              width: `${currentBlock.width}%`,
              height: '32px',
              backgroundColor: COLORS[currentLevel % COLORS.length],
            }}
            className="absolute rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.4)] border border-white/60 flex items-center justify-center text-xs font-bold text-stone-900"
          >
            ☁️
          </div>
        )}

        {/* Placed Stacked Blocks */}
        {blocks.map((block) => (
          <div
            key={block.level}
            style={{
              left: `${block.left}%`,
              bottom: `${40 + block.level * 36}px`,
              width: `${block.width}%`,
              height: '32px',
              backgroundColor: block.color,
            }}
            className="absolute rounded-xl shadow-md border border-white/40 flex items-center justify-center text-xs font-semibold text-stone-900 transition-all duration-150"
          >
            ☁️ {block.level === 0 ? 'Base' : `#${block.level}`}
          </div>
        ))}

        {/* Won Overlay */}
        {gameState === 'won' && (
          <div className="absolute inset-0 bg-purple-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white space-y-3 z-30 animate-fade-in">
            <div className="text-5xl animate-bounce">🏰☁️✨</div>
            <h3 className="text-2xl font-serif-heading font-bold text-amber-300">
              Skyward Tower Complete!
            </h3>
            <p className="text-sm text-purple-200">
              You stacked {TARGET_HEIGHT} dream blocks into the clouds!
            </p>
            {firstTimeReward && (
              <div className="bg-amber-400/20 border border-amber-400/50 text-amber-200 px-4 py-2 rounded-xl text-xs font-semibold">
                First Completion Bonus: +{firstTimeReward} XP Awarded!
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleRestart}
                className="px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-xs cursor-pointer"
              >
                Build Another
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

        {/* Lost Overlay */}
        {gameState === 'lost' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white space-y-3 z-30 animate-fade-in">
            <div className="text-5xl">💨☁️</div>
            <h3 className="text-2xl font-serif-heading font-bold text-rose-300">
              The Dream Cushion Slipped!
            </h3>
            <p className="text-sm text-purple-200">
              You reached height {blocks.length - 1} of {TARGET_HEIGHT}. Give it another gentle try!
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleRestart}
                className="px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-xs cursor-pointer"
              >
                Try Again
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

      <div className="text-center">
        <button
          onClick={handleDrop}
          className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-900 font-rounded font-bold text-sm shadow-md active:scale-95 cursor-pointer"
        >
          Drop Dream Block (Tap Here or Spacebar)
        </button>
      </div>
    </div>
  );
};
