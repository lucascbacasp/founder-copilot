import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getGoogleAuthUrl } from '@/lib/integrations/google';
import { getNotionAuthUrl } from '@/lib/integrations/notion';

// GET /api/integrations — list connected integrations
export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: integrations } = await supabase
    .from('user_integrations')
    .select('id, provider, scope, metadata, created_at')
    .eq('user_id', user.id);

  return NextResponse.json({ integrations: integrations || [] });
}

// POST /api/integrations — start OAuth flow or disconnect
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { action, provider } = await req.json();

  if (action === 'connect') {
    const state = Buffer.from(JSON.stringify({ userId: user.id })).toString('base64');

    switch (provider) {
      case 'google': {
        const url = getGoogleAuthUrl(state);
        return NextResponse.json({ url });
      }
      case 'notion': {
        const url = getNotionAuthUrl(state);
        return NextResponse.json({ url });
      }
      default:
        return NextResponse.json({ error: 'Unknown provider' }, { status: 400 });
    }
  }

  if (action === 'disconnect') {
    await supabase
      .from('user_integrations')
      .delete()
      .eq('user_id', user.id)
      .eq('provider', provider);

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
