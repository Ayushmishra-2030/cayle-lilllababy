import React from 'react';
import { useProgression } from '../context/ProgressionContext';
import { X, Sparkles } from 'lucide-react';

export const EasterEggNotification: React.FC = () => {
  const { notifications, dismissNotification } = useProgression();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
      {notifications.map((item) => (
        <div
          key={item.id}
          className="pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border-2 border-[#a34063]/30 dark:border-purple-500/40 flex items-start gap-3 animate-slide-up transform transition-all duration-300 hover:scale-[1.02]"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-rose-100 dark:from-purple-900 dark:to-pink-900 flex items-center justify-center text-xl shadow-inner flex-shrink-0">
            {item.icon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h4 className="font-rounded font-bold text-sm text-[#5c4033] dark:text-purple-100 truncate">
                {item.title}
              </h4>
              {item.xpDelta !== undefined && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full flex-shrink-0">
                  +{item.xpDelta} XP
                </span>
              )}
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5 line-clamp-2 leading-relaxed">
              {item.message}
            </p>
          </div>

          <button
            onClick={() => dismissNotification(item.id)}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-0.5 cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
