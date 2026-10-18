import React from 'react';
import { Sparkles, Moon, Star, X } from 'lucide-react';
import { sound } from '../utils/audio';

interface SecretRoomModalProps {
  onClose: () => void;
}

export const SecretRoomModal: React.FC<SecretRoomModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#1e1b4b] to-[#0f172a] text-purple-100 rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-amber-400/50 my-auto">
        {/* Glow corner stars */}
        <div className="absolute top-3 left-4 text-amber-300 animate-star-pulse">✨</div>
        <div className="absolute bottom-4 right-4 text-amber-300 animate-star-pulse">⭐</div>

        <button
          onClick={() => {
            sound.playTap();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-purple-200 cursor-pointer"
          aria-label="Close secret attic"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Easter Egg Discovery #1</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif-heading font-bold text-amber-200">
            The Starlight Observatory Attic
          </h2>
          <p className="text-xs sm:text-sm text-purple-300 font-handwriting text-lg">
            ~ Caylee&apos;s hidden rooftop sanctuary above the bureau clouds ~
          </p>
        </div>

        {/* Observatory Scene Graphic */}
        <div className="relative rounded-2xl bg-indigo-950/80 border border-purple-500/30 p-5 mb-5 flex flex-col items-center justify-center min-h-[160px] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-800/20 via-transparent to-transparent pointer-events-none" />

          {/* SVG Telescope & Moon window */}
          <svg viewBox="0 0 200 120" className="w-48 h-32 drop-shadow-md">
            {/* Arched Window */}
            <path
              d="M 50,110 L 50,45 A 50,50 0 0 1 150,45 L 150,110 Z"
              fill="#0b0f29"
              stroke="#fbbf24"
              strokeWidth="2"
            />
            {/* Stars in window */}
            <circle cx="80" cy="40" r="1.5" fill="#fef08a" />
            <circle cx="120" cy="30" r="2" fill="#ffffff" />
            <circle cx="135" cy="55" r="1.5" fill="#fef08a" />
            <circle cx="65" cy="65" r="1" fill="#ffffff" />
            {/* Moon in window */}
            <path
              d="M 95,20 A 15,15 0 0 0 110,42 A 18,18 0 1 1 95,20 Z"
              fill="#fef08a"
              opacity="0.9"
            />
            {/* Brass Telescope on tripod */}
            <line x1="85" y1="95" x2="65" y2="115" stroke="#d97706" strokeWidth="2.5" />
            <line x1="85" y1="95" x2="105" y2="115" stroke="#d97706" strokeWidth="2.5" />
            <line x1="85" y1="95" x2="85" y2="115" stroke="#d97706" strokeWidth="2.5" />
            {/* Telescope Tube angled */}
            <polygon points="60,80 125,50 127,55 62,85" fill="#fbbf24" stroke="#92400e" strokeWidth="1" />
            <circle cx="126" cy="52.5" r="4.5" fill="#38bdf8" opacity="0.8" />
          </svg>

          <p className="mt-2 text-xs text-center text-purple-200 font-medium">
            &ldquo;From this attic skylight, Caylee watches each lost wish navigate the constellations before morning arrives.&rdquo;
          </p>
        </div>

        {/* Secret Attic Lore Note */}
        <div className="bg-purple-900/40 rounded-2xl p-4 border border-purple-400/20 text-xs sm:text-sm text-purple-200 space-y-2">
          <p className="leading-relaxed">
            <strong className="text-amber-300">A handwritten note on the desk reads:</strong><br />
            &ldquo;To whoever found this telescope: You have the curious heart of a true wishkeeper.
            Remember that even when the moon is slender as a fingernail, its light still guides sleepy travelers home.&rdquo;
          </p>
          <p className="text-right font-handwriting text-base text-pink-300">
            — Caylee &amp; The Dream Council
          </p>
        </div>

        <button
          onClick={() => {
            sound.playTap();
            onClose();
          }}
          className="mt-6 w-full py-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-900 font-rounded font-bold text-sm shadow-lg transition-transform active:scale-95 cursor-pointer"
        >
          Return to Bureau Main Hall
        </button>
      </div>
    </div>
  );
};
