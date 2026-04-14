import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { loadFounderContext } from '@/lib/agent/context';
import { runAgentLoop } from '@/lib/agent/loop';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await req.json();
  const { message, conversationId, mode } = body;

  if (!message || !conversationId || !mode) {
    return new Response('Missing required fields', { status: 400 });
  }

  // Load full founder context
  const context = await loadFounderContext(supabase, user.id, conversationId, mode);

  // Save user message to DB
  await supabase.from('messages').insert({
    conversation_id: conversationId,
    role: 'user',
    content: message,
  });

  // Stream agent response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      let fullResponse = '';

      try {
        for await (const event of runAgentLoop(message, context)) {
          // Accumulate text for DB save
          if (event.type === 'text' && event.content) {
            fullResponse += event.content;
          }

          // Send each event as SSE
          const data = `data: ${JSON.stringify(event)}\n\n`;
          controller.enqueue(encoder.encode(data));
        }

        // Save full assistant response to DB
        if (fullResponse) {
          await supabase.from('messages').insert({
            conversation_id: conversationId,
            role: 'assistant',
            content: fullResponse,
          });
        }

        // Update conversation timestamp
        await supabase
          .from('conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', conversationId);
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error';
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'error', content: errMsg })}\n\n`)
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
