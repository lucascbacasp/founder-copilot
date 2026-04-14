'use client';

import clsx from 'clsx';
import { useI18n } from '@/lib/i18n';

const TOOL_COLORS: Record<string, string> = {
  web_search: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  gen_artifact: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  save_memory: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  push_apps: 'bg-green-500/15 text-green-400 border-green-500/30',
  search_funding: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
};

interface ToolCallBadgeProps {
  toolName: string;
  active?: boolean;
}

export function ToolCallBadge({ toolName, active = false }: ToolCallBadgeProps) {
  const { t } = useI18n();
  const toolT = t.chat.tools[toolName as keyof typeof t.chat.tools];
  const label = toolT?.label || toolName;
  const activeLabel = toolT?.active || `${toolName}...`;
  const color = TOOL_COLORS[toolName] || 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30';

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
        color
      )}
    >
      {active && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      {active ? activeLabel : label}
    </div>
  );
}
