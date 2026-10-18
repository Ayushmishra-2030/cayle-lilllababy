import React from 'react';
import { TabType } from '../../types';
import { CayleeAvatar } from '../CayleeAvatar';
import { useProgression } from '../../context/ProgressionContext';
import { sound } from '../../utils/audio';
import {
  Gamepad2,
  BookOpen,
  Sparkles,
  Trophy,
  ArrowRight,
  PackageOpen,
  Send,
  Volume2,
} from 'lucide-react';

interface HomeViewProps {
  onSelectTab: (tab: TabType) => void;
  onOpenIntro: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSelectTab, onOpenIntro }) => {
  const { progress } = useProgression();

  return (
    <div className="space-y-8">
      {/* Hero Scrapbook Banner */}
      <div className="relative paper-card p-6 sm:p-10 bg-gradient-to-br from-amber-50 via-[#fff8f1] to-purple-50 dark:from-[#1e1b4b] dark:via-[#161233] dark:to-[#231245] border-2 border-[#a34063]/20 overflow-hidden shadow-xl">
        {/* Washi tapes */}
        <div className="washi-tape washi-tape-gold -top-2.5 left-12 w-36 rotate-[-2deg] rounded" />
        <div className="washi-tape washi-tape-lavender -top-2.5 right-14 w-32 rotate-[3deg] rounded" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Hero Text */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#a34063]/10 dark:bg-pink-900/40 text-[#a34063] dark:text-pink-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Star Bureau Headquarters</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif-heading font-extrabold text-[#5c4033] dark:text-purple-100 leading-tight">
              Caylee&apos;s Little <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a34063] to-amber-600 dark:from-pink-400 dark:to-amber-300">
                Star Bureau
              </span>
            </h1>

            <p className="font-handwriting text-2xl text-[#a34063] dark:text-pink-300">
              &ldquo;No wish is too small to find its way home.&rdquo;
            </p>

            <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300 max-w-lg">
              Step into the magical illustrated scrapbook of Caylee the moon-moth.
              Collect lost dreams, repair sleepy stars, uncover hidden secrets, and play 10 cozy arcade games!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <button
                onClick={() => {
                  sound.playTap();
                  onSelectTab('arcade');
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#a34063] to-[#802a4b] hover:from-[#b54a72] hover:to-[#913256] text-white font-rounded font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Play Games</span>
              </button>

              <button
                onClick={() => {
                  sound.playTap();
                  onSelectTab('scrapbook');
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-slate-800 border-2 border-[#a34063]/30 hover:border-[#a34063] text-[#5c4033] dark:text-purple-200 font-rounded font-bold text-sm transition-all active:scale-95 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#a34063] dark:text-pink-400" />
                <span>Read Scrapbook</span>
              </button>

              <button
                onClick={() => {
                  sound.playTap();
                  onOpenIntro();
                }}
                className="flex items-center gap-1.5 px-4 py-3 rounded-full text-xs font-semibold text-stone-600 dark:text-purple-300 hover:text-[#a34063] cursor-pointer"
                title="Replay Caylee's spoken voice greeting"
              >
                <Volume2 className="w-4 h-4" />
                <span>Replay Voice</span>
              </button>
            </div>
          </div>

          {/* Interactive Hero Caylee Avatar */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="relative p-6 rounded-full bg-gradient-to-b from-purple-100 to-amber-50 dark:from-purple-900/60 dark:to-slate-900/60 border-4 border-amber-300/40 shadow-inner">
              <CayleeAvatar
                size="lg"
                interactive={true}
                showDialogue={true}
                dialogueText="Hi friend! Pet me or tap my antennae! ✨"
              />
            </div>
            <span className="mt-3 text-xs font-handwriting text-xl text-[#a34063] dark:text-pink-300">
              Caylee the Moon-Moth • Click for surprises!
            </span>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            tab: 'arcade' as TabType,
            title: '10 Arcade Games',
            desc: 'Wish Catcher, Star Repair, Constellation Connector, & 7 unlockables.',
            icon: '🕹️',
            badge: `${progress.unlockedGames.length} Unlocked`,
          },
          {
            tab: 'scrapbook' as TabType,
            title: 'Magical Scrapbook',
            desc: '7 interactive pages with secrets, polaroid gallery, and clues.',
            icon: '📖',
            badge: 'Pages A-G',
          },
          {
            tab: 'wishes' as TabType,
            title: 'Wish Generator',
            desc: 'Craft original cosmic wishes by mood and export shareable cards.',
            icon: '✨',
            badge: `${progress.savedWishes.length} Saved`,
          },
          {
            tab: 'collection' as TabType,
            title: 'Satchel Treasures',
            desc: 'Inspect rare bottles, star shards, stickers, stamps, and badges.',
            icon: '🍶',
            badge: 'Treasures',
          },
          {
            tab: 'map' as TabType,
            title: 'Dream Delivery Map',
            desc: 'Survey 5 celestial territories, glowing routes, and landmarks.',
            icon: '🗺️',
            badge: '5 Sectors',
          },
          {
            tab: 'lullaby' as TabType,
            title: 'Lullaby Lab',
            desc: 'Interactive synthesized music box with gentle melodies and manual crank.',
            icon: '🎵',
            badge: 'Music Box',
          },
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={() => {
              sound.playTap();
              onSelectTab(item.tab);
            }}
            className="paper-card p-5 text-left transition-all duration-300 hover:scale-102 hover:shadow-lg flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{item.icon}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-[#a34063] dark:text-pink-300">
                  {item.badge}
                </span>
              </div>
              <h3 className="font-serif-heading font-bold text-base text-[#5c4033] dark:text-purple-100 group-hover:text-[#a34063] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                {item.desc}
              </p>
            </div>

            <div className="mt-4 pt-2 border-t border-[#5c4033]/10 dark:border-purple-500/20 flex items-center justify-between text-xs font-semibold text-[#a34063] dark:text-pink-400">
              <span>Explore Section</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>

      {/* Bureau Bulletin Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Bureau Notice of the Day */}
        <div className="md:col-span-2 paper-card p-6 space-y-3">
          <div className="flex items-center gap-2 border-b border-[#5c4033]/15 pb-2">
            <span className="text-xl">📌</span>
            <h3 className="font-serif-heading font-bold text-lg text-[#5c4033] dark:text-purple-100">
              Bureau Notice Board
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-handwriting text-xl">
            &ldquo;Attention all nocturnal visitors! The northern constellation pathway is clear of meteor clouds.
            If you spot any wishes tangled in pine trees or drifting across tea mugs, please dispatch them to Caylee&apos;s desk immediately.&rdquo;
          </p>
          <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-200 dark:border-slate-700">
            <span>Posted by: Barnaby the Headmaster Owl</span>
            <span className="text-emerald-600 font-semibold">Status: Peaceful Night Sky</span>
          </div>
        </div>

        {/* Right: Quick Bureau Stats */}
        <div className="paper-card p-6 space-y-3 flex flex-col justify-between">
          <h3 className="font-serif-heading font-bold text-base text-[#5c4033] dark:text-purple-100 border-b border-[#5c4033]/15 pb-2">
            🌟 Bureau Activity
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-stone-600 dark:text-stone-400">Total XP Earned:</span>
              <strong className="text-[#a34063] dark:text-pink-400">{progress.xp} XP</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600 dark:text-stone-400">Secrets Discovered:</span>
              <strong className="text-amber-600">{progress.discoveredEasterEggs.length} / 10</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600 dark:text-stone-400">Games Won:</span>
              <strong className="text-purple-600 dark:text-purple-300">
                {Object.keys(progress.completedGames).length}
              </strong>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              onSelectTab('achievements');
            }}
            className="w-full py-2 rounded-xl bg-purple-100 dark:bg-purple-900/60 hover:bg-purple-200 text-[#a34063] dark:text-pink-300 font-rounded font-bold text-xs cursor-pointer text-center"
          >
            View Achievements
          </button>
        </div>
      </div>
    </div>
  );
};
