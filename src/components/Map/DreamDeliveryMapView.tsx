import React, { useState } from 'react';
import { useProgression } from '../../context/ProgressionContext';
import { sound } from '../../utils/audio';
import { MapPin, Sparkles, CheckCircle2, Lock, Navigation, Info } from 'lucide-react';

interface MapLocation {
  id: string;
  name: string;
  code: string;
  x: number; // percentage
  y: number; // percentage
  icon: string;
  summary: string;
  lore: string;
  rewardXP: number;
}

const MAP_LOCATIONS: MapLocation[] = [
  {
    id: 'loc-bureau',
    name: 'Little Star Bureau',
    code: 'HQ-CENTRAL',
    x: 50,
    y: 20,
    icon: '🏛️',
    summary: 'The administrative heart perched high on Nimbus clouds where incoming wishes are cataloged.',
    lore: 'Smells of old parchment, jasmine tea, and freshly polished star crowns.',
    rewardXP: 10,
  },
  {
    id: 'loc-moon-garden',
    name: 'Moon Garden',
    code: 'SECTOR-LUNA',
    x: 22,
    y: 45,
    icon: '🌸',
    summary: 'A tranquil terrace of silver luminescence where rare lunar moss and midnight bluebells bloom.',
    lore: 'Lunetta frequently gathers cloud wool here as dawn mist rolls in.',
    rewardXP: 10,
  },
  {
    id: 'loc-dream-lake',
    name: 'Dream Lake',
    code: 'WATERS-OF-REST',
    x: 76,
    y: 50,
    icon: '🌊',
    summary: 'Still, mirror-smooth waters that reflect constellations with crystal clarity.',
    lore: 'Pip loves testing tiny leaf boats on the lake ripples.',
    rewardXP: 10,
  },
  {
    id: 'loc-forest',
    name: 'Lost Wish Forest',
    code: 'SYLVAN-WHISPERS',
    x: 35,
    y: 80,
    icon: '🌲',
    summary: 'A dense grove of ancient pine and weeping willow trees where drifting wishes get caught on branches.',
    lore: 'Caylee flies through these needles with her satchel to gently disentangle lost hopes.',
    rewardXP: 10,
  },
  {
    id: 'loc-observatory',
    name: 'Midnight Observatory',
    code: 'STAR-SPIRE-9',
    x: 72,
    y: 82,
    icon: '🔭',
    summary: 'The highest brass dome in the archipelago, housing the celestial astrolabe.',
    lore: 'From this dome, the great beacon shines across light-years to guide sleepy wanderers.',
    rewardXP: 10,
  },
];

export const DreamDeliveryMapView: React.FC = () => {
  const { progress, claimReward } = useProgression();
  const [selectedLocId, setSelectedLocId] = useState<string>(MAP_LOCATIONS[0].id);

  const selectedLoc = MAP_LOCATIONS.find((l) => l.id === selectedLocId) || MAP_LOCATIONS[0];

  const isDiscovered = (locId: string) => {
    return Boolean(progress.claimedRewards[`map-loc-${locId}`]);
  };

  const handleDiscoverLocation = (loc: MapLocation) => {
    sound.playSparkle();
    setSelectedLocId(loc.id);
    const key = `map-loc-${loc.id}`;
    if (!progress.claimedRewards[key]) {
      claimReward(key, loc.rewardXP, `Surveyed ${loc.name} on the Delivery Map!`);
    }
  };

  const discoveredCount = MAP_LOCATIONS.filter((l) => isDiscovered(l.id)).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="paper-card p-6 sm:p-8 bg-gradient-to-r from-amber-50 to-purple-50 dark:from-[#1e1b4b] dark:to-[#171031] relative overflow-hidden">
        <div className="washi-tape washi-tape-gold -top-2.5 left-10 w-36 rotate-[-1deg] rounded" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#a34063]/10 dark:bg-pink-900/40 text-[#a34063] dark:text-pink-300">
              <Navigation className="w-3.5 h-3.5" />
              <span>Cartographic Sky Chart • 5 Key Sectors</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#5c4033] dark:text-purple-100">
              Dream Delivery Map
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              Explore the five celestial territories of the Star Bureau archipelago. Click each landmark to survey its lore and log your discovery progress!
            </p>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 px-4 py-2 rounded-2xl border text-xs font-bold text-center self-start sm:self-auto">
            Sectors Surveyed: <span className="text-[#a34063] dark:text-pink-400">{discoveredCount} / 5</span>
          </div>
        </div>
      </div>

      {/* Interactive Map Board Canvas */}
      <div className="relative w-full h-[400px] sm:h-[480px] rounded-3xl bg-gradient-to-b from-[#140b28] via-[#21113e] to-[#0c051a] border-4 border-amber-300/40 shadow-2xl overflow-hidden p-6 select-none">
        {/* Sky Background Stars */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute top-12 left-16 text-xs">✨</div>
          <div className="absolute top-28 right-24 text-xs">⭐</div>
          <div className="absolute bottom-20 left-1/3 text-xs">✨</div>
          <div className="absolute bottom-12 right-1/4 text-xs">⭐</div>
        </div>

        {/* Glowing Route Pathways SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Path 1: Bureau -> Moon Garden */}
          <line
            x1="50%"
            y1="20%"
            x2="22%"
            y2="45%"
            stroke="#fde047"
            strokeWidth="2.5"
            strokeDasharray="6 6"
            className="opacity-70 drop-shadow-[0_0_8px_#fde047]"
          />
          {/* Path 2: Bureau -> Dream Lake */}
          <line
            x1="50%"
            y1="20%"
            x2="76%"
            y2="50%"
            stroke="#fde047"
            strokeWidth="2.5"
            strokeDasharray="6 6"
            className="opacity-70 drop-shadow-[0_0_8px_#fde047]"
          />
          {/* Path 3: Moon Garden -> Lost Wish Forest */}
          <line
            x1="22%"
            y1="45%"
            x2="35%"
            y2="80%"
            stroke="#fde047"
            strokeWidth="2.5"
            strokeDasharray="6 6"
            className="opacity-70 drop-shadow-[0_0_8px_#fde047]"
          />
          {/* Path 4: Dream Lake -> Midnight Observatory */}
          <line
            x1="76%"
            y1="50%"
            x2="72%"
            y2="82%"
            stroke="#fde047"
            strokeWidth="2.5"
            strokeDasharray="6 6"
            className="opacity-70 drop-shadow-[0_0_8px_#fde047]"
          />
          {/* Path 5: Forest -> Observatory */}
          <line
            x1="35%"
            y1="80%"
            x2="72%"
            y2="82%"
            stroke="#fde047"
            strokeWidth="2.5"
            strokeDasharray="6 6"
            className="opacity-70 drop-shadow-[0_0_8px_#fde047]"
          />
        </svg>

        {/* Location Pins */}
        {MAP_LOCATIONS.map((loc) => {
          const isSelected = selectedLocId === loc.id;
          const discovered = isDiscovered(loc.id);

          return (
            <button
              key={loc.id}
              onClick={() => handleDiscoverLocation(loc)}
              style={{
                left: `${loc.x}%`,
                top: `${loc.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`absolute p-2 rounded-2xl flex flex-col items-center cursor-pointer transition-all duration-300 z-20 ${
                isSelected
                  ? 'scale-125 z-30'
                  : 'hover:scale-110'
              }`}
              title={`${loc.name} (${discovered ? 'Surveyed' : 'Click to Survey'})`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg border-2 transition-all ${
                  isSelected
                    ? 'bg-amber-400 border-white text-stone-900 drop-shadow-[0_0_15px_#fef08a]'
                    : discovered
                    ? 'bg-purple-900/90 border-amber-300 text-white'
                    : 'bg-slate-900/90 border-stone-600 text-stone-300'
                }`}
              >
                {loc.icon}
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-amber-100 whitespace-nowrap mt-1 drop-shadow bg-black/60 px-2 py-0.5 rounded-full">
                {loc.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Location Dossier */}
      <div className="paper-card p-6 sm:p-8 space-y-4 border border-[#a34063]/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#5c4033]/15 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{selectedLoc.icon}</span>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#a34063] dark:text-pink-300 tracking-wider">
                {selectedLoc.code}
              </span>
              <h3 className="font-serif-heading font-bold text-xl text-[#5c4033] dark:text-purple-100">
                {selectedLoc.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isDiscovered(selectedLoc.id) ? (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Surveyed (+{selectedLoc.rewardXP} XP)
              </span>
            ) : (
              <button
                onClick={() => handleDiscoverLocation(selectedLoc)}
                className="px-4 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-900 font-rounded font-bold text-xs shadow cursor-pointer"
              >
                Claim Survey (+{selectedLoc.rewardXP} XP)
              </button>
            )}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
          {selectedLoc.summary}
        </p>

        <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-purple-950/60 border border-amber-200 dark:border-purple-800 text-xs text-stone-700 dark:text-purple-200 font-handwriting text-lg">
          &ldquo;{selectedLoc.lore}&rdquo;
        </div>
      </div>
    </div>
  );
};
