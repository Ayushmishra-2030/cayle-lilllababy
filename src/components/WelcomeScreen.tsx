import React, { useState, useEffect } from 'react';
import { CayleeAvatar } from './CayleeAvatar';
import { sound } from '../utils/audio';
import { useProgression } from '../context/ProgressionContext';
import { Volume2, VolumeX, Sparkles, Star, Play, CheckCircle2, Compass } from 'lucide-react';

interface WelcomeScreenProps {
  onDismiss: () => void;
  onOpenSecretRoom?: () => void;
}

const CAYLEE_INTRO_SCRIPT =
  "Hiii! I'm Caylee! Welcome to my little star bureau. I collect lost wishes, fix sleepy stars, and sometimes get glitter in my tea. Would you like to help me find a missing wish? Come on, let's go!";

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onDismiss, onOpenSecretRoom }) => {
  const { progress, setSoundEnabled, discoverEasterEgg, claimReward } = useProgression();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [interactiveStarClicks, setInteractiveStarClicks] = useState<number[]>([]);

  // Check if speech synthesis is available
  const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const handleMeetCaylee = () => {
    sound.playTap();
    setIsSpeaking(true);
    setSpeechError(null);

    const success = sound.speak(
      CAYLEE_INTRO_SCRIPT,
      () => {
        setIsSpeaking(true);
      },
      () => {
        setIsSpeaking(false);
        setHasPlayedOnce(true);
        // Award first hello achievement & XP
        claimReward('reward-meet-caylee-voice', 10, 'Listened to Caylee’s voice introduction!');
      },
      (err) => {
        setIsSpeaking(false);
        setHasPlayedOnce(true);
        setSpeechError('Speech synthesis not fully supported on this device/browser.');
        claimReward('reward-meet-caylee-voice', 10, 'Met Caylee at the bureau!');
      }
    );

    if (!success) {
      setIsSpeaking(false);
      setHasPlayedOnce(true);
      claimReward('reward-meet-caylee-voice', 10, 'Met Caylee at the bureau!');
    }
  };

  const handleReplay = () => {
    handleMeetCaylee();
  };

  const handleSkipOrExplore = () => {
    sound.stopSpeaking();
    sound.playTap();
    onDismiss();
  };

  // Easter Egg #1: The Seventh Star (user clicks the tiny 7th star on the welcome screen)
  const handleSeventhStarClick = () => {
    sound.playSparkle();
    discoverEasterEgg('egg-1-seventh-star');
    if (onOpenSecretRoom) {
      onOpenSecretRoom();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#5c4033]/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      {/* Scrapbook Welcome Card */}
      <div className="relative w-full max-w-2xl bg-[#fff8f1] dark:bg-[#1e1b4b] rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border-2 border-[#a34063]/25 dark:border-purple-500/30 text-[#5c4033] dark:text-purple-100 my-auto">
        {/* Washi tape decoration at top */}
        <div className="washi-tape washi-tape-lavender -top-3 left-1/2 -translate-x-1/2 w-48 rounded" />
        <div className="washi-tape washi-tape-gold -top-2 left-10 w-24 rotate-[-4deg] rounded" />

        {/* Header Controls: Sound & Skip */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setSoundEnabled(!progress.soundEnabled)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/80 dark:bg-slate-800/80 border border-[#a34063]/20 hover:bg-[#a34063]/10 transition-colors cursor-pointer"
            title="Toggle sound"
            aria-label={progress.soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {progress.soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#a34063] dark:text-pink-400" />
                <span>Sound: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                <span>Sound: MUTED</span>
              </>
            )}
          </button>

          <button
            onClick={handleSkipOrExplore}
            className="text-xs font-semibold text-stone-500 dark:text-stone-300 hover:text-[#a34063] underline cursor-pointer px-2 py-1"
          >
            Skip intro
          </button>
        </div>

        {/* Interactive Background Stars floating */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <button
              key={i}
              onClick={() => {
                sound.playSparkle();
                setInteractiveStarClicks((prev) => [...prev, i]);
              }}
              style={{
                top: `${15 + (i * 14) % 70}%`,
                left: `${8 + (i * 16) % 85}%`,
              }}
              className="pointer-events-auto absolute p-1 text-amber-300/80 hover:text-amber-400 hover:scale-125 transition-transform animate-star-pulse"
              title="A sleepy star (click me!)"
            >
              <Star className="w-4 h-4 fill-amber-300" />
            </button>
          ))}

          {/* THE SEVENTH STAR (Easter Egg #1) */}
          <button
            onClick={handleSeventhStarClick}
            style={{ top: '88%', right: '8%' }}
            className="pointer-events-auto absolute p-1.5 text-amber-400 hover:text-amber-200 hover:scale-150 transition-transform cursor-pointer animate-pulse"
            title="A curious seven-pointed star gleaming softly..."
            aria-label="Secret Seventh Star"
          >
            <Sparkles className="w-5 h-5 text-amber-400 drop-shadow-[0_0_8px_#fde047]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
          {/* Caylee Avatar */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="relative bg-gradient-to-b from-purple-100 to-amber-50 dark:from-purple-950/60 dark:to-slate-900/60 p-4 rounded-3xl border border-purple-200/50 shadow-inner">
              <CayleeAvatar
                size="md"
                expression={isSpeaking ? 'giggle' : 'happy'}
                interactive={true}
                showDialogue={isSpeaking}
                dialogueText="✨ Speaking... ✨"
              />
            </div>
            <span className="mt-2 text-xs font-handwriting text-lg text-[#a34063] dark:text-pink-300">
              ~ Caylee the Moon-Moth ~
            </span>
          </div>

          {/* Intro Narrative */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#a34063]/10 dark:bg-pink-900/40 text-[#a34063] dark:text-pink-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Junior Wishkeeper & Star Restorer</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#5c4033] dark:text-purple-100 tracking-tight">
              Caylee&apos;s Little Star Bureau
            </h1>

            <p className="text-sm font-handwriting text-xl text-[#a34063] dark:text-pink-300">
              &ldquo;No wish is too small to find its way home.&rdquo;
            </p>

            <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300">
              Welcome to the cozy celestial office perched between the moonbeams and the morning dew.
              Press <span className="font-semibold text-[#a34063] dark:text-pink-300">&ldquo;Meet Caylee&rdquo;</span> to hear her voice greeting!
            </p>

            {/* Voice Transcript Card */}
            <div className="bg-white/90 dark:bg-slate-900/90 rounded-2xl p-3.5 border border-[#5c4033]/10 dark:border-purple-400/20 text-xs sm:text-sm shadow-sm space-y-1">
              <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                <span>Transcript</span>
                {isSpeaking && (
                  <span className="text-[#a34063] dark:text-pink-400 animate-pulse flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#a34063] dark:bg-pink-400 inline-block" />
                    Playing Voice
                  </span>
                )}
              </div>
              <p className="italic text-stone-800 dark:text-stone-200 leading-snug">
                &ldquo;{CAYLEE_INTRO_SCRIPT}&rdquo;
              </p>
              {speechError && (
                <p className="text-amber-600 dark:text-amber-400 text-xs">{speechError}</p>
              )}
            </div>
          </div>
        </div>

        {/* Buttons Action Bar */}
        <div className="relative z-10 mt-6 pt-4 border-t border-[#5c4033]/10 dark:border-purple-500/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleMeetCaylee}
              disabled={isSpeaking}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-rounded font-semibold text-sm transition-all shadow-md cursor-pointer ${
                isSpeaking
                  ? 'bg-purple-200 text-purple-700 opacity-80 cursor-wait'
                  : 'bg-gradient-to-r from-[#a34063] to-[#802a4b] hover:from-[#b54a72] hover:to-[#913256] text-white active:scale-95'
              }`}
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isSpeaking ? 'Caylee is speaking...' : hasPlayedOnce ? 'Replay Voice' : 'Meet Caylee'}</span>
            </button>

            {hasPlayedOnce && (
              <span className="inline-flex items-center text-xs text-emerald-600 dark:text-emerald-400 gap-1 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                Greeting heard!
              </span>
            )}
          </div>

          <button
            onClick={handleSkipOrExplore}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full font-rounded font-semibold text-sm bg-amber-400 hover:bg-amber-300 text-[#5c4033] shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Let&apos;s Explore!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
