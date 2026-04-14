'use client';

import Link from 'next/link';
import { IntegrationsPanel } from '@/components/settings/IntegrationsPanel';
import { MemoryPanel } from '@/components/settings/MemoryPanel';
import { useI18n } from '@/lib/i18n';

interface Memory {
  id: string;
  category: string;
  key: string;
  value: Record<string, unknown>;
  summary: string;
  updated_at: string;
}

interface Profile {
  company_name: string;
  stage: string;
  vertical: string;
  country: string;
  mrr: number;
  active_customers: number;
  description: string;
}

interface SettingsContentProps {
  profile: Profile | null;
  memories: Memory[];
  userEmail: string | undefined;
}

export function SettingsContent({ profile, memories, userEmail }: SettingsContentProps) {
  const { t } = useI18n();

  const stageLabels: Record<string, string> = {
    idea: t.stages.idea,
    prototipo: t.stages.prototipo,
    mvp: t.stages.mvp,
    traccion: t.stages.traccion,
    revenue: t.stages.revenue,
  };

  const verticalLabels: Record<string, string> = {
    saas: t.verticals.saas,
    fintech: t.verticals.fintech,
    marketplace: t.verticals.marketplace,
    consumer: t.verticals.consumer,
    deeptech: t.verticals.deeptech,
    otro: t.verticals.otro,
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <h1 className="text-xl font-bold text-white mb-6">{t.settings.title}</h1>

      {/* Profile section */}
      <section className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">{t.settings.profile.title}</h2>
          <Link
            href="/onboarding"
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {profile ? t.common.edit : t.settings.profile.completeCta}
          </Link>
        </div>

        {profile ? (
          <div className="rounded-xl border border-zinc-800 p-5 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] text-zinc-500 uppercase tracking-wide">{t.settings.profile.startup}</p>
                <p className="text-sm text-white mt-0.5">{profile.company_name}</p>
              </div>
              <div>
                <p className="text-[11px] text-zinc-500 uppercase tracking-wide">{t.settings.profile.stage}</p>
                <p className="text-sm text-white mt-0.5">{stageLabels[profile.stage] || profile.stage}</p>
              </div>
              <div>
                <p className="text-[11px] text-zinc-500 uppercase tracking-wide">{t.settings.profile.vertical}</p>
                <p className="text-sm text-white mt-0.5">{verticalLabels[profile.vertical] || profile.vertical}</p>
              </div>
              <div>
                <p className="text-[11px] text-zinc-500 uppercase tracking-wide">{t.settings.profile.country}</p>
                <p className="text-sm text-white mt-0.5">{profile.country}</p>
              </div>
              {(profile.mrr > 0 || profile.active_customers > 0) && (
                <>
                  <div>
                    <p className="text-[11px] text-zinc-500 uppercase tracking-wide">{t.settings.profile.mrr}</p>
                    <p className="text-sm text-white mt-0.5">${profile.mrr || 0}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-zinc-500 uppercase tracking-wide">{t.settings.profile.activeCustomers}</p>
                    <p className="text-sm text-white mt-0.5">{profile.active_customers || 0}</p>
                  </div>
                </>
              )}
            </div>
            {profile.description && (
              <div className="pt-3 border-t border-zinc-800">
                <p className="text-[11px] text-zinc-500 uppercase tracking-wide">{t.settings.profile.description}</p>
                <p className="text-sm text-zinc-300 mt-0.5">{profile.description}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
            <p className="text-sm text-amber-400">
              {t.settings.profile.emptyMessage}
            </p>
            <Link
              href="/onboarding"
              className="inline-block mt-3 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {t.settings.profile.completeCta}
            </Link>
          </div>
        )}
      </section>

      {/* Memory section */}
      <section className="space-y-4 mb-8">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
          {t.settings.memory.title}
        </h2>
        <p className="text-xs text-zinc-500">
          {t.settings.memory.subtitle}
        </p>
        <MemoryPanel memories={memories} />
      </section>

      {/* Integrations section */}
      <section className="space-y-4 mb-8">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">{t.settings.integrations.title}</h2>
        <p className="text-xs text-zinc-500">
          {t.settings.integrations.subtitle}
        </p>
        <IntegrationsPanel />
      </section>

      {/* Account section */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">{t.settings.account.title}</h2>
        <div className="rounded-xl border border-zinc-800 p-5 space-y-3">
          <div>
            <p className="text-[11px] text-zinc-500 uppercase tracking-wide">{t.settings.account.email}</p>
            <p className="text-sm text-white mt-0.5">{userEmail}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
