import { createClient } from '@/lib/supabase/server';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { redirect } from 'next/navigation';
import type { Mode } from '@/components/chat/ModeSelector';

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: conversation } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', id)
    .single();

  if (!conversation) redirect('/chat');

  // Load messages and artifacts in parallel
  const [{ data: messages }, { data: artifacts }] = await Promise.all([
    supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true }),
    supabase
      .from('artifacts')
      .select('id, type, title, content, created_at')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true }),
  ]);

  // Build interleaved items: messages + artifact cards inserted at their creation time
  type ChatItem =
    | { role: 'user' | 'assistant'; content: string }
    | { type: 'artifact'; artifactId: string; artifactType: string; title: string; content: Record<string, unknown> };

  const items: ChatItem[] = [];
  const artifactQueue = [...(artifacts || [])];

  for (const m of messages || []) {
    if (m.role !== 'user' && m.role !== 'assistant') continue;

    // Insert any artifacts created before this message
    while (artifactQueue.length > 0 && artifactQueue[0].created_at <= m.created_at) {
      const a = artifactQueue.shift()!;
      items.push({
        type: 'artifact',
        artifactId: a.id,
        artifactType: a.type,
        title: a.title,
        content: a.content as Record<string, unknown>,
      });
    }

    items.push({
      role: m.role as 'user' | 'assistant',
      content: typeof m.content === 'string' ? m.content : (m.content as { text?: string })?.text || JSON.stringify(m.content),
    });
  }

  // Any remaining artifacts after last message
  for (const a of artifactQueue) {
    items.push({
      type: 'artifact',
      artifactId: a.id,
      artifactType: a.type,
      title: a.title,
      content: a.content as Record<string, unknown>,
    });
  }

  return (
    <ChatInterface
      conversationId={id}
      initialMode={conversation.mode as Mode}
      initialItems={items}
    />
  );
}
