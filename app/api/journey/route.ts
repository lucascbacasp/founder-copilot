import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

function safeProgress(raw: unknown): { completed: string[]; skipped: string[] } {
  const p = raw as { completed?: string[]; skipped?: string[] } | null;
  return {
    completed: Array.isArray(p?.completed) ? p.completed : [],
    skipped: Array.isArray(p?.skipped) ? p.skipped : [],
  };
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No auth' }, { status: 401 });

  const { data: profile } = await supabase
    .from('founder_profiles')
    .select('journey_progress')
    .eq('user_id', user.id)
    .single();

  const { data: conversations } = await supabase
    .from('conversations')
    .select('mode, id')
    .eq('user_id', user.id);

  const completedModes = new Set<string>();
  if (conversations) {
    for (const conv of conversations) {
      completedModes.add(conv.mode);
    }
  }

  return NextResponse.json({
    progress: safeProgress(profile?.journey_progress),
    completedModes: Array.from(completedModes),
  });
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No auth' }, { status: 401 });

  const { action, step } = await req.json();

  const { data: profile } = await supabase
    .from('founder_profiles')
    .select('journey_progress')
    .eq('user_id', user.id)
    .single();

  const progress = safeProgress(profile?.journey_progress);

  if (action === 'skip') {
    if (!progress.skipped.includes(step)) {
      progress.skipped.push(step);
    }
  } else if (action === 'complete') {
    if (!progress.completed.includes(step)) {
      progress.completed.push(step);
    }
    progress.skipped = progress.skipped.filter((s: string) => s !== step);
  } else if (action === 'unskip') {
    progress.skipped = progress.skipped.filter((s: string) => s !== step);
  }

  const { error } = await supabase
    .from('founder_profiles')
    .update({ journey_progress: progress })
    .eq('user_id', user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ progress });
}
