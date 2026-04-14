'use client';

import clsx from 'clsx';

export type Mode = 'diagnostico' | 'financiero' | 'pitch' | 'qa' | 'latam' | 'challenge';

const MODES: { id: Mode; label: string; description: string }[] = [
  { id: 'diagnostico', label: 'Diagnóstico', description: 'Evaluá tu idea y problem-solution fit' },
  { id: 'financiero', label: 'Financiero', description: 'Analizá unit economics y modelo de negocio' },
  { id: 'pitch', label: 'Pitch', description: 'Prepará y mejorá tu pitch deck' },
  { id: 'qa', label: 'Q&A Analista', description: 'Simulación de due diligence con un VC' },
  { id: 'latam', label: 'Expansión LATAM', description: 'Estrategia de expansión regional' },
  { id: 'challenge', label: 'Challenge', description: 'Desafío estilo YC: respuestas cortas y repreguntas duras' },
];

interface ModeSelectorProps {
  selected: Mode | null;
  onSelect: (mode: Mode) => void;
}

export function ModeSelector({ selected, onSelect }: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {MODES.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onSelect(mode.id)}
          className={clsx(
            'rounded-xl border p-4 text-left transition-all',
            selected === mode.id
              ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500'
              : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50'
          )}
        >
          <p className="text-sm font-medium text-white">{mode.label}</p>
          <p className="text-xs text-zinc-400 mt-1">{mode.description}</p>
        </button>
      ))}
    </div>
  );
}
