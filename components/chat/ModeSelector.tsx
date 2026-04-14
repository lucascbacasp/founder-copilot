'use client';

import clsx from 'clsx';

export type Mode = 'diagnostico' | 'financiero' | 'pitch' | 'qa' | 'latam' | 'challenge';

interface ModeConfig {
  id: Mode;
  label: string;
  description: string;
  artifacts: string;
  estimate: string;
}

const MODES: ModeConfig[] = [
  {
    id: 'diagnostico',
    label: 'Diagnóstico',
    description: 'Validación de problem-solution fit y diagnóstico base de tu startup.',
    artifacts: 'BMC + Scorecard + Mapa de competidores',
    estimate: '~10 min',
  },
  {
    id: 'financiero',
    label: 'Financiero',
    description: 'Análisis de unit economics, modelo de revenue y benchmarks.',
    artifacts: 'Modelo financiero + Roadmap de experimentos',
    estimate: '~15 min',
  },
  {
    id: 'pitch',
    label: 'Pitch',
    description: 'Construcción de pitch deck y preparación de narrativa para inversores.',
    artifacts: 'Investor deck + Funding map + Pitch adaptado',
    estimate: '~15 min',
  },
  {
    id: 'qa',
    label: 'Q&A Analista',
    description: 'Simulación de due diligence con un analista de VC.',
    artifacts: 'Score de preparación + Puntos débiles',
    estimate: '~10 min',
  },
  {
    id: 'latam',
    label: 'Expansión LATAM',
    description: 'Estrategia de expansión regional y oportunidades de mercado.',
    artifacts: 'Mapa de oportunidades + Estrategia regional',
    estimate: '~12 min',
  },
  {
    id: 'challenge',
    label: 'Challenge',
    description: '12 preguntas duras estilo YC, una por vez, con repreguntas si tus respuestas son vagas.',
    artifacts: 'Challenge scorecard (5 criterios)',
    estimate: '~20 min',
  },
];

interface ModeSelectorProps {
  selected: Mode | null;
  onSelect: (mode: Mode) => void;
  completedModes?: string[];
  recommendedMode?: string | null;
}

export function ModeSelector({ selected, onSelect, completedModes = [], recommendedMode }: ModeSelectorProps) {
  const completedSet = new Set(completedModes);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-3xl">
      {MODES.map((mode) => {
        const isSelected = selected === mode.id;
        const isCompleted = completedSet.has(mode.id);
        const isRecommended = recommendedMode === mode.id;
        const isChallenge = mode.id === 'challenge';

        return (
          <button
            key={mode.id}
            onClick={() => onSelect(mode.id)}
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
                  Recomendado
                </span>
              )}
              {isCompleted && (
                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  Completado
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
                <span className="text-zinc-600">Genera:</span> {mode.artifacts}
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
