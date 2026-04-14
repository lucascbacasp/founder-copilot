'use client';

import { useState } from 'react';
import clsx from 'clsx';

interface Memory {
  id: string;
  category: string;
  key: string;
  value: Record<string, unknown>;
  summary: string;
  updated_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  hypothesis: 'Hipótesis',
  validation: 'Validación',
  metric: 'Métrica',
  competitor: 'Competidor',
  experiment: 'Experimento',
  decision: 'Decisión',
  milestone: 'Hito',
  risk: 'Riesgo',
};

const CATEGORY_COLORS: Record<string, string> = {
  hypothesis: 'bg-purple-500/15 text-purple-400',
  validation: 'bg-emerald-500/15 text-emerald-400',
  metric: 'bg-blue-500/15 text-blue-400',
  competitor: 'bg-orange-500/15 text-orange-400',
  experiment: 'bg-pink-500/15 text-pink-400',
  decision: 'bg-indigo-500/15 text-indigo-400',
  milestone: 'bg-green-500/15 text-green-400',
  risk: 'bg-red-500/15 text-red-400',
};

export function MemoryPanel({ memories: initialMemories }: { memories: Memory[] }) {
  const [memories, setMemories] = useState(initialMemories);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(memoryId: string) {
    setDeleting(memoryId);
    try {
      const res = await fetch(`/api/memory?id=${memoryId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMemories((prev) => prev.filter((m) => m.id !== memoryId));
      }
    } finally {
      setDeleting(null);
    }
  }

  if (memories.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 p-5">
        <p className="text-sm text-zinc-500">
          El copiloto todavía no guardó información. Se llena automáticamente durante las conversaciones.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {memories.map((mem) => (
        <div
          key={mem.id}
          className="rounded-lg border border-zinc-800 p-3 group hover:border-zinc-700 transition-colors"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className={clsx(
                  'text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full',
                  CATEGORY_COLORS[mem.category] || 'bg-zinc-700 text-zinc-400'
                )}>
                  {CATEGORY_LABELS[mem.category] || mem.category}
                </span>
                <span className="text-[10px] text-zinc-600">
                  {new Date(mem.updated_at).toLocaleDateString('es-AR')}
                </span>
              </div>
              <p className="text-sm text-zinc-300">{mem.summary}</p>
            </div>
            <button
              onClick={() => handleDelete(mem.id)}
              disabled={deleting === mem.id}
              className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all p-1"
              title="Eliminar"
            >
              {deleting === mem.id ? (
                <span className="text-xs text-zinc-500">...</span>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
