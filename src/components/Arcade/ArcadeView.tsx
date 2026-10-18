import React, { useState } from 'react';
import { useProgression } from '../../context/ProgressionContext';
import { ARCADE_GAMES } from '../../constants/gameData';
import { sound } from '../../utils/audio';
import { WishCatcherGame } from './games/WishCatcherGame';
import { StarRepairGame } from './games/StarRepairGame';
import { ConstellationGame } from './games/ConstellationGame';
import { DreamStackerGame } from './games/DreamStackerGame';
import { MoonlightMemoryGame } from './games/MoonlightMemoryGame';
import { LostWishDetectiveGame } from './games/LostWishDetectiveGame';
import { DreamMazeGame } from './games/DreamMazeGame';
import { CelestialPuzzleGame } from './games/CelestialPuzzleGame';
import { WishFactoryGame } from './games/WishFactoryGame';
import { MidnightTrialGame } from './games/MidnightTrialGame';
import { Lock, Unlock, Play, Clock, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export const ArcadeView: React.FC = () => {
  const { progress, unlockGame } = useProgression();
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [unlockMessage, setUnlockMessage] = useState<{ id: string; msg: string; error?: boolean } | null>(null);

  const handleUnlock = (gameId: string) => {
    sound.playTap();
    const res = unlockGame(gameId);
    setUnlockMessage({ id: gameId, msg: res.message, error: !res.success });
  };

  const handleLaunchGame = (gameId: string) => {
    sound.playTap();
    setActiveGameId(gameId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToArcade = () => {
    setActiveGameId(null);
  };

  // If a game is active, render its screen
  if (activeGameId === 'game-1-wish-catcher') {
    return <WishCatcherGame onBack={handleBackToArcade} />;
  }
  if (activeGameId === 'game-2-star-repair') {
    return <StarRepairGame onBack={handleBackToArcade} />;
  }
  if (activeGameId === 'game-3-constellation-connector') {
    return <ConstellationGame onBack={handleBackToArcade} />;
  }
  if (activeGameId === 'game-4-dream-stacker') {
    return <DreamStackerGame onBack={handleBackToArcade} />;
  }
  if (activeGameId === 'game-5-moonlight-memory') {
    return <MoonlightMemoryGame onBack={handleBackToArcade} />;
  }
  if (activeGameId === 'game-6-lost-wish-detective') {
    return <LostWishDetectiveGame onBack={handleBackToArcade} />;
  }
  if (activeGameId === 'game-7-dream-maze') {
    return <DreamMazeGame onBack={handleBackToArcade} />;
  }
  if (activeGameId === 'game-8-celestial-puzzle') {
    return <CelestialPuzzleGame onBack={handleBackToArcade} />;
  }
  if (activeGameId === 'game-9-wish-factory') {
    return <WishFactoryGame onBack={handleBackToArcade} />;
  }
  if (activeGameId === 'game-10-midnight-trial') {
    return <MidnightTrialGame onBack={handleBackToArcade} />;
  }

  return (
    <div className="space-y-6">
      {/* Arcade Header */}
      <div className="paper-card p-6 sm:p-8 bg-gradient-to-r from-amber-50 to-pink-50 dark:from-[#1e1b4b] dark:to-[#171031] relative overflow-hidden">
        <div className="washi-tape washi-tape-gold -top-2 left-10 w-36 rotate-[-2deg] rounded" />
        <div className="washi-tape washi-tape-lavender -top-2 right-12 w-28 rotate-[2deg] rounded" />

        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#a34063]/10 dark:bg-pink-900/40 text-[#a34063] dark:text-pink-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Celestial Amusement Hall • 10 Interactive Games</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#5c4033] dark:text-purple-100">
            Caylee&apos;s Star Arcade
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
            Play 3 free foundational bureau games, earn XP by discovering secrets, and unlock 7 advanced celestial challenges!
            Your current XP: <strong className="text-[#a34063] dark:text-pink-400">{progress.xp} XP</strong>.
          </p>
        </div>
      </div>

      {/* Games Grid (10 Games) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ARCADE_GAMES.map((game, idx) => {
          const isUnlocked = progress.unlockedGames.includes(game.id);
          const completions = progress.completedGames[game.id] || 0;
          const hasEnoughXP = progress.xp >= game.cost;

          // Check prerequisites
          let prereqMet = true;
          if (game.prerequisiteId) {
            if (game.prerequisiteId.startsWith('chapter-')) {
              prereqMet = progress.completedStoryChapters.includes(game.prerequisiteId);
            } else {
              prereqMet = (progress.completedGames[game.prerequisiteId] || 0) > 0;
            }
          }

          const canUnlock = !isUnlocked && hasEnoughXP && prereqMet;

          return (
            <div
              key={game.id}
              className={`paper-card p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg ${
                isUnlocked
                  ? 'border-[#a34063]/20 dark:border-purple-500/30'
                  : 'opacity-90 bg-stone-50 dark:bg-slate-900/60'
              }`}
            >
              <div>
                {/* Category & Status Badges */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-stone-300">
                    {game.category} • {game.difficulty}
                  </span>

                  {isUnlocked ? (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Unlock className="w-3.5 h-3.5" />
                      <span>{completions > 0 ? `Won (${completions}x)` : 'Ready'}</span>
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>{game.cost} XP</span>
                    </span>
                  )}
                </div>

                {/* Game Title & Icon */}
                <div className="flex items-start gap-3 my-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-rose-100 dark:from-purple-900 dark:to-pink-900 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                    {game.icon}
                  </div>
                  <div>
                    <h3 className="font-serif-heading font-bold text-base text-[#5c4033] dark:text-purple-100 leading-tight">
                      {game.title}
                    </h3>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{game.estimatedTime}</span>
                    </p>
                  </div>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-3">
                  {game.tagline}
                </p>

                {/* Prerequisite warning if locked and missing prereq */}
                {!isUnlocked && game.prerequisiteLabel && !prereqMet && (
                  <div className="mb-2 p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-[11px] text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{game.prerequisiteLabel}</span>
                  </div>
                )}

                {/* Missing XP indicator */}
                {!isUnlocked && !hasEnoughXP && prereqMet && (
                  <div className="mb-2 text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                    Need {game.cost - progress.xp} more XP to unlock
                  </div>
                )}

                {/* Unlock Feedback message */}
                {unlockMessage?.id === game.id && (
                  <div
                    className={`mb-2 p-2 rounded-xl text-[11px] font-semibold ${
                      unlockMessage.error
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {unlockMessage.msg}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-[#5c4033]/10 dark:border-purple-500/20">
                {isUnlocked ? (
                  <button
                    onClick={() => handleLaunchGame(game.id)}
                    className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#a34063] to-[#802a4b] hover:from-[#b54a72] hover:to-[#913256] text-white text-xs font-rounded font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Play Now</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnlock(game.id)}
                    disabled={!canUnlock}
                    className={`w-full py-2.5 rounded-full text-xs font-rounded font-bold transition-all shadow flex items-center justify-center gap-1.5 ${
                      canUnlock
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-900 cursor-pointer active:scale-95'
                        : 'bg-stone-200 dark:bg-slate-800 text-stone-400 dark:text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Unlock for {game.cost} XP</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
