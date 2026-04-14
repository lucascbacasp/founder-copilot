import Anthropic from '@anthropic-ai/sdk';
import { TOOL_DEFINITIONS } from './tool-definitions';
import { buildSystemPrompt, type AgentContext } from './system-prompts';
import { executeWebSearch, type WebSearchInput } from './tools/web-search';
import { executeGenArtifact, type GenArtifactInput, type GeneratedArtifact } from './tools/gen-artifact';
import { executeSaveMemory, type SaveMemoryInput } from './tools/save-memory';
import { executePushApps, type PushAppsInput } from './tools/push-apps';
import { executeSearchFunding, type SearchFundingInput } from './tools/search-funding';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface AgentStreamEvent {
  type: 'text' | 'tool_start' | 'tool_end' | 'artifact' | 'memory' | 'done' | 'error';
  content?: string;
  toolName?: string;
  toolInput?: Record<string, unknown>;
  toolResult?: string;
  artifact?: GeneratedArtifact;
  memoryKey?: string;
  memorySummary?: string;
}

export async function* runAgentLoop(
  userMessage: string,
  context: AgentContext
): AsyncGenerator<AgentStreamEvent> {
  const messages: Anthropic.MessageParam[] = [
    ...context.conversationHistory.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user', content: userMessage },
  ];

  let iterations = 0;
  const MAX_ITERATIONS = 10;

  while (iterations < MAX_ITERATIONS) {
    iterations++;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: buildSystemPrompt(context),
      tools: TOOL_DEFINITIONS,
      messages,
    });

    // Case 1: Claude finished — return text response
    if (response.stop_reason === 'end_turn') {
      const textBlocks = response.content.filter(
        (b): b is Anthropic.TextBlock => b.type === 'text'
      );
      const text = textBlocks.map((b) => b.text).join('');
      if (text) {
        yield { type: 'text', content: text };
      }
      yield { type: 'done' };

      messages.push({ role: 'assistant', content: response.content });
      break;
    }

    // Case 2: Claude wants to use tools
    if (response.stop_reason === 'tool_use') {
      // Emit any partial text
      const textBlocks = response.content.filter(
        (b): b is Anthropic.TextBlock => b.type === 'text'
      );
      const partialText = textBlocks.map((b) => b.text).join('');
      if (partialText) {
        yield { type: 'text', content: partialText };
      }

      // Add assistant turn to history
      messages.push({ role: 'assistant', content: response.content });

      // Execute all requested tools
      const toolResultBlocks: Anthropic.ToolResultBlockParam[] = [];

      const toolUseBlocks = response.content.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use'
      );

      for (const block of toolUseBlocks) {
        yield {
          type: 'tool_start',
          toolName: block.name,
          toolInput: block.input as Record<string, unknown>,
        };

        let result: string;
        let artifact: GeneratedArtifact | undefined;

        switch (block.name) {
          case 'web_search': {
            result = await executeWebSearch(block.input as WebSearchInput);
            break;
          }

          case 'gen_artifact': {
            const artifactResult = await executeGenArtifact(
              block.input as GenArtifactInput,
              context.userId,
              context.conversationId
            );
            result = artifactResult.summary;
            artifact = artifactResult.artifact;
            break;
          }

          case 'save_memory': {
            const memInput = block.input as SaveMemoryInput;
            result = await executeSaveMemory(memInput, context.userId, context.conversationId);
            yield {
              type: 'memory',
              memoryKey: memInput.key,
              memorySummary: memInput.summary,
            };
            break;
          }

          case 'search_funding': {
            result = await executeSearchFunding(block.input as SearchFundingInput);
            break;
          }

          case 'push_apps': {
            result = await executePushApps(block.input as PushAppsInput, context.userId);
            break;
          }

          default:
            result = `Herramienta desconocida: ${block.name}`;
        }

        yield { type: 'tool_end', toolName: block.name, toolResult: result };
        if (artifact) {
          yield { type: 'artifact', artifact };
        }

        toolResultBlocks.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: result,
        });
      }

      // Add tool results as user turn
      messages.push({ role: 'user', content: toolResultBlocks });
      // Continue loop — Claude will process results
    }
  }

  if (iterations >= MAX_ITERATIONS) {
    yield {
      type: 'text',
      content: '\n\n[Se alcanzo el limite de iteraciones del agente. Podes continuar la conversacion para seguir.]',
    };
    yield { type: 'done' };
  }
}
