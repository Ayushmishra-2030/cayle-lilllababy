import { Achievement, ArcadeGameMeta, CollectibleItem, EasterEgg } from '../types';

export const XP_REWARDS = {
  FIRST_VISIT: 5,
  DISCOVER_EASTER_EGG: 10,
  SOLVE_SCRAPBOOK_RIDDLE: 15,
  COMPLETE_FREE_GAME_FIRST: 20,
  COMPLETE_GAME_CHALLENGE: 10,
  DISCOVER_SECRET_PAGE: 15,
  COMPLETE_STORY_CHAPTER: 20,
  COMPLETE_SECRET_CHALLENGE: 25,
} as const;

export interface LevelInfo {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
  icon: string;
  badgeColor: string;
  perkDescription: string;
}

export const LEVELS: LevelInfo[] = [
  {
    level: 1,
    title: 'Little Dreamer',
    minXP: 0,
    maxXP: 49,
    icon: '✨',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    perkDescription: 'Fresh wings! Able to visit the bureau and explore basic stories.',
  },
  {
    level: 2,
    title: 'Star Explorer',
    minXP: 50,
    maxXP: 119,
    icon: '🌟',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    perkDescription: 'Keen eye for cosmic dust! Unlocks intermediate arcade puzzles.',
  },
  {
    level: 3,
    title: 'Wish Collector',
    minXP: 120,
    maxXP: 219,
    icon: '📜',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    perkDescription: 'Carrying a magical satchel! Can decode constellation riddles.',
  },
  {
    level: 4,
    title: 'Moon Guardian',
    minXP: 220,
    maxXP: 349,
    icon: '🌙',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    perkDescription: 'Attuned to lunar tides! Granted access to advanced secret trials.',
  },
  {
    level: 5,
    title: 'Master Wishkeeper',
    minXP: 350,
    maxXP: 99999,
    icon: '👑',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    perkDescription: 'Supreme keeper of starlight! Caylee bestows the Celestial Bureau Seal.',
  },
];

export function getLevelForXP(xp: number): LevelInfo {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

export function getNextLevelInfo(xp: number): { nextLevel: LevelInfo | null; progressPercent: number; xpNeeded: number } {
  const current = getLevelForXP(xp);
  const nextIdx = LEVELS.findIndex((l) => l.level === current.level + 1);
  if (nextIdx === -1) {
    return { nextLevel: null, progressPercent: 100, xpNeeded: 0 };
  }
  const next = LEVELS[nextIdx];
  const span = next.minXP - current.minXP;
  const inLevel = Math.max(0, xp - current.minXP);
  const percent = Math.min(100, Math.floor((inLevel / span) * 100));
  return {
    nextLevel: next,
    progressPercent: percent,
    xpNeeded: Math.max(0, next.minXP - xp),
  };
}

export const ARCADE_GAMES: ArcadeGameMeta[] = [
  // 3 FREE GAMES
  {
    id: 'game-1-wish-catcher',
    title: 'Wish Catcher',
    tagline: 'Catch falling moonbeams and golden wishes before they fade into the mist!',
    category: 'Action',
    cost: 0,
    difficulty: 'Easy',
    estimatedTime: '60s challenge',
    thumbnailColor: 'from-amber-200 to-rose-200',
    icon: '✨',
    instructions: [
      'Move your satchel basket left and right with mouse, arrow keys, or touch buttons.',
      'Catch glowing stars (+10 pts) and rare wish bottles (+25 pts).',
      'Avoid cloudy storm dust (-15 pts).',
      'Score at least 100 points before the 45-second timer runs out to win!',
    ],
  },
  {
    id: 'game-2-star-repair',
    title: 'Star Repair Workshop',
    tagline: 'Clean cosmic soot and awaken sleepy stars with magical starlight polish.',
    category: 'Puzzle',
    cost: 0,
    difficulty: 'Easy',
    estimatedTime: '2 mins',
    thumbnailColor: 'from-sky-200 to-indigo-200',
    icon: '⭐',
    instructions: [
      'Seven sleepy stars need urgent repair in the workshop.',
      'Tap each dim star to inspect its soot level and click polish to restore its radiance.',
      'When all 7 stars are gleaming at 100% brightness, the constellation reignites!',
    ],
  },
  {
    id: 'game-3-constellation-connector',
    title: 'Constellation Connector',
    tagline: 'Trace celestial pathways in correct numerical order to uncover lost sky art.',
    category: 'Puzzle',
    cost: 0,
    difficulty: 'Easy',
    estimatedTime: '2 mins',
    thumbnailColor: 'from-purple-200 to-pink-200',
    icon: '🌌',
    instructions: [
      'Tap star node #1 to begin the magical celestial thread.',
      'Connect consecutive numbered stars (1 → 2 → 3 → 4...) without breaking the link.',
      'Use the "Hint" button if you get stuck.',
      'Complete the constellation to reveal its ancient celestial story!',
    ],
  },
  // 7 LOCKED GAMES
  {
    id: 'game-4-dream-stacker',
    title: 'Dream Stacker',
    tagline: 'Build a skyward tower of fluffy dream cushions with rhythmic timing.',
    category: 'Action',
    cost: 40,
    difficulty: 'Medium',
    estimatedTime: '2 mins',
    thumbnailColor: 'from-blue-200 to-teal-200',
    icon: '☁️',
    instructions: [
      'Watch each dream block glide smoothly back and forth.',
      'Tap "Drop Block" or hit Spacebar to stack it precisely onto the base.',
      'Overhanging portions will be trimmed away!',
      'Stack 8 or more levels safely to earn the Dream Architect crown.',
    ],
  },
  {
    id: 'game-5-moonlight-memory',
    title: 'Moonlight Memory',
    tagline: 'Flip and match magical pairs of Caylee’s favorite night treasures.',
    category: 'Memory',
    cost: 60,
    difficulty: 'Medium',
    estimatedTime: '3 mins',
    thumbnailColor: 'from-violet-200 to-fuchsia-200',
    icon: '🃏',
    instructions: [
      'A 16-card grid hiding 8 matching celestial pairs.',
      'Flip two cards per turn. If they match, they glow and lock into place.',
      'Complete all 8 pairs in under 18 turns to pass the trial!',
    ],
  },
  {
    id: 'game-6-lost-wish-detective',
    title: 'Lost Wish Detective',
    tagline: 'Examine magical evidence to trace who sent the mysterious lavender wish.',
    category: 'Mystery',
    cost: 80,
    difficulty: 'Challenging',
    estimatedTime: '4 mins',
    thumbnailColor: 'from-amber-100 to-orange-200',
    icon: '🔍',
    instructions: [
      'Four crime scenes / bureau desks hold lost wish clues.',
      'Inspect the ribbon swatch, the stardust scent, the quill handwriting, and the stamp.',
      'Cross-examine the Dreamland registry and select the correct wish sender!',
    ],
  },
  {
    id: 'game-7-dream-maze',
    title: 'Dream Maze',
    tagline: 'Guide Caylee through shifting cloud corridors to reach the Moon Gate.',
    category: 'Puzzle',
    cost: 100,
    difficulty: 'Challenging',
    estimatedTime: '3 mins',
    thumbnailColor: 'from-indigo-200 to-purple-300',
    icon: '🧭',
    instructions: [
      'Use on-screen direction arrows or keyboard WASD / Arrow keys.',
      'Guide Caylee moth through the labyrinth.',
      'Collect all 4 glowing Star Keys scattered in the corridors.',
      'Reach the Moon Gate exit before your lantern light expires.',
    ],
  },
  {
    id: 'game-8-celestial-puzzle',
    title: 'Celestial Puzzle Room',
    tagline: 'Reorder scrambled starry fresco tiles to restore the Bureau’s Ancient Crest.',
    category: 'Puzzle',
    cost: 130,
    difficulty: 'Challenging',
    estimatedTime: '4 mins',
    thumbnailColor: 'from-rose-200 to-amber-200',
    icon: '🧩',
    instructions: [
      'A 3x3 sliding tile puzzle featuring Caylee’s Moon-Moth Bureau Emblem.',
      'Click or tap adjacent tiles to slide them into the empty slot.',
      'Arrange tiles from 1 through 8 in order, with the blank space in the bottom right.',
    ],
  },
  {
    id: 'game-9-wish-factory',
    title: 'Secret Wish Factory',
    tagline: 'Brew miraculous wishes in the celestial copper cauldron with rare stardust.',
    category: 'Alchemy',
    cost: 160,
    prerequisiteId: 'game-6-lost-wish-detective',
    prerequisiteLabel: 'Requires Lost Wish Detective completion',
    difficulty: 'Challenging',
    estimatedTime: '3 mins',
    thumbnailColor: 'from-emerald-200 to-sky-200',
    icon: '🧪',
    instructions: [
      'Select cosmic ingredients: Starlight Essence, Moon Dew, Velvet Cloud, and Solar Spark.',
      'Consult the ancient Recipe Codex to brew 4 specific wish types (Sweet Dreams, Courage, Friendship, Inspiration).',
      'Keep cauldron heat balanced to successfully fulfill the Bureau orders!',
    ],
  },
  {
    id: 'game-10-midnight-trial',
    title: 'Midnight Star Trial',
    tagline: 'The ultimate 3-stage challenge to reignite the Great Bureau Lighthouse Beacon!',
    category: 'Action',
    cost: 200,
    prerequisiteId: 'chapter-secret-wish',
    prerequisiteLabel: 'Requires Secret Scrapbook Discovery',
    difficulty: 'Expert',
    estimatedTime: '5 mins',
    thumbnailColor: 'from-purple-900 to-slate-900 text-amber-200',
    icon: '👑',
    instructions: [
      'Stage 1: Comet Dodge — Weave between falling meteors for 20 seconds.',
      'Stage 2: Moon Dial Alignment — Spin 3 celestial rings until their alignment glyphs lock.',
      'Stage 3: Starlight Infusion — Rapidly channel starlight energy into the central crystal!',
      'Conquer all 3 stages to unlock the true ending and Master Wishkeeper status.',
    ],
  },
];

export const EASTER_EGGS: EasterEgg[] = [
  {
    id: 'egg-1-seventh-star',
    name: 'The Seventh Star',
    hint: 'A tiny sparkling star floats quietly in the welcome corner...',
    description: 'You found the secret Seventh Star! It unlocked the hidden Bureau Attic room.',
    rewardXP: 10,
    icon: '⭐',
  },
  {
    id: 'egg-2-curling-page',
    name: 'The Curling Page',
    hint: 'Look closely at the scrapbook page edge for a folded paper dog-ear.',
    description: 'You peeled back the curled corner to reveal Caylee’s doodle of a slumbering comet!',
    rewardXP: 10,
    icon: '📜',
  },
  {
    id: 'egg-3-moon-button',
    name: 'The Moon Button',
    hint: 'A crescent moon symbol in the header shines with a subtle aura.',
    description: 'You triple-clicked the moon button and received a message from the Moon Queen!',
    rewardXP: 10,
    icon: '🌙',
  },
  {
    id: 'egg-4-caylee-antennae',
    name: 'Caylee’s Antennae',
    hint: 'Try petting or gently clicking Caylee’s golden antennae directly.',
    description: 'Caylee giggled and her antennae emitted a shower of sweet golden pollen!',
    rewardXP: 10,
    icon: '✨',
  },
  {
    id: 'egg-5-keyboard-sequence',
    name: 'Secret Melody Sequence',
    hint: 'Type "m-o-t-h" anywhere on your keyboard when relaxing.',
    description: 'You played the secret moth chord! The night sky rained gentle pastel petals.',
    rewardXP: 10,
    icon: '🎹',
  },
  {
    id: 'egg-6-wish-jar',
    name: 'The Wish Jar',
    hint: 'An unopened glowing mason jar sits on the Bureau shelf in the About section.',
    description: 'You popped the cork off the jar and freed a captive wish for chocolate chip cookies!',
    rewardXP: 10,
    icon: '🫙',
  },
  {
    id: 'egg-7-hidden-constellation',
    name: 'Hidden Moth Constellation',
    hint: 'In Constellation Connector or the Sky view, tap the stars in the shape of wings.',
    description: 'You charted the mythological Great Silk Moth in the deep sky coordinates!',
    rewardXP: 10,
    icon: '🔭',
  },
  {
    id: 'egg-8-secret-diary-code',
    name: 'Secret Diary Cipher',
    hint: 'Collect numbers hidden inside Page B (trinkets) and Page C (diary dates).',
    description: 'You deciphered the passcode "777" and unlocked Caylee’s private night musings!',
    rewardXP: 10,
    icon: '🗝️',
  },
  {
    id: 'egg-9-midnight-message',
    name: 'Midnight Message',
    hint: 'Switch the bureau to Night Mode and inspect the slumbering lantern.',
    description: 'In the dark, phosphorescent ink revealed: "Dreams never truly sleep, they just wait for stars."',
    rewardXP: 10,
    icon: '🕯️',
  },
  {
    id: 'egg-10-dev-note',
    name: 'Developer’s Stash',
    hint: 'Check the Bureau Credits at the bottom of Settings for a tiny heart.',
    description: 'You found the developer note: "Made with moonlight, cozy tea, and infinite love for dreamers."',
    rewardXP: 10,
    icon: '💌',
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first-hello',
    title: 'First Hello',
    description: 'Met Caylee and listened to her opening voice greeting.',
    badge: '👋',
    category: 'exploration',
    rewardXP: 10,
    conditionDescription: 'Click "Meet Caylee" or listen to her introduction.',
  },
  {
    id: 'ach-curious-moth',
    title: 'Curious Moth',
    description: 'Discovered your first hidden Easter egg in the bureau.',
    badge: '🔎',
    category: 'exploration',
    rewardXP: 15,
    conditionDescription: 'Find at least 1 hidden secret in the bureau.',
  },
  {
    id: 'ach-page-turner',
    title: 'Page Turner',
    description: 'Read through at least 4 pages of the magical scrapbook.',
    badge: '📖',
    category: 'scrapbook',
    rewardXP: 20,
    conditionDescription: 'Navigate through multiple scrapbook chapters.',
  },
  {
    id: 'ach-star-saver',
    title: 'Star Saver',
    description: 'Repaired all 7 sleepy stars in the Star Repair Workshop.',
    badge: '⭐',
    category: 'games',
    rewardXP: 25,
    conditionDescription: 'Complete the Star Repair Workshop game.',
  },
  {
    id: 'ach-wish-catcher',
    title: 'Wish Catcher Pro',
    description: 'Scored 100+ points in the Wish Catcher arcade game.',
    badge: '🧺',
    category: 'games',
    rewardXP: 25,
    conditionDescription: 'Achieve a winning score in Wish Catcher.',
  },
  {
    id: 'ach-puzzle-friend',
    title: 'Puzzle Friend',
    description: 'Successfully connected all stars in Constellation Connector.',
    badge: '🌌',
    category: 'games',
    rewardXP: 25,
    conditionDescription: 'Complete the Constellation Connector puzzle.',
  },
  {
    id: 'ach-treasure-hunter',
    title: 'Treasure Hunter',
    description: 'Collected at least 6 magical items in your bureau satchel.',
    badge: '💎',
    category: 'exploration',
    rewardXP: 30,
    conditionDescription: 'Collect 6 or more items across games and scrapbook.',
  },
  {
    id: 'ach-arcade-explorer',
    title: 'Arcade Explorer',
    description: 'Unlocked at least 3 advanced games in the Arcade.',
    badge: '🕹️',
    category: 'games',
    rewardXP: 35,
    conditionDescription: 'Unlock 3 locked games using earned XP.',
  },
  {
    id: 'ach-midnight-visitor',
    title: 'Midnight Visitor',
    description: 'Switched to Night Mode and explored the moonlit bureau.',
    badge: '🌙',
    category: 'exploration',
    rewardXP: 15,
    conditionDescription: 'Toggle the theme to Night Mode.',
  },
  {
    id: 'ach-master-wishkeeper',
    title: 'Master Wishkeeper',
    description: 'Reached Level 5 and collected 350+ XP across the bureau.',
    badge: '👑',
    category: 'mastery',
    rewardXP: 50,
    conditionDescription: 'Ascend to Level 5: Master Wishkeeper.',
  },
];

export const COLLECTIBLES: CollectibleItem[] = [
  {
    id: 'col-1-bottle-lavender',
    name: 'Lavender Moonbeam Bottle',
    category: 'bottles',
    description: 'A sealed crystal vial preserving the gentle glow of the moon Caylee was born under.',
    hint: 'Claimed automatically when meeting Caylee on your first visit.',
    iconSvg: '🍶',
    rarity: 'common',
  },
  {
    id: 'col-2-feather-owl',
    name: 'Barnaby’s Celestial Feather',
    category: 'notes',
    description: 'A downy silver quill left behind by Barnaby the Bureau Headmaster Owl.',
    hint: 'Inspect Barnaby in Scrapbook Page D: Friends from Dreamland.',
    iconSvg: '🪶',
    rarity: 'rare',
  },
  {
    id: 'col-3-star-fragment',
    name: 'Polished Comet Shard',
    category: 'stars',
    description: 'A glowing pebble buffed to mirror brightness during Star Repair.',
    hint: 'Win the Star Repair Workshop game.',
    iconSvg: '💎',
    rarity: 'common',
  },
  {
    id: 'col-4-button-pearl',
    name: 'Mother-of-Pearl Moon Button',
    category: 'stickers',
    description: 'A shimmering button sewn onto Caylee’s satchel for good luck.',
    hint: 'Find the Moon Button Easter egg in the header.',
    iconSvg: '🔘',
    rarity: 'common',
  },
  {
    id: 'col-5-card-cygnus',
    name: 'Starlight Swan Constellation Card',
    category: 'cards',
    description: 'An illuminated star card drawn with gold ink on pressed indigo paper.',
    hint: 'Finish Constellation Connector.',
    iconSvg: '🦢',
    rarity: 'rare',
  },
  {
    id: 'col-6-stamp-bureau',
    name: 'Official Bureau Wax Seal',
    category: 'stamps',
    description: 'Embossed with the motto: "No wish is too small to find its way home."',
    hint: 'Unlocked upon reaching Level 2: Star Explorer.',
    iconSvg: '🏵️',
    rarity: 'rare',
  },
  {
    id: 'col-7-cloud-cushion',
    name: 'Spun Sugar Cloud Fluff',
    category: 'notes',
    description: 'Soft mist gathered from Lunetta the Cloud Sheep’s gentle wool.',
    hint: 'Meet Lunetta in Scrapbook Page D.',
    iconSvg: '☁️',
    rarity: 'common',
  },
  {
    id: 'col-8-golden-quill',
    name: 'Gilded Starlight Pen',
    category: 'notes',
    description: 'Used by wishkeepers to chart the flight paths of drifting dreams.',
    hint: 'Write an entry in the Guestbook.',
    iconSvg: '✒️',
    rarity: 'common',
  },
  {
    id: 'col-9-nebula-shell',
    name: 'Pip’s Iridescent Snail Shell',
    category: 'bottles',
    description: 'A tiny spiral shell that hums with the soft sound of cosmic ocean waves.',
    hint: 'Inspect Pip the Nebula Snail in Scrapbook Page D.',
    iconSvg: '🐚',
    rarity: 'rare',
  },
  {
    id: 'col-10-secret-key',
    name: 'Antique Bureau Brass Key',
    category: 'notes',
    description: 'An ornate key with a star-shaped bit, found tucked inside a curled scrapbook page.',
    hint: 'Find the Curling Page Easter egg.',
    iconSvg: '🗝️',
    rarity: 'celestial',
  },
  {
    id: 'col-11-crystal-wish',
    name: 'Eternal Wish Crystal',
    category: 'bottles',
    description: 'A pristine wish crystallized under the pressure of pure love and hope.',
    hint: 'Brew your first potion in the Secret Wish Factory.',
    iconSvg: '🔮',
    rarity: 'celestial',
  },
  {
    id: 'col-12-master-crown',
    name: 'Crown of the Wishkeeper',
    category: 'stars',
    description: 'A diaphanous circlet woven from shooting stars and morning dew.',
    hint: 'Ascend to Level 5: Master Wishkeeper.',
    iconSvg: '👑',
    rarity: 'celestial',
  },
];
