import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ARTIFACT_TYPE_LABELS, ARTIFACT_TYPE_COLORS } from '@/lib/constants/artifact-types';
import { EmptyState } from '@/components/ui/EmptyState';
import { ArtifactFilters } from '@/components/artifacts/ArtifactFilters';

export default async function ArtifactsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: artifacts } = await supabase
    .from('artifacts')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false });

  // Group by type for filter counts
  const typeCounts: Record<string, number> = {};
  (artifacts || []).forEach((a) => {
    typeCounts[a.type] = (typeCounts[a.type] || 0) + 1;
  });

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Artefactos</h1>
          {artifacts && artifacts.length > 0 && (
            <p className="text-xs text-zinc-500 mt-0.5">{artifacts.length} generados</p>
          )}
        </div>
      </div>

      {artifacts && artifacts.length > 0 ? (
        <ArtifactFilters
          artifacts={artifacts}
          typeCounts={typeCounts}
          typeLabels={ARTIFACT_TYPE_LABELS}
          typeColors={ARTIFACT_TYPE_COLORS}
        />
      ) : (
        <EmptyState
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          title="Tus artefactos se generan en las conversaciones"
          description="Cada sesión crea deliverables reales: BMC completo, scorecard 1-10, modelo financiero, pitch deck y más."
          actionLabel="Empezar mi primer diagnóstico"
          actionHref="/chat?mode=diagnostico&journey=diagnostico"
        />
      )}
    </div>
  );
}
