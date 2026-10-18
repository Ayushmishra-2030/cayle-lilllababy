import React, { useState, useEffect } from 'react';
import { useProgression } from '../../../context/ProgressionContext';
import { sound } from '../../../utils/audio';
import { ArrowLeft, RotateCcw } from 'lucide-react';

interface MoonlightMemoryProps {
  onBack: () => void;
}

interface CardItem {
  id: number;
  symbol: string;
  name: string;
  matched: boolean;
}

const SYMBOLS = [
  { symbol: '🌙', name: 'Crescent Moon' },
  { symbol: '⭐', name: 'Golden Star' },
  { symbol: '🦋', name: 'Moth Wings' },
  { symbol: '🍶', name: 'Wish Bottle' },
  { symbol: '🏮', name: 'Bureau Lantern' },
  { symbol: '🍵', name: 'Glitter Tea' },
  { symbol: '☄️', name: 'Comet Dust' },
  { symbol: '☁️', name: 'Dream Cloud' },
];

function createDeck(): CardItem[] {
  const deck: CardItem[] = [];
  let id = 1;
  SYMBOLS.forEach((item) => {
    // Add two of each
    deck.push({ id: id++, symbol: item.symbol, name: item.name, matched: false });
    deck.push({ id: id++, symbol: item.symbol, name: item.name, matched: false });
  });
  // Shuffle
  return deck.sort(() => Math.random() - 0.5);
}

export const MoonlightMemoryGame: React.FC<MoonlightMemoryProps> = ({ onBack }) => {
  const { recordGameCompletion } = useProgression();
  const [cards, setCards] = useState<CardItem[]>(createDeck);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [turns, setTurns] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [firstTimeReward, setFirstTimeReward] = useState<number | null>(null);

  const matchedCount = cards.filter((c) => c.matched).length / 2;

  const handleCardClick = (index: number) => {
    // Prevent clicking already matched or already flipped
    if (cards[index].matched || flippedIndices.includes(index) || flippedIndices.length >= 2) {
      return;
    }

    sound.playTap();
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setTurns((t) => t + 1);
      const firstCard = cards[newFlipped[0]];
      const secondCard = cards[newFlipped[1]];

      if (firstCard.symbol === secondCard.symbol) {
        // Match!
        setTimeout(() => {
          sound.playStarCatch();
          setCards((prev) =>
            prev.map((c, i) =>
              i === newFlipped[0] || i === newFlipped[1] ? { ...c, matched: true } : c
            )
          );
          setFlippedIndices([]);
        }, 500);
      } else {
        // Not a match, flip back
        setTimeout(() => {
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  // Check win condition
  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.matched) && !isWon) {
      setIsWon(true);
      sound.playLevelUp();
      const res = recordGameCompletion('game-5-moonlight-memory');
      if (res.firstTime) {
        setFirstTimeReward(res.xpAwarded);
      }
    }
  }, [cards, isWon, recordGameCompletion]);

  const handleReset = () => {
    sound.playTap();
    setCards(createDeck());
    setFlippedIndices([]);
    setTurns(0);
    setIsWon(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Top Bar */}
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
            Pairs: {matchedCount} / 8 • Turns: {turns}
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 4x4 Card Grid */}
      <div className="relative p-4 sm:p-6 rounded-3xl bg-gradient-to-b from-[#181135] to-[#2d1b4e] border-4 border-purple-400/30 shadow-2xl">
        <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-md mx-auto">
          {cards.map((card, index) => {
            const isFlipped = card.matched || flippedIndices.includes(index);
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(index)}
                className={`aspect-square rounded-2xl flex items-center justify-center text-3xl sm:text-4xl transition-all duration-300 transform cursor-pointer ${
                  isFlipped
                    ? 'bg-gradient-to-br from-amber-100 to-rose-100 dark:from-purple-900 dark:to-pink-900 border-2 border-amber-300 shadow-lg scale-100'
                    : 'bg-gradient-to-br from-purple-800 to-indigo-900 hover:from-purple-700 hover:to-indigo-800 border-2 border-purple-500/40 shadow hover:scale-105'
                }`}
                aria-label={isFlipped ? card.name : 'Hidden card'}
              >
                {isFlipped ? (
                  <span className="animate-fade-in drop-shadow">{card.symbol}</span>
                ) : (
                  <span className="text-xl sm:text-2xl text-amber-300/60 font-serif">✨</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Won Overlay */}
        {isWon && (
          <div className="absolute inset-0 bg-purple-950/90 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-6 text-center text-white space-y-3 z-30 animate-fade-in">
            <div className="text-5xl animate-bounce">🌙🃏✨</div>
            <h3 className="text-2xl font-serif-heading font-bold text-amber-300">
              Celestial Memory Master!
            </h3>
            <p className="text-sm text-purple-200">
              You matched all 8 celestial pairs in <span className="font-bold text-amber-300">{turns}</span> turns!
            </p>
            {firstTimeReward && (
              <div className="bg-amber-400/20 border border-amber-400/50 text-amber-200 px-4 py-2 rounded-xl text-xs font-semibold">
                First Completion Bonus: +{firstTimeReward} XP Awarded!
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-xs cursor-pointer"
              >
                Play Again
              </button>
              <button
                onClick={onBack}
                className="px-6 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-xs cursor-pointer"
              >
                Arcade Menu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
