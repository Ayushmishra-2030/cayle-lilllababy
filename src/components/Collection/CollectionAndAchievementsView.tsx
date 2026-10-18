import React, { useState } from 'react';
import { useProgression } from '../../context/ProgressionContext';
import { ACHIEVEMENTS, COLLECTIBLES } from '../../constants/gameData';
import { sound } from '../../utils/audio';
import { Sparkles, Trophy, PackageOpen, CheckCircle2, Lock, HelpCircle } from 'lucide-react';

export const CollectionAndAchievementsView: React.FC = () => {
  const { progress } = useProgression();
  const [activeTab, setActiveTab] = useState<'all' | 'collectibles' | 'achievements'>('all');
  const [selectedItem, setSelectedItem] = useState<typeof COLLECTIBLES[0] | null>(null);

  // Collectible unlock checks:
  const isCollectibleUnlocked = (id: string): boolean => {
    switch (id) {
      case 'col-1-bottle-lavender':
        return progress.firstVisitDone;
      case 'col-2-feather-owl':
        return progress.unlockedScrapbookPages.includes('page-d');
      case 'col-3-star-fragment':
        return (progress.completedGames['game-2-star-repair'] || 0) > 0;
      case 'col-4-button-pearl':
        return progress.discoveredEasterEggs.includes('egg-3-moon-button');
      case 'col-5-card-cygnus':
        return (progress.completedGames['game-3-constellation-connector'] || 0) > 0;
      case 'col-6-stamp-bureau':
        return progress.xp >= 50;
      case 'col-7-cloud-cushion':
        return progress.unlockedScrapbookPages.includes('page-d');
      case 'col-8-golden-quill':
        return progress.guestbookEntries.length > 2;
      case 'col-9-nebula-shell':
        return progress.unlockedScrapbookPages.includes('page-d');
      case 'col-10-secret-key':
        return progress.discoveredEasterEggs.includes('egg-2-curling-page');
      case 'col-11-crystal-wish':
        return (progress.completedGames['game-9-wish-factory'] || 0) > 0;
      case 'col-12-master-crown':
        return progress.xp >= 350;
      default:
        return false;
    }
  };

  const unlockedCollectiblesCount = COLLECTIBLES.filter((c) => isCollectibleUnlocked(c.id)).length;
  const unlockedAchievementsCount = ACHIEVEMENTS.filter((a) => progress.achievements[a.id]?.unlocked).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="paper-card p-6 sm:p-8 bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 dark:from-[#1e1b4b] dark:to-[#171031] relative overflow-hidden">
        <div className="washi-tape washi-tape-gold -top-2.5 left-10 w-36 rotate-[-1deg] rounded" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#a34063]/10 dark:bg-pink-900/40 text-[#a34063] dark:text-pink-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Satchel &amp; Accolades</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#5c4033] dark:text-purple-100">
              Treasures &amp; Achievements
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
              Every wish bottle, comet shard, and bureau medal you collect is preserved safely in Caylee&apos;s satchel.
            </p>
          </div>

          <div className="flex sm:flex-col gap-2">
            <div className="bg-white/80 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border text-xs font-bold text-center">
              Treasures: <span className="text-[#a34063] dark:text-pink-400">{unlockedCollectiblesCount} / {COLLECTIBLES.length}</span>
            </div>
            <div className="bg-white/80 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border text-xs font-bold text-center">
              Badges: <span className="text-amber-600 dark:text-amber-300">{unlockedAchievementsCount} / {ACHIEVEMENTS.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex gap-2 border-b border-[#5c4033]/15 pb-2">
        <button
          onClick={() => {
            sound.playTap();
            setActiveTab('all');
          }}
          className={`px-4 py-2 rounded-full font-rounded text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[#a34063] text-white shadow'
              : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-purple-200'
          }`}
        >
          All Relics
        </button>
        <button
          onClick={() => {
            sound.playTap();
            setActiveTab('collectibles');
          }}
          className={`px-4 py-2 rounded-full font-rounded text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'collectibles'
              ? 'bg-[#a34063] text-white shadow'
              : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-purple-200'
          }`}
        >
          Satchel Treasures ({unlockedCollectiblesCount})
        </button>
        <button
          onClick={() => {
            sound.playTap();
            setActiveTab('achievements');
          }}
          className={`px-4 py-2 rounded-full font-rounded text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'achievements'
              ? 'bg-[#a34063] text-white shadow'
              : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-purple-200'
          }`}
        >
          Bureau Achievements ({unlockedAchievementsCount})
        </button>
      </div>

      {/* Section 1: Collectibles Gallery */}
      {(activeTab === 'all' || activeTab === 'collectibles') && (
        <div className="space-y-4">
          <h3 className="font-serif-heading font-bold text-lg text-[#5c4033] dark:text-purple-100 flex items-center gap-2">
            <PackageOpen className="w-5 h-5 text-[#a34063] dark:text-pink-400" />
            <span>Satchel Collectibles</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {COLLECTIBLES.map((col) => {
              const unlocked = isCollectibleUnlocked(col.id);

              return (
                <button
                  key={col.id}
                  onClick={() => {
                    sound.playTap();
                    setSelectedItem(col);
                  }}
                  className={`paper-card p-4 text-center space-y-2 transition-all cursor-pointer flex flex-col justify-between ${
                    unlocked
                      ? 'border-[#a34063]/20 hover:scale-104 hover:shadow-md'
                      : 'opacity-60 bg-stone-100 dark:bg-slate-900 border-dashed border-stone-300 dark:border-slate-700'
                  }`}
                >
                  <div className="relative">
                    <span
                      className={`text-4xl block my-1 ${
                        unlocked ? 'drop-shadow-md' : 'filter grayscale blur-[1px]'
                      }`}
                    >
                      {unlocked ? col.iconSvg : '🔒'}
                    </span>
                    {!unlocked && (
                      <span className="text-[10px] text-stone-400 block font-semibold">
                        Locked Relic
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-[#5c4033] dark:text-purple-100 truncate">
                      {unlocked ? col.name : 'Unknown Treasure'}
                    </h4>
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                      {col.category}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Section 2: Achievements Badges */}
      {(activeTab === 'all' || activeTab === 'achievements') && (
        <div className="space-y-4 pt-4">
          <h3 className="font-serif-heading font-bold text-lg text-[#5c4033] dark:text-purple-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>Bureau Accolades (10 Achievements)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ACHIEVEMENTS.map((ach) => {
              const isUnlocked = progress.achievements[ach.id]?.unlocked;

              return (
                <div
                  key={ach.id}
                  className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
                    isUnlocked
                      ? 'bg-gradient-to-r from-amber-50 to-purple-50 dark:from-purple-950/60 dark:to-slate-900/60 border-amber-300/80 shadow-sm'
                      : 'bg-white/60 dark:bg-slate-800/50 border-stone-200 dark:border-slate-700 opacity-75'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm ${
                      isUnlocked
                        ? 'bg-amber-100 dark:bg-amber-900 border border-amber-300'
                        : 'bg-stone-200 dark:bg-slate-700 filter grayscale'
                    }`}
                  >
                    {ach.badge}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-serif-heading font-bold text-sm text-[#5c4033] dark:text-purple-100 truncate">
                        {ach.title}
                      </h4>
                      {isUnlocked ? (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
                          <CheckCircle2 className="w-3 h-3" /> Unlocked
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full flex-shrink-0">
                          +{ach.rewardXP} XP
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5 leading-snug">
                      {ach.description}
                    </p>
                    <span className="text-[10px] text-stone-400 mt-1 block italic">
                      Requirement: {ach.conditionDescription}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Collectible Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="paper-card p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="text-5xl my-2">
              {isCollectibleUnlocked(selectedItem.id) ? selectedItem.iconSvg : '🔒'}
            </div>
            <h3 className="font-serif-heading font-bold text-lg text-[#5c4033] dark:text-purple-100">
              {isCollectibleUnlocked(selectedItem.id) ? selectedItem.name : 'Tasteful Silhouette'}
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              {isCollectibleUnlocked(selectedItem.id)
                ? selectedItem.description
                : `Locked: ${selectedItem.hint}`}
            </p>
            <button
              onClick={() => setSelectedItem(null)}
              className="w-full py-2.5 rounded-full bg-[#a34063] hover:bg-[#852f4e] text-white font-rounded font-bold text-xs cursor-pointer shadow"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
