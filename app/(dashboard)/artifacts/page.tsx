import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function ArtifactsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: artifacts } = await supabase
    .from('artifacts')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false });

  const typeLabels: Record<string, string> = {
    bmc: 'Business Model Canvas',
    scorecard: 'Scorecard de Inversibilidad',
    financial_model: 'Modelo Financiero',
    experiment_roadmap: 'Roadmap de Experimentos',
    competitor_map: 'Mapa de Competidores',
    pitch_outline: 'Outline de Pitch',
    funding_map: 'Mapa de Oportunidades',
    adapted_pitch: 'Pitch Adaptado',
    investor_deck: 'Deck para Inversores',
    challenge_scorecard: 'Challenge Scorecard',
  };

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold text-white mb-6">Artefactos</h1>

      {artifacts && artifacts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {artifacts.map((artifact) => (
            <Link
              key={artifact.id}
              href={`/artifacts/${artifact.id}`}
              className="rounded-xl border border-zinc-800 p-5 hover:bg-zinc-800/50 hover:border-zinc-700 transition-colors cursor-pointer block"
            >
              <p className="text-xs font-medium text-indigo-400 uppercase">
                {typeLabels[artifact.type] || artifact.type}
              </p>
              <p className="text-sm font-medium text-white mt-2">{artifact.title}</p>
              <p className="text-xs text-zinc-500 mt-3">
                {new Date(artifact.created_at).toLocaleDateString('es-AR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-zinc-500">No hay artefactos todavia.</p>
          <p className="text-zinc-600 text-sm mt-1">
            El agente genera artefactos automaticamente durante las conversaciones.
          </p>
        </div>
      )}
    </div>
  );
}
