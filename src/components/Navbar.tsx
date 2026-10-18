import React, { useState } from 'react';
import { TabType } from '../types';
import { useProgression } from '../context/ProgressionContext';
import { sound } from '../utils/audio';
import {
  Home,
  User,
  BookOpen,
  Sparkles,
  Gamepad2,
  Trophy,
  PackageOpen,
  Settings,
  FolderHeart,
  Moon,
  Sun,
  Menu,
  X,
  Volume2,
  VolumeX,
  Send,
  Navigation,
  Music,
  MessageCircle,
  Box,
} from 'lucide-react';

interface NavbarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenChat?: () => void;
  onOpen3D?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab, onOpenChat, onOpen3D }) => {
  const { progress, toggleTheme, setSoundEnabled, discoverEasterEgg } = useProgression();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moonClicks, setMoonClicks] = useState(0);

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'about', label: 'About Caylee', icon: <User className="w-4 h-4" /> },
    { id: 'scrapbook', label: 'Scrapbook', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'story', label: 'Origin Story', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'map', label: 'Dream Map', icon: <Navigation className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <FolderHeart className="w-4 h-4" /> },
    { id: 'arcade', label: 'Game Arcade', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'collection', label: 'Collection', icon: <PackageOpen className="w-4 h-4" /> },
    { id: 'achievements', label: 'Achievements', icon: <Trophy className="w-4 h-4" /> },
    { id: 'wishes', label: 'Wish Generator', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'lullaby', label: 'Lullaby Lab', icon: <Music className="w-4 h-4" /> },
    { id: 'guestbook', label: 'Guestbook', icon: <Send className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleTabClick = (tab: TabType) => {
    sound.playTap();
    onSelectTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Easter Egg #3: The Moon Button
  const handleMoonButtonClick = () => {
    sound.playSparkle();
    toggleTheme();
    const newCount = moonClicks + 1;
    setMoonClicks(newCount);
    if (newCount >= 2) {
      discoverEasterEgg('egg-3-moon-button');
    }
  };

  return (
    <header className="bg-white/80 dark:bg-[#120f2c]/85 backdrop-blur-md border-b border-[#5c4033]/10 dark:border-purple-500/20 sticky top-12 z-30 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <button
          onClick={() => handleTabClick('home')}
          className="flex items-center gap-2 text-left group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#a34063]/30 rounded-xl p-1"
        >
          {/* Mini moth icon */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-900 dark:to-pink-900 flex items-center justify-center text-sm shadow-sm group-hover:scale-105 transition-transform">
            ✨
          </div>
          <div>
            <h1 className="font-serif-heading font-bold text-sm sm:text-base text-[#5c4033] dark:text-purple-100 leading-tight">
              Little Star Bureau
            </h1>
            <p className="font-handwriting text-xs text-[#a34063] dark:text-pink-300 hidden sm:block">
              Caylee&apos;s World
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-rounded text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#a34063] text-white shadow-sm'
                    : 'text-stone-700 dark:text-purple-200 hover:bg-[#a34063]/10 dark:hover:bg-purple-900/40'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action controls (3D, Chat, Theme, Sound, Mobile Menu) */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* 3D Model Button */}
          {onOpen3D && (
            <button
              onClick={() => {
                sound.playTap();
                onOpen3D();
              }}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/60 text-[#a34063] dark:text-pink-300 hover:bg-purple-200 cursor-pointer flex items-center gap-1 border border-purple-300/40"
              title="Open Interactive 3D Model"
            >
              <Box className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">3D Caylee</span>
            </button>
          )}

          {/* Chat with Caylee Button */}
          {onOpenChat && (
            <button
              onClick={() => {
                sound.playTap();
                onOpenChat();
              }}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-semibold bg-pink-100 dark:bg-pink-900/60 text-[#a34063] dark:text-pink-300 hover:bg-pink-200 cursor-pointer flex items-center gap-1 border border-pink-300/40"
              title="Chat with Caylee"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Chat</span>
            </button>
          )}

          {/* Moon / Sun Button (Easter Egg #3) */}
          <button
            onClick={handleMoonButtonClick}
            className="p-2 rounded-full text-stone-700 dark:text-purple-200 bg-amber-50 dark:bg-purple-950/80 border border-amber-300/40 dark:border-purple-600/40 hover:bg-amber-100 dark:hover:bg-purple-900 transition-colors cursor-pointer"
            title={progress.theme === 'day' ? 'Switch to Night Mode (Moon Button)' : 'Switch to Day Mode'}
            aria-label="Toggle Night/Day mode"
          >
            {progress.theme === 'day' ? (
              <Moon className="w-4 h-4 text-purple-700" />
            ) : (
              <Sun className="w-4 h-4 text-amber-300" />
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              sound.playTap();
              setSoundEnabled(!progress.soundEnabled);
            }}
            className="p-2 rounded-full text-stone-700 dark:text-purple-200 bg-stone-100 dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 hover:bg-stone-200 transition-colors cursor-pointer"
            title={progress.soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
            aria-label={progress.soundEnabled ? 'Mute audio' : 'Unmute audio'}
          >
            {progress.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#a34063] dark:text-pink-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-400" />
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => {
              sound.playTap();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="lg:hidden p-2 rounded-xl text-stone-700 dark:text-purple-200 bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 cursor-pointer"
            aria-label="Toggle mobile navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#5c4033]/10 dark:border-purple-500/20 bg-white/95 dark:bg-[#120f2c]/95 backdrop-blur-md px-4 py-3 space-y-1 animate-slide-down shadow-xl max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2 pb-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl font-rounded text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#a34063] text-white shadow-sm'
                      : 'bg-stone-50 dark:bg-slate-800/60 text-stone-700 dark:text-purple-200 hover:bg-stone-100'
                  }`}
                >
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
