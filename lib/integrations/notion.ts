const NOTION_AUTH_URL = 'https://api.notion.com/v1/oauth/authorize';
const NOTION_TOKEN_URL = 'https://api.notion.com/v1/oauth/token';

export function getNotionAuthUrl(state: string) {
  const params = new URLSearchParams({
    client_id: process.env.NOTION_CLIENT_ID || '',
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/notion/callback`,
    response_type: 'code',
    owner: 'user',
    state,
  });
  return `${NOTION_AUTH_URL}?${params.toString()}`;
}

export async function exchangeNotionCode(code: string) {
  const credentials = Buffer.from(
    `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`
  ).toString('base64');

  const res = await fetch(NOTION_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${credentials}`,
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/notion/callback`,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Notion token exchange failed: ${err}`);
  }

  return res.json() as Promise<{
    access_token: string;
    workspace_id: string;
    workspace_name: string;
    bot_id: string;
  }>;
}
