import type { SupabaseClient } from '@supabase/supabase-js';
import type { AgentContext, FounderProfile, MemoryEntry, Message } from './system-prompts';

export async function loadFounderContext(
  supabase: SupabaseClient,
  userId: string,
  conversationId: string,
  mode: AgentContext['mode']
): Promise<AgentContext> {
  // Load all context in parallel
  const [profileResult, memoryResult, historyResult] = await Promise.all([
    supabase
      .from('founder_profiles')
      .select('*')
      .eq('user_id', userId)
      .single(),
    supabase
      .from('founder_memory')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(50),
    supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(50),
  ]);

  const conversationHistory: Message[] = (historyResult.data || [])
    .filter((m: { role: string }) => m.role === 'user' || m.role === 'assistant')
    .map((m: { role: string; content: unknown }) => ({
      role: m.role as 'user' | 'assistant',
      content: typeof m.content === 'string'
        ? m.content
        : (m.content as { text?: string })?.text || JSON.stringify(m.content),
    }));

  return {
    userId,
    conversationId,
    mode,
    founderProfile: (profileResult.data as FounderProfile) || null,
    memory: (memoryResult.data || []) as MemoryEntry[],
    conversationHistory,
  };
}
