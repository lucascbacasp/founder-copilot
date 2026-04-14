import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { JourneyMap } from '@/components/dashboard/JourneyMap';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Load profile with journey progress
  const { data: profile } = await supabase
    .from('founder_profiles')
    .select('company_name, stage, journey_progress')
    .eq('user_id', user!.id)
    .single();

  // Get conversations grouped by mode to detect completed steps
  const { data: conversations } = await supabase
    .from('conversations')
    .select('id, title, mode, updated_at')
    .eq('user_id', user!.id)
    .order('updated_at', { ascending: false });

  const completedModes = Array.from(
    new Set((conversations || []).map((c) => c.mode))
  );

  const journeyProgress = profile?.journey_progress || { completed: [], skipped: [] };

  // Recent artifacts
  const { data: artifacts } = await supabase
    .from('artifacts')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(4);

  const recentConversations = (conversations || []).slice(0, 5);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          {profile?.company_name
            ? `${profile.company_name}`
            : 'Bienvenido'}
        </h1>
        <p className="text-zinc-400 mt-1">
          Segui el camino para validar y preparar tu startup para inversores
        </p>
      </div>

      {/* Journey Map — the main feature */}
      <section className="mb-10">
        <JourneyMap
          completedModes={completedModes}
          journeyProgress={journeyProgress}
        />
      </section>

      {/* Two columns: recent conversations + artifacts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent conversations */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
              Conversaciones recientes
            </h3>
            <Link href="/chat" className="text-xs text-indigo-400 hover:text-indigo-300">
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
                    <p className="text-sm text-zinc-300 truncate">{conv.title || 'Sin titulo'}</p>
                    <p className="text-[11px] text-zinc-600 mt-0.5">
                      {new Date(conv.updated_at).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  <span className="flex-shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500">
                    {conv.mode}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-600 py-4">
              Las conversaciones apareceran aca cuando empieces el journey.
            </p>
          )}
        </section>

        {/* Recent artifacts */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
              Artefactos generados
            </h3>
            <Link href="/artifacts" className="text-xs text-indigo-400 hover:text-indigo-300">
              Ver todos
            </Link>
          </div>
          {artifacts && artifacts.length > 0 ? (
            <div className="space-y-1.5">
              {artifacts.map((artifact) => (
                <div
                  key={artifact.id}
                  className="rounded-lg border border-zinc-800/50 px-3 py-2.5"
                >
                  <p className="text-[10px] font-semibold text-indigo-400 uppercase">
                    {artifact.type.replace('_', ' ')}
                  </p>
                  <p className="text-sm text-zinc-300 mt-0.5">{artifact.title}</p>
                  <p className="text-[11px] text-zinc-600 mt-0.5">
                    {new Date(artifact.created_at).toLocaleDateString('es-AR')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-600 py-4">
              Los artefactos se generan automaticamente durante las conversaciones.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
