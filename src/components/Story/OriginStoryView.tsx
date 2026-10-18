import React, { useState, useEffect, useRef } from 'react';
import { useProgression } from '../../context/ProgressionContext';
import { sound } from '../../utils/audio';
import {
  Sparkles,
  CheckCircle2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Compass,
} from 'lucide-react';

interface StoryChapter {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  illustrationSvg: string;
  body: string[];
}

const CHAPTERS: StoryChapter[] = [
  {
    id: 'chap-1-moonbeam',
    title: 'Chapter 1: The Stray Moonbeam',
    subtitle: 'Where dreams are woven into wings',
    icon: '🌙',
    illustrationSvg: '✨🌕🦋',
    body: [
      'High above the sleeping world, a quiet whisper climbed beyond the clouds. It was not a grand wish for riches or palaces, but a tender plea whispered into an open windowsill.',
      'The moon leaned down to listen. A slender sliver of silver light reached out, cocooning the wish in lavender nebula dust. As dawn approached, the cocoon fluttered—and Caylee opened her warm amber eyes for the very first time.',
    ],
  },
  {
    id: 'chap-2-gatekeeper',
    title: 'Chapter 2: The Bureau Gatekeeper',
    subtitle: 'An unexpected entrance into the celestial registry',
    icon: '🦉',
    illustrationSvg: '🏛️📜🦉',
    body: [
      'Tumbling through a cloud bank, Caylee landed beak-first onto an open atlas inside the Little Star Bureau. Behind a mountain of tea tins sat Barnaby, an ancient owl with round spectacles.',
      'He adjusted his glasses, inspected her translucent star wings, and cleared his throat. "Well now," Barnaby murmured, "we haven\'t had a moon-moth since the Great Comet of 1882. Here is your satchel, little one. Your shift begins at dusk."',
    ],
  },
  {
    id: 'chap-3-sleepy-star',
    title: 'Chapter 3: The First Sleepy Star',
    subtitle: 'A lesson in starlight restoration',
    icon: '⭐',
    illustrationSvg: '⭐🧹✨',
    body: [
      'Her first assignment was Rigel Minor, a tiny star that had fallen asleep behind a thunderstorm and stopped twinkling. Ships below were starting to lose their headings.',
      'With a soft chamois cloth and a drop of moon polish, Caylee buffed away the grey meteor soot. When the star sneezed and burst into brilliant gold radiance, Caylee felt a warm spark in her heart.',
    ],
  },
  {
    id: 'chap-4-oath',
    title: 'Chapter 4: The Oath of the Wishkeeper',
    subtitle: 'A promise sworn to every dreamer',
    icon: '👑',
    illustrationSvg: '📜👑🌌',
    body: [
      'Standing atop the Bureau Lighthouse, Caylee clasped her wish satchel and looked out over the glittering constellations.',
      '"I promise," she whispered to the quiet night, "that no matter how distant the world or how quiet the whisper, no wish will ever be too small to find its way home."',
    ],
  },
];

export const OriginStoryView: React.FC = () => {
  const { progress, completeStoryChapter } = useProgression();
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [mode, setMode] = useState<'scroll' | 'flipbook'>('scroll');

  const activeChapter = CHAPTERS[activeIdx];
  const isRead = progress.completedStoryChapters.includes(activeChapter.id);

  // Flipbook navigation
  const handleNext = () => {
    if (activeIdx < CHAPTERS.length - 1) {
      sound.playPageTurn();
      setActiveIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeIdx > 0) {
      sound.playPageTurn();
      setActiveIdx((prev) => prev - 1);
    }
  };

  const handleMarkAsRead = (chapId: string) => {
    sound.playStarCatch();
    completeStoryChapter(chapId);
  };

  // Keyboard navigation for flipbook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIdx]);

  const completedCount = progress.completedStoryChapters.length;
  const progressPercent = Math.min(100, (completedCount / CHAPTERS.length) * 100);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="paper-card p-6 sm:p-8 bg-gradient-to-r from-purple-50 to-amber-50 dark:from-[#1e1b4b] dark:to-[#1a1338] relative overflow-hidden">
        <div className="washi-tape washi-tape-gold -top-2.5 left-12 w-36 rotate-[-1deg] rounded" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#a34063]/10 dark:bg-pink-900/40 text-[#a34063] dark:text-pink-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Illustrated Storybook • 4 Chapters</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#5c4033] dark:text-purple-100">
              The Tale of the Moon-Moth
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
              Discover how Caylee was born from a forgotten wish and sworn into the Little Star Bureau.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex gap-1.5 bg-stone-100 dark:bg-slate-800 p-1.5 rounded-2xl border text-xs font-bold self-start sm:self-auto">
            <button
              onClick={() => {
                sound.playTap();
                setMode('scroll');
              }}
              className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                mode === 'scroll'
                  ? 'bg-[#a34063] text-white shadow'
                  : 'text-stone-700 dark:text-purple-200'
              }`}
            >
              Scroll Mode
            </button>
            <button
              onClick={() => {
                sound.playTap();
                setMode('flipbook');
              }}
              className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                mode === 'flipbook'
                  ? 'bg-[#a34063] text-white shadow'
                  : 'text-stone-700 dark:text-purple-200'
              }`}
            >
              Flipbook Mode
            </button>
          </div>
        </div>
      </div>

      {/* Animated Glowing Progress Path SVG */}
      <div className="paper-card p-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-[#5c4033] dark:text-purple-200">
          <span className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-amber-500" />
            <span>Storyline Path Progress</span>
          </span>
          <span>{completedCount} / 4 Chapters Read ({progressPercent}%)</span>
        </div>

        {/* Visual SVG Path with Waypoints */}
        <div className="relative w-full h-12 flex items-center justify-between px-6">
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Background line */}
            <line x1="8%" y1="50%" x2="92%" y2="50%" stroke="rgba(163,64,99,0.2)" strokeWidth="4" strokeLinecap="round" />
            {/* Glowing active progress line */}
            <line
              x1="8%"
              y1="50%"
              x2={`${8 + (progressPercent / 100) * 84}%`}
              y2="50%"
              stroke="#fbbf24"
              strokeWidth="4"
              strokeLinecap="round"
              className="drop-shadow-[0_0_8px_#fde047] transition-all duration-500"
            />
          </svg>

          {CHAPTERS.map((ch, i) => {
            const isCompleted = progress.completedStoryChapters.includes(ch.id);
            const isCurrent = activeIdx === i;

            return (
              <button
                key={ch.id}
                onClick={() => {
                  sound.playTap();
                  setActiveIdx(i);
                }}
                className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${
                  isCurrent
                    ? 'ring-4 ring-amber-400 bg-[#a34063] text-white scale-110 shadow-lg'
                    : isCompleted
                    ? 'bg-amber-400 text-stone-900 drop-shadow'
                    : 'bg-stone-200 dark:bg-slate-700 text-stone-500'
                }`}
                title={`Part ${i + 1}: ${ch.title}`}
              >
                {isCompleted ? '✓' : i + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode 1: Flipbook View */}
      {mode === 'flipbook' ? (
        <div className="paper-card p-6 sm:p-10 space-y-6 min-h-[460px] flex flex-col justify-between transition-all duration-300">
          <div className="text-center space-y-2 border-b border-[#5c4033]/15 pb-4">
            <div className="text-5xl animate-gentle-float">{activeChapter.illustrationSvg}</div>
            <h3 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#5c4033] dark:text-purple-100">
              {activeChapter.title}
            </h3>
            <p className="font-handwriting text-xl text-[#a34063] dark:text-pink-300">
              ~ {activeChapter.subtitle} ~
            </p>
          </div>

          <div className="space-y-4 max-w-2xl mx-auto flex-1">
            {activeChapter.body.map((para, i) => (
              <p
                key={i}
                className="text-sm sm:text-base leading-relaxed text-stone-800 dark:text-stone-200 first-letter:text-3xl first-letter:font-serif first-letter:font-bold first-letter:text-[#a34063] first-letter:mr-1 first-letter:float-left"
              >
                {para}
              </p>
            ))}
          </div>

          {/* Flipbook Footer Navigation */}
          <div className="pt-6 border-t border-[#5c4033]/15 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={activeIdx === 0}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold font-rounded ${
                activeIdx === 0
                  ? 'opacity-40 cursor-not-allowed text-stone-400'
                  : 'bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 text-stone-700 dark:text-purple-200 cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {!isRead ? (
              <button
                onClick={() => handleMarkAsRead(activeChapter.id)}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-stone-900 font-bold text-xs shadow cursor-pointer flex items-center gap-1.5"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Mark Read (+20 XP)</span>
              </button>
            ) : (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Read &amp; Claimed
              </span>
            )}

            <button
              onClick={handleNext}
              disabled={activeIdx === CHAPTERS.length - 1}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold font-rounded ${
                activeIdx === CHAPTERS.length - 1
                  ? 'opacity-40 cursor-not-allowed text-stone-400'
                  : 'bg-[#a34063] hover:bg-[#852f4e] text-white cursor-pointer shadow'
              }`}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Mode 2: Scroll-Driven Multi-Chapter View */
        <div className="space-y-6">
          {CHAPTERS.map((ch, idx) => {
            const chapRead = progress.completedStoryChapters.includes(ch.id);

            return (
              <div
                key={ch.id}
                className="paper-card p-6 sm:p-8 space-y-4 border border-[#5c4033]/15 transition-all hover:shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#5c4033]/10 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{ch.illustrationSvg}</span>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#a34063] dark:text-pink-300 tracking-wider">
                        Chapter #{idx + 1}
                      </span>
                      <h3 className="font-serif-heading font-bold text-xl text-[#5c4033] dark:text-purple-100">
                        {ch.title}
                      </h3>
                      <p className="font-handwriting text-base text-stone-500 dark:text-purple-300">
                        ~ {ch.subtitle} ~
                      </p>
                    </div>
                  </div>

                  {!chapRead ? (
                    <button
                      onClick={() => handleMarkAsRead(ch.id)}
                      className="px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-xs shadow cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>Mark as Read (+20 XP)</span>
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 self-start sm:self-auto bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Chapter Read
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
                  {ch.body.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
