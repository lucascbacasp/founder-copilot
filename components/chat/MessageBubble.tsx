'use client';

import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  return (
    <div
      className={clsx(
        'flex',
        role === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={clsx(
          'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
          role === 'user'
            ? 'bg-indigo-600 text-white'
            : 'bg-zinc-800 text-zinc-100'
        )}
      >
        {role === 'user' ? (
          <div className="whitespace-pre-wrap">{content}</div>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none prose-p:my-1.5 prose-li:my-0.5 prose-headings:mt-3 prose-headings:mb-1.5 prose-ul:my-1.5 prose-ol:my-1.5 prose-strong:text-white prose-a:text-indigo-400">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
