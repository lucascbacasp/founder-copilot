'use client';

import { useI18n } from '@/lib/i18n';
import { EmptyState } from '@/components/ui/EmptyState';
import { ArtifactFilters } from '@/components/artifacts/ArtifactFilters';

interface Artifact {
  id: string;
  type: string;
  title: string;
  content: Record<string, unknown>;
  created_at: string;
}

interface ArtifactsPageClientProps {
  artifacts: Artifact[];
  typeCounts: Record<string, number>;
  typeColors: Record<string, string>;
}

export function ArtifactsPageClient({ artifacts, typeCounts, typeColors }: ArtifactsPageClientProps) {
  const { t } = useI18n();

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">{t.artifactsPage.title}</h1>
          {artifacts.length > 0 && (
            <p className="text-xs text-zinc-500 mt-0.5">{artifacts.length} generados</p>
          )}
        </div>
      </div>

      {artifacts.length > 0 ? (
        <ArtifactFilters
          artifacts={artifacts}
          typeCounts={typeCounts}
          typeColors={typeColors}
        />
      ) : (
        <EmptyState
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          title={t.artifactsPage.empty.title}
          description={t.artifactsPage.empty.description}
          actionLabel={t.artifactsPage.empty.cta}
          actionHref="/chat?mode=diagnostico&journey=diagnostico"
        />
      )}
    </div>
  );
}
