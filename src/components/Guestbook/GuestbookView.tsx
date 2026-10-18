import React, { useState } from 'react';
import { useProgression } from '../../context/ProgressionContext';
import { sound } from '../../utils/audio';
import { Send, Stamp, Sparkles, BookOpen, Heart } from 'lucide-react';

const STAMP_OPTIONS = ['🦉', '🐚', '🌙', '⭐', '🍵', '🦋', '🌸', '🏮'];

export const GuestbookView: React.FC = () => {
  const { progress, addGuestbookEntry } = useProgression();
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [selectedStamp, setSelectedStamp] = useState('✨');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    sound.playStarCatch();
    addGuestbookEntry(author, message, selectedStamp);
    setAuthor('');
    setMessage('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="paper-card p-6 sm:p-8 bg-gradient-to-r from-amber-50 to-pink-50 dark:from-[#1e1b4b] dark:to-[#171031] relative overflow-hidden">
        <div className="washi-tape washi-tape-lavender -top-2.5 left-10 w-36 rotate-[-1deg] rounded" />

        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#a34063]/10 dark:bg-pink-900/40 text-[#a34063] dark:text-pink-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bureau Guest Register • Stored in Your Local Browser</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#5c4033] dark:text-purple-100">
            The Starlight Guestbook
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            Leave a note in Caylee&apos;s parchment guest ledger.
            <span className="block mt-1 text-[11px] font-semibold text-stone-500 italic">
              Notice: Because this applet runs purely client-side without external tracking databases,
              your entries are preserved locally in this browser.
            </span>
          </p>
        </div>
      </div>

      {/* Entry Form */}
      <div className="paper-card p-6 sm:p-8 space-y-4">
        <h3 className="font-serif-heading font-bold text-lg text-[#5c4033] dark:text-purple-100 flex items-center gap-2 border-b border-[#5c4033]/15 pb-2">
          <Send className="w-4 h-4 text-[#a34063] dark:text-pink-400" />
          <span>Sign the Register</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Your Explorer Name:
                </label>
                <span className="text-[10px] text-stone-400">{author.length}/50</span>
              </div>
              <input
                type="text"
                maxLength={50}
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Moonbeam Wanderer"
                className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm border border-[#5c4033]/20 bg-white dark:bg-slate-800 text-stone-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-[#a34063]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1">
                Choose a Wax Stamp:
              </label>
              <div className="flex gap-2 flex-wrap">
                {STAMP_OPTIONS.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      sound.playTap();
                      setSelectedStamp(st);
                    }}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border transition-all cursor-pointer ${
                      selectedStamp === st
                        ? 'bg-amber-100 border-amber-400 scale-110 shadow-sm'
                        : 'bg-white dark:bg-slate-800 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Your Message or Nighttime Thought:
              </label>
              <span className="text-[10px] text-stone-400">{message.length}/280</span>
            </div>
            <textarea
              rows={3}
              maxLength={280}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a sweet message, a favorite dream, or a greeting to Caylee..."
              className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm border border-[#5c4033]/20 bg-white dark:bg-slate-800 text-stone-800 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-[#a34063]"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            {submitted ? (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                ✨ Signed and stamped in the bureau register!
              </span>
            ) : (
              <span className="text-[11px] text-stone-400">
                Signing awards first-time guestbook XP!
              </span>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#a34063] hover:bg-[#852f4e] text-white font-rounded font-bold text-xs shadow transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Affix Stamp &amp; Sign</span>
            </button>
          </div>
        </form>
      </div>

      {/* Guestbook Entries List */}
      <div className="space-y-4">
        <h3 className="font-serif-heading font-bold text-lg text-[#5c4033] dark:text-purple-100 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#a34063] dark:text-pink-400" />
          <span>Past Signatures ({progress.guestbookEntries.length})</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {progress.guestbookEntries.map((entry) => (
            <div
              key={entry.id}
              className="paper-card p-4 space-y-2 border border-stone-200 dark:border-purple-800/40 relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-[#5c4033]/10 pb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{entry.stamp}</span>
                  <span className="font-bold text-xs text-[#5c4033] dark:text-purple-100">
                    {entry.author}
                  </span>
                </div>
                <span className="text-[10px] text-stone-400">{entry.date}</span>
              </div>
              <p className="font-handwriting text-base text-stone-700 dark:text-stone-300 leading-snug">
                &ldquo;{entry.message}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
