'use client';

import clsx from 'clsx';
import { useI18n } from '@/lib/i18n';

export type Mode = 'diagnostico' | 'financiero' | 'pitch' | 'qa' | 'latam' | 'challenge';

const MODE_IDS: Mode[] = ['diagnostico', 'financiero', 'pitch', 'qa', 'latam', 'challenge'];

interface ModeSelectorProps {
  selected: Mode | null;
  onSelect: (mode: Mode) => void;
  completedModes?: string[];
  recommendedMode?: string | null;
}

export function ModeSelector({ selected, onSelect, completedModes = [], recommendedMode }: ModeSelectorProps) {
  const completedSet = new Set(completedModes);
  const { t } = useI18n();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-3xl">
      {MODE_IDS.map((id) => {
        const mode = t.chat.modes[id];
        const isSelected = selected === id;
        const isCompleted = completedSet.has(id);
        const isRecommended = recommendedMode === id;
        const isChallenge = id === 'challenge';

        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={clsx(
              'relative text-left rounded-xl border p-4 transition-all',
              isSelected
                ? isChallenge
                  ? 'border-red-500/50 bg-red-500/10 ring-1 ring-red-500/30'
                  : 'border-indigo-500/50 bg-indigo-500/10 ring-1 ring-indigo-500/30'
                : isChallenge
                  ? 'border-red-500/20 hover:border-red-500/40 hover:bg-red-500/5'
                  : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/30'
            )}
          >
            {/* Badges */}
            <div className="flex items-center gap-1.5 mb-2 min-h-[18px]">
              {isRecommended && !isCompleted && (
                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">
                  {t.chat.recommended}
                </span>
              )}
              {isCompleted && (
                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  {t.chat.completed}
                </span>
              )}
            </div>

            <h3 className={clsx(
              'text-sm font-semibold mb-1',
              isSelected ? 'text-white' : isChallenge ? 'text-red-300' : 'text-zinc-200'
            )}>
              {mode.label}
            </h3>
            <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
              {mode.description}
            </p>

            <div className="space-y-1">
              <p className="text-[10px] text-zinc-500">
                <span className="text-zinc-600">{t.chat.generates}</span> {mode.artifacts}
              </p>
              <p className="text-[10px] text-zinc-600">
                {mode.estimate}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
