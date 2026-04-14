import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { IntegrationsPanel } from '@/components/settings/IntegrationsPanel';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('founder_profiles')
    .select('*')
    .eq('user_id', user!.id)
    .single();

  const { data: memories } = await supabase
    .from('founder_memory')
    .select('*')
    .eq('user_id', user!.id)
    .order('updated_at', { ascending: false });

  const stageLabels: Record<string, string> = {
    idea: 'Idea',
    prototipo: 'Prototipo',
    mvp: 'MVP',
    traccion: 'Traccion',
    revenue: 'Revenue',
  };

  const verticalLabels: Record<string, string> = {
    saas: 'SaaS',
    fintech: 'Fintech',
    marketplace: 'Marketplace',
    consumer: 'Consumer',
    deeptech: 'Deep Tech',
    otro: 'Otro',
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-6">Configuración</h1>

      {/* Profile section */}
      <section className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Perfil de la startup</h2>
          <Link
            href="/onboarding"
            className="text-sm text-indigo-400 hover:text-indigo-300"
          >
            {profile ? 'Editar' : 'Completar'}
          </Link>
        </div>

        {profile ? (
          <div className="rounded-xl border border-zinc-800 p-5 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-zinc-500">Startup</p>
                <p className="text-sm text-white">{profile.company_name}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Etapa</p>
                <p className="text-sm text-white">{stageLabels[profile.stage] || profile.stage}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Vertical</p>
                <p className="text-sm text-white">{verticalLabels[profile.vertical] || profile.vertical}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Pais</p>
                <p className="text-sm text-white">{profile.country}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">MRR</p>
                <p className="text-sm text-white">${profile.mrr || 0}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Clientes activos</p>
                <p className="text-sm text-white">{profile.active_customers || 0}</p>
              </div>
            </div>
            {profile.description && (
              <div>
                <p className="text-xs text-zinc-500">Descripcion</p>
                <p className="text-sm text-white">{profile.description}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
            <p className="text-sm text-amber-400">
              Completa tu perfil para que el copiloto te de analisis mas relevantes.
            </p>
            <Link
              href="/onboarding"
              className="inline-block mt-3 text-sm font-medium text-indigo-400 hover:text-indigo-300"
            >
              Completar perfil →
            </Link>
          </div>
        )}
      </section>

      {/* Memory section */}
      <section className="space-y-4 mb-8">
        <h2 className="text-lg font-semibold text-white">Memoria del agente</h2>
        <p className="text-sm text-zinc-500">
          Informacion que el agente guardo de tus conversaciones anteriores
        </p>

        {memories && memories.length > 0 ? (
          <div className="space-y-2">
            {memories.map((mem) => (
              <div
                key={mem.id}
                className="rounded-lg border border-zinc-800 p-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                    {mem.category}
                  </span>
                  <span className="text-xs text-zinc-600">{mem.key}</span>
                </div>
                <p className="text-sm text-zinc-300">{mem.summary}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-600">
            El agente aun no guardo nada en memoria. Esto se llena automaticamente durante las conversaciones.
          </p>
        )}
      </section>

      {/* Integrations section */}
      <section className="space-y-4 mb-8">
        <h2 className="text-lg font-semibold text-white">Integraciones</h2>
        <p className="text-sm text-zinc-500">
          Conecta tus herramientas para exportar artefactos directamente desde el chat
        </p>
        <IntegrationsPanel />
      </section>

      {/* Account section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Cuenta</h2>
        <div className="rounded-xl border border-zinc-800 p-5">
          <p className="text-xs text-zinc-500">Email</p>
          <p className="text-sm text-white">{user?.email}</p>
        </div>
      </section>
    </div>
  );
}
