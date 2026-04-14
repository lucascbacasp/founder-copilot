import { ChatInterface } from '@/components/chat/ChatInterface';
import type { Mode } from '@/components/chat/ModeSelector';

export default async function NewChatPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; journey?: string }>;
}) {
  const params = await searchParams;
  const validModes = ['diagnostico', 'financiero', 'pitch', 'qa', 'latam'];
  const mode = validModes.includes(params.mode || '') ? (params.mode as Mode) : undefined;
  const journeyStep = params.journey || undefined;

  return <ChatInterface initialMode={mode} journeyStep={journeyStep} />;
}
