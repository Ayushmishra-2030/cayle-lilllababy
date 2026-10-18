import React, { useState, useEffect, useRef } from 'react';
import { TabType } from './types';
import { ProgressionProvider, useProgression } from './context/ProgressionContext';
import { PlayerStatusBar } from './components/PlayerStatusBar';
import { Navbar } from './components/Navbar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { EasterEggNotification } from './components/EasterEggNotification';
import { SparkleTrail } from './components/SparkleTrail';
import { NightlightCursor } from './components/NightlightCursor';
import { SecretRoomModal } from './components/SecretRoomModal';
import { ThreeCayleeModal } from './components/ThreeCaylee/ThreeCayleeModal';
import { CayleeDialogueModal } from './components/Dialogue/CayleeDialogueModal';
import { HomeView } from './components/Home/HomeView';
import { AboutView } from './components/About/AboutView';
import { ScrapbookView } from './components/Scrapbook/ScrapbookView';
import { OriginStoryView } from './components/Story/OriginStoryView';
import { DreamDeliveryMapView } from './components/Map/DreamDeliveryMapView';
import { ProjectsView } from './components/Projects/ProjectsView';
import { ArcadeView } from './components/Arcade/ArcadeView';
import { CollectionAndAchievementsView } from './components/Collection/CollectionAndAchievementsView';
import { WishGeneratorView } from './components/WishGenerator/WishGeneratorView';
import { LullabyLabView } from './components/LullabyLab/LullabyLabView';
import { GuestbookView } from './components/Guestbook/GuestbookView';
import { SettingsView } from './components/Settings/SettingsView';
import { sound } from './utils/audio';
import { Sparkles, Moon, Lamp, MessageCircle, Box } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { progress, discoverEasterEgg } = useProgression();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    return !progress.firstVisitDone;
  });
  const [showSecretRoom, setShowSecretRoom] = useState<boolean>(false);
  const [show3DModal, setShow3DModal] = useState<boolean>(false);
  const [showChatModal, setShowChatModal] = useState<boolean>(false);

  // Easter Egg #5: Secret Keyboard Sequence "m-o-t-h"
  const typedKeys = useRef<string[]>([]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not intercept if user is typing in form inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      typedKeys.current = [...typedKeys.current.slice(-3), key];
      const sequence = typedKeys.current.join('');
      if (sequence === 'moth') {
        sound.playLevelUp();
        discoverEasterEgg('egg-5-keyboard-sequence');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [discoverEasterEgg]);

  // Easter Egg #9: Midnight Message (clicking the phosphor lantern in night mode)
  const handleMidnightLanternClick = () => {
    sound.playSparkle();
    if (progress.theme === 'night') {
      discoverEasterEgg('egg-9-midnight-message');
    } else {
      sound.playTap();
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        progress.theme === 'night'
          ? 'bg-[#0f0c29] text-purple-100'
          : 'bg-[#fff8f1] text-[#5c4033]'
      } ${progress.chaosMode ? 'rotate-[0.2deg] scale-[0.998]' : ''}`}
    >
      {/* Sparkle Cursor Trail */}
      <SparkleTrail />

      {/* Nightlight Spotlight Cursor Overlay (Toggleable in Settings) */}
      <NightlightCursor enabled={progress.nightlightCursorEnabled !== false} />

      {/* Floating Notifications Toast Stack */}
      <EasterEggNotification />

      {/* Persistent Compact Player Status Bar */}
      <PlayerStatusBar />

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenChat={() => setShowChatModal(true)}
        onOpen3D={() => setShow3DModal(true)}
      />

      {/* Optional Welcome Intro Screen */}
      {showWelcome && (
        <WelcomeScreen
          onDismiss={() => setShowWelcome(false)}
          onOpenSecretRoom={() => {
            setShowWelcome(false);
            setShowSecretRoom(true);
          }}
        />
      )}

      {/* Easter Egg #1 Secret Room Modal */}
      {showSecretRoom && <SecretRoomModal onClose={() => setShowSecretRoom(false)} />}

      {/* 3D Caylee Model Modal */}
      {show3DModal && <ThreeCayleeModal onClose={() => setShow3DModal(false)} />}

      {/* Interactive Dialogue Modal with Caylee */}
      {showChatModal && <CayleeDialogueModal onClose={() => setShowChatModal(false)} />}

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Subtle Night Mode Banner with clickable lantern (Easter Egg #9) */}
        {progress.theme === 'night' && (
          <div className="mb-6 p-3 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-between animate-fade-in text-xs">
            <div className="flex items-center gap-2 text-purple-200">
              <Moon className="w-4 h-4 text-amber-300" />
              <span>
                Night Sky Mode active • The bureau lantern shines with soft phosphorescence...
              </span>
            </div>
            <button
              onClick={handleMidnightLanternClick}
              className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 hover:bg-amber-400/30 cursor-pointer flex items-center gap-1 font-semibold"
              title="Inspect the slumbering lantern (Easter Egg #9!)"
            >
              <Lamp className="w-3.5 h-3.5" />
              <span>Inspect Lantern</span>
            </button>
          </div>
        )}

        {/* Dynamic Route Switching */}
        {activeTab === 'home' && (
          <HomeView
            onSelectTab={setActiveTab}
            onOpenIntro={() => setShowWelcome(true)}
          />
        )}
        {activeTab === 'about' && <AboutView />}
        {activeTab === 'scrapbook' && <ScrapbookView />}
        {activeTab === 'story' && <OriginStoryView />}
        {activeTab === 'map' && <DreamDeliveryMapView />}
        {activeTab === 'projects' && <ProjectsView />}
        {activeTab === 'arcade' && <ArcadeView />}
        {activeTab === 'collection' && <CollectionAndAchievementsView />}
        {activeTab === 'achievements' && <CollectionAndAchievementsView />}
        {activeTab === 'wishes' && <WishGeneratorView />}
        {activeTab === 'lullaby' && <LullabyLabView />}
        {activeTab === 'guestbook' && <GuestbookView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Whimsical Scrapbook Footer */}
      <footer className="border-t border-[#5c4033]/15 dark:border-purple-500/20 py-8 px-4 text-center text-xs text-stone-600 dark:text-purple-300 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm mt-auto">
        <div className="max-w-4xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span>✨</span>
            <span className="font-serif-heading font-bold text-sm text-[#5c4033] dark:text-purple-100">
              Caylee&apos;s Little Star Bureau
            </span>
            <span>✨</span>
          </div>
          <p className="font-handwriting text-lg text-[#a34063] dark:text-pink-300">
            &ldquo;No wish is too small to find its way home.&rdquo;
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-[11px] text-stone-500">
            <button
              onClick={() => {
                sound.playTap();
                setActiveTab('map');
              }}
              className="hover:underline cursor-pointer"
            >
              Dream Map
            </button>
            <span>•</span>
            <button
              onClick={() => {
                sound.playTap();
                setActiveTab('lullaby');
              }}
              className="hover:underline cursor-pointer"
            >
              Lullaby Lab
            </button>
            <span>•</span>
            <button
              onClick={() => {
                sound.playTap();
                setShowChatModal(true);
              }}
              className="hover:underline cursor-pointer text-[#a34063] dark:text-pink-300 font-semibold"
            >
              Chat with Caylee
            </button>
            <span>•</span>
            <button
              onClick={() => {
                sound.playTap();
                setShow3DModal(true);
              }}
              className="hover:underline cursor-pointer text-purple-600 dark:text-purple-300 font-semibold"
            >
              3D Model
            </button>
            <span>•</span>
            <button
              onClick={() => {
                sound.playTap();
                setShowSecretRoom(true);
              }}
              className="hover:underline cursor-pointer text-amber-500"
            >
              Attic Observatory
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ProgressionProvider>
      <MainAppContent />
    </ProgressionProvider>
  );
}
