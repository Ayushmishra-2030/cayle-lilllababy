import React, { useState } from 'react';
import { CayleeAvatar } from '../CayleeAvatar';
import { useProgression } from '../../context/ProgressionContext';
import { sound } from '../../utils/audio';
import { Sparkles, Heart, Feather, Coffee, Moon, Star } from 'lucide-react';

export const AboutView: React.FC = () => {
  const { discoverEasterEgg } = useProgression();
  const [jarOpened, setJarOpened] = useState(false);
  const [selectedPart, setSelectedPart] = useState<'antennae' | 'wings' | 'eyes' | 'satchel' | 'fluff'>('antennae');

  // Easter Egg #6: The Wish Jar
  const handleWishJarClick = () => {
    sound.playSparkle();
    setJarOpened(true);
    discoverEasterEgg('egg-6-wish-jar');
  };

  const anatomicalNotes = {
    antennae: {
      title: 'Golden Antennae',
      desc: 'Sensitive to the whispers of falling stars and the flutter of distant dreams. Emits a shower of gentle pollen when tickled!',
      icon: '✨',
    },
    wings: {
      title: 'Translucent Star Wings',
      desc: 'Woven from moonlight and spun morning dew. They make a soft humming sound like a tiny music box during high-altitude flight.',
      icon: '🦋',
    },
    eyes: {
      title: 'Warm Amber Eyes',
      desc: 'Equipped with celestial night vision to spot wandering wishes through thick storm clouds and foggy rooftops.',
      icon: '👁️',
    },
    satchel: {
      title: 'Leather Wish Satchel',
      desc: 'Her trusted crossbody bag with a golden star buckle. Inside are glass wish vials, soft chamois cloth, and chamomile tea leaves.',
      icon: '👜',
    },
    fluff: {
      title: 'Lavender Cloud Fluff',
      desc: 'Soft as fresh marshmallows. Keeps Caylee warm during sub-zero journeys past the rings of Saturn.',
      icon: '☁️',
    },
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title & Introduction */}
      <div className="paper-card p-6 sm:p-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-[#1e1b4b] dark:to-[#171031] relative overflow-hidden">
        <div className="washi-tape washi-tape-lavender -top-2.5 left-10 w-36 rotate-[-1deg] rounded" />

        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <CayleeAvatar size="lg" expression="curious" interactive={true} />
          </div>

          <div className="flex-1 space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#a34063]/10 dark:bg-pink-900/40 text-[#a34063] dark:text-pink-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Character Dossier</span>
            </div>

            <h2 className="text-3xl font-serif-heading font-bold text-[#5c4033] dark:text-purple-100">
              About Caylee the Moon-Moth
            </h2>

            <p className="font-handwriting text-2xl text-[#a34063] dark:text-pink-300">
              &ldquo;Small wings, endless horizons.&rdquo;
            </p>

            <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              Born from a stray wish carried on a midnight moonbeam, Caylee is the Junior Wishkeeper at the Little Star Bureau.
              She is curious, playful, intensely loyal, and slightly clumsy whenever glitter gets in her tea mugs.
            </p>
          </div>
        </div>
      </div>

      {/* Character Stats & Preferences */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Species', val: 'Celestial Moon-Moth', icon: '🦋' },
          { label: 'Favorite Drink', val: 'Chamomile & Glitter Tea', icon: '🍵' },
          { label: 'Bureau Duty', val: 'Repairing Sleepy Stars', icon: '⭐' },
          { label: 'Dream Companion', val: 'Pip the Nebula Snail', icon: '🐚' },
        ].map((item, idx) => (
          <div key={idx} className="paper-card p-4 text-center space-y-1">
            <span className="text-2xl">{item.icon}</span>
            <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
              {item.label}
            </div>
            <div className="font-bold text-xs sm:text-sm text-[#5c4033] dark:text-purple-100">
              {item.val}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Anatomical Breakdown */}
      <div className="paper-card p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#5c4033]/15 pb-2">
          <h3 className="font-serif-heading font-bold text-xl text-[#5c4033] dark:text-purple-100">
            Moth Physiology &amp; Magical Gear
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-300">
            Click any part below to learn how Caylee navigates the night skies.
          </p>
        </div>

        {/* Part Selection Buttons */}
        <div className="flex flex-wrap gap-2">
          {(['antennae', 'wings', 'eyes', 'satchel', 'fluff'] as const).map((part) => (
            <button
              key={part}
              onClick={() => {
                sound.playTap();
                setSelectedPart(part);
              }}
              className={`px-4 py-2 rounded-full font-rounded text-xs font-bold transition-all cursor-pointer ${
                selectedPart === part
                  ? 'bg-[#a34063] text-white shadow'
                  : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-purple-200 hover:bg-stone-200'
              }`}
            >
              {anatomicalNotes[part].icon} {anatomicalNotes[part].title}
            </button>
          ))}
        </div>

        {/* Selected Part Detail Card */}
        <div className="p-5 rounded-3xl bg-amber-50/70 dark:bg-purple-950/50 border border-amber-200 dark:border-purple-800 space-y-2 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{anatomicalNotes[selectedPart].icon}</span>
            <h4 className="font-serif-heading font-bold text-base text-[#5c4033] dark:text-purple-100">
              {anatomicalNotes[selectedPart].title}
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
            {anatomicalNotes[selectedPart].desc}
          </p>
        </div>
      </div>

      {/* EASTER EGG #6: The Wish Jar on the Shelf */}
      <div className="paper-card p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-900 dark:to-purple-950 border border-amber-300/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            onClick={handleWishJarClick}
            className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/60 border-2 border-amber-400 flex items-center justify-center text-3xl cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-md drop-shadow-[0_0_10px_#fde047]"
            title="A glowing corked mason jar (Click to open! Easter Egg #6)"
          >
            {jarOpened ? '🍪✨' : '🫙'}
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curiosity on the Bureau Shelf</span>
            </div>
            <h4 className="font-serif-heading font-bold text-base text-[#5c4033] dark:text-purple-100">
              {jarOpened ? 'The Cookie Wish Jar Uncorked!' : 'An Unlabeled Glowing Mason Jar'}
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
              {jarOpened
                ? 'You popped the cork! A secret wish for chocolate chip cookies escaped into the night sky (+10 XP).'
                : 'A strange jar with a cork stopper is humming softly on the bookshelf. What could be inside?'}
            </p>
          </div>
        </div>

        {!jarOpened && (
          <button
            onClick={handleWishJarClick}
            className="px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-900 font-rounded font-bold text-xs shadow cursor-pointer transition-transform active:scale-95 whitespace-nowrap"
          >
            Pop the Cork
          </button>
        )}
      </div>
    </div>
  );
};
