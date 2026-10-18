import React, { useState, useEffect, useRef } from 'react';
import { useProgression } from '../../../context/ProgressionContext';
import { sound } from '../../../utils/audio';
import { Play, Pause, RotateCcw, Trophy, ArrowLeft, ArrowRight, ShieldAlert } from 'lucide-react';

interface WishCatcherProps {
  onBack: () => void;
}

interface Item {
  id: number;
  x: number;
  y: number;
  speed: number;
  type: 'star' | 'bottle' | 'cloud';
}

export const WishCatcherGame: React.FC<WishCatcherProps> = ({ onBack }) => {
  const { recordGameCompletion, progress } = useProgression();
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused' | 'won' | 'lost'>('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [basketX, setBasketX] = useState(50); // percentage 0 - 100
  const [firstTimeReward, setFirstTimeReward] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Item[]>([]);
  const nextItemId = useRef(1);
  const keysPressed = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });

  const TARGET_SCORE = 100;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysPressed.current.left = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysPressed.current.right = true;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysPressed.current.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysPressed.current.right = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main game loop (Movement & Spawning)
  useEffect(() => {
    if (gameState !== 'playing') return;

    let animId: number;
    let lastSpawn = Date.now();

    const loop = () => {
      // Move basket with keys
      if (keysPressed.current.left) {
        setBasketX((prev) => Math.max(8, prev - 2.5));
      }
      if (keysPressed.current.right) {
        setBasketX((prev) => Math.min(92, prev + 2.5));
      }

      // Spawn falling items
      const now = Date.now();
      const spawnInterval = Math.max(450, 900 - (45 - timeLeft) * 12);
      if (now - lastSpawn > spawnInterval) {
        lastSpawn = now;
        const rand = Math.random();
        let type: Item['type'] = 'star';
        if (rand > 0.75) type = 'bottle';
        else if (rand > 0.55) type = 'cloud';

        itemsRef.current.push({
          id: nextItemId.current++,
          x: Math.random() * 80 + 10,
          y: -5,
          speed: Math.random() * 0.7 + 0.9 + (45 - timeLeft) * 0.02,
          type,
        });
      }

      // Update item positions and check collision
      const remaining: Item[] = [];
      const basketWidth = 16; // 16% width

      itemsRef.current.forEach((item) => {
        item.y += item.speed;

        // Check if item hits basket level (around y=82 to 92%)
        if (item.y >= 82 && item.y <= 92) {
          const hitBasket = Math.abs(item.x - basketX) < basketWidth;
          if (hitBasket) {
            // Collision caught!
            if (item.type === 'star') {
              sound.playStarCatch();
              setScore((s) => s + 10);
            } else if (item.type === 'bottle') {
              sound.playSparkle();
              setScore((s) => s + 25);
            } else if (item.type === 'cloud') {
              sound.playTap();
              setScore((s) => Math.max(0, s - 15));
            }
            return; // Dropped and caught
          }
        }

        if (item.y < 105) {
          remaining.push(item);
        }
      });

      itemsRef.current = remaining;
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animId);
  }, [gameState, basketX, timeLeft]);

  // Countdown timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Check win condition
          setGameState(score >= TARGET_SCORE ? 'won' : 'lost');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, score]);

  // Handle victory completion XP reward
  useEffect(() => {
    if (gameState === 'won') {
      const res = recordGameCompletion('game-1-wish-catcher', score);
      if (res.firstTime) {
        setFirstTimeReward(res.xpAwarded);
      }
    }
  }, [gameState, score, recordGameCompletion]);

  const startGame = () => {
    sound.playTap();
    setScore(0);
    setTimeLeft(45);
    setBasketX(50);
    itemsRef.current = [];
    setGameState('playing');
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (gameState !== 'playing' || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    const pct = Math.max(8, Math.min(92, (touchX / rect.width) * 100));
    setBasketX(pct);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (gameState !== 'playing' || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const pct = Math.max(8, Math.min(92, (mouseX / rect.width) * 100));
    setBasketX(pct);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
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

        <div className="flex items-center gap-3">
          <div className="bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700/50 px-3 py-1 rounded-xl text-xs font-bold text-amber-900 dark:text-amber-200">
            Score: {score} / {TARGET_SCORE} pts
          </div>
          <div className="bg-purple-100 dark:bg-purple-950/70 border border-purple-300 dark:border-purple-700/50 px-3 py-1 rounded-xl text-xs font-bold text-purple-900 dark:text-purple-200">
            Time: {timeLeft}s
          </div>
        </div>
      </div>

      {/* Main Game Screen Canvas */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full h-[400px] sm:h-[460px] rounded-3xl bg-gradient-to-b from-[#1e1b4b] via-[#2e1065] to-[#0f172a] border-4 border-amber-300/40 shadow-2xl overflow-hidden select-none cursor-crosshair"
      >
        {/* Distant Twinkling Stars */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-10 left-12 text-xs">✨</div>
          <div className="absolute top-24 right-20 text-xs">⭐</div>
          <div className="absolute top-48 left-1/3 text-xs">✨</div>
          <div className="absolute top-72 right-1/4 text-xs">⭐</div>
        </div>

        {/* Falling items */}
        {gameState === 'playing' &&
          itemsRef.current.map((item) => (
            <div
              key={item.id}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute text-2xl transition-all duration-75 pointer-events-none"
            >
              {item.type === 'star' ? (
                <span className="drop-shadow-[0_0_8px_#fde047]">⭐</span>
              ) : item.type === 'bottle' ? (
                <span className="drop-shadow-[0_0_10px_#f472b6]">🍶</span>
              ) : (
                <span className="opacity-80">☁️</span>
              )}
            </div>
          ))}

        {/* Player Basket (Caylee's Magical Wish Satchel) */}
        <div
          style={{
            left: `${basketX}%`,
            bottom: '24px',
            transform: 'translateX(-50%)',
          }}
          className="absolute flex flex-col items-center pointer-events-none transition-all duration-75"
        >
          {/* Satchel Graphic */}
          <div className="w-16 h-10 bg-gradient-to-r from-amber-600 to-amber-800 rounded-b-2xl border-2 border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.6)] flex items-center justify-center text-white text-xs font-bold">
            ✨ Satchel
          </div>
        </div>

        {/* Start / Intro Overlay */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
            <div className="text-4xl animate-bounce">🧺✨</div>
            <h3 className="text-2xl font-serif-heading font-bold text-amber-200">
              Wish Catcher
            </h3>
            <p className="max-w-md text-xs sm:text-sm text-purple-200 leading-relaxed">
              Catch falling glowing stars (+10) and magical wish bottles (+25). Avoid dark storm clouds (-15).
              Score at least 100 points in 45 seconds to win!
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-900 font-rounded font-bold text-sm shadow-xl transition-transform active:scale-95 cursor-pointer"
            >
              Start Catching Wishes
            </button>
          </div>
        )}

        {/* Pause Overlay */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
            <h3 className="text-2xl font-bold font-serif-heading text-amber-200">Game Paused</h3>
            <button
              onClick={() => setGameState('playing')}
              className="px-6 py-2.5 rounded-full bg-amber-400 text-stone-900 font-bold text-sm"
            >
              Resume
            </button>
          </div>
        )}

        {/* Won Overlay */}
        {gameState === 'won' && (
          <div className="absolute inset-0 bg-purple-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white space-y-3 animate-fade-in">
            <div className="text-5xl animate-bounce">🎉⭐</div>
            <h3 className="text-2xl font-serif-heading font-bold text-amber-300">
              Wonderful Catching!
            </h3>
            <p className="text-sm text-purple-200">
              You scored <span className="font-bold text-amber-300">{score}</span> points and saved the wandering wishes!
            </p>
            {firstTimeReward && (
              <div className="bg-amber-400/20 border border-amber-400/40 text-amber-200 px-4 py-2 rounded-2xl text-xs font-semibold">
                First Completion Bonus: +{firstTimeReward} XP Awarded!
              </div>
            )}
            <div className="flex gap-3 mt-2">
              <button
                onClick={startGame}
                className="px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-900 font-rounded font-bold text-sm cursor-pointer shadow"
              >
                Play Again
              </button>
              <button
                onClick={onBack}
                className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-purple-200 text-sm font-semibold cursor-pointer"
              >
                Arcade Menu
              </button>
            </div>
          </div>
        )}

        {/* Lost Overlay */}
        {gameState === 'lost' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white space-y-3 animate-fade-in">
            <div className="text-5xl">🌙</div>
            <h3 className="text-2xl font-serif-heading font-bold text-rose-300">
              Time Ran Out!
            </h3>
            <p className="text-sm text-purple-200">
              You reached <span className="font-bold text-amber-300">{score}</span> points (Goal: {TARGET_SCORE}).
              Don&apos;t worry, Caylee will catch the rest!
            </p>
            <div className="flex gap-3 mt-2">
              <button
                onClick={startGame}
                className="px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-900 font-rounded font-bold text-sm cursor-pointer shadow"
              >
                Try Again
              </button>
              <button
                onClick={onBack}
                className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-purple-200 text-sm font-semibold cursor-pointer"
              >
                Arcade Menu
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Touch / Mobile Controls */}
      <div className="flex items-center justify-between sm:hidden px-2 pt-1">
        <button
          onTouchStart={() => (keysPressed.current.left = true)}
          onTouchEnd={() => (keysPressed.current.left = false)}
          onMouseDown={() => (keysPressed.current.left = true)}
          onMouseUp={() => (keysPressed.current.left = false)}
          className="w-20 h-14 rounded-2xl bg-[#a34063] text-white flex items-center justify-center active:bg-[#802a4b] shadow-md select-none"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-xs text-stone-500 font-medium">Touch or Arrow Keys</span>
        <button
          onTouchStart={() => (keysPressed.current.right = true)}
          onTouchEnd={() => (keysPressed.current.right = false)}
          onMouseDown={() => (keysPressed.current.right = true)}
          onMouseUp={() => (keysPressed.current.right = false)}
          className="w-20 h-14 rounded-2xl bg-[#a34063] text-white flex items-center justify-center active:bg-[#802a4b] shadow-md select-none"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
