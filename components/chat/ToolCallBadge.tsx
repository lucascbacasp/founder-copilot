'use client';

import clsx from 'clsx';

const TOOL_INFO: Record<string, { label: string; color: string; activeLabel: string }> = {
  web_search: {
    label: 'Búsqueda web',
    activeLabel: 'Buscando información...',
    color: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  },
  gen_artifact: {
    label: 'Artefacto generado',
    activeLabel: 'Generando artefacto...',
    color: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  },
  save_memory: {
    label: 'Memoria guardada',
    activeLabel: 'Guardando en memoria...',
    color: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  },
  push_apps: {
    label: 'Enviado a app',
    activeLabel: 'Enviando a app...',
    color: 'bg-green-500/15 text-green-400 border-green-500/30',
  },
  search_funding: {
    label: 'Oportunidades encontradas',
    activeLabel: 'Buscando hackathons, grants y fondeo...',
    color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  },
};

interface ToolCallBadgeProps {
  toolName: string;
  active?: boolean;
}

export function ToolCallBadge({ toolName, active = false }: ToolCallBadgeProps) {
  const info = TOOL_INFO[toolName] || {
    label: toolName,
    activeLabel: `${toolName}...`,
    color: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
  };

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
        info.color
      )}
    >
      {active && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      {active ? info.activeLabel : info.label}
    </div>
  );
}
