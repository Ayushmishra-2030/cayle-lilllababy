import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  PlayerProgress,
  SavedWish,
  GuestbookEntry,
  EasterEgg,
  Achievement,
} from '../types';
import {
  XP_REWARDS,
  LEVELS,
  getLevelForXP,
  EASTER_EGGS,
  ACHIEVEMENTS,
  ARCADE_GAMES,
} from '../constants/gameData';
import { sound } from '../utils/audio';

const STORAGE_KEY = 'caylee_star_bureau_save_v1.0';

const INITIAL_PROGRESS: PlayerProgress = {
  xp: 0,
  claimedRewards: {},
  unlockedGames: ['game-1-wish-catcher', 'game-2-star-repair', 'game-3-constellation-connector'],
  completedGames: {},
  discoveredEasterEggs: [],
  unlockedScrapbookPages: ['page-a', 'page-b', 'page-c', 'page-d', 'page-g'], // A, B, C, D, G unlocked initially; E & F are secret/puzzle locked
  completedStoryChapters: [],
  achievements: {},
  savedWishes: [],
  guestbookEntries: [
    {
      id: 'gb-initial-1',
      author: 'Barnaby the Headmaster Owl',
      message: 'Always remember: a star that wanders is not lost; it simply seeks a wider sky.',
      stamp: '🦉',
      date: 'Bureau Moon 14',
    },
    {
      id: 'gb-initial-2',
      author: 'Pip the Nebula Snail',
      message: 'Left some shiny glitter on the desk. Happy wishkeeping!',
      stamp: '🐚',
      date: 'Bureau Moon 18',
    },
  ],
  firstVisitDone: false,
  visitCount: 1,
  theme: 'day',
  soundEnabled: true,
  chaosMode: false,
  sparklesEnabled: true,
  nightlightCursorEnabled: true,
  transactions: [],
};

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  xpDelta?: number;
  type: 'xp' | 'level' | 'egg' | 'achievement' | 'unlock';
  icon: string;
}

interface ProgressionContextType {
  progress: PlayerProgress;
  notifications: NotificationItem[];
  dismissNotification: (id: string) => void;
  // Core actions
  claimReward: (rewardId: string, amount: number, description: string) => boolean;
  unlockGame: (gameId: string) => { success: boolean; message: string };
  recordGameCompletion: (gameId: string, score?: number) => { firstTime: boolean; xpAwarded: number };
  discoverEasterEgg: (eggId: string) => boolean;
  unlockScrapbookPage: (pageId: string) => boolean;
  completeStoryChapter: (chapterId: string) => boolean;
  saveWish: (wish: Omit<SavedWish, 'id' | 'timestamp'>) => void;
  deleteWish: (wishId: string) => void;
  addGuestbookEntry: (author: string, message: string, stamp: string) => void;
  setTheme: (theme: 'day' | 'night') => void;
  toggleTheme: () => void;
  setSoundEnabled: (enabled: boolean) => void;
  toggleChaosMode: () => void;
  setSparklesEnabled: (enabled: boolean) => void;
  setNightlightCursorEnabled: (enabled: boolean) => void;
  toggleNightlightCursor: () => void;
  resetProgress: () => void;
  exportSaveData: () => string;
  importSaveData: (jsonStr: string) => { success: boolean; message: string };
  triggerCelebration: () => void;
}

const ProgressionContext = createContext<ProgressionContextType | null>(null);

export const ProgressionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<PlayerProgress>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Validate parsed object structure safely
        if (typeof parsed === 'object' && parsed !== null && typeof parsed.xp === 'number') {
          return {
            ...INITIAL_PROGRESS,
            ...parsed,
            xp: Math.max(0, parsed.xp), // XP must never be negative
            unlockedGames: Array.isArray(parsed.unlockedGames)
              ? Array.from(new Set([...INITIAL_PROGRESS.unlockedGames, ...parsed.unlockedGames]))
              : INITIAL_PROGRESS.unlockedGames,
            claimedRewards: typeof parsed.claimedRewards === 'object' ? parsed.claimedRewards : {},
            transactions: Array.isArray(parsed.transactions) ? parsed.transactions.slice(-50) : [],
          };
        }
      }
    } catch (e) {
      console.warn('Could not parse saved data, recovering with fresh save:', e);
    }
    return INITIAL_PROGRESS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const prevLevelRef = useRef<number>(getLevelForXP(progress.xp).level);

  // Sync mute setting with audio engine
  useEffect(() => {
    sound.setMuted(!progress.soundEnabled);
  }, [progress.soundEnabled]);

  // Apply dark mode class to html element
  useEffect(() => {
    if (progress.theme === 'night') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [progress.theme]);

  // Persistent saving with debounce/effect
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [progress]);

  const pushNotification = useCallback((notif: Omit<NotificationItem, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setNotifications((prev) => [...prev, { ...notif, id }]);
    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4500);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const triggerCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#ec4899', '#a855f7', '#38bdf8', '#fbbf24'],
      });
    } catch {
      // Graceful fallback
    }
  }, []);

  // Check Level ups whenever XP changes
  useEffect(() => {
    const currentLevel = getLevelForXP(progress.xp);
    if (currentLevel.level > prevLevelRef.current) {
      sound.playLevelUp();
      triggerCelebration();
      pushNotification({
        title: 'Level Up!',
        message: `You are now a ${currentLevel.title} (Level ${currentLevel.level})!`,
        type: 'level',
        icon: currentLevel.icon,
      });

      // Check Level 5 achievement
      if (currentLevel.level >= 5) {
        checkAndUnlockAchievement('ach-master-wishkeeper');
      }
      // Check Level 2 achievement perk
      if (currentLevel.level >= 2) {
        checkAndUnlockAchievement('ach-curious-moth');
      }
    }
    prevLevelRef.current = currentLevel.level;
  }, [progress.xp, pushNotification, triggerCelebration]);

  // Helper to check achievements
  const checkAndUnlockAchievement = useCallback(
    (achId: string) => {
      setProgress((prev) => {
        if (prev.achievements[achId]?.unlocked) return prev;
        const ach = ACHIEVEMENTS.find((a) => a.id === achId);
        if (!ach) return prev;

        const newBalance = prev.xp + ach.rewardXP;
        const tx: PlayerProgress['transactions'][0] = {
          id: `tx-ach-${Date.now()}`,
          timestamp: Date.now(),
          description: `Achievement: ${ach.title}`,
          amount: ach.rewardXP,
          newBalance,
        };

        sound.playSparkle();
        pushNotification({
          title: `Achievement: ${ach.title}`,
          message: ach.description,
          xpDelta: ach.rewardXP,
          type: 'achievement',
          icon: ach.badge,
        });

        return {
          ...prev,
          xp: newBalance,
          achievements: {
            ...prev.achievements,
            [achId]: { unlocked: true, unlockedAt: Date.now() },
          },
          transactions: [tx, ...prev.transactions].slice(0, 50),
        };
      });
    },
    [pushNotification]
  );

  // First Visit vs Returning Visitor Check (Atomic)
  useEffect(() => {
    if (!progress.firstVisitDone && !progress.claimedRewards['reward-first-visit']) {
      claimReward('reward-first-visit', XP_REWARDS.FIRST_VISIT, 'Welcome to the Star Bureau! (First Visit)');
      setProgress((prev) => ({
        ...prev,
        firstVisitDone: true,
        visitCount: 1,
      }));
    } else if (progress.firstVisitDone) {
      // Returning visitor memory!
      const currentLevel = getLevelForXP(progress.xp);
      setProgress((prev) => ({
        ...prev,
        visitCount: (prev.visitCount || 1) + 1,
      }));
      setTimeout(() => {
        pushNotification({
          title: 'Welcome Back!',
          message: `Welcome back, ${currentLevel.title}! Your wishes missed you. You have ${progress.xp} XP in your satchel.`,
          type: 'xp',
          icon: '✨',
        });
      }, 1200);
    }
  }, []);

  /**
   * Claim a one-time reward safely. Returns true if claimed, false if already claimed or invalid.
   */
  const claimReward = useCallback(
    (rewardId: string, amount: number, description: string): boolean => {
      let awarded = false;
      setProgress((prev) => {
        if (prev.claimedRewards[rewardId]) {
          return prev; // Already claimed! No-op
        }

        const newBalance = Math.max(0, prev.xp + amount);
        const tx: PlayerProgress['transactions'][0] = {
          id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          timestamp: Date.now(),
          description,
          amount,
          newBalance,
        };

        sound.playStarCatch();
        pushNotification({
          title: 'XP Earned!',
          message: description,
          xpDelta: amount,
          type: 'xp',
          icon: '✨',
        });

        awarded = true;
        return {
          ...prev,
          xp: newBalance,
          claimedRewards: {
            ...prev.claimedRewards,
            [rewardId]: true,
          },
          transactions: [tx, ...prev.transactions].slice(0, 50),
        };
      });
      return awarded;
    },
    [pushNotification]
  );

  /**
   * Unlock an arcade game. Atomic verification & single deduction.
   */
  const unlockGame = useCallback(
    (gameId: string): { success: boolean; message: string } => {
      const meta = ARCADE_GAMES.find((g) => g.id === gameId);
      if (!meta) return { success: false, message: 'Game not found.' };

      if (progress.unlockedGames.includes(gameId)) {
        return { success: false, message: 'Game is already unlocked!' };
      }

      // Check prerequisite if any
      if (meta.prerequisiteId) {
        if (meta.prerequisiteId.startsWith('chapter-')) {
          if (!progress.completedStoryChapters.includes(meta.prerequisiteId)) {
            return {
              success: false,
              message: `Locked! ${meta.prerequisiteLabel || 'Requires prerequisite chapter.'}`,
            };
          }
        } else {
          // Game completion prerequisite
          const compCount = progress.completedGames[meta.prerequisiteId] || 0;
          if (compCount === 0) {
            return {
              success: false,
              message: `Locked! ${meta.prerequisiteLabel || 'Requires previous game completion.'}`,
            };
          }
        }
      }

      // Check XP balance
      if (progress.xp < meta.cost) {
        return {
          success: false,
          message: `Not enough XP! Need ${meta.cost} XP, but you have ${progress.xp} XP.`,
        };
      }

      // Atomic purchase
      let result = { success: false, message: '' };
      setProgress((prev) => {
        // Double check inside atomic updater
        if (prev.unlockedGames.includes(gameId)) {
          result = { success: false, message: 'Game is already unlocked!' };
          return prev;
        }
        if (prev.xp < meta.cost) {
          result = { success: false, message: 'Insufficient XP.' };
          return prev;
        }

        const newBalance = prev.xp - meta.cost;
        const tx: PlayerProgress['transactions'][0] = {
          id: `tx-unlock-${Date.now()}`,
          timestamp: Date.now(),
          description: `Unlocked Arcade Game: ${meta.title}`,
          amount: -meta.cost,
          newBalance,
        };

        sound.playLevelUp();
        triggerCelebration();

        pushNotification({
          title: 'Game Unlocked!',
          message: `You unlocked ${meta.title}! Let's play!`,
          type: 'unlock',
          icon: meta.icon,
        });

        const newUnlockedList = [...prev.unlockedGames, gameId];

        // Check Arcade Explorer achievement (3 or more unlocked)
        const premiumUnlockedCount = newUnlockedList.filter(
          (id) => !['game-1-wish-catcher', 'game-2-star-repair', 'game-3-constellation-connector'].includes(id)
        ).length;
        if (premiumUnlockedCount >= 3) {
          setTimeout(() => checkAndUnlockAchievement('ach-arcade-explorer'), 500);
        }

        result = { success: true, message: `Successfully unlocked ${meta.title}!` };

        return {
          ...prev,
          xp: newBalance,
          unlockedGames: newUnlockedList,
          transactions: [tx, ...prev.transactions].slice(0, 50),
        };
      });

      return result;
    },
    [progress.unlockedGames, progress.completedStoryChapters, progress.completedGames, progress.xp, triggerCelebration, pushNotification, checkAndUnlockAchievement]
  );

  /**
   * Record completion of a game. First-time reward given ONCE only.
   */
  const recordGameCompletion = useCallback(
    (gameId: string, score = 0): { firstTime: boolean; xpAwarded: number } => {
      let isFirstTime = false;
      let xpAwarded = 0;

      setProgress((prev) => {
        const count = prev.completedGames[gameId] || 0;
        const updatedCount = count + 1;
        isFirstTime = count === 0;

        const rewardKey = `game-completion-${gameId}`;
        let currentXP = prev.xp;
        let newTransactions = [...prev.transactions];

        if (isFirstTime && !prev.claimedRewards[rewardKey]) {
          xpAwarded = XP_REWARDS.COMPLETE_FREE_GAME_FIRST;
          currentXP += xpAwarded;
          sound.playStarCatch();
          triggerCelebration();

          const tx: PlayerProgress['transactions'][0] = {
            id: `tx-game-${Date.now()}`,
            timestamp: Date.now(),
            description: `First Victory: ${ARCADE_GAMES.find((g) => g.id === gameId)?.title || gameId}`,
            amount: xpAwarded,
            newBalance: currentXP,
          };
          newTransactions = [tx, ...newTransactions].slice(0, 50);

          pushNotification({
            title: 'First Victory Bonus!',
            message: `Completed game for the first time! +${xpAwarded} XP`,
            xpDelta: xpAwarded,
            type: 'xp',
            icon: '🏆',
          });
        }

        // Achievements check based on game
        if (gameId === 'game-1-wish-catcher' && score >= 100) {
          setTimeout(() => checkAndUnlockAchievement('ach-wish-catcher'), 300);
        }
        if (gameId === 'game-2-star-repair') {
          setTimeout(() => checkAndUnlockAchievement('ach-star-saver'), 300);
        }
        if (gameId === 'game-3-constellation-connector') {
          setTimeout(() => checkAndUnlockAchievement('ach-puzzle-friend'), 300);
        }

        return {
          ...prev,
          xp: currentXP,
          completedGames: {
            ...prev.completedGames,
            [gameId]: updatedCount,
          },
          claimedRewards: isFirstTime
            ? { ...prev.claimedRewards, [rewardKey]: true }
            : prev.claimedRewards,
          transactions: newTransactions,
        };
      });

      return { firstTime: isFirstTime, xpAwarded };
    },
    [triggerCelebration, pushNotification, checkAndUnlockAchievement]
  );

  /**
   * Discover an Easter egg. Deduplicated and atomic.
   */
  const discoverEasterEgg = useCallback(
    (eggId: string): boolean => {
      const egg = EASTER_EGGS.find((e) => e.id === eggId);
      if (!egg) return false;

      let newlyDiscovered = false;
      setProgress((prev) => {
        if (prev.discoveredEasterEggs.includes(eggId)) {
          return prev; // Already discovered
        }

        const rewardKey = `egg-${eggId}`;
        if (prev.claimedRewards[rewardKey]) {
          return prev;
        }

        const newBalance = prev.xp + egg.rewardXP;
        sound.playSparkle();
        triggerCelebration();

        const tx: PlayerProgress['transactions'][0] = {
          id: `tx-egg-${Date.now()}`,
          timestamp: Date.now(),
          description: `Secret Uncovered: ${egg.name}`,
          amount: egg.rewardXP,
          newBalance,
        };

        pushNotification({
          title: `Secret Found: ${egg.name}!`,
          message: egg.description,
          xpDelta: egg.rewardXP,
          type: 'egg',
          icon: egg.icon,
        });

        // Trigger Curious Moth achievement on 1st secret
        setTimeout(() => checkAndUnlockAchievement('ach-curious-moth'), 400);

        newlyDiscovered = true;
        return {
          ...prev,
          xp: newBalance,
          discoveredEasterEggs: [...prev.discoveredEasterEggs, eggId],
          claimedRewards: {
            ...prev.claimedRewards,
            [rewardKey]: true,
          },
          transactions: [tx, ...prev.transactions].slice(0, 50),
        };
      });

      return newlyDiscovered;
    },
    [triggerCelebration, pushNotification, checkAndUnlockAchievement]
  );

  /**
   * Unlock a Scrapbook Page
   */
  const unlockScrapbookPage = useCallback(
    (pageId: string): boolean => {
      let newlyUnlocked = false;
      setProgress((prev) => {
        if (prev.unlockedScrapbookPages.includes(pageId)) return prev;

        const rewardKey = `scrapbook-page-${pageId}`;
        const xpDelta = XP_REWARDS.DISCOVER_SECRET_PAGE;
        const newBalance = prev.xp + xpDelta;

        sound.playPageTurn();
        triggerCelebration();

        const tx: PlayerProgress['transactions'][0] = {
          id: `tx-page-${Date.now()}`,
          timestamp: Date.now(),
          description: `Discovered Secret Scrapbook Page: ${pageId.toUpperCase()}`,
          amount: xpDelta,
          newBalance,
        };

        pushNotification({
          title: 'Secret Scrapbook Page!',
          message: `You unlocked Page ${pageId.toUpperCase()}! +${xpDelta} XP`,
          xpDelta,
          type: 'xp',
          icon: '📖',
        });

        newlyUnlocked = true;
        return {
          ...prev,
          xp: newBalance,
          unlockedScrapbookPages: [...prev.unlockedScrapbookPages, pageId],
          claimedRewards: {
            ...prev.claimedRewards,
            [rewardKey]: true,
          },
          transactions: [tx, ...prev.transactions].slice(0, 50),
        };
      });
      return newlyUnlocked;
    },
    [pushNotification, triggerCelebration]
  );

  /**
   * Complete Story Chapter
   */
  const completeStoryChapter = useCallback(
    (chapterId: string): boolean => {
      let isFirst = false;
      setProgress((prev) => {
        if (prev.completedStoryChapters.includes(chapterId)) return prev;

        const rewardKey = `chapter-${chapterId}`;
        const xpDelta = XP_REWARDS.COMPLETE_STORY_CHAPTER;
        const newBalance = prev.xp + xpDelta;

        sound.playSparkle();

        const tx: PlayerProgress['transactions'][0] = {
          id: `tx-chap-${Date.now()}`,
          timestamp: Date.now(),
          description: `Story Chapter Finished: ${chapterId}`,
          amount: xpDelta,
          newBalance,
        };

        pushNotification({
          title: 'Story Chapter Completed!',
          message: `Finished reading ${chapterId}! +${xpDelta} XP`,
          xpDelta,
          type: 'xp',
          icon: '✨',
        });

        isFirst = true;
        return {
          ...prev,
          xp: newBalance,
          completedStoryChapters: [...prev.completedStoryChapters, chapterId],
          claimedRewards: {
            ...prev.claimedRewards,
            [rewardKey]: true,
          },
          transactions: [tx, ...prev.transactions].slice(0, 50),
        };
      });
      return isFirst;
    },
    [pushNotification]
  );

  const saveWish = useCallback((wish: Omit<SavedWish, 'id' | 'timestamp'>) => {
    setProgress((prev) => {
      const newWish: SavedWish = {
        ...wish,
        id: `wish-${Date.now()}`,
        timestamp: Date.now(),
      };
      sound.playSparkle();
      return {
        ...prev,
        savedWishes: [newWish, ...prev.savedWishes],
      };
    });
  }, []);

  const deleteWish = useCallback((wishId: string) => {
    setProgress((prev) => ({
      ...prev,
      savedWishes: prev.savedWishes.filter((w) => w.id !== wishId),
    }));
  }, []);

  const addGuestbookEntry = useCallback(
    (author: string, message: string, stamp: string) => {
      setProgress((prev) => {
        const entry: GuestbookEntry = {
          id: `gb-${Date.now()}`,
          author: author.trim() || 'Anonymous Dreamer',
          message: message.trim(),
          stamp,
          date: `Bureau Moon ${new Date().getDate()}`,
        };
        sound.playTap();
        return {
          ...prev,
          guestbookEntries: [entry, ...prev.guestbookEntries],
        };
      });
      // Award guestbook writer
      claimReward('reward-guestbook-signed', 10, 'Signed the Bureau Guestbook!');
    },
    [claimReward]
  );

  const setTheme = useCallback((theme: 'day' | 'night') => {
    setProgress((prev) => ({ ...prev, theme }));
    if (theme === 'night') {
      setTimeout(() => checkAndUnlockAchievement('ach-midnight-visitor'), 300);
    }
  }, [checkAndUnlockAchievement]);

  const toggleTheme = useCallback(() => {
    setProgress((prev) => {
      const nextTheme = prev.theme === 'day' ? 'night' : 'day';
      if (nextTheme === 'night') {
        setTimeout(() => checkAndUnlockAchievement('ach-midnight-visitor'), 300);
      }
      return { ...prev, theme: nextTheme };
    });
  }, [checkAndUnlockAchievement]);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setProgress((prev) => ({ ...prev, soundEnabled: enabled }));
  }, []);

  const toggleChaosMode = useCallback(() => {
    setProgress((prev) => {
      sound.playTap();
      return { ...prev, chaosMode: !prev.chaosMode };
    });
  }, []);

  const setSparklesEnabled = useCallback((enabled: boolean) => {
    setProgress((prev) => ({ ...prev, sparklesEnabled: enabled }));
  }, []);

  const setNightlightCursorEnabled = useCallback((enabled: boolean) => {
    setProgress((prev) => ({ ...prev, nightlightCursorEnabled: enabled }));
  }, []);

  const toggleNightlightCursor = useCallback(() => {
    setProgress((prev) => {
      sound.playTap();
      return { ...prev, nightlightCursorEnabled: !prev.nightlightCursorEnabled };
    });
  }, []);

  const resetProgress = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    prevLevelRef.current = 1;
    setProgress(INITIAL_PROGRESS);
    sound.playTap();
  }, []);

  const exportSaveData = useCallback((): string => {
    return JSON.stringify(progress, null, 2);
  }, [progress]);

  const importSaveData = useCallback((jsonStr: string): { success: boolean; message: string } => {
    try {
      const data = JSON.parse(jsonStr);
      if (typeof data === 'object' && data !== null && typeof data.xp === 'number') {
        setProgress({
          ...INITIAL_PROGRESS,
          ...data,
          xp: Math.max(0, data.xp),
        });
        return { success: true, message: 'Bureau data restored successfully!' };
      }
      return { success: false, message: 'Invalid data format.' };
    } catch (e) {
      return { success: false, message: 'Could not parse JSON save data.' };
    }
  }, []);

  return (
    <ProgressionContext.Provider
      value={{
        progress,
        notifications,
        dismissNotification,
        claimReward,
        unlockGame,
        recordGameCompletion,
        discoverEasterEgg,
        unlockScrapbookPage,
        completeStoryChapter,
        saveWish,
        deleteWish,
        addGuestbookEntry,
        setTheme,
        toggleTheme,
        setSoundEnabled,
        toggleChaosMode,
        setSparklesEnabled,
        setNightlightCursorEnabled,
        toggleNightlightCursor,
        resetProgress,
        exportSaveData,
        importSaveData,
        triggerCelebration,
      }}
    >
      {children}
    </ProgressionContext.Provider>
  );
};

export const useProgression = () => {
  const context = useContext(ProgressionContext);
  if (!context) {
    throw new Error('useProgression must be used within ProgressionProvider');
  }
  return context;
};
