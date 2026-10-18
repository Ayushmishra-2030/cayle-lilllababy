import React, { useState } from 'react';
import { useProgression } from '../../context/ProgressionContext';
import { sound } from '../../utils/audio';
import {
  Settings,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Sparkles,
  Download,
  Upload,
  RotateCcw,
  AlertTriangle,
  Heart,
  Eye,
  CheckCircle2,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    progress,
    setTheme,
    setSoundEnabled,
    toggleChaosMode,
    setSparklesEnabled,
    toggleNightlightCursor,
    resetProgress,
    exportSaveData,
    importSaveData,
    discoverEasterEgg,
  } = useProgression();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [devNoteFound, setDevNoteFound] = useState(false);

  const handleExport = () => {
    sound.playSparkle();
    const dataStr = exportSaveData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `caylee-bureau-save-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJson.trim()) return;
    const res = importSaveData(importJson);
    setImportStatus(res.message);
    if (res.success) {
      sound.playLevelUp();
      setImportJson('');
    } else {
      sound.playTap();
    }
  };

  // Easter Egg #10: Developer's Note
  const handleHeartClick = () => {
    sound.playSparkle();
    setDevNoteFound(true);
    discoverEasterEgg('egg-10-dev-note');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="paper-card p-6 sm:p-8 bg-gradient-to-r from-stone-50 to-purple-50 dark:from-[#1e1b4b] dark:to-[#171031] relative overflow-hidden">
        <div className="washi-tape washi-tape-gold -top-2.5 left-10 w-36 rotate-[-1deg] rounded" />

        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#a34063]/10 dark:bg-pink-900/40 text-[#a34063] dark:text-pink-300">
            <Settings className="w-3.5 h-3.5" />
            <span>Preferences &amp; Save Management</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#5c4033] dark:text-purple-100">
            Bureau Preferences
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            Customize audio ambience, sky lighting, and visual sparkle effects.
            Manage your local browser save ledger safely below.
          </p>
        </div>
      </div>

      {/* Audio & Visual Controls */}
      <div className="paper-card p-6 space-y-4">
        <h3 className="font-serif-heading font-bold text-lg text-[#5c4033] dark:text-purple-100 border-b border-[#5c4033]/15 pb-2">
          Ambiance &amp; Controls
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Day / Night Theme */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-xl">
                {progress.theme === 'day' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-purple-300" />}
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#5c4033] dark:text-purple-100">
                  Visual Theme
                </h4>
                <p className="text-[11px] text-stone-500">
                  {progress.theme === 'day' ? 'Daylight Bureau' : 'Midnight Starry Mode'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playTap();
                setTheme(progress.theme === 'day' ? 'night' : 'day');
              }}
              className="px-4 py-2 rounded-full text-xs font-bold font-rounded bg-white dark:bg-slate-700 border hover:bg-stone-100 dark:hover:bg-slate-600 transition-colors cursor-pointer"
            >
              Switch to {progress.theme === 'day' ? 'Night' : 'Day'}
            </button>
          </div>

          {/* Sound Mute */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-xl">
                {progress.soundEnabled ? <Volume2 className="w-5 h-5 text-[#a34063]" /> : <VolumeX className="w-5 h-5 text-stone-400" />}
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#5c4033] dark:text-purple-100">
                  Audio &amp; Voice
                </h4>
                <p className="text-[11px] text-stone-500">
                  {progress.soundEnabled ? 'Chimes & Speech Active' : 'Sound Muted'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playTap();
                setSoundEnabled(!progress.soundEnabled);
              }}
              className="px-4 py-2 rounded-full text-xs font-bold font-rounded bg-white dark:bg-slate-700 border hover:bg-stone-100 dark:hover:bg-slate-600 transition-colors cursor-pointer"
            >
              {progress.soundEnabled ? 'Mute' : 'Unmute'}
            </button>
          </div>

          {/* Sparkle Cursor Trail */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900 flex items-center justify-center text-xl">
                <Sparkles className="w-5 h-5 text-pink-500" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#5c4033] dark:text-purple-100">
                  Sparkle Cursor Trail
                </h4>
                <p className="text-[11px] text-stone-500">
                  {progress.sparklesEnabled ? 'Subtle stardust particles' : 'Trail disabled'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playTap();
                setSparklesEnabled(!progress.sparklesEnabled);
              }}
              className="px-4 py-2 rounded-full text-xs font-bold font-rounded bg-white dark:bg-slate-700 border hover:bg-stone-100 dark:hover:bg-slate-600 transition-colors cursor-pointer"
            >
              {progress.sparklesEnabled ? 'Disable' : 'Enable'}
            </button>
          </div>

          {/* Nightlight Spotlight Cursor */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-xl">
                🔦
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#5c4033] dark:text-purple-100">
                  Nightlight Spotlight Cursor
                </h4>
                <p className="text-[11px] text-stone-500">
                  {progress.nightlightCursorEnabled !== false ? 'Soft beam reveals hidden details' : 'Spotlight disabled'}
                </p>
              </div>
            </div>

            <button
              onClick={toggleNightlightCursor}
              className="px-4 py-2 rounded-full text-xs font-bold font-rounded bg-white dark:bg-slate-700 border hover:bg-stone-100 dark:hover:bg-slate-600 transition-colors cursor-pointer"
            >
              {progress.nightlightCursorEnabled !== false ? 'Disable' : 'Enable'}
            </button>
          </div>

          {/* Local Visit Counter */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-xl">
                📜
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#5c4033] dark:text-purple-100">
                  Local Visit Log
                </h4>
                <p className="text-[11px] text-stone-500">
                  Total Bureau Visits on this device: <strong>{progress.visitCount || 1}</strong>
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-300/40">
              Returning Visitor
            </span>
          </div>

          {/* Chaos Mode */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-xl">
                🌀
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#5c4033] dark:text-purple-100">
                  Playful Chaos Mode
                </h4>
                <p className="text-[11px] text-stone-500">
                  {progress.chaosMode ? 'Whimsical tilted frames ON' : 'Standard alignment'}
                </p>
              </div>
            </div>

            <button
              onClick={toggleChaosMode}
              className="px-4 py-2 rounded-full text-xs font-bold font-rounded bg-white dark:bg-slate-700 border hover:bg-stone-100 dark:hover:bg-slate-600 transition-colors cursor-pointer"
            >
              {progress.chaosMode ? 'Turn Off' : 'Turn On'}
            </button>
          </div>
        </div>
      </div>

      {/* Local Save System & Ledger */}
      <div className="paper-card p-6 space-y-4">
        <h3 className="font-serif-heading font-bold text-lg text-[#5c4033] dark:text-purple-100 border-b border-[#5c4033]/15 pb-2">
          Local Save File &amp; Backups
        </h3>

        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700 text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
          <strong>Browser Storage Architecture:</strong> All your XP transactions, completed games,
          achievements, and unlocked scrapbook pages are stored in this browser&apos;s localStorage
          under <code className="bg-white/80 dark:bg-slate-900 px-1 py-0.5 rounded">caylee_star_bureau_save_v1.0</code>.
          Local saves do not automatically sync across different browsers or separate devices. Use the export button below to make a backup file!
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#a34063] hover:bg-[#852f4e] text-white font-rounded font-bold text-xs shadow cursor-pointer transition-transform active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Save File (.json)</span>
          </button>
        </div>

        {/* Import JSON Form */}
        <form onSubmit={handleImport} className="space-y-2 pt-2">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
            Import Bureau Backup (Paste JSON):
          </label>
          <textarea
            rows={2}
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            placeholder="Paste your exported save JSON string here..."
            className="w-full p-2.5 rounded-xl text-xs border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-stone-800 dark:text-purple-100"
          />
          {importStatus && (
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {importStatus}
            </p>
          )}
          <button
            type="submit"
            className="px-5 py-2 rounded-full bg-stone-200 dark:bg-slate-700 hover:bg-stone-300 text-stone-800 dark:text-purple-200 font-rounded font-bold text-xs cursor-pointer"
          >
            Import and Restore Progress
          </button>
        </form>

        {/* Danger Zone: Reset Progress */}
        <div className="pt-4 border-t border-rose-200 dark:border-rose-950/60 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-xs text-rose-700 dark:text-rose-400">
              Reset Bureau Progress
            </h4>
            <p className="text-[11px] text-stone-500">
              Clear all XP, unlocks, and achievements and start anew with Caylee.
            </p>
          </div>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 rounded-full border border-rose-300 hover:bg-rose-50 text-rose-700 dark:text-rose-300 text-xs font-bold cursor-pointer"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* Credits & Easter Egg #10 */}
      <div className="p-6 text-center space-y-2 text-xs text-stone-500">
        <p>
          Caylee&apos;s Little Star Bureau • Original Character &amp; World
        </p>
        <p className="flex items-center justify-center gap-1">
          <span>Crafted with starlight, cozy tea, and infinite love</span>
          <button
            onClick={handleHeartClick}
            className="text-pink-500 hover:scale-125 transition-transform p-0.5 cursor-pointer"
            title="A tiny shining heart... (Easter Egg #10!)"
            aria-label="Secret developer heart"
          >
            <Heart className="w-3.5 h-3.5 fill-pink-500" />
          </button>
        </p>

        {devNoteFound && (
          <div className="p-3 max-w-sm mx-auto rounded-2xl bg-amber-50 dark:bg-slate-800 border border-amber-300 text-[11px] text-amber-900 dark:text-amber-200 font-handwriting text-base animate-fade-in">
            &ldquo;Made with moonlight, cozy tea, and infinite love for dreamers. Thank you for visiting Caylee&apos;s world! (+10 XP)&rdquo;
          </div>
        )}
      </div>

      {/* Confirmation Modal for Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="paper-card p-6 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="font-serif-heading font-bold text-lg text-rose-700 dark:text-rose-300">
              Reset All Progress?
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Are you sure? This will reset all earned XP, locked games, achievements, and scrapbook discoveries back to the first visit.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-full border border-stone-300 text-stone-700 dark:text-stone-300 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetProgress();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
