import React, { useState } from 'react';
import { CayleeAvatar } from '../CayleeAvatar';
import { useProgression } from '../../context/ProgressionContext';
import { sound } from '../../utils/audio';
import { MessageCircle, Sparkles, Volume2, VolumeX, X, Send } from 'lucide-react';

interface DialoguePrompt {
  id: string;
  category: 'Origin' | 'Scrapbook' | 'Locations' | 'Games' | 'XP' | 'Hints';
  question: string;
  answer: string;
}

const DIALOGUE_PROMPTS: DialoguePrompt[] = [
  {
    id: 'd-1',
    category: 'Origin',
    question: 'How did you become a wishkeeper, Caylee?',
    answer: 'I was born from a forgotten wish carried on a midnight moonbeam! Barnaby the Owl gave me my wish satchel, and now I fly across constellations helping sleepy stars twinkle again.',
  },
  {
    id: 'd-2',
    category: 'Scrapbook',
    question: 'What is hidden inside your secret diary?',
    answer: 'Shhh! Page E holds my private night musings! If you look closely at Pages B, C, and D, each one conceals a lucky number. Together they form the 3-digit secret code: 777!',
  },
  {
    id: 'd-3',
    category: 'Locations',
    question: 'What is your favorite place in the sky archipelago?',
    answer: 'The Moon Garden! The air smells of chamomile and lavender moss, and Lunetta knits cloud fluff there while the stars slumber.',
  },
  {
    id: 'd-4',
    category: 'Games',
    question: 'Can you give me tips for the Arcade games?',
    answer: 'In Wish Catcher, watch for rare pink wish bottles (+25 pts) and dodge storm clouds. In Star Repair, use the brush first to sweep soot, then polish with moon dew!',
  },
  {
    id: 'd-5',
    category: 'XP',
    question: 'How do I climb to Master Wishkeeper level?',
    answer: 'Explore every corner! You earn XP on your first visit, solving scrapbook riddles, finding Easter eggs, reading origin chapters, and winning arcade challenges. At 350 XP, you attain Level 5!',
  },
  {
    id: 'd-6',
    category: 'Hints',
    question: 'Are there any secret Easter eggs nearby?',
    answer: 'Try clicking my golden antennae! Or peel back the curled page corner on the scrapbook. You can also type "m-o-t-h" on your keyboard when relaxing!',
  },
];

interface DialogueProps {
  onClose: () => void;
}

export const CayleeDialogueModal: React.FC<DialogueProps> = ({ onClose }) => {
  const { progress } = useProgression();
  const [selectedPrompt, setSelectedPrompt] = useState<DialoguePrompt>(DIALOGUE_PROMPTS[0]);
  const [speakVoice, setSpeakVoice] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSelectPrompt = (prompt: DialoguePrompt) => {
    sound.playTap();
    setSelectedPrompt(prompt);

    if (speakVoice && progress.soundEnabled) {
      setIsSpeaking(true);
      sound.speak(
        prompt.answer,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        () => setIsSpeaking(false)
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#fff8f1] to-[#fce7f3] dark:from-[#1e1b4b] dark:to-[#120a28] text-[#5c4033] dark:text-purple-100 rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#a34063]/30 my-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#5c4033]/15 dark:border-purple-500/30">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[#a34063] dark:text-pink-400" />
            <h3 className="font-serif-heading font-bold text-xl text-[#5c4033] dark:text-purple-100">
              Tea Time Chat with Caylee
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSpeakVoice(!speakVoice)}
              className="p-1.5 rounded-full bg-white/70 dark:bg-slate-800 border text-xs font-semibold flex items-center gap-1 cursor-pointer"
              title="Toggle voice readout"
            >
              {speakVoice ? <Volume2 className="w-4 h-4 text-[#a34063]" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
            </button>
            <button
              onClick={() => {
                sound.stopSpeaking();
                sound.playTap();
                onClose();
              }}
              className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-slate-700 text-stone-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Caylee Avatar & Active Dialogue Bubble */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <CayleeAvatar size="md" expression={isSpeaking ? 'giggle' : 'curious'} interactive={true} />
          </div>

          <div className="flex-1 space-y-2 text-left">
            <div className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#a34063] dark:text-pink-300 bg-[#a34063]/10 dark:bg-pink-900/40 px-2.5 py-0.5 rounded-full">
              Category: {selectedPrompt.category}
            </div>
            <h4 className="font-bold text-sm text-stone-800 dark:text-purple-200">
              Q: &ldquo;{selectedPrompt.question}&rdquo;
            </h4>
            <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-[#5c4033]/10 dark:border-purple-500/20 text-xs sm:text-sm leading-relaxed shadow-sm font-handwriting text-xl text-[#5c4033] dark:text-amber-100">
              &ldquo;{selectedPrompt.answer}&rdquo;
            </div>
          </div>
        </div>

        {/* Suggested Dialogue Questions Grid */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
            Ask Caylee a question:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {DIALOGUE_PROMPTS.map((prompt) => (
              <button
                key={prompt.id}
                onClick={() => handleSelectPrompt(prompt)}
                className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                  selectedPrompt.id === prompt.id
                    ? 'bg-[#a34063] text-white shadow border-[#a34063]'
                    : 'bg-white dark:bg-slate-800 text-stone-700 dark:text-purple-200 border-stone-200 hover:border-amber-400'
                }`}
              >
                <div className="text-[10px] opacity-75">{prompt.category}</div>
                <div className="truncate mt-0.5">{prompt.question}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
