import { createClient } from '@/lib/supabase/server';
import { SettingsContent } from '@/components/settings/SettingsContent';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('founder_profiles')
    .select('*')
    .eq('user_id', user!.id)
    .single();

  const { data: memories } = await supabase
    .from('founder_memory')
    .select('*')
    .eq('user_id', user!.id)
    .order('updated_at', { ascending: false });

  return (
    <SettingsContent
      profile={profile}
      memories={memories || []}
      userEmail={user?.email}
    />
  );
}
