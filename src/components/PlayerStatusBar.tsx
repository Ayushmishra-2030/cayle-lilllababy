import React, { useState } from 'react';
import { useProgression } from '../context/ProgressionContext';
import { getLevelForXP, getNextLevelInfo } from '../constants/gameData';
import { Sparkles, Trophy, History, ChevronDown, ChevronUp } from 'lucide-react';

export const PlayerStatusBar: React.FC = () => {
  const { progress } = useProgression();
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const levelInfo = getLevelForXP(progress.xp);
  const nextInfo = getNextLevelInfo(progress.xp);

  return (
    <>
      <div className="w-full bg-[#fff8f1]/90 dark:bg-[#1e1b4b]/90 backdrop-blur-md border-b border-[#5c4033]/15 dark:border-purple-500/20 py-2 px-3 sm:px-6 transition-colors z-40 sticky top-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
          {/* Left: Avatar + Level Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-purple-100 dark:bg-purple-900 border-2 border-[#a34063]/40 flex items-center justify-center text-base shadow-sm">
              <span>{levelInfo.icon}</span>
              <span className="absolute -bottom-1 -right-1 bg-[#a34063] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow">
                {levelInfo.level}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-rounded font-bold text-xs sm:text-sm text-[#5c4033] dark:text-purple-100 leading-tight">
                  {levelInfo.title}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border hidden sm:inline-block ${levelInfo.badgeColor}`}>
                  Level {levelInfo.level}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-purple-300 hidden md:block">
                {levelInfo.perkDescription}
              </p>
            </div>
          </div>

          {/* Center: XP & Progress Bar toward next level */}
          <div className="flex-1 max-w-xs sm:max-w-sm mx-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#5c4033] dark:text-purple-200 mb-1">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{progress.xp} XP</span>
              </span>
              <span>
                {nextInfo.nextLevel
                  ? `${nextInfo.xpNeeded} XP to Level ${nextInfo.nextLevel.level}`
                  : 'Max Level Reached!'}
              </span>
            </div>

            <div className="w-full h-2 bg-stone-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner relative">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-pink-400 to-[#a34063] rounded-full transition-all duration-500"
                style={{ width: `${nextInfo.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Right: Quick Stats & History Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistoryModal(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/70 dark:bg-slate-800/70 border border-[#5c4033]/15 dark:border-purple-400/20 hover:bg-[#a34063]/10 dark:hover:bg-purple-900/40 text-stone-700 dark:text-stone-200 cursor-pointer transition-colors"
              title="View XP Transaction History"
            >
              <History className="w-3.5 h-3.5 text-[#a34063] dark:text-pink-400" />
              <span className="hidden sm:inline">Log</span>
            </button>
          </div>
        </div>
      </div>

      {/* Transaction History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#fff8f1] dark:bg-[#1e1b4b] rounded-3xl p-6 shadow-2xl border border-[#a34063]/30 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#5c4033]/15 dark:border-purple-400/20">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#a34063] dark:text-pink-400" />
                <h3 className="font-serif-heading font-bold text-lg text-[#5c4033] dark:text-purple-100">
                  XP Transaction Log
                </h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1 rounded-full hover:bg-stone-200 dark:hover:bg-slate-700 text-stone-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-2 text-xs text-stone-600 dark:text-purple-300">
              Current Balance: <span className="font-bold text-[#a34063] dark:text-pink-400">{progress.xp} XP</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-2">
              {progress.transactions.length === 0 ? (
                <div className="text-center py-8 text-stone-400 text-sm">
                  No XP transactions recorded yet. Explore the bureau to earn XP!
                </div>
              ) : (
                progress.transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-[#5c4033]/10 dark:border-purple-500/20 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-medium text-stone-800 dark:text-purple-200">
                        {tx.description}
                      </p>
                      <p className="text-[10px] text-stone-400">
                        {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-bold font-rounded text-sm ${
                          tx.amount >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {tx.amount > 0 ? `+${tx.amount}` : tx.amount} XP
                      </span>
                      <p className="text-[10px] text-stone-400">Bal: {tx.newBalance}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setShowHistoryModal(false)}
              className="mt-3 w-full py-2.5 rounded-full bg-[#a34063] hover:bg-[#852f4e] text-white text-xs font-semibold font-rounded cursor-pointer shadow"
            >
              Close Ledger
            </button>
          </div>
        </div>
      )}
    </>
  );
};
