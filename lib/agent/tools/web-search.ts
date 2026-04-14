import { braveSearch, formatResults } from './brave-search';

export interface WebSearchInput {
  query: string;
  focus: string;
  region?: string;
}

const REGION_COUNTRY: Record<string, string> = {
  argentina: 'AR',
  mexico: 'MX',
  colombia: 'CO',
  brasil: 'BR',
  chile: 'CL',
};

export async function executeWebSearch(input: WebSearchInput): Promise<string> {
  try {
    const regionSuffix = input.region && input.region !== 'global'
      ? ` ${input.region}`
      : '';
    const query = `${input.query} ${input.focus}${regionSuffix}`;
    const country = input.region ? REGION_COUNTRY[input.region] : undefined;

    const results = await braveSearch(query, 8, country);
    const formatted = formatResults(results);

    return `## Resultados de búsqueda: ${input.query}
**Enfoque:** ${input.focus} | **Región:** ${input.region || 'global'}

${formatted}`;
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    return `Error en búsqueda: ${msg}`;
  }
}
