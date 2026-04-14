import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { exchangeNotionCode } from '@/lib/integrations/notion';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (error || !code || !state) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings?error=notion_auth_failed`
    );
  }

  try {
    const { userId } = JSON.parse(Buffer.from(state, 'base64').toString());
    const tokenData = await exchangeNotionCode(code);

    const supabase = createServiceClient();

    await supabase.from('user_integrations').upsert(
      {
        user_id: userId,
        provider: 'notion',
        access_token: tokenData.access_token,
        refresh_token: null,
        expires_at: null,
        scope: 'read_write',
        metadata: {
          workspace_id: tokenData.workspace_id,
          workspace_name: tokenData.workspace_name,
          bot_id: tokenData.bot_id,
        },
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,provider' }
    );

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings?success=notion`
    );
  } catch (err) {
    console.error('Notion OAuth callback error:', err);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings?error=notion_token_failed`
    );
  }
}
