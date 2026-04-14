import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface SearchFundingInput {
  startup_description: string;
  vertical: string;
  stage: string;
  country: string;
  funding_types?: string[];
}

export async function executeSearchFunding(input: SearchFundingInput): Promise<string> {
  const types = input.funding_types?.length
    ? input.funding_types.join(', ')
    : 'hackathons, grants, aceleradoras, angel investors, competencias, fondos VC early-stage';

  try {
    // Run multiple targeted searches in parallel
    const searches = [
      searchFundingBatch(
        `hackathons startups ${input.vertical} ${input.country} 2025 2026 aplicar convocatoria abierta`,
        'hackathons y competencias'
      ),
      searchFundingBatch(
        `grants financiamiento no dilutivo startups ${input.vertical} ${input.country} LATAM 2025 convocatoria`,
        'grants y fondos no dilutivos'
      ),
      searchFundingBatch(
        `aceleradoras programas startups ${input.stage} ${input.vertical} ${input.country} Latinoamerica aplicar`,
        'aceleradoras y programas'
      ),
    ];

    const results = await Promise.all(searches);

    const combinedResults = `## BUSQUEDA DE OPORTUNIDADES DE FINANCIAMIENTO

**Startup:** ${input.startup_description}
**Vertical:** ${input.vertical} | **Etapa:** ${input.stage} | **Pais:** ${input.country}
**Tipos buscados:** ${types}

---

### HACKATHONS Y COMPETENCIAS
${results[0]}

### GRANTS Y FONDOS NO DILUTIVOS
${results[1]}

### ACELERADORAS Y PROGRAMAS
${results[2]}

---
Usa esta informacion para generar un funding_map estructurado con gen_artifact.`;

    return combinedResults;
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    return `Error buscando oportunidades de financiamiento: ${msg}`;
  }
}

async function searchFundingBatch(query: string, label: string): Promise<string> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      tools: [{ type: 'web_search_20250305' as const, name: 'web_search', max_uses: 5 }],
      messages: [
        {
          role: 'user',
          content: `Busca ${label} con la siguiente consulta: ${query}

Para cada oportunidad encontrada, incluye:
- Nombre del programa/hackathon/grant
- Organizador
- Monto o premio (si se menciona)
- Deadline o fecha (si se menciona)
- URL o como aplicar
- Requisitos principales
- Region/paises elegibles

Prioriza oportunidades con convocatorias abiertas o proximas. Incluye tanto oportunidades especificas del pais como regionales (LATAM) y globales relevantes.`,
        },
      ],
    });

    const textBlocks = response.content.filter(
      (b): b is Anthropic.TextBlock => b.type === 'text'
    );
    return textBlocks.map((b) => b.text).join('\n') || 'Sin resultados.';
  } catch {
    return `No se pudieron buscar ${label}.`;
  }
}
