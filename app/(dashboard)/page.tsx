import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { JourneyMap } from '@/components/dashboard/JourneyMap';
import { EmptyState } from '@/components/ui/EmptyState';
import { ARTIFACT_TYPE_LABELS, ARTIFACT_TYPE_COLORS, MODE_LABELS, MODE_COLORS } from '@/lib/constants/artifact-types';
import clsx from 'clsx';

const STAGE_LABELS: Record<string, string> = {
  idea: 'Idea',
  prototipo: 'Prototipo',
  mvp: 'MVP',
  traccion: 'Tracción',
  revenue: 'Revenue',
};

const JOURNEY_STEPS = [
  { id: 'diagnostico', mode: 'diagnostico', title: 'Diagnóstico', benefit: 'Validá si tu idea resuelve un problema real' },
  { id: 'financiero', mode: 'financiero', title: 'Financiero', benefit: 'Probá que los números cierran' },
  { id: 'pitch', mode: 'pitch', title: 'Pitch', benefit: 'Armá tu narrativa para inversores' },
  { id: 'qa', mode: 'qa', title: 'Q&A Analista', benefit: 'Stress-test tu historia antes de enfrentar VCs' },
  { id: 'funding', mode: 'latam', title: 'Funding', benefit: 'Encontrá hackathons, grants y oportunidades' },
  { id: 'challenge', mode: 'challenge', title: 'Challenge', benefit: 'Entrenamiento estilo YC con repreguntas' },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('founder_profiles')
    .select('company_name, stage, vertical, journey_progress')
    .eq('user_id', user!.id)
    .single();

  const { data: conversations } = await supabase
    .from('conversations')
    .select('id, title, mode, updated_at')
    .eq('user_id', user!.id)
    .order('updated_at', { ascending: false });

  const completedModes = Array.from(
    new Set((conversations || []).map((c) => c.mode))
  );

  const journeyProgress = profile?.journey_progress || { completed: [], skipped: [] };
  const completedSteps = new Set([
    ...(journeyProgress.completed || []),
    ...completedModes,
  ]);
  const skippedSteps = new Set(journeyProgress.skipped || []);

  // Find next step
  const nextStep = JOURNEY_STEPS.find(
    (s) => !completedSteps.has(s.id) && !completedSteps.has(s.mode) && !skippedSteps.has(s.id)
  );

  const doneCount = JOURNEY_STEPS.filter(
    (s) => completedSteps.has(s.id) || completedSteps.has(s.mode)
  ).length;
  const totalSteps = JOURNEY_STEPS.length;
  const progressPercent = Math.round((doneCount / totalSteps) * 100);

  const { data: artifacts } = await supabase
    .from('artifacts')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(4);

  const recentConversations = (conversations || []).slice(0, 5);

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Status bar */}
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-xl font-bold text-white">
          {profile?.company_name || 'Bienvenido'}
        </h1>
        {profile?.stage && (
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400">
            {STAGE_LABELS[profile.stage] || profile.stage}
          </span>
        )}
        {doneCount > 0 && (
          <span className="text-xs text-zinc-500 ml-auto">
            {doneCount}/{totalSteps} etapas completadas
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
              <h2 className="text-sm font-semibold text-white mb-1">Completá tu perfil para empezar</h2>
              <p className="text-xs text-zinc-400">
                Con tus datos, el copiloto personaliza: las preguntas que te hace, los competidores que busca y los benchmarks que usa.
              </p>
            </div>
            <span className="text-xs text-amber-400 font-medium group-hover:translate-x-0.5 transition-transform flex-shrink-0 mt-1">
              Completar &rarr;
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
              <p className="text-[10px] font-bold uppercase text-indigo-400 mb-1">
                Tu siguiente paso
              </p>
              <h2 className="text-sm font-semibold text-white mb-1">{nextStep.title}</h2>
              <p className="text-xs text-zinc-400">
                {nextStep.benefit}
              </p>
            </div>
            <span className="text-xs text-indigo-400 font-medium group-hover:translate-x-0.5 transition-transform flex-shrink-0 mt-3">
              Empezar &rarr;
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
              <h2 className="text-sm font-semibold text-white">Completaste todas las etapas</h2>
              <p className="text-xs text-zinc-400">Podés repetir cualquier etapa o explorar tus artefactos generados.</p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Compact Journey Progress */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
            Camino de validación
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
          {JOURNEY_STEPS.map((step) => {
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
                      {JOURNEY_STEPS.indexOf(step) + 1}
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

      {/* Expandable full journey — still available below */}
      <section className="mb-8">
        <JourneyMap
          completedModes={completedModes}
          journeyProgress={journeyProgress}
        />
      </section>

      {/* Two columns: artifacts + conversations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Artifacts — higher priority */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
              Artefactos generados
            </h3>
            <Link href="/artifacts" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
              Ver todos &rarr;
            </Link>
          </div>
          {artifacts && artifacts.length > 0 ? (
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
                        {ARTIFACT_TYPE_LABELS[artifact.type] || artifact.type}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-300 truncate">{artifact.title}</p>
                  </div>
                  <span className="text-[11px] text-zinc-600 flex-shrink-0 ml-3">
                    {new Date(artifact.created_at).toLocaleDateString('es-AR')}
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
              title="Sin artefactos todavía"
              description="Cada conversación genera deliverables reales: BMC, scorecard, modelo financiero y más."
              actionLabel="Empezar diagnóstico"
              actionHref="/chat?mode=diagnostico&journey=diagnostico"
            />
          )}
        </section>

        {/* Recent conversations */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
              Conversaciones recientes
            </h3>
            <Link href="/chat" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
              Nueva +
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
                    <p className="text-sm text-zinc-300 truncate">{conv.title || 'Sin título'}</p>
                    <p className="text-[11px] text-zinc-600 mt-0.5">
                      {new Date(conv.updated_at).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  <span className={clsx(
                    'flex-shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full',
                    MODE_COLORS[conv.mode] || 'bg-zinc-800 text-zinc-500'
                  )}>
                    {MODE_LABELS[conv.mode] || conv.mode}
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
              title="Sin conversaciones"
              description="Contá tu idea y el copiloto te ayuda a validarla paso a paso."
              actionLabel="Nueva conversación"
              actionHref="/chat"
            />
          )}
        </section>
      </div>
    </div>
  );
}
