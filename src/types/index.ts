export type TabType =
  | 'home'
  | 'about'
  | 'scrapbook'
  | 'story'
  | 'map'
  | 'projects'
  | 'arcade'
  | 'collection'
  | 'achievements'
  | 'wishes'
  | 'lullaby'
  | 'guestbook'
  | 'settings';

export type CayleeExpression = 'happy' | 'curious' | 'surprised' | 'sleepy' | 'proud' | 'giggle';

export interface PlayerProgress {
  xp: number;
  claimedRewards: Record<string, boolean>; // Unique reward IDs to prevent double claiming
  unlockedGames: string[]; // List of unlocked game IDs
  completedGames: Record<string, number>; // Game ID to completion count
  discoveredEasterEggs: string[]; // Easter egg IDs
  unlockedScrapbookPages: string[]; // Scrapbook page IDs
  completedStoryChapters: string[]; // Story chapter IDs
  achievements: Record<string, { unlocked: boolean; unlockedAt?: number }>;
  savedWishes: SavedWish[];
  guestbookEntries: GuestbookEntry[];
  firstVisitDone: boolean;
  visitCount: number;
  theme: 'day' | 'night';
  soundEnabled: boolean;
  chaosMode: boolean;
  sparklesEnabled: boolean;
  nightlightCursorEnabled?: boolean;
  transactions: XPTransaction[];
}

export interface XPTransaction {
  id: string;
  timestamp: number;
  description: string;
  amount: number; // positive for gain, negative for spent
  newBalance: number;
}

export interface SavedWish {
  id: string;
  mood: string;
  text: string;
  recipient: string;
  timestamp: number;
  starsCount: number;
}

export interface GuestbookEntry {
  id: string;
  author: string;
  message: string;
  stamp: string;
  date: string;
}

export interface EasterEgg {
  id: string;
  name: string;
  hint: string;
  description: string;
  rewardXP: number;
  icon: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  badge: string;
  category: 'exploration' | 'games' | 'scrapbook' | 'mastery';
  rewardXP: number;
  conditionDescription: string;
}

export interface CollectibleItem {
  id: string;
  name: string;
  category: 'bottles' | 'stars' | 'stickers' | 'stamps' | 'cards' | 'notes';
  description: string;
  hint: string;
  iconSvg: string;
  rarity: 'common' | 'rare' | 'celestial';
}

export interface ArcadeGameMeta {
  id: string;
  title: string;
  tagline: string;
  category: 'Action' | 'Puzzle' | 'Memory' | 'Mystery' | 'Alchemy';
  cost: number;
  prerequisiteId?: string;
  prerequisiteLabel?: string;
  difficulty: 'Easy' | 'Medium' | 'Challenging' | 'Expert';
  estimatedTime: string;
  thumbnailColor: string;
  icon: string;
  instructions: string[];
}
