import { braveSearch, formatResults } from './brave-search';

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
    // Run 3 targeted Brave searches in parallel (~1s total vs ~30s before)
    const [hackathons, grants, accelerators] = await Promise.all([
      searchBatch(
        `hackathons startups ${input.vertical} ${input.country} 2025 2026 convocatoria abierta`,
        'hackathons y competencias'
      ),
      searchBatch(
        `grants financiamiento no dilutivo startups ${input.vertical} ${input.country} LATAM 2025`,
        'grants y fondos no dilutivos'
      ),
      searchBatch(
        `aceleradoras programas startups ${input.stage} ${input.vertical} ${input.country} Latinoamerica aplicar`,
        'aceleradoras y programas'
      ),
    ]);

    return `## BÚSQUEDA DE OPORTUNIDADES DE FINANCIAMIENTO

**Startup:** ${input.startup_description}
**Vertical:** ${input.vertical} | **Etapa:** ${input.stage} | **País:** ${input.country}
**Tipos buscados:** ${types}

---

### HACKATHONS Y COMPETENCIAS
${hackathons}

### GRANTS Y FONDOS NO DILUTIVOS
${grants}

### ACELERADORAS Y PROGRAMAS
${accelerators}

---
Usa esta información para generar un funding_map estructurado con gen_artifact.`;
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    return `Error buscando oportunidades de financiamiento: ${msg}`;
  }
}

async function searchBatch(query: string, label: string): Promise<string> {
  try {
    const results = await braveSearch(query, 8);
    return formatResults(results);
  } catch {
    return `No se pudieron buscar ${label}.`;
  }
}
