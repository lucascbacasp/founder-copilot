import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { IntegrationsPanel } from '@/components/settings/IntegrationsPanel';
import { MemoryPanel } from '@/components/settings/MemoryPanel';

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
    traccion: 'Tracción',
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
    <div className="p-6 md:p-8 max-w-2xl">
      <h1 className="text-xl font-bold text-white mb-6">Configuración</h1>

      {/* Profile section */}
      <section className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">Perfil de la startup</h2>
          <Link
            href="/onboarding"
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {profile ? 'Editar' : 'Completar'}
          </Link>
        </div>

        {profile ? (
          <div className="rounded-xl border border-zinc-800 p-5 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] text-zinc-500 uppercase tracking-wide">Startup</p>
                <p className="text-sm text-white mt-0.5">{profile.company_name}</p>
              </div>
              <div>
                <p className="text-[11px] text-zinc-500 uppercase tracking-wide">Etapa</p>
                <p className="text-sm text-white mt-0.5">{stageLabels[profile.stage] || profile.stage}</p>
              </div>
              <div>
                <p className="text-[11px] text-zinc-500 uppercase tracking-wide">Vertical</p>
                <p className="text-sm text-white mt-0.5">{verticalLabels[profile.vertical] || profile.vertical}</p>
              </div>
              <div>
                <p className="text-[11px] text-zinc-500 uppercase tracking-wide">País</p>
                <p className="text-sm text-white mt-0.5">{profile.country}</p>
              </div>
              {(profile.mrr > 0 || profile.active_customers > 0) && (
                <>
                  <div>
                    <p className="text-[11px] text-zinc-500 uppercase tracking-wide">MRR</p>
                    <p className="text-sm text-white mt-0.5">${profile.mrr || 0}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-zinc-500 uppercase tracking-wide">Clientes activos</p>
                    <p className="text-sm text-white mt-0.5">{profile.active_customers || 0}</p>
                  </div>
                </>
              )}
            </div>
            {profile.description && (
              <div className="pt-3 border-t border-zinc-800">
                <p className="text-[11px] text-zinc-500 uppercase tracking-wide">Descripción</p>
                <p className="text-sm text-zinc-300 mt-0.5">{profile.description}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
            <p className="text-sm text-amber-400">
              Completá tu perfil para que el copiloto te dé análisis personalizados.
            </p>
            <Link
              href="/onboarding"
              className="inline-block mt-3 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Completar perfil &rarr;
            </Link>
          </div>
        )}
      </section>

      {/* Memory section — renamed */}
      <section className="space-y-4 mb-8">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
          Lo que el copiloto sabe de tu startup
        </h2>
        <p className="text-xs text-zinc-500">
          Información que el agente guardó de tus conversaciones. Podés eliminar cualquier item.
        </p>
        <MemoryPanel memories={memories || []} />
      </section>

      {/* Integrations section */}
      <section className="space-y-4 mb-8">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">Integraciones</h2>
        <p className="text-xs text-zinc-500">
          Conectá tus herramientas para exportar artefactos directamente desde el chat.
        </p>
        <IntegrationsPanel />
      </section>

      {/* Account section */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">Cuenta</h2>
        <div className="rounded-xl border border-zinc-800 p-5 space-y-3">
          <div>
            <p className="text-[11px] text-zinc-500 uppercase tracking-wide">Email</p>
            <p className="text-sm text-white mt-0.5">{user?.email}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
