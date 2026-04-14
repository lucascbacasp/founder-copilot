'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useI18n } from '@/lib/i18n';

interface JourneyStep {
  id: string;
  mode: string;
  number: number;
  icon: React.ReactNode;
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: 'diagnostico',
    mode: 'diagnostico',
    number: 1,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    id: 'financiero',
    mode: 'financiero',
    number: 2,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'pitch',
    mode: 'pitch',
    number: 3,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4V2m0 2a2 2 0 012 2v1a2 2 0 01-2 2 2 2 0 01-2-2V6a2 2 0 012-2zm0 10v2m0-2a2 2 0 00-2-2H4a2 2 0 00-2 2v1a2 2 0 002 2h1a2 2 0 002-2zm10-10V2m0 2a2 2 0 012 2v1a2 2 0 01-2 2 2 2 0 01-2-2V6a2 2 0 012-2z" />
      </svg>
    ),
  },
  {
    id: 'qa',
    mode: 'qa',
    number: 4,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'funding',
    mode: 'latam',
    number: 5,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    id: 'challenge',
    mode: 'challenge',
    number: 6,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
      </svg>
    ),
  },
];

type StepStatus = 'completed' | 'current' | 'skipped' | 'upcoming';

interface JourneyMapProps {
  completedModes: string[];
  journeyProgress: { completed: string[]; skipped: string[] };
}

function ensureProgress(p: { completed?: string[]; skipped?: string[] } | null | undefined): { completed: string[]; skipped: string[] } {
  return {
    completed: Array.isArray(p?.completed) ? p.completed : [],
    skipped: Array.isArray(p?.skipped) ? p.skipped : [],
  };
}

export function JourneyMap({ completedModes: initialCompletedModes, journeyProgress: initialProgress }: JourneyMapProps) {
  const router = useRouter();
  const { t } = useI18n();
  const [progress, setProgress] = useState(() => ensureProgress(initialProgress));
  const [completedModes] = useState(new Set(initialCompletedModes));
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [skipping, setSkipping] = useState<string | null>(null);

  function getStepStatus(step: JourneyStep): StepStatus {
    // Explicitly completed or has a conversation in that mode
    if (progress.completed.includes(step.id) || completedModes.has(step.mode)) {
      return 'completed';
    }
    if (progress.skipped.includes(step.id)) {
      return 'skipped';
    }
    // Current = first step that isn't completed or skipped
    const currentStep = JOURNEY_STEPS.find(
      (s) =>
        !progress.completed.includes(s.id) &&
        !completedModes.has(s.mode) &&
        !progress.skipped.includes(s.id)
    );
    if (currentStep?.id === step.id) return 'current';
    return 'upcoming';
  }

  async function handleSkip(stepId: string) {
    setSkipping(stepId);
    // Optimistic update
    setProgress((prev) => ({
      ...prev,
      skipped: prev.skipped.includes(stepId) ? prev.skipped : [...prev.skipped, stepId],
    }));
    try {
      const res = await fetch('/api/journey', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'skip', step: stepId }),
      });
      if (res.ok) {
        const { progress: updated } = await res.json();
        setProgress(ensureProgress(updated));
      }
    } finally {
      setSkipping(null);
    }
  }

  async function handleUnskip(stepId: string) {
    setSkipping(stepId);
    // Optimistic update
    setProgress((prev) => ({
      ...prev,
      skipped: prev.skipped.filter((s) => s !== stepId),
    }));
    try {
      const res = await fetch('/api/journey', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unskip', step: stepId }),
      });
      if (res.ok) {
        const { progress: updated } = await res.json();
        setProgress(ensureProgress(updated));
      }
    } finally {
      setSkipping(null);
    }
  }

  function handleStart(step: JourneyStep) {
    router.push(`/chat?mode=${step.mode}&journey=${step.id}`);
  }

  // Helper to get step translations by id
  function getStepTranslations(stepId: string) {
    return t.journey.steps[stepId as keyof typeof t.journey.steps];
  }

  // Calculate overall progress — skipped steps count as progress
  const totalSteps = JOURNEY_STEPS.length;
  const doneCount = JOURNEY_STEPS.filter(
    (s) => progress.completed.includes(s.id) || completedModes.has(s.mode)
  ).length;
  const skippedCount = JOURNEY_STEPS.filter(
    (s) => progress.skipped.includes(s.id) && !progress.completed.includes(s.id) && !completedModes.has(s.mode)
  ).length;
  const advancedCount = doneCount + skippedCount;
  const progressPercent = Math.round((advancedCount / totalSteps) * 100);

  return (
    <div className="space-y-6">
      {/* Progress header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">{t.journey.title}</h2>
          <p className="text-sm text-zinc-400 mt-0.5">
            {advancedCount === 0
              ? t.journey.startValidating
              : advancedCount === totalSteps
                ? doneCount === totalSteps ? t.journey.allComplete : `${doneCount} ${t.journey.completed}, ${skippedCount} ${t.journey.skipped}`
                : `${doneCount} / ${totalSteps} ${t.journey.completed}${skippedCount > 0 ? `, ${skippedCount} ${t.journey.skipped}` : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-32 h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-medium text-zinc-400">{progressPercent}%</span>
        </div>
      </div>

      {/* Journey steps */}
      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-[27px] top-8 bottom-8 w-px bg-zinc-800" />

        <div className="space-y-3">
          {JOURNEY_STEPS.map((step, index) => {
            const status = getStepStatus(step);
            const isExpanded = expandedStep === step.id;
            const stepT = getStepTranslations(step.id);

            return (
              <div key={step.id} className="relative">
                <button
                  onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                  className={clsx(
                    'w-full text-left rounded-xl border p-4 transition-all relative z-10',
                    status === 'completed' && 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10',
                    status === 'current' && 'border-indigo-500/50 bg-indigo-500/10 hover:bg-indigo-500/15 ring-1 ring-indigo-500/30',
                    status === 'skipped' && 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 opacity-60',
                    status === 'upcoming' && 'border-zinc-800 bg-zinc-900/30 hover:bg-zinc-800/30'
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Step indicator */}
                    <div
                      className={clsx(
                        'flex-shrink-0 w-[38px] h-[38px] rounded-full flex items-center justify-center',
                        status === 'completed' && 'bg-emerald-500/20 text-emerald-400',
                        status === 'current' && 'bg-indigo-500/20 text-indigo-400 ring-2 ring-indigo-500/40',
                        status === 'skipped' && 'bg-zinc-800 text-zinc-500',
                        status === 'upcoming' && 'bg-zinc-800/80 text-zinc-500'
                      )}
                    >
                      {status === 'completed' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : status === 'skipped' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                      ) : (
                        <span className="text-sm font-bold">{step.number}</span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3
                          className={clsx(
                            'text-sm font-semibold',
                            status === 'completed' && 'text-emerald-300',
                            status === 'current' && 'text-white',
                            status === 'skipped' && 'text-zinc-500 line-through',
                            status === 'upcoming' && 'text-zinc-400'
                          )}
                        >
                          {stepT.title}
                        </h3>
                        <span
                          className={clsx(
                            'text-xs px-2 py-0.5 rounded-full',
                            status === 'completed' && 'bg-emerald-500/15 text-emerald-400',
                            status === 'current' && 'bg-indigo-500/15 text-indigo-400',
                            status === 'skipped' && 'bg-zinc-800 text-zinc-500',
                            status === 'upcoming' && 'bg-zinc-800/50 text-zinc-600'
                          )}
                        >
                          {status === 'completed'
                            ? t.journey.statusCompleted
                            : status === 'current'
                              ? t.journey.statusNext
                              : status === 'skipped'
                                ? t.journey.statusSkipped
                                : `${step.number}`}
                        </span>
                      </div>
                      <p
                        className={clsx(
                          'text-xs mt-0.5',
                          status === 'current' ? 'text-zinc-300' : 'text-zinc-500'
                        )}
                      >
                        {stepT.shortDesc}
                      </p>
                    </div>

                    {/* Expand arrow */}
                    <svg
                      className={clsx(
                        'w-4 h-4 transition-transform text-zinc-500',
                        isExpanded && 'rotate-180'
                      )}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div
                    className={clsx(
                      'mt-1 ml-[54px] rounded-lg border p-4 space-y-3',
                      status === 'current'
                        ? 'border-indigo-500/20 bg-indigo-500/5'
                        : 'border-zinc-800 bg-zinc-900/50'
                    )}
                  >
                    <p className="text-sm text-zinc-300">{stepT.longDesc}</p>

                    <div>
                      <p className="text-xs font-medium text-zinc-500 mb-1.5">{t.journey.deliverables}</p>
                      <ul className="space-y-1">
                        {stepT.deliverables.split(',').map((d: string) => (
                          <li key={d.trim()} className="flex items-center gap-2 text-xs text-zinc-400">
                            <span className="w-1 h-1 rounded-full bg-zinc-600" />
                            {d.trim()}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      {status !== 'completed' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStart(step);
                          }}
                          className={clsx(
                            'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                            status === 'current'
                              ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                          )}
                        >
                          {t.journey.start}
                        </button>
                      )}

                      {status === 'completed' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStart(step);
                          }}
                          className="rounded-lg px-4 py-2 text-sm font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
                        >
                          {t.journey.repeat}
                        </button>
                      )}

                      {status !== 'completed' && status !== 'skipped' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSkip(step.id);
                          }}
                          disabled={skipping === step.id}
                          className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors disabled:opacity-50"
                        >
                          {t.journey.skip}
                        </button>
                      )}

                      {status === 'skipped' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnskip(step.id);
                          }}
                          disabled={skipping === step.id}
                          className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors disabled:opacity-50"
                        >
                          {t.journey.undoSkip}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
