import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SignOutButton } from '@/components/dashboard/SignOutButton';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { ToastProvider } from '@/components/ui/Toast';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('founder_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  const { data: conversations } = await supabase
    .from('conversations')
    .select('id, title, mode, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(15);

  return (
    <ToastProvider>
      <div className="flex h-screen bg-zinc-950">
        <Sidebar
          email={user.email || ''}
          hasProfile={!!profile}
          conversations={conversations || []}
          signOutButton={<SignOutButton />}
        />

        <main className="flex-1 overflow-auto md:ml-0">
          {/* Mobile top spacing for hamburger */}
          <div className="md:hidden h-12" />
          {children}
        </main>
      </div>
    </ToastProvider>
  );
}
