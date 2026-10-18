import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../../utils/audio';
import { useProgression } from '../../context/ProgressionContext';
import { Play, Pause, Volume2, VolumeX, Music, RotateCw, Sparkles, Disc, Sliders } from 'lucide-react';

interface Melody {
  id: string;
  title: string;
  tempo: number;
  icon: string;
  notes: { freq: number; duration: number }[];
  lore: string;
}

// Gentle celestial frequencies
const MELODIES: Melody[] = [
  {
    id: 'lullaby-1',
    title: 'Starlight Lullaby',
    tempo: 420,
    icon: '⭐',
    lore: 'Played each twilight by the Bureau music box to invite sweet slumber.',
    notes: [
      { freq: 523.25, duration: 0.4 }, // C5
      { freq: 659.25, duration: 0.4 }, // E5
      { freq: 783.99, duration: 0.6 }, // G5
      { freq: 659.25, duration: 0.4 }, // E5
      { freq: 1046.5, duration: 0.8 }, // C6
      { freq: 880.0, duration: 0.4 },  // A5
      { freq: 783.99, duration: 0.6 }, // G5
      { freq: 523.25, duration: 0.8 }, // C5
    ],
  },
  {
    id: 'lullaby-2',
    title: 'Moonbeam Waltz',
    tempo: 360,
    icon: '🌙',
    lore: 'A gentle 3/4 waltz Caylee dances to while flying past starry clouds.',
    notes: [
      { freq: 587.33, duration: 0.5 }, // D5
      { freq: 739.99, duration: 0.3 }, // F#5
      { freq: 880.0, duration: 0.3 },  // A5
      { freq: 739.99, duration: 0.3 }, // F#5
      { freq: 1174.66, duration: 0.6 },// D6
      { freq: 987.77, duration: 0.4 }, // B5
      { freq: 880.0, duration: 0.6 },  // A5
    ],
  },
  {
    id: 'lullaby-3',
    title: 'Caylee’s Secret Hymn',
    tempo: 480,
    icon: '🦋',
    lore: 'The soft chime whispered when a forgotten wish finds its home.',
    notes: [
      { freq: 659.25, duration: 0.4 }, // E5
      { freq: 783.99, duration: 0.4 }, // G5
      { freq: 987.77, duration: 0.5 }, // B5
      { freq: 1318.51, duration: 0.8 },// E6
      { freq: 1174.66, duration: 0.4 },// D6
      { freq: 987.77, duration: 0.4 }, // B5
      { freq: 783.99, duration: 0.7 }, // G5
    ],
  },
];

export const LullabyLabView: React.FC = () => {
  const { progress } = useProgression();
  const [selectedMelodyId, setSelectedMelodyId] = useState<string>(MELODIES[0].id);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentNoteIdx, setCurrentNoteIdx] = useState<number>(-1);
  const [volume, setVolume] = useState<number>(0.7);
  const [crankRotation, setCrankRotation] = useState<number>(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeMelody = MELODIES.find((m) => m.id === selectedMelodyId) || MELODIES[0];

  // Clean up audio context and loop on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const getAudioContext = (): AudioContext | null => {
    if (!progress.soundEnabled) return null;
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playMusicBoxNote = (freq: number, duration: number) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      // Music box chime timbre: fundamental + light harmonic overtone
      const osc = ctx.createOscillator();
      const overtone = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      overtone.type = 'sine';
      overtone.frequency.setValueAtTime(freq * 2.01, ctx.currentTime);

      const effectiveVolume = volume * 0.15;
      gain.gain.setValueAtTime(effectiveVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      overtone.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      overtone.start();
      osc.stop(ctx.currentTime + duration);
      overtone.stop(ctx.currentTime + duration);
    } catch {
      // graceful fallback
    }
  };

  const startPlayback = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    let step = 0;

    const playStep = () => {
      if (step >= activeMelody.notes.length) {
        step = 0; // loop
      }
      setCurrentNoteIdx(step);
      const note = activeMelody.notes[step];
      playMusicBoxNote(note.freq, note.duration);
      setCrankRotation((prev) => (prev + 35) % 360);

      step++;
      timerRef.current = setTimeout(playStep, activeMelody.tempo);
    };

    playStep();
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    setCurrentNoteIdx(-1);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleCrankManual = () => {
    sound.playTap();
    setCrankRotation((prev) => (prev + 45) % 360);
    // Play a single next note
    const randNote = activeMelody.notes[Math.floor(Math.random() * activeMelody.notes.length)];
    playMusicBoxNote(randNote.freq, 0.45);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="paper-card p-6 sm:p-8 bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 dark:from-[#1e1b4b] dark:to-[#171031] relative overflow-hidden">
        <div className="washi-tape washi-tape-lavender -top-2.5 left-10 w-36 rotate-[-1deg] rounded" />

        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#a34063]/10 dark:bg-pink-900/40 text-[#a34063] dark:text-pink-300">
            <Music className="w-3.5 h-3.5" />
            <span>Acoustic Celestial Music Box</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#5c4033] dark:text-purple-100">
            Caylee&apos;s Lullaby Lab
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            Listen to delicate handcrafted music-box melodies synthesized live with the Web Audio API.
            Turn the crank or choose a melody below to bring cozy starlight ambiance to your session.
          </p>
        </div>
      </div>

      {/* Melody Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {MELODIES.map((m) => {
          const isSelected = selectedMelodyId === m.id;
          return (
            <button
              key={m.id}
              onClick={() => {
                sound.playTap();
                stopPlayback();
                setSelectedMelodyId(m.id);
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#a34063] text-white shadow-md border-[#a34063]'
                  : 'bg-white dark:bg-slate-800 text-stone-800 dark:text-purple-200 border-stone-200 hover:border-amber-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl">{m.icon}</span>
                <span className="text-[10px] uppercase font-bold opacity-80">
                  {m.tempo}ms
                </span>
              </div>
              <h4 className="font-serif-heading font-bold text-sm truncate">{m.title}</h4>
              <p className="text-[11px] opacity-80 line-clamp-2 mt-0.5">{m.lore}</p>
            </button>
          );
        })}
      </div>

      {/* Interactive Music Box Player Stage */}
      <div className="paper-card p-6 sm:p-10 space-y-8 text-center border-2 border-[#a34063]/20 shadow-xl bg-gradient-to-br from-[#fffdfa] via-white to-purple-50/40 dark:from-[#1b143a] dark:to-[#120a28]">
        {/* Animated Music Box Graphic & Crank */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          {/* Rotating Music Cylinder */}
          <div className="relative w-36 h-36 rounded-3xl bg-gradient-to-tr from-amber-200 via-amber-100 to-rose-100 dark:from-purple-900 dark:to-indigo-950 border-4 border-amber-300 shadow-inner flex items-center justify-center">
            <div
              style={{ transform: `rotate(${crankRotation}deg)` }}
              className="transition-transform duration-300 text-5xl select-none"
            >
              {activeMelody.icon}
            </div>
            {/* Sparkles on active playback */}
            {isPlaying && (
              <span className="absolute -top-2 -right-2 text-xl animate-bounce">✨</span>
            )}
          </div>

          {/* Interactive Manual Crank Handle */}
          <div className="flex flex-col items-center space-y-2">
            <button
              onClick={handleCrankManual}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-white shadow-lg flex items-center justify-center cursor-pointer transition-transform active:scale-90"
              title="Click to manually spin the crank!"
            >
              <RotateCw className="w-8 h-8" />
            </button>
            <span className="text-xs font-semibold text-stone-500 font-handwriting text-lg">
              Spin Crank Manually
            </span>
          </div>
        </div>

        {/* Note Visualizer Beads */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {activeMelody.notes.map((n, idx) => {
            const isActive = currentNoteIdx === idx;
            return (
              <div
                key={idx}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-150 ${
                  isActive
                    ? 'bg-amber-400 text-stone-900 scale-125 shadow-[0_0_12px_#fbbf24]'
                    : 'bg-stone-200 dark:bg-slate-700 text-stone-500 dark:text-purple-300'
                }`}
              >
                ♪
              </div>
            );
          })}
        </div>

        {/* Audio Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-[#5c4033]/15">
          <button
            onClick={() => (isPlaying ? stopPlayback() : startPlayback())}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-rounded font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer ${
              isPlaying
                ? 'bg-amber-400 hover:bg-amber-300 text-stone-900'
                : 'bg-gradient-to-r from-[#a34063] to-[#802a4b] hover:from-[#b54a72] text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-stone-900" />
                <span>Pause Melody</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Play {activeMelody.title}</span>
              </>
            )}
          </button>

          {/* Volume Slider */}
          <div className="flex items-center gap-2 bg-stone-100 dark:bg-slate-800 px-4 py-2 rounded-full border border-stone-200 dark:border-slate-700">
            {volume === 0 || !progress.soundEnabled ? (
              <VolumeX className="w-4 h-4 text-stone-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#a34063] dark:text-pink-400" />
            )}
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-24 accent-[#a34063] cursor-pointer"
              aria-label="Volume"
            />
            <span className="text-[10px] font-bold text-stone-500">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
