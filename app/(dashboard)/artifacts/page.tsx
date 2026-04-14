import { createClient } from '@/lib/supabase/server';
import { ARTIFACT_TYPE_COLORS } from '@/lib/constants/artifact-types';
import { ArtifactsPageClient } from '@/components/artifacts/ArtifactsPageClient';

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
    <ArtifactsPageClient
      artifacts={artifacts || []}
      typeCounts={typeCounts}
      typeColors={ARTIFACT_TYPE_COLORS}
    />
  );
}
