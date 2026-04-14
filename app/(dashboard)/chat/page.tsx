import { ChatInterface } from '@/components/chat/ChatInterface';
import { createClient } from '@/lib/supabase/server';
import type { Mode } from '@/components/chat/ModeSelector';

const JOURNEY_ORDER = ['diagnostico', 'financiero', 'pitch', 'qa', 'latam', 'challenge'];

export default async function NewChatPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; journey?: string }>;
}) {
  const params = await searchParams;
  const validModes = ['diagnostico', 'financiero', 'pitch', 'qa', 'latam', 'challenge'];
  const mode = validModes.includes(params.mode || '') ? (params.mode as Mode) : undefined;
  const journeyStep = params.journey || undefined;

  // Load completed modes for the selector
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let completedModes: string[] = [];
  let recommendedMode: string | null = null;

  if (user) {
    const { data: conversations } = await supabase
      .from('conversations')
      .select('mode')
      .eq('user_id', user.id);

    completedModes = Array.from(new Set((conversations || []).map((c) => c.mode)));

    const { data: profile } = await supabase
      .from('founder_profiles')
      .select('journey_progress')
      .eq('user_id', user.id)
      .single();

    const progress = profile?.journey_progress || { completed: [], skipped: [] };
    const completedSet = new Set([
      ...(progress.completed || []),
      ...completedModes,
    ]);
    const skippedSet = new Set(progress.skipped || []);

    const next = JOURNEY_ORDER.find(
      (s) => !completedSet.has(s) && !skippedSet.has(s)
    );
    recommendedMode = next || null;
  }

  return (
    <ChatInterface
      initialMode={mode}
      journeyStep={journeyStep}
      completedModes={completedModes}
      recommendedMode={recommendedMode}
    />
  );
}
