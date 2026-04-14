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

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true });

  const chatMessages = (messages || [])
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: typeof m.content === 'string' ? m.content : (m.content as { text?: string })?.text || JSON.stringify(m.content),
    }));

  return (
    <ChatInterface
      conversationId={id}
      initialMode={conversation.mode as Mode}
      initialMessages={chatMessages}
    />
  );
}
