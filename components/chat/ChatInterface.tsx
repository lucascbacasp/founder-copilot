'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { ModeSelector, type Mode } from './ModeSelector';
import { ToolCallBadge } from './ToolCallBadge';
import { ArtifactCard } from './ArtifactCard';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ToolEvent {
  type: 'tool';
  toolName: string;
  active: boolean;
}

interface ArtifactEvent {
  type: 'artifact';
  artifactId?: string;
  artifactType: string;
  title: string;
  content: Record<string, unknown>;
}

interface MemoryEvent {
  type: 'memory';
  key: string;
  summary: string;
}

type ChatItem = ChatMessage | ToolEvent | ArtifactEvent | MemoryEvent;

interface ChatInterfaceProps {
  conversationId?: string;
  initialMode?: Mode;
  initialMessages?: ChatMessage[];
  initialItems?: ChatItem[];
  journeyStep?: string;
  completedModes?: string[];
  recommendedMode?: string | null;
}

export function ChatInterface({ conversationId, initialMode, initialMessages = [], initialItems, journeyStep, completedModes = [], recommendedMode }: ChatInterfaceProps) {
  const [mode, setMode] = useState<Mode | null>(initialMode || null);
  const [items, setItems] = useState<ChatItem[]>(initialItems || initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(conversationId || null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [items]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !mode || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setItems((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      let convId = currentConversationId;
      if (!convId) {
        const createRes = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode, title: userMessage.slice(0, 100) }),
        });
        const { id } = await createRes.json();
        convId = id;
        setCurrentConversationId(id);
        window.history.replaceState(null, '', `/chat/${id}`);

        // Mark journey step as completed if coming from journey
        if (journeyStep) {
          fetch('/api/journey', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'complete', step: journeyStep }),
          }).catch(() => {});
        }
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, conversationId: convId, mode }),
      });

      if (!res.ok) throw new Error('Error en la respuesta');

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No reader');

      const decoder = new TextDecoder();
      let assistantContent = '';
      let hasAssistantMessage = false;
      let sseBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        sseBuffer += decoder.decode(value, { stream: true });
        const lines = sseBuffer.split('\n');
        // Keep the last (potentially incomplete) line in the buffer
        sseBuffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (!data) continue;

          try {
            const event = JSON.parse(data);

            switch (event.type) {
              case 'text': {
                if (event.content) {
                  assistantContent += event.content;
                  const snapshot = assistantContent;
                  if (!hasAssistantMessage) {
                    hasAssistantMessage = true;
                    setItems((prev) => [...prev, { role: 'assistant', content: snapshot }]);
                  } else {
                    setItems((prev) => {
                      const updated = [...prev];
                      for (let i = updated.length - 1; i >= 0; i--) {
                        if ('role' in updated[i] && (updated[i] as ChatMessage).role === 'assistant') {
                          updated[i] = { role: 'assistant', content: snapshot };
                          break;
                        }
                      }
                      return updated;
                    });
                  }
                }
                break;
              }

              case 'tool_end': {
                setItems((prev) =>
                  prev.map((item) =>
                    'type' in item &&
                    item.type === 'tool' &&
                    item.toolName === event.toolName &&
                    item.active
                      ? { ...item, active: false }
                      : item
                  )
                );
                break;
              }

              case 'artifact': {
                if (event.artifact) {
                  setItems((prev) => [
                    ...prev,
                    {
                      type: 'artifact',
                      artifactType: event.artifact.type,
                      title: event.artifact.title,
                      content: event.artifact.content,
                    },
                  ]);
                }
                break;
              }

              case 'memory': {
                setItems((prev) => [
                  ...prev,
                  {
                    type: 'memory',
                    key: event.memoryKey || '',
                    summary: event.memorySummary || '',
                  },
                ]);
                break;
              }

              case 'tool_start': // handled below but reset text state
              case 'done': {
                if (event.type === 'done') {
                  // Reset for next potential text block
                  hasAssistantMessage = false;
                  assistantContent = '';
                  break;
                }
                // For tool_start, reset text accumulator so post-tool text
                // creates a new assistant message below the tool badges
                hasAssistantMessage = false;
                assistantContent = '';
                setItems((prev) => [
                  ...prev,
                  { type: 'tool', toolName: event.toolName, active: true },
                ]);
                break;
              }
            }
          } catch {
            // Skip malformed SSE lines
          }
        }
      }
    } catch {
      setItems((prev) => [
        ...prev,
        { role: 'assistant', content: 'Error: no se pudo conectar con el agente. Intenta de nuevo.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  if (!mode) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 md:p-8">
        {journeyStep && (
          <div className="mb-4 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            <p className="text-xs text-indigo-400 font-medium">Paso del journey: {journeyStep.charAt(0).toUpperCase() + journeyStep.slice(1)}</p>
          </div>
        )}
        <h2 className="text-xl font-bold text-white mb-2">Elegí un modo</h2>
        <p className="text-sm text-zinc-400 mb-6">Cada modo adapta al agente para un objetivo distinto</p>
        <ModeSelector
          selected={mode}
          onSelect={setMode}
          completedModes={completedModes}
          recommendedMode={recommendedMode}
        />
        <div className="mt-5 flex items-center gap-2 text-zinc-500">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs">
            Seguí el <a href="/" className="text-indigo-400 hover:text-indigo-300 underline">camino del dashboard</a> para el orden recomendado
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-zinc-500 text-sm">
              Conta tu idea y el copiloto te va a ayudar a validarla.
            </p>
          </div>
        )}

        {items.map((item, i) => {
          // Regular message
          if ('role' in item) {
            return <MessageBubble key={i} role={item.role} content={item.content} />;
          }

          // Tool call badge
          if (item.type === 'tool') {
            return (
              <div key={i} className="flex justify-start">
                <ToolCallBadge toolName={item.toolName} active={item.active} />
              </div>
            );
          }

          // Artifact card
          if (item.type === 'artifact') {
            return (
              <div key={i} className="flex justify-start">
                <ArtifactCard type={item.artifactType} title={item.title} content={item.content} artifactId={item.artifactId} />
              </div>
            );
          }

          // Memory saved indicator
          if (item.type === 'memory') {
            return (
              <div key={i} className="flex justify-start">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Guardado: {item.summary}
                </div>
              </div>
            );
          }

          return null;
        })}

        {isLoading && !items.some((item) => 'type' in item && item.type === 'tool' && item.active) && items[items.length - 1] && !('role' in items[items.length - 1] && (items[items.length - 1] as ChatMessage).role === 'assistant') && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-zinc-800 p-4">
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe tu idea, pregunta o pedile algo al agente..."
            className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
