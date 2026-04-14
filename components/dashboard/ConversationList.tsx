'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { MODE_LABELS, MODE_COLORS } from '@/lib/constants/artifact-types';

interface Conversation {
  id: string;
  title: string | null;
  mode: string;
  updated_at: string;
}

const MODE_SHORT: Record<string, string> = {
  diagnostico: 'D',
  financiero: 'F',
  pitch: 'P',
  qa: 'Q',
  latam: 'L',
  challenge: 'C',
};

export function ConversationList({ conversations }: { conversations: Conversation[] }) {
  const pathname = usePathname();

  if (conversations.length === 0) return null;

  return (
    <div className="flex-1 overflow-y-auto border-t border-zinc-800">
      <p className="px-4 pt-3 pb-1 text-xs font-medium text-zinc-500 uppercase tracking-wider">
        Historial
      </p>
      <div className="p-2 space-y-0.5">
        {conversations.map((conv) => {
          const isActive = pathname === `/chat/${conv.id}`;
          return (
            <Link
              key={conv.id}
              href={`/chat/${conv.id}`}
              className={clsx(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300'
              )}
            >
              <span
                className={clsx(
                  'w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center shrink-0',
                  MODE_COLORS[conv.mode] || 'bg-zinc-700 text-zinc-400'
                )}
              >
                {MODE_SHORT[conv.mode] || '?'}
              </span>
              <span className="truncate">
                {conv.title || 'Sin título'}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
