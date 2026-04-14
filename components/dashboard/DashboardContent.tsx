'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { JourneyMap } from '@/components/dashboard/JourneyMap';
import { EmptyState } from '@/components/ui/EmptyState';
import { ARTIFACT_TYPE_COLORS, MODE_COLORS } from '@/lib/constants/artifact-types';
import { useI18n } from '@/lib/i18n';

interface DashboardContentProps {
  profile: { company_name?: string; stage?: string; journey_progress?: { completed?: string[]; skipped?: string[] } } | null;
  artifacts: { id: string; type: string; title: string; created_at: string }[];
  conversations: { id: string; title: string | null; mode: string; updated_at: string }[];
  completedModes: string[];
}

const JOURNEY_STEP_IDS = ['diagnostico', 'financiero', 'pitch', 'qa', 'funding', 'challenge'] as const;
const JOURNEY_STEP_MODES: Record<string, string> = {
  diagnostico: 'diagnostico',
  financiero: 'financiero',
  pitch: 'pitch',
  qa: 'qa',
  funding: 'latam',
  challenge: 'challenge',
};

export function DashboardContent({ profile, artifacts, conversations, completedModes }: DashboardContentProps) {
  const { t, locale } = useI18n();

  const journeySteps = JOURNEY_STEP_IDS.map((id) => ({
    id,
    mode: JOURNEY_STEP_MODES[id],
    title: t.journey.steps[id as keyof typeof t.journey.steps]?.title || id,
    benefit: t.journey.steps[id as keyof typeof t.journey.steps]?.shortDesc || '',
  }));

  const journeyProgress = {
    completed: profile?.journey_progress?.completed || [],
    skipped: profile?.journey_progress?.skipped || [],
  };
  const completedSteps = new Set([
    ...(journeyProgress.completed || []),
    ...completedModes,
  ]);
  const skippedSteps = new Set(journeyProgress.skipped || []);

  const nextStep = journeySteps.find(
    (s) => !completedSteps.has(s.id) && !completedSteps.has(s.mode) && !skippedSteps.has(s.id)
  );

  const doneCount = journeySteps.filter(
    (s) => completedSteps.has(s.id) || completedSteps.has(s.mode)
  ).length;
  const totalSteps = journeySteps.length;
  const progressPercent = Math.round((doneCount / totalSteps) * 100);

  const recentConversations = conversations.slice(0, 5);
  const dateLocale = locale === 'es' ? 'es-AR' : 'en-US';

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Status bar */}
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-xl font-bold text-white">
          {profile?.company_name || t.dashboard.welcome}
        </h1>
        {profile?.stage && (
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400">
            {t.stages[profile.stage as keyof typeof t.stages] || profile.stage}
          </span>
        )}
        {doneCount > 0 && (
          <span className="text-xs text-zinc-500 ml-auto">
            {doneCount}/{totalSteps} {t.dashboard.stagesCompleted}
          </span>
        )}
      </div>

      {/* Hero contextual */}
      {!profile ? (
        <Link
          href="/onboarding"
          className="block rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 mb-6 hover:bg-amber-500/10 transition-colors group"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-white mb-1">{t.dashboard.completeProfile.title}</h2>
              <p className="text-xs text-zinc-400">{t.dashboard.completeProfile.description}</p>
            </div>
            <span className="text-xs text-amber-400 font-medium group-hover:translate-x-0.5 transition-transform flex-shrink-0 mt-1">
              {t.dashboard.completeProfile.cta}
            </span>
          </div>
        </Link>
      ) : nextStep ? (
        <Link
          href={`/chat?mode=${nextStep.mode}&journey=${nextStep.id}`}
          className="block rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-5 mb-6 hover:bg-indigo-500/10 transition-colors group"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase text-indigo-400 mb-1">{t.dashboard.nextStep.title}</p>
              <h2 className="text-sm font-semibold text-white mb-1">{nextStep.title}</h2>
              <p className="text-xs text-zinc-400">{nextStep.benefit}</p>
            </div>
            <span className="text-xs text-indigo-400 font-medium group-hover:translate-x-0.5 transition-transform flex-shrink-0 mt-3">
              {t.dashboard.nextStep.cta}
            </span>
          </div>
        </Link>
      ) : doneCount === totalSteps ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">{t.dashboard.allComplete.title}</h2>
              <p className="text-xs text-zinc-400">{t.dashboard.allComplete.description}</p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Compact Journey Progress */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
            {t.dashboard.validationPath}
          </h2>
          <span className="text-xs text-zinc-500">{progressPercent}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-zinc-800 mb-3 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {journeySteps.map((step, idx) => {
            const isDone = completedSteps.has(step.id) || completedSteps.has(step.mode);
            const isSkipped = skippedSteps.has(step.id) && !isDone;
            const isCurrent = nextStep?.id === step.id;
            return (
              <Link
                key={step.id}
                href={`/chat?mode=${step.mode}&journey=${step.id}`}
                className={clsx(
                  'rounded-lg border p-2.5 text-center transition-all hover:scale-[1.02]',
                  isDone && 'border-emerald-500/30 bg-emerald-500/5',
                  isCurrent && 'border-indigo-500/40 bg-indigo-500/10 ring-1 ring-indigo-500/30',
                  isSkipped && 'border-zinc-800 bg-zinc-900/50 opacity-50',
                  !isDone && !isCurrent && !isSkipped && 'border-zinc-800 bg-zinc-900/30'
                )}
              >
                <div className="flex justify-center mb-1.5">
                  {isDone ? (
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className={clsx(
                      'w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center',
                      isCurrent ? 'bg-indigo-500/30 text-indigo-400' : 'bg-zinc-800 text-zinc-500'
                    )}>
                      {idx + 1}
                    </span>
                  )}
                </div>
                <p className={clsx(
                  'text-[11px] font-medium truncate',
                  isDone ? 'text-emerald-400' : isCurrent ? 'text-white' : 'text-zinc-500'
                )}>
                  {step.title}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Expandable full journey */}
      <section className="mb-8">
        <JourneyMap
          completedModes={completedModes}
          journeyProgress={journeyProgress}
        />
      </section>

      {/* Two columns: artifacts + conversations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
              {t.dashboard.artifacts.title}
            </h3>
            <Link href="/artifacts" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
              {t.dashboard.artifacts.viewAll}
            </Link>
          </div>
          {artifacts.length > 0 ? (
            <div className="space-y-1.5">
              {artifacts.map((artifact) => (
                <Link
                  key={artifact.id}
                  href={`/artifacts/${artifact.id}`}
                  className="flex items-center justify-between rounded-lg border border-zinc-800/50 px-3 py-2.5 hover:bg-zinc-800/40 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={clsx(
                        'text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full',
                        ARTIFACT_TYPE_COLORS[artifact.type] || 'bg-zinc-700 text-zinc-400'
                      )}>
                        {t.artifactTypes[artifact.type as keyof typeof t.artifactTypes] || artifact.type}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-300 truncate">{artifact.title}</p>
                  </div>
                  <span className="text-[11px] text-zinc-600 flex-shrink-0 ml-3">
                    {new Date(artifact.created_at).toLocaleDateString(dateLocale)}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              title={t.dashboard.artifacts.empty.title}
              description={t.dashboard.artifacts.empty.description}
              actionLabel={t.dashboard.artifacts.empty.cta}
              actionHref="/chat?mode=diagnostico&journey=diagnostico"
            />
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
              {t.dashboard.conversations.title}
            </h3>
            <Link href="/chat" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
              {t.dashboard.conversations.new}
            </Link>
          </div>
          {recentConversations.length > 0 ? (
            <div className="space-y-1.5">
              {recentConversations.map((conv) => (
                <Link
                  key={conv.id}
                  href={`/chat/${conv.id}`}
                  className="flex items-center justify-between rounded-lg border border-zinc-800/50 px-3 py-2.5 hover:bg-zinc-800/40 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-zinc-300 truncate">{conv.title || t.common.noTitle}</p>
                    <p className="text-[11px] text-zinc-600 mt-0.5">
                      {new Date(conv.updated_at).toLocaleDateString(dateLocale)}
                    </p>
                  </div>
                  <span className={clsx(
                    'flex-shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full',
                    MODE_COLORS[conv.mode] || 'bg-zinc-800 text-zinc-500'
                  )}>
                    {t.modeLabels[conv.mode as keyof typeof t.modeLabels] || conv.mode}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              }
              title={t.dashboard.conversations.empty.title}
              description={t.dashboard.conversations.empty.description}
              actionLabel={t.dashboard.conversations.empty.cta}
              actionHref="/chat"
            />
          )}
        </section>
      </div>
    </div>
  );
}
