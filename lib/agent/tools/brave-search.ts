const BRAVE_API_KEY = process.env.BRAVE_SEARCH_API_KEY;
const BRAVE_SEARCH_URL = 'https://api.search.brave.com/res/v1/web/search';

export interface BraveSearchResult {
  title: string;
  url: string;
  description: string;
}

export async function braveSearch(
  query: string,
  count: number = 5,
  country?: string
): Promise<BraveSearchResult[]> {
  if (!BRAVE_API_KEY) {
    throw new Error('BRAVE_SEARCH_API_KEY not configured');
  }

  const params = new URLSearchParams({
    q: query,
    count: String(count),
    text_decorations: 'false',
    search_lang: 'es',
  });

  if (country) {
    params.set('country', country);
  }

  const response = await fetch(`${BRAVE_SEARCH_URL}?${params}`, {
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip',
      'X-Subscription-Token': BRAVE_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Brave Search error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const results: BraveSearchResult[] = (data.web?.results || []).map(
    (r: { title: string; url: string; description: string }) => ({
      title: r.title,
      url: r.url,
      description: r.description,
    })
  );

  return results;
}

export function formatResults(results: BraveSearchResult[]): string {
  if (results.length === 0) return 'Sin resultados.';

  return results
    .map((r, i) => `${i + 1}. **${r.title}**\n   ${r.description}\n   Fuente: ${r.url}`)
    .join('\n\n');
}
