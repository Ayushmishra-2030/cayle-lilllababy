import React, { useState, useRef } from 'react';
import { useProgression } from '../../context/ProgressionContext';
import { sound } from '../../utils/audio';
import { Sparkles, Copy, Check, Download, Heart, Trash2, Send } from 'lucide-react';

interface WishTemplate {
  mood: string;
  emoji: string;
  color: string;
  wishes: string[];
}

const WISH_TEMPLATES: WishTemplate[] = [
  {
    mood: 'Peaceful',
    emoji: '🕊️',
    color: 'from-sky-100 to-indigo-100 dark:from-slate-800 dark:to-indigo-950',
    wishes: [
      'May quiet mornings bring you soft tea, gentle breezes, and thoughts as serene as a sleeping comet.',
      'May all your worries drift away like silver clouds passing silently over the northern horizon.',
      'May your heart find stillness tonight, knowing tomorrow holds a quiet constellation just for you.',
      'May rest wrap around you like Lunetta’s spun wool blankets beneath a tranquil crescent moon.',
    ],
  },
  {
    mood: 'Brave',
    emoji: '🦁',
    color: 'from-amber-100 to-rose-100 dark:from-amber-950 dark:to-rose-950',
    wishes: [
      'May you discover that even the tiniest star has enough starlight to pierce the deepest twilight.',
      'May your footsteps be guided by courage, and may you remember that you were born to traverse vast skies.',
      'May every challenge you face become a stepping stone across the cosmic archway.',
      'May you soar high above stormy thunderheads, knowing your wings are stronger than you think.',
    ],
  },
  {
    mood: 'Whimsical',
    emoji: '✨',
    color: 'from-pink-100 to-purple-100 dark:from-pink-950 dark:to-purple-950',
    wishes: [
      'May you accidentally discover chocolate chip cookies inside your pocket when you need them most.',
      'May tea mugs never run cold, and may glitter never stay in your eyes too long.',
      'May playful shooting stars leave ribbons of strawberry stardust along your path.',
      'May you giggle with friendly snails and dance with friendly fireflies under lavender clouds.',
    ],
  },
  {
    mood: 'Cozy',
    emoji: '🍵',
    color: 'from-orange-100 to-amber-100 dark:from-orange-950 dark:to-amber-950',
    wishes: [
      'May warm socks, a purring companion, and a flickering lantern keep your evening snug and bright.',
      'May chamomile tea warm your hands and cozy bedtime stories invite sweet, golden dreams.',
      'May every corner of your home glow with the familiar comfort of old books and gentle lullabies.',
    ],
  },
  {
    mood: 'Cosmic',
    emoji: '🌌',
    color: 'from-purple-100 to-indigo-200 dark:from-purple-950 dark:to-slate-900',
    wishes: [
      'May the ancient council of stars align their golden rays to illuminate your deepest aspiration.',
      'May you feel the rhythm of orbiting planets and know that you belong to this infinite, caring universe.',
      'May your wishes travel safely across light-years and return home as brilliant, joyful memories.',
    ],
  },
];

export const WishGeneratorView: React.FC = () => {
  const { progress, saveWish, deleteWish } = useProgression();
  const [selectedMood, setSelectedMood] = useState<string>('Peaceful');
  const [recipient, setRecipient] = useState<string>('');
  const [currentWish, setCurrentWish] = useState<string>(
    'May quiet mornings bring you soft tea, gentle breezes, and thoughts as serene as a sleeping comet.'
  );
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const activeTemplate = WISH_TEMPLATES.find((t) => t.mood === selectedMood) || WISH_TEMPLATES[0];

  const handleGenerateWish = () => {
    sound.playSparkle();
    const available = activeTemplate.wishes;
    const randomWish = available[Math.floor(Math.random() * available.length)];
    setCurrentWish(randomWish);
    setCopied(false);
    setSavedSuccess(false);
  };

  const handleCopy = () => {
    sound.playTap();
    const fullText = `"${currentWish}" ${recipient ? `— To: ${recipient}` : ''}\n(Wish from Caylee's Little Star Bureau ✨)`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveFavorite = () => {
    saveWish({
      mood: selectedMood,
      text: currentWish,
      recipient: recipient.trim() || 'A Dear Friend',
      starsCount: Math.floor(Math.random() * 5) + 3,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Canvas card generator for downloading or sharing
  const handleDownloadCard = () => {
    sound.playStarCatch();
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw background gradient
    const grad = ctx.createLinearGradient(0, 0, 800, 500);
    grad.addColorStop(0, '#fff8f1');
    grad.addColorStop(0.5, '#fce7f3');
    grad.addColorStop(1, '#fef3c7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 500);

    // Border
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#a34063';
    ctx.strokeRect(20, 20, 760, 460);

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#d97706';
    ctx.strokeRect(32, 32, 736, 436);

    // Decorative Header
    ctx.fillStyle = '#a34063';
    ctx.font = 'bold 30px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText("Caylee's Little Star Bureau", 400, 80);

    ctx.fillStyle = '#78350f';
    ctx.font = 'italic 20px Georgia, serif';
    ctx.fillText('~ "No wish is too small to find its way home" ~', 400, 115);

    // Recipient
    if (recipient.trim()) {
      ctx.fillStyle = '#5c4033';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.fillText(`Dedicated to: ${recipient.trim()}`, 400, 160);
    }

    // Wish Text with wrapping
    ctx.fillStyle = '#451a03';
    ctx.font = '22px Georgia, serif';
    const words = currentWish.split(' ');
    let line = '';
    let y = recipient.trim() ? 220 : 190;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 680 && n > 0) {
        ctx.fillText(line, 400, y);
        line = words[n] + ' ';
        y += 34;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 400, y);

    // Footer with stamp
    ctx.fillStyle = '#a34063';
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.fillText(`Mood: ${selectedMood}  •  Certified by Junior Wishkeeper Caylee ✨`, 400, 440);

    // Export image
    const link = document.createElement('a');
    link.download = `caylee-wish-${selectedMood.toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="paper-card p-6 sm:p-8 bg-gradient-to-r from-pink-50 via-purple-50 to-amber-50 dark:from-[#1e1b4b] dark:to-[#171031] relative overflow-hidden">
        <div className="washi-tape washi-tape-lavender -top-2.5 left-10 w-36 rotate-[-1deg] rounded" />

        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#a34063]/10 dark:bg-pink-900/40 text-[#a34063] dark:text-pink-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Celestial Alchemy of Words</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#5c4033] dark:text-purple-100">
            Magical Wish Generator
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
            Choose your current mood or intention. Caylee will weave a personalized celestial wish that you can save, copy, or export as a downloadable scrapbook card!
          </p>
        </div>
      </div>

      {/* Mood Selector Buttons */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
          1. Select Your Wish Mood:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {WISH_TEMPLATES.map((tmpl) => {
            const isSelected = selectedMood === tmpl.mood;
            return (
              <button
                key={tmpl.mood}
                onClick={() => {
                  sound.playTap();
                  setSelectedMood(tmpl.mood);
                }}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#a34063] text-white shadow-md border-[#a34063] scale-102'
                    : 'bg-white dark:bg-slate-800 border-stone-200 text-stone-700 dark:text-purple-200 hover:border-amber-400'
                }`}
              >
                <div className="text-2xl mb-1">{tmpl.emoji}</div>
                <div className="font-rounded font-bold text-xs">{tmpl.mood}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recipient Optional Input */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1.5">
          2. Dedicated To (Optional):
        </label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="e.g. My best friend, My future self, Grandmother..."
          className="w-full max-w-md py-2.5 px-4 rounded-xl text-xs sm:text-sm border border-[#5c4033]/20 bg-white dark:bg-slate-800 text-stone-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-[#a34063]"
        />
      </div>

      {/* Generated Wish Card */}
      <div className="paper-card p-6 sm:p-10 space-y-6 text-center border-2 border-[#a34063]/30 bg-gradient-to-br from-amber-50/50 via-white to-purple-50/50 dark:from-[#1b143a] dark:to-[#120a28] shadow-xl">
        <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-2xl mx-auto shadow-inner">
          {activeTemplate.emoji}
        </div>

        {recipient && (
          <span className="text-xs font-bold text-[#a34063] dark:text-pink-300 uppercase tracking-widest block">
            Dedicated with love to {recipient}
          </span>
        )}

        <blockquote className="text-lg sm:text-2xl font-serif-heading font-medium text-[#5c4033] dark:text-purple-100 leading-relaxed max-w-2xl mx-auto italic">
          &ldquo;{currentWish}&rdquo;
        </blockquote>

        <p className="font-handwriting text-xl text-[#a34063] dark:text-pink-300">
          — Certified by Caylee, Junior Wishkeeper
        </p>

        {/* Wish Actions Bar */}
        <div className="pt-4 border-t border-[#5c4033]/15 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleGenerateWish}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-900 font-rounded font-bold text-xs shadow transition-transform active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Another Wish</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 hover:bg-stone-100 text-stone-700 dark:text-purple-200 font-rounded font-semibold text-xs cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handleSaveFavorite}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-300 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-rounded font-semibold text-xs cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 fill-rose-500" />
            <span>{savedSuccess ? 'Saved to Favorites!' : 'Save Favorite'}</span>
          </button>

          <button
            onClick={handleDownloadCard}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-300 hover:bg-purple-100 text-purple-700 dark:text-purple-300 font-rounded font-semibold text-xs cursor-pointer"
            title="Download pretty shareable PNG card"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Wish Card</span>
          </button>
        </div>
      </div>

      {/* Saved Favorites Section */}
      {progress.savedWishes.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="font-serif-heading font-bold text-lg text-[#5c4033] dark:text-purple-100 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <span>Saved Wishes Vault ({progress.savedWishes.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {progress.savedWishes.map((w) => (
              <div
                key={w.id}
                className="paper-card p-4 flex flex-col justify-between space-y-3 border border-pink-200 dark:border-purple-800"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-[#a34063] dark:text-pink-300">
                      {w.mood} • To: {w.recipient}
                    </span>
                    <button
                      onClick={() => deleteWish(w.id)}
                      className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-200 italic leading-relaxed">
                    &ldquo;{w.text}&rdquo;
                  </p>
                </div>

                <div className="text-[10px] text-stone-400 flex items-center justify-between border-t border-stone-200 dark:border-slate-800 pt-2">
                  <span>Saved on {new Date(w.timestamp).toLocaleDateString()}</span>
                  <span>{'⭐'.repeat(w.starsCount || 3)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
