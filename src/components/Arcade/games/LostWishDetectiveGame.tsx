import React, { useState } from 'react';
import { useProgression } from '../../../context/ProgressionContext';
import { sound } from '../../../utils/audio';
import { ArrowLeft, Search, CheckCircle2, AlertCircle } from 'lucide-react';

interface DetectiveProps {
  onBack: () => void;
}

interface Clue {
  id: string;
  name: string;
  icon: string;
  details: string;
  inspected: boolean;
}

const INITIAL_CLUES: Clue[] = [
  {
    id: 'ribbon',
    name: 'Silver Ribbon Thread',
    icon: '🎀',
    details: 'Woven from downy silver-gray celestial feathers found exclusively in high mountain roosts.',
    inspected: false,
  },
  {
    id: 'scent',
    name: 'Stardust Aroma',
    icon: '☕',
    details: 'Faint scent of dried chamomile flowers, old leather-bound atlases, and midnight jasmine tea.',
    inspected: false,
  },
  {
    id: 'ink',
    name: 'Ink & Calligraphy',
    icon: '✒️',
    details: 'Neat, stately serif handwriting written with a heavy italic nib and dark midnight-violet ink.',
    inspected: false,
  },
  {
    id: 'wax',
    name: 'Broken Wax Seal',
    icon: '🏵️',
    details: 'A fragment of amber sealing wax showing the distinct outline of round spectacles and feathered ears.',
    inspected: false,
  },
];

const SUSPECTS = [
  {
    id: 'pip',
    name: 'Pip the Nebula Snail',
    role: 'Glitter Courier',
    icon: '🐚',
    traits: 'Leaves trails of blue glitter, drinks strawberry dew, writes in tiny curly doodles.',
    isCorrect: false,
  },
  {
    id: 'barnaby',
    name: 'Barnaby the Headmaster Owl',
    role: 'Bureau Archivist',
    icon: '🦉',
    traits: 'Preens silver feathers, drinks midnight jasmine tea, wears round reading spectacles, writes in formal serif calligraphy.',
    isCorrect: true,
  },
  {
    id: 'lunetta',
    name: 'Lunetta the Cloud Sheep',
    role: 'Dream Weaver',
    icon: '🐑',
    traits: 'Knits with soft cloud wool, drinks warm milk and honey, uses pastel pink wax stamps.',
    isCorrect: false,
  },
  {
    id: 'zephyr',
    name: 'Zephyr the Breeze Finch',
    role: 'High Wind Messenger',
    icon: '🐦',
    traits: 'Flies swift loops, always smells of fresh pine needles, uses bright yellow ink.',
    isCorrect: false,
  },
];

export const LostWishDetectiveGame: React.FC<DetectiveProps> = ({ onBack }) => {
  const { recordGameCompletion } = useProgression();
  const [clues, setClues] = useState<Clue[]>(INITIAL_CLUES);
  const [activeClueId, setActiveClueId] = useState<string | null>(null);
  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ status: 'correct' | 'wrong'; text: string } | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const [firstTimeReward, setFirstTimeReward] = useState<number | null>(null);

  const inspectedCount = clues.filter((c) => c.inspected).length;

  const handleInspectClue = (clueId: string) => {
    sound.playSparkle();
    setActiveClueId(clueId);
    setClues((prev) =>
      prev.map((c) => (c.id === clueId ? { ...c, inspected: true } : c))
    );
  };

  const handleAccusation = (suspectId: string) => {
    sound.playTap();
    setSelectedSuspect(suspectId);
    const suspect = SUSPECTS.find((s) => s.id === suspectId);

    if (suspect?.isCorrect) {
      sound.playLevelUp();
      setIsSolved(true);
      setFeedback({
        status: 'correct',
        text: 'Case Solved! Barnaby the Celestial Owl sent this wish!',
      });
      const res = recordGameCompletion('game-6-lost-wish-detective');
      if (res.firstTime) {
        setFirstTimeReward(res.xpAwarded);
      }
    } else {
      sound.playChime(250, 0.3, 'sawtooth');
      setFeedback({
        status: 'wrong',
        text: `Not quite! The clues don't match ${suspect?.name}. Inspect all 4 pieces of evidence!`,
      });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
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

        <div className="bg-amber-100 dark:bg-amber-950/70 border border-amber-300 px-3 py-1 rounded-xl text-xs font-bold text-amber-900 dark:text-amber-200">
          Clues Examined: {inspectedCount} / 4
        </div>
      </div>

      {/* Case File Board */}
      <div className="paper-card p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-3 border-b border-[#5c4033]/15 dark:border-purple-400/20 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-xl">
            🔍
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#a34063] dark:text-pink-300 tracking-wider">
              Bureau Mystery Case #104
            </span>
            <h3 className="font-serif-heading font-bold text-xl text-[#5c4033] dark:text-purple-100">
              The Mystery of the Lavender Wish
            </h3>
          </div>
        </div>

        {/* Evidence Items */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
            1. Evidence Locker (Click each to examine)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {clues.map((clue) => {
              const isActive = activeClueId === clue.id;
              return (
                <button
                  key={clue.id}
                  onClick={() => handleInspectClue(clue.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-100 dark:bg-amber-950/70 border-amber-400 ring-2 ring-amber-300 scale-102'
                      : clue.inspected
                      ? 'bg-stone-50 dark:bg-slate-800/80 border-emerald-400/50'
                      : 'bg-white dark:bg-slate-800 border-stone-200 hover:border-amber-400'
                  }`}
                >
                  <div className="text-2xl mb-1 flex items-center justify-between">
                    <span>{clue.icon}</span>
                    {clue.inspected && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </div>
                  <div className="text-xs font-bold text-[#5c4033] dark:text-purple-100">
                    {clue.name}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Clue Detail Box */}
          {activeClueId && (
            <div className="mt-3 p-3.5 rounded-2xl bg-amber-50 dark:bg-slate-900 border border-amber-200 dark:border-amber-800/40 text-xs sm:text-sm text-stone-800 dark:text-amber-100 animate-fade-in">
              <strong className="text-[#a34063] dark:text-pink-400">Analysis: </strong>
              {clues.find((c) => c.id === activeClueId)?.details}
            </div>
          )}
        </div>

        {/* Suspects Identification */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
            2. Match to Dreamland Resident
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SUSPECTS.map((suspect) => (
              <div
                key={suspect.id}
                className="p-3 rounded-2xl bg-white dark:bg-slate-800/70 border border-stone-200 dark:border-slate-700 flex flex-col justify-between space-y-2"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{suspect.icon}</span>
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-[#5c4033] dark:text-purple-100">
                      {suspect.name}
                    </h5>
                    <span className="text-[10px] text-[#a34063] dark:text-pink-300 font-semibold">
                      {suspect.role}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                  {suspect.traits}
                </p>
                <button
                  onClick={() => handleAccusation(suspect.id)}
                  disabled={isSolved}
                  className="w-full py-2 rounded-xl bg-purple-100 dark:bg-purple-900/60 hover:bg-purple-200 dark:hover:bg-purple-800 text-[#a34063] dark:text-pink-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  This is the Sender!
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div
            className={`p-3.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 ${
              feedback.status === 'correct'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-rose-100 text-rose-900 border border-rose-300'
            }`}
          >
            {feedback.status === 'correct' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Solved Wish Reveal */}
        {isSolved && (
          <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-100 to-amber-100 dark:from-purple-950 dark:to-slate-900 border-2 border-amber-300 space-y-2 animate-fade-in">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300">
              <span>✨ Secret Unsealed: Barnaby&apos;s Wish</span>
            </div>
            <p className="italic text-xs sm:text-sm font-handwriting text-xl text-[#5c4033] dark:text-purple-100 leading-snug">
              &ldquo;I wish for a warm pair of spectacles with rose-tinted lenses, so that as my feathers turn gray,
              I might keep reading bedtime star charts to every lost dreamer who passes our bureau.&rdquo;
            </p>
            {firstTimeReward && (
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                First Completion Bonus: +{firstTimeReward} XP Awarded!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
