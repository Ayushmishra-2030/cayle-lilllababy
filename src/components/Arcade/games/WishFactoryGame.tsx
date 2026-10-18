import React, { useState } from 'react';
import { useProgression } from '../../../context/ProgressionContext';
import { sound } from '../../../utils/audio';
import { ArrowLeft, RotateCcw, Sparkles, CheckCircle2, Flame } from 'lucide-react';

interface FactoryProps {
  onBack: () => void;
}

interface Ingredient {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const INGREDIENTS: Ingredient[] = [
  { id: 'starlight', name: 'Starlight Nectar', icon: '🍯', color: 'bg-amber-100 text-amber-900 border-amber-300' },
  { id: 'moondew', name: 'Moon Dew', icon: '💧', color: 'bg-sky-100 text-sky-900 border-sky-300' },
  { id: 'cloud', name: 'Velvet Cloud', icon: '☁️', color: 'bg-purple-100 text-purple-900 border-purple-300' },
  { id: 'solar', name: 'Solar Spark', icon: '☀️', color: 'bg-rose-100 text-rose-900 border-rose-300' },
];

interface Recipe {
  id: string;
  name: string;
  reqs: [string, string];
  description: string;
  icon: string;
  completed: boolean;
}

const INITIAL_RECIPES: Recipe[] = [
  { id: 'sweet-dreams', name: 'Sweet Dreams Wish', reqs: ['moondew', 'cloud'], description: 'Brings peaceful slumber free of night chills.', icon: '🌙', completed: false },
  { id: 'courage', name: 'Courage In The Dark', reqs: ['solar', 'starlight'], description: 'Ignites gentle boldness in the quietest heart.', icon: '🦁', completed: false },
  { id: 'friendship', name: 'Endless Friendship', reqs: ['starlight', 'cloud'], description: 'Tethers two souls across constellations.', icon: '🤝', completed: false },
  { id: 'inspiration', name: 'Cosmic Inspiration', reqs: ['moondew', 'solar'], description: 'Kindles sudden poetry, melodies, and starlight art.', icon: '💡', completed: false },
];

export const WishFactoryGame: React.FC<FactoryProps> = ({ onBack }) => {
  const { recordGameCompletion } = useProgression();
  const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES);
  const [cauldronIngredients, setCauldronIngredients] = useState<string[]>([]);
  const [isBrewing, setIsBrewing] = useState(false);
  const [brewMessage, setBrewMessage] = useState<string | null>(null);
  const [isWon, setIsWon] = useState(false);
  const [firstTimeReward, setFirstTimeReward] = useState<number | null>(null);

  const completedCount = recipes.filter((r) => r.completed).length;

  const handleAddIngredient = (ingId: string) => {
    if (cauldronIngredients.length >= 2 || isBrewing) return;
    sound.playTap();
    setCauldronIngredients((prev) => [...prev, ingId]);
    setBrewMessage(null);
  };

  const handleBrew = () => {
    if (cauldronIngredients.length !== 2) return;
    setIsBrewing(true);
    sound.playSparkle();

    setTimeout(() => {
      setIsBrewing(false);
      const [a, b] = cauldronIngredients;

      // Check matching recipe
      const matchedIdx = recipes.findIndex(
        (r) =>
          !r.completed &&
          ((r.reqs[0] === a && r.reqs[1] === b) || (r.reqs[0] === b && r.reqs[1] === a))
      );

      if (matchedIdx !== -1) {
        sound.playStarCatch();
        const updated = [...recipes];
        updated[matchedIdx].completed = true;
        setRecipes(updated);
        setBrewMessage(`✨ Successfully brewed ${updated[matchedIdx].name}!`);

        // Check if all recipes brewed!
        if (updated.every((r) => r.completed)) {
          sound.playLevelUp();
          setIsWon(true);
          const res = recordGameCompletion('game-9-wish-factory');
          if (res.firstTime) {
            setFirstTimeReward(res.xpAwarded);
          }
        }
      } else {
        sound.playChime(260, 0.3, 'sine');
        setBrewMessage('🌫️ The mixture bubbled into gentle lavender mist. Try another pair!');
      }

      setCauldronIngredients([]);
    }, 900);
  };

  const handleClear = () => {
    sound.playTap();
    setCauldronIngredients([]);
    setBrewMessage(null);
  };

  const handleResetAll = () => {
    sound.playTap();
    setRecipes(INITIAL_RECIPES);
    setCauldronIngredients([]);
    setBrewMessage(null);
    setIsWon(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            sound.playTap();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-200 dark:bg-slate-800 text-stone-700 dark:text-purple-200 hover:bg-stone-300 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Arcade</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="bg-amber-100 dark:bg-amber-950/70 border border-amber-300 text-xs font-bold px-3 py-1 rounded-xl text-amber-900 dark:text-amber-200">
            Orders Brewed: {completedCount} / 4
          </div>
          <button
            onClick={handleResetAll}
            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 dark:bg-slate-800 border border-stone-300 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Factory Workshop Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Recipe Book */}
        <div className="paper-card p-4 space-y-3">
          <h4 className="font-serif-heading font-bold text-base text-[#5c4033] dark:text-purple-100 border-b border-[#5c4033]/15 pb-1">
            📜 Bureau Recipe Codex
          </h4>
          <div className="space-y-2">
            {recipes.map((r) => {
              const req1 = INGREDIENTS.find((i) => i.id === r.reqs[0])!;
              const req2 = INGREDIENTS.find((i) => i.id === r.reqs[1])!;
              return (
                <div
                  key={r.id}
                  className={`p-2.5 rounded-2xl border transition-all ${
                    r.completed
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-200'
                      : 'bg-white dark:bg-slate-800 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs flex items-center gap-1.5">
                      <span>{r.icon}</span>
                      <span>{r.name}</span>
                    </span>
                    {r.completed ? (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Brewed
                      </span>
                    ) : (
                      <span className="text-[10px] text-stone-400">
                        Needs: {req1.icon} + {req2.icon}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-300 mt-0.5">
                    {r.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Cauldron & Ingredients */}
        <div className="paper-card p-4 flex flex-col justify-between space-y-4">
          <div>
            <h4 className="font-serif-heading font-bold text-base text-[#5c4033] dark:text-purple-100 border-b border-[#5c4033]/15 pb-1 mb-2">
              🧪 Cosmic Cauldron
            </h4>

            {/* Visual Cauldron */}
            <div className="relative h-36 rounded-2xl bg-gradient-to-b from-[#180e2b] to-[#341857] flex flex-col items-center justify-center p-3 text-white overflow-hidden shadow-inner border border-purple-400/30">
              <div className="text-4xl animate-gentle-float">
                {isBrewing ? '✨🫧✨' : '⚗️'}
              </div>

              {/* Added ingredients tags */}
              <div className="flex gap-2 mt-2">
                {cauldronIngredients.length === 0 ? (
                  <span className="text-xs text-purple-300 italic">
                    Add 2 ingredients from below...
                  </span>
                ) : (
                  cauldronIngredients.map((id, idx) => {
                    const ing = INGREDIENTS.find((i) => i.id === id);
                    return (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 border border-white/40 flex items-center gap-1"
                      >
                        {ing?.icon} {ing?.name}
                      </span>
                    );
                  })
                )}
              </div>
            </div>

            {brewMessage && (
              <div className="mt-2 text-xs font-semibold text-center text-[#a34063] dark:text-pink-300 animate-fade-in">
                {brewMessage}
              </div>
            )}
          </div>

          {/* Ingredient Selector */}
          <div>
            <span className="text-xs font-bold text-stone-500 block mb-1.5 uppercase tracking-wider">
              Pick 2 Ingredients:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {INGREDIENTS.map((ing) => (
                <button
                  key={ing.id}
                  onClick={() => handleAddIngredient(ing.id)}
                  disabled={cauldronIngredients.length >= 2 || isBrewing}
                  className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${ing.color} hover:scale-102 active:scale-95`}
                >
                  <span className="text-lg">{ing.icon}</span>
                  <span className="truncate">{ing.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleClear}
              className="px-4 py-2 rounded-full border border-stone-300 text-stone-600 dark:text-stone-300 text-xs font-semibold hover:bg-stone-100 cursor-pointer"
            >
              Empty
            </button>
            <button
              onClick={handleBrew}
              disabled={cauldronIngredients.length !== 2 || isBrewing}
              className={`flex-1 py-2.5 rounded-full font-rounded font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
                cauldronIngredients.length === 2 && !isBrewing
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-900 cursor-pointer'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isBrewing ? 'Simmering Starlight...' : 'Brew Wish!'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Won Overlay */}
      {isWon && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900 to-indigo-950 text-white text-center space-y-3 border-2 border-amber-300 shadow-xl animate-fade-in">
          <div className="text-5xl animate-bounce">🧪✨🍶</div>
          <h3 className="text-2xl font-serif-heading font-bold text-amber-300">
            Master Alchemist of Wishes!
          </h3>
          <p className="text-xs sm:text-sm text-purple-200 max-w-md mx-auto">
            You crafted all four miraculous wishes in the sacred copper cauldron!
            The Little Star Bureau has restocked its crystal pantry.
          </p>
          {firstTimeReward && (
            <div className="bg-amber-400/20 border border-amber-400/50 text-amber-200 px-4 py-2 rounded-xl text-xs font-semibold inline-block">
              First Completion Bonus: +{firstTimeReward} XP Awarded!
            </div>
          )}
          <div>
            <button
              onClick={onBack}
              className="px-6 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-xs cursor-pointer shadow"
            >
              Return to Arcade Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
