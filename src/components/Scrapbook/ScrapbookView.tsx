import React, { useState, useEffect } from 'react';
import { useProgression } from '../../context/ProgressionContext';
import { sound } from '../../utils/audio';
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
  Key,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Bookmark,
} from 'lucide-react';

export const ScrapbookView: React.FC = () => {
  const { progress, unlockScrapbookPage, completeStoryChapter, discoverEasterEgg } = useProgression();
  const [currentPage, setCurrentPage] = useState<'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'>('A');

  // Page E secret code state
  const [codeDigits, setCodeDigits] = useState('');
  const [codeError, setCodeError] = useState(false);

  // Page G polaroid flips
  const [flippedPolaroids, setFlippedPolaroids] = useState<Record<number, boolean>>({});

  // Page A moonbeam filter
  const [moonbeamPhase, setMoonbeamPhase] = useState<'crescent' | 'full' | 'silver'>('full');

  const pageIds: ('A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G')[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  const handleNextPage = () => {
    sound.playPageTurn();
    const idx = pageIds.indexOf(currentPage);
    if (idx < pageIds.length - 1) {
      setCurrentPage(pageIds[idx + 1]);
    }
  };

  const handlePrevPage = () => {
    sound.playPageTurn();
    const idx = pageIds.indexOf(currentPage);
    if (idx > 0) {
      setCurrentPage(pageIds[idx - 1]);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNextPage();
      if (e.key === 'ArrowLeft') handlePrevPage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Handle Page E unlock code
  const handleUnlockPageE = (e: React.FormEvent) => {
    e.preventDefault();
    if (codeDigits === '777') {
      sound.playLevelUp();
      unlockScrapbookPage('page-e');
      discoverEasterEgg('egg-8-secret-diary-code');
      setCodeError(false);
    } else {
      sound.playChime(240, 0.3, 'sawtooth');
      setCodeError(true);
    }
  };

  // Handle Page F unlock (unlocked if Page E is open and user solves riddle)
  const handleUnlockPageF = () => {
    sound.playLevelUp();
    unlockScrapbookPage('page-f');
    completeStoryChapter('chapter-secret-wish');
  };

  // Easter Egg #2: The Curling Page (click the curled edge on Page G or anywhere)
  const handleCurlingPageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playSparkle();
    discoverEasterEgg('egg-2-curling-page');
  };

  const togglePolaroid = (id: number) => {
    sound.playTap();
    setFlippedPolaroids((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isPageEUnlocked = progress.unlockedScrapbookPages.includes('page-e');
  const isPageFUnlocked = progress.unlockedScrapbookPages.includes('page-f');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Scrapbook Header & Nav Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#a34063] dark:text-pink-300 font-handwriting text-xl">
            ~ Handwritten Keepsakes &amp; Pressed Memories ~
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#5c4033] dark:text-purple-100">
            Caylee&apos;s Magical Scrapbook
          </h2>
        </div>

        {/* Page Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-stone-200 dark:border-slate-700 overflow-x-auto max-w-full">
          {pageIds.map((p) => {
            const isSelected = currentPage === p;
            const isLocked = (p === 'E' && !isPageEUnlocked) || (p === 'F' && !isPageFUnlocked);

            return (
              <button
                key={p}
                onClick={() => {
                  sound.playPageTurn();
                  setCurrentPage(p);
                }}
                className={`px-3 py-1.5 rounded-xl font-rounded text-xs font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#a34063] text-white shadow-sm'
                    : isLocked
                    ? 'text-stone-400 dark:text-stone-500 hover:text-stone-600'
                    : 'text-stone-700 dark:text-purple-200 hover:bg-stone-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>Page {p}</span>
                {isLocked && <Lock className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Scrapbook Paper Album Frame */}
      <div className="relative min-h-[520px] rounded-3xl paper-card p-6 sm:p-10 shadow-2xl border-2 border-[#5c4033]/15 overflow-hidden transition-all duration-300">
        {/* Washi tape decorations */}
        <div className="washi-tape washi-tape-lavender -top-3 left-14 w-32 rotate-[-1deg] rounded" />
        <div className="washi-tape washi-tape-gold -top-2 right-16 w-28 rotate-[2deg] rounded" />

        {/* EASTER EGG #2: The Curling Page dog-ear button at top-right */}
        <div
          onClick={handleCurlingPageClick}
          className="absolute -top-1 -right-1 w-14 h-14 bg-gradient-to-bl from-amber-200 via-stone-100 to-transparent shadow-md cursor-pointer group z-30 transition-transform duration-300 hover:scale-110"
          title="Peel back the curled page corner (Easter Egg #2!)"
        >
          <div className="absolute top-2 right-2 text-[10px] text-stone-500 font-serif rotate-45 select-none opacity-60 group-hover:opacity-100">
            Peel me
          </div>
        </div>

        {/* ================= PAGE A: MY FIRST MOONBEAM ================= */}
        {currentPage === 'A' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-[#5c4033]/15 dark:border-purple-400/20 pb-3">
              <span className="text-xs uppercase font-bold tracking-widest text-[#a34063] dark:text-pink-300">
                Page A • Genesis
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#5c4033] dark:text-purple-100">
                My First Moonbeam
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
                <p>
                  Before I had wings or a satchel, I was just a stray wish—whispered into a teacup by a child who dreamed of flying across constellations.
                </p>
                <p>
                  The moonbeam caught that wish, wrapped it in lavender stardust, and spun tiny translucent star wings. That was the night Caylee was born!
                </p>
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-purple-950/60 border border-amber-200 dark:border-purple-800 text-xs text-stone-600 dark:text-purple-200 font-handwriting text-base">
                  &ldquo;Every moth has a candle, but moon-moths are born from the gentle light that never burns.&rdquo;
                </div>
              </div>

              {/* Interactive Moonbeam Prism Dial */}
              <div className="rounded-2xl p-5 bg-gradient-to-br from-indigo-900 to-purple-950 text-white flex flex-col items-center justify-center text-center space-y-3 shadow-inner">
                <div className="text-4xl animate-gentle-float">
                  {moonbeamPhase === 'full' ? '🌕' : moonbeamPhase === 'crescent' ? '🌙' : '✨'}
                </div>
                <h4 className="font-serif-heading font-bold text-sm text-amber-200">
                  Prism of Birth Light: {moonbeamPhase.toUpperCase()}
                </h4>
                <div className="flex gap-2">
                  {(['crescent', 'full', 'silver'] as const).map((phase) => (
                    <button
                      key={phase}
                      onClick={() => {
                        sound.playSparkle();
                        setMoonbeamPhase(phase);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                        moonbeamPhase === phase
                          ? 'bg-amber-400 text-stone-900 border-amber-300 shadow'
                          : 'bg-white/10 text-purple-200 border-white/20 hover:bg-white/20'
                      }`}
                    >
                      {phase}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-purple-300 max-w-xs">
                  Shift the lunar prism to view Caylee’s birth radiance!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= PAGE B: THINGS I COLLECT ================= */}
        {currentPage === 'B' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-[#5c4033]/15 dark:border-purple-400/20 pb-3">
              <span className="text-xs uppercase font-bold tracking-widest text-[#a34063] dark:text-pink-300">
                Page B • Keepsakes
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#5c4033] dark:text-purple-100">
                Things I Collect
              </h3>
            </div>

            <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              Whenever I travel to sleepy planets or repair tired comets, I tuck little souvenirs into my satchel pockets.
              Click each trinket to inspect its memory!
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: 'Moon Buttons', icon: '🔘', lore: 'Lost from jackets during winter stargazing sessions.' },
                { name: 'Silver Feathers', icon: '🪶', lore: 'Barnaby drops these whenever he sneezes at old books.' },
                { name: 'Wish Vials', icon: '🍶', lore: 'Blown from starlight glass to keep dreams cozy.' },
                { name: 'Star Clocks', icon: '⏰', lore: 'They only tick when someone falls asleep with a smile.' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => sound.playSparkle()}
                  className="paper-card p-4 text-center space-y-2 hover:scale-105 transition-transform cursor-pointer border border-[#5c4033]/15"
                >
                  <div className="text-3xl">{item.icon}</div>
                  <h4 className="font-bold text-xs text-[#5c4033] dark:text-purple-100">{item.name}</h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-300 leading-tight">{item.lore}</p>
                </button>
              ))}
            </div>

            {/* Secret Clue Box */}
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300/50 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
              <span>🗝️ <strong>Secret Diary Clue #1:</strong> First cipher number is &quot;7&quot;.</span>
              <span className="font-handwriting text-base text-[#a34063] dark:text-pink-300">Remember this!</span>
            </div>
          </div>
        )}

        {/* ================= PAGE C: A DAY AT THE STAR BUREAU ================= */}
        {currentPage === 'C' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-[#5c4033]/15 dark:border-purple-400/20 pb-3">
              <span className="text-xs uppercase font-bold tracking-widest text-[#a34063] dark:text-pink-300">
                Page C • Bureau Logs
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#5c4033] dark:text-purple-100">
                A Day at the Star Bureau
              </h3>
            </div>

            <div className="space-y-4">
              {[
                { time: '07:00 Lunar Time', task: 'Stir chamomile tea and shake stardust out of my antennae.', stamp: '✨ DONE' },
                { time: '11:30 Lunar Time', task: 'Polished 3 dim stars in the northern quadrant with soft chamois cloth.', stamp: '⭐ RESTORED' },
                { time: '16:00 Lunar Time', task: 'Logged incoming wish #4,102 from a baker who wished for fluffier sourdough.', stamp: '🍞 DELIVERED' },
                { time: '21:00 Lunar Time', task: 'Helped a tiny dream find the right pillow before bedtime.', stamp: '🌙 TUCKED IN' },
              ].map((log, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-[#5c4033]/10 dark:border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      {log.time}
                    </span>
                    <p className="text-xs sm:text-sm font-medium text-stone-800 dark:text-purple-200">
                      {log.task}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-[#a34063] dark:text-pink-300 bg-[#a34063]/10 dark:bg-pink-900/40 px-2.5 py-1 rounded-full self-start sm:self-auto">
                    {log.stamp}
                  </span>
                </div>
              ))}
            </div>

            {/* Secret Clue Box */}
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300/50 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
              <span>🗝️ <strong>Secret Diary Clue #2:</strong> Second cipher number is &quot;7&quot;.</span>
              <span className="font-handwriting text-base text-[#a34063] dark:text-pink-300">Almost decoded!</span>
            </div>
          </div>
        )}

        {/* ================= PAGE D: FRIENDS FROM DREAMLAND ================= */}
        {currentPage === 'D' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-[#5c4033]/15 dark:border-purple-400/20 pb-3">
              <span className="text-xs uppercase font-bold tracking-widest text-[#a34063] dark:text-pink-300">
                Page D • Companions
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#5c4033] dark:text-purple-100">
                Friends from Dreamland
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Barnaby */}
              <div className="paper-card p-4 space-y-2 border border-purple-200 dark:border-purple-800">
                <div className="text-4xl text-center">🦉</div>
                <h4 className="font-serif-heading font-bold text-center text-sm text-[#5c4033] dark:text-purple-100">
                  Barnaby the Owl
                </h4>
                <p className="text-[10px] text-center font-bold text-[#a34063] dark:text-pink-300">
                  Headmaster of Archives
                </p>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  Wise, gentle, and perpetually sipping jasmine tea. He maintains the Registry of Lost Wishes and teaches Caylee star navigation.
                </p>
              </div>

              {/* Pip */}
              <div className="paper-card p-4 space-y-2 border border-purple-200 dark:border-purple-800">
                <div className="text-4xl text-center">🐚</div>
                <h4 className="font-serif-heading font-bold text-center text-sm text-[#5c4033] dark:text-purple-100">
                  Pip the Nebula Snail
                </h4>
                <p className="text-[10px] text-center font-bold text-[#a34063] dark:text-pink-300">
                  Glitter Artisan
                </p>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  Slow-moving but cheerful. Pip leaves shimmering trails of cosmic glitter that mark safe flight paths for nighttime dreamers.
                </p>
              </div>

              {/* Lunetta */}
              <div className="paper-card p-4 space-y-2 border border-purple-200 dark:border-purple-800">
                <div className="text-4xl text-center">🐑</div>
                <h4 className="font-serif-heading font-bold text-center text-sm text-[#5c4033] dark:text-purple-100">
                  Lunetta the Cloud Sheep
                </h4>
                <p className="text-[10px] text-center font-bold text-[#a34063] dark:text-pink-300">
                  Dream Weaver
                </p>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  Soft as marshmallow fluff. She gathers spun cloud wool and knits cozy blankets so little stars don&apos;t catch a chill during winter.
                </p>
              </div>
            </div>

            {/* Secret Clue Box */}
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300/50 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
              <span>🗝️ <strong>Secret Diary Clue #3:</strong> Third cipher number is &quot;7&quot;. (Code: 777)</span>
              <span className="font-handwriting text-base text-[#a34063] dark:text-pink-300">Enter code on Page E!</span>
            </div>
          </div>
        )}

        {/* ================= PAGE E: MY SECRET DIARY ================= */}
        {currentPage === 'E' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-[#5c4033]/15 dark:border-purple-400/20 pb-3">
              <span className="text-xs uppercase font-bold tracking-widest text-[#a34063] dark:text-pink-300">
                Page E • Classified Diary
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#5c4033] dark:text-purple-100">
                My Secret Diary
              </h3>
            </div>

            {!isPageEUnlocked ? (
              /* Locked Diary Gate */
              <div className="max-w-md mx-auto text-center space-y-4 py-8">
                <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-purple-900/60 flex items-center justify-center text-3xl mx-auto shadow-inner">
                  🔒
                </div>
                <h4 className="font-serif-heading font-bold text-lg text-[#5c4033] dark:text-purple-100">
                  The Diary Clasp is Sealed
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  Enter the 3-digit combination code discovered from Pages B, C, and D.
                </p>

                <form onSubmit={handleUnlockPageE} className="flex flex-col items-center gap-3">
                  <input
                    type="text"
                    maxLength={3}
                    value={codeDigits}
                    onChange={(e) => setCodeDigits(e.target.value)}
                    placeholder="777"
                    className="w-32 py-2 px-4 rounded-xl text-center font-bold text-lg border-2 border-[#a34063]/30 bg-white dark:bg-slate-800 text-[#5c4033] dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-[#a34063]"
                  />
                  {codeError && (
                    <span className="text-xs text-rose-600 font-semibold">
                      Incorrect code. Check clues on pages B, C, and D!
                    </span>
                  )}
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full bg-[#a34063] hover:bg-[#852f4e] text-white font-rounded font-bold text-xs shadow cursor-pointer"
                  >
                    Unlock Secret Diary
                  </button>
                </form>
              </div>
            ) : (
              /* Unlocked Secret Diary Content */
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 rounded-3xl bg-amber-50/80 dark:bg-purple-950/60 border border-amber-300/60 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#a34063] dark:text-pink-300">
                    <Sparkles className="w-4 h-4" />
                    <span>Private Musings • Bureau Midnight Hour</span>
                  </div>

                  <p className="text-xs sm:text-sm font-handwriting text-xl text-stone-800 dark:text-purple-100 leading-relaxed">
                    &ldquo;Dear Night Sky, I found a wish today that had no name or address on it. It smelled of peppermint and pine needles.
                    I think it belongs to someone who felt too shy to ask for a friend. I promised myself I would build a lighthouse so strong that
                    even the quietest wishes would find their way to a caring heart.&rdquo;
                  </p>

                  <p className="text-xs text-stone-500 font-medium">
                    ✨ Unlocked Secret Clue for Page F: Combine this discovery to unveil The Forgotten Wish!
                  </p>
                </div>

                {!isPageFUnlocked && (
                  <button
                    onClick={handleUnlockPageF}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-900 font-rounded font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>Unlock Mystery Page F: The Forgotten Wish!</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= PAGE F: THE FORGOTTEN WISH ================= */}
        {currentPage === 'F' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-[#5c4033]/15 dark:border-purple-400/20 pb-3">
              <span className="text-xs uppercase font-bold tracking-widest text-[#a34063] dark:text-pink-300">
                Page F • Celestial Mystery
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#5c4033] dark:text-purple-100">
                The Forgotten Wish
              </h3>
            </div>

            {!isPageFUnlocked ? (
              <div className="text-center py-10 space-y-3">
                <Lock className="w-12 h-12 text-stone-400 mx-auto" />
                <h4 className="font-serif-heading font-bold text-base text-stone-600 dark:text-stone-300">
                  This Sacred Mystery Page is Locked
                </h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Unlock Page E first and read Caylee’s secret diary entry to reveal this sacred wish!
                </p>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-950 to-purple-900 text-white shadow-xl border-2 border-amber-300 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <Sparkles className="w-4 h-4" />
                    <span>The Heart of the Bureau Revealed</span>
                  </div>

                  <h4 className="text-xl font-serif-heading font-bold text-amber-200">
                    The Very Wish That Made Caylee
                  </h4>

                  <p className="text-xs sm:text-sm text-purple-200 leading-relaxed font-handwriting text-xl">
                    &ldquo;I wish there was a tiny creature in the night sky who could look after all the stars when they feel sleepy,
                    and carry our little hopes home when we are afraid to speak them aloud.&rdquo;
                  </p>

                  <div className="pt-2 border-t border-purple-500/30 text-xs text-purple-300">
                    🎉 Story Chapter Completed! You have unlocked prerequisite access to Game 10 (Midnight Star Trial).
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= PAGE G: MEMORIES AND POLAROIDS ================= */}
        {currentPage === 'G' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-[#5c4033]/15 dark:border-purple-400/20 pb-3">
              <span className="text-xs uppercase font-bold tracking-widest text-[#a34063] dark:text-pink-300">
                Page G • Photo Album
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#5c4033] dark:text-purple-100">
                Memories &amp; Polaroids
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
              Snapshots taken with Caylee’s antique starlight camera. Click any polaroid to flip it and read the handwritten note on the back!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { id: 1, title: 'Tea with Pip', emoji: '🍵🐌', note: 'Pip brought elderberry dew. Half the glitter spilled in the sugar bowl!' },
                { id: 2, title: 'First Star Repaired', emoji: '⭐🔧', note: 'Rigel Minor was so sleepy it sneezed stardust all over my antennae.' },
                { id: 3, title: 'Flight Over Clouds', emoji: '☁️🦋', note: 'Flew beneath the silver aurora with Lunetta. Softest breeze ever.' },
                { id: 4, title: 'Barnaby’s Stash', emoji: '🦉📚', note: 'Searching for the ancient starmap behind Barnaby’s tea tins.' },
              ].map((p) => {
                const isFlipped = flippedPolaroids[p.id];
                return (
                  <div
                    key={p.id}
                    onClick={() => togglePolaroid(p.id)}
                    className="polaroid-frame rounded-2xl cursor-pointer select-none text-center min-h-[180px] flex flex-col justify-between"
                  >
                    {!isFlipped ? (
                      <>
                        <div className="w-full h-24 rounded-xl bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center text-4xl shadow-inner">
                          {p.emoji}
                        </div>
                        <span className="font-handwriting text-base text-[#5c4033] dark:text-purple-200 mt-2 block">
                          {p.title}
                        </span>
                      </>
                    ) : (
                      <div className="p-2 flex flex-col items-center justify-center h-full space-y-1 animate-fade-in">
                        <span className="text-[10px] uppercase font-bold text-[#a34063] dark:text-pink-300">
                          Handwritten Note
                        </span>
                        <p className="font-handwriting text-base text-stone-700 dark:text-purple-200 leading-snug">
                          &ldquo;{p.note}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Page Footer Navigation Arrows */}
        <div className="mt-8 pt-4 border-t border-[#5c4033]/15 dark:border-purple-400/20 flex items-center justify-between">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 'A'}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold font-rounded transition-colors ${
              currentPage === 'A'
                ? 'opacity-40 cursor-not-allowed text-stone-400'
                : 'bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 text-stone-700 dark:text-purple-200 cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Page</span>
          </button>

          <span className="text-xs font-semibold text-stone-500 font-rounded">
            Page {currentPage} of G
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === 'G'}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold font-rounded transition-colors ${
              currentPage === 'G'
                ? 'opacity-40 cursor-not-allowed text-stone-400'
                : 'bg-[#a34063] hover:bg-[#852f4e] text-white cursor-pointer shadow'
            }`}
          >
            <span>Next Page</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
