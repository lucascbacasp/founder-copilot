'use client';

import { useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

interface Artifact {
  id: string;
  type: string;
  title: string;
  content: Record<string, unknown>;
  created_at: string;
}

interface ArtifactFiltersProps {
  artifacts: Artifact[];
  typeCounts: Record<string, number>;
  typeLabels: Record<string, string>;
  typeColors: Record<string, string>;
}

function getMiniKPI(artifact: Artifact): string | null {
  const c = artifact.content;
  switch (artifact.type) {
    case 'scorecard':
      return c.overall_score !== undefined ? `${c.overall_score}/10` : null;
    case 'challenge_scorecard':
      return c.overall_score !== undefined ? `${c.overall_score}/5` : null;
    case 'financial_model':
      return (c.year1 as Record<string, unknown>)?.revenue !== undefined
        ? `$${Number((c.year1 as Record<string, unknown>).revenue).toLocaleString()} Y1`
        : null;
    case 'pitch_outline':
    case 'adapted_pitch':
    case 'investor_deck':
      return Array.isArray(c.slides) ? `${c.slides.length} slides` : null;
    case 'funding_map':
      return Array.isArray(c.opportunities) ? `${c.opportunities.length} oportunidades` : null;
    case 'experiment_roadmap':
      return Array.isArray(c.experiments) ? `${c.experiments.length} experimentos` : null;
    case 'competitor_map':
      return Array.isArray(c.competitors) ? `${c.competitors.length} competidores` : null;
    default:
      return null;
  }
}

export function ArtifactFilters({ artifacts, typeCounts, typeLabels, typeColors }: ArtifactFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const uniqueTypes = Object.keys(typeCounts).sort();
  const filteredArtifacts = activeFilter === 'all'
    ? artifacts
    : artifacts.filter((a) => a.type === activeFilter);

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveFilter('all')}
          className={clsx(
            'text-xs px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap',
            activeFilter === 'all'
              ? 'bg-zinc-700 text-white'
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
          )}
        >
          Todos ({artifacts.length})
        </button>
        {uniqueTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActiveFilter(type)}
            className={clsx(
              'text-xs px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap',
              activeFilter === type
                ? 'bg-zinc-700 text-white'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
            )}
          >
            {typeLabels[type] || type} ({typeCounts[type]})
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredArtifacts.map((artifact) => {
          const kpi = getMiniKPI(artifact);
          return (
            <Link
              key={artifact.id}
              href={`/artifacts/${artifact.id}`}
              className="rounded-xl border border-zinc-800 p-4 hover:bg-zinc-800/50 hover:border-zinc-700 transition-colors block group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={clsx(
                  'text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full',
                  typeColors[artifact.type] || 'bg-zinc-700 text-zinc-400'
                )}>
                  {typeLabels[artifact.type] || artifact.type}
                </span>
                {kpi && (
                  <span className="text-xs font-semibold text-zinc-300">{kpi}</span>
                )}
              </div>
              <p className="text-sm font-medium text-white mt-1.5 group-hover:text-indigo-300 transition-colors">
                {artifact.title}
              </p>
              <p className="text-[11px] text-zinc-600 mt-2">
                {new Date(artifact.created_at).toLocaleDateString('es-AR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
