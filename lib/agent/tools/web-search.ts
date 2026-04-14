import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface WebSearchInput {
  query: string;
  focus: string;
  region?: string;
}

export async function executeWebSearch(input: WebSearchInput): Promise<string> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      tools: [{ type: 'web_search_20250305' as const, name: 'web_search', max_uses: 3 }],
      messages: [
        {
          role: 'user',
          content: `Busca informacion sobre: ${input.query}
Enfoque: ${input.focus}
Region: ${input.region || 'latam'}

Devuelve un resumen estructurado con:
1. Datos clave encontrados
2. Competidores identificados (si aplica)
3. Tamaño de mercado o traccion (si aplica)
4. Fuentes principales`,
        },
      ],
    });

    // Extract text from response, ignoring tool_use blocks
    const textBlocks = response.content.filter(
      (b): b is Anthropic.TextBlock => b.type === 'text'
    );
    return textBlocks.map((b) => b.text).join('\n') || 'Sin resultados relevantes.';
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    return `Error en busqueda: ${msg}`;
  }
}
