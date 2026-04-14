import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { getGoogleOAuthClient } from '@/lib/integrations/google';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (error || !code || !state) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings?error=google_auth_failed`
    );
  }

  try {
    const { userId } = JSON.parse(Buffer.from(state, 'base64').toString());
    const client = getGoogleOAuthClient();
    const { tokens } = await client.getToken(code);

    const supabase = createServiceClient();

    await supabase.from('user_integrations').upsert(
      {
        user_id: userId,
        provider: 'google',
        access_token: tokens.access_token!,
        refresh_token: tokens.refresh_token || null,
        expires_at: tokens.expiry_date
          ? new Date(tokens.expiry_date).toISOString()
          : null,
        scope: tokens.scope || '',
        metadata: { token_type: tokens.token_type },
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,provider' }
    );

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings?success=google`
    );
  } catch (err) {
    console.error('Google OAuth callback error:', err);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings?error=google_token_failed`
    );
  }
}
