import { createClient } from '@supabase/supabase-js';

export interface SaveMemoryInput {
  category: string;
  key: string;
  value: Record<string, unknown>;
  summary: string;
}

export async function executeSaveMemory(
  input: SaveMemoryInput,
  userId: string,
  conversationId?: string
): Promise<string> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase
    .from('founder_memory')
    .upsert(
      {
        user_id: userId,
        category: input.category,
        key: input.key,
        value: input.value,
        summary: input.summary,
        source_conversation_id: conversationId || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,category,key' }
    );

  if (error) {
    return `Error guardando en memoria: ${error.message}`;
  }

  return `Memoria guardada: [${input.category}] ${input.key} — ${input.summary}`;
}
