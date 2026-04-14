import { createClient } from '@/lib/supabase/server';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('founder_profiles')
    .select('company_name, stage, vertical, journey_progress')
    .eq('user_id', user!.id)
    .single();

  const { data: conversations } = await supabase
    .from('conversations')
    .select('id, title, mode, updated_at')
    .eq('user_id', user!.id)
    .order('updated_at', { ascending: false });

  const completedModes = Array.from(
    new Set((conversations || []).map((c) => c.mode))
  );

  const { data: artifacts } = await supabase
    .from('artifacts')
    .select('id, type, title, created_at')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(4);

  return (
    <DashboardContent
      profile={profile}
      artifacts={artifacts || []}
      conversations={conversations || []}
      completedModes={completedModes}
    />
  );
}
