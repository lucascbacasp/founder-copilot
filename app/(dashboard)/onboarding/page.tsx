'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const { t } = useI18n();

  const STAGES = [
    { value: 'idea', label: t.stages.idea, description: t.stageDescriptions.idea },
    { value: 'prototipo', label: t.stages.prototipo, description: t.stageDescriptions.prototipo },
    { value: 'mvp', label: t.stages.mvp, description: t.stageDescriptions.mvp },
    { value: 'traccion', label: t.stages.traccion, description: t.stageDescriptions.traccion },
    { value: 'revenue', label: t.stages.revenue, description: t.stageDescriptions.revenue },
  ];

  const VERTICALS = [
    { value: 'saas', label: t.verticals.saas },
    { value: 'fintech', label: t.verticals.fintech },
    { value: 'marketplace', label: t.verticals.marketplace },
    { value: 'consumer', label: t.verticals.consumer },
    { value: 'deeptech', label: t.verticals.deeptech },
    { value: 'otro', label: t.verticals.otro },
  ];

  const COUNTRIES = [
    { value: 'ARG', label: t.countries.argentina },
    { value: 'MEX', label: t.countries.mexico },
    { value: 'COL', label: t.countries.colombia },
    { value: 'BRA', label: t.countries.brasil },
    { value: 'CHL', label: t.countries.chile },
    { value: 'PER', label: t.countries.peru },
    { value: 'URY', label: t.countries.uruguay },
    { value: 'OTHER', label: t.countries.otro },
  ];

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    company_name: '',
    description: '',
    pitch_summary: '',
    stage: '',
    vertical: '',
    country: 'ARG',
    mrr: 0,
    active_customers: 0,
  });

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoadingProfile(false); return; }

      const { data: profile } = await supabase
        .from('founder_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        setForm({
          company_name: profile.company_name || '',
          description: profile.description || '',
          pitch_summary: profile.pitch_summary || '',
          stage: profile.stage || '',
          vertical: profile.vertical || '',
          country: profile.country || 'ARG',
          mrr: profile.mrr || 0,
          active_customers: profile.active_customers || 0,
        });
      }
      setLoadingProfile(false);
    }
    loadProfile();
  }, []);

  function update(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
    }
  }

  function validateStep0(): boolean {
    const newErrors: Record<string, string> = {};
    if (!form.company_name.trim()) newErrors.company_name = t.onboarding.fields.companyName;
    if (!form.description.trim()) newErrors.description = t.onboarding.fields.description;
    if (!form.stage) newErrors.stage = t.onboarding.fields.stage;
    if (!form.vertical) newErrors.vertical = t.onboarding.fields.vertical;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('founder_profiles')
      .upsert({
        user_id: user.id,
        full_name: user.user_metadata?.full_name || null,
        ...form,
      }, { onConflict: 'user_id' });

    if (error) {
      console.error('Error saving profile:', error);
      setLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  }

  async function handleSkipStep2() {
    // Save only step 1 data
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('founder_profiles')
      .upsert({
        user_id: user.id,
        full_name: user.user_metadata?.full_name || null,
        company_name: form.company_name,
        description: form.description,
        stage: form.stage,
        vertical: form.vertical,
        country: form.country,
        mrr: 0,
        active_customers: 0,
      }, { onConflict: 'user_id' });

    if (error) {
      console.error('Error saving profile:', error);
      setLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  }

  const showMetrics = ['traccion', 'revenue', 'mvp'].includes(form.stage);

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-full p-8">
        <div className="w-full max-w-lg space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-zinc-800 rounded" />
            <div className="h-4 w-64 bg-zinc-800 rounded" />
            <div className="h-32 bg-zinc-800 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-full p-6 md:p-8">
      <div className="w-full max-w-lg space-y-6">
        <div>
          <h1 className="text-xl font-bold text-white">{t.onboarding.title}</h1>
          <p className="text-sm text-zinc-400 mt-1">
            {t.onboarding.subtitle}
          </p>
        </div>

        {/* Step indicators */}
        <div className="space-y-2">
          <div className="flex gap-2">
            {[0, 1].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? 'bg-indigo-500' : 'bg-zinc-800'}`}
              />
            ))}
          </div>
          <div className="flex justify-between">
            {t.onboarding.steps.map((label: string, i: number) => (
              <span
                key={i}
                className={`text-[11px] ${i <= step ? 'text-indigo-400' : 'text-zinc-600'}`}
              >
                {i + 1}. {label}
              </span>
            ))}
          </div>
        </div>

        {/* Step 0: Startup essentials */}
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                {t.onboarding.fields.companyName} <span className="text-red-400">{t.onboarding.required}</span>
              </label>
              <input
                type="text"
                value={form.company_name}
                onChange={(e) => update('company_name', e.target.value)}
                className={`w-full rounded-lg border bg-zinc-800 px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 ${
                  errors.company_name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-zinc-700 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
                placeholder={t.onboarding.fields.companyNamePlaceholder}
              />
              {errors.company_name && <p className="text-xs text-red-400 mt-1">{errors.company_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                {t.onboarding.fields.description} <span className="text-red-400">{t.onboarding.required}</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                rows={3}
                className={`w-full rounded-lg border bg-zinc-800 px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 resize-none ${
                  errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-zinc-700 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
                placeholder={t.onboarding.fields.descriptionPlaceholder}
              />
              {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                {t.onboarding.fields.stage} <span className="text-red-400">{t.onboarding.required}</span>
              </label>
              {errors.stage && <p className="text-xs text-red-400 mb-2">{errors.stage}</p>}
              <div className="space-y-2">
                {STAGES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => update('stage', s.value)}
                    className={`w-full text-left rounded-lg border p-3 transition-all ${
                      form.stage === s.value
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <p className="text-sm font-medium text-white">{s.label}</p>
                    <p className="text-xs text-zinc-400">{s.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                {t.onboarding.fields.vertical} <span className="text-red-400">{t.onboarding.required}</span>
              </label>
              {errors.vertical && <p className="text-xs text-red-400 mb-2">{errors.vertical}</p>}
              <div className="grid grid-cols-3 gap-2">
                {VERTICALS.map((v) => (
                  <button
                    key={v.value}
                    onClick={() => update('vertical', v.value)}
                    className={`rounded-lg border p-2.5 text-sm transition-all ${
                      form.vertical === v.value
                        ? 'border-indigo-500 bg-indigo-500/10 text-white'
                        : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => { if (validateStep0()) setStep(1); }}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
            >
              {t.common.next}
            </button>
          </div>
        )}

        {/* Step 1: Context (conditional by stage) */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                {t.onboarding.fields.country}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => update('country', c.value)}
                    className={`rounded-lg border p-2.5 text-sm transition-all ${
                      form.country === c.value
                        ? 'border-indigo-500 bg-indigo-500/10 text-white'
                        : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                {t.onboarding.fields.pitchSummary}
              </label>
              <input
                type="text"
                value={form.pitch_summary}
                onChange={(e) => update('pitch_summary', e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder={t.onboarding.fields.pitchTemplate}
              />
              <p className="text-[11px] text-zinc-600 mt-1">
                {t.onboarding.fields.pitchExample}
              </p>
            </div>

            {/* Conditional metrics based on stage */}
            {showMetrics && (
              <>
                <div className="pt-2 border-t border-zinc-800">
                  <p className="text-xs text-zinc-500 mb-3">
                    {t.onboarding.fields.metrics}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-1">
                        {t.onboarding.fields.mrr}
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={form.mrr || ''}
                        onChange={(e) => update('mrr', parseInt(e.target.value) || 0)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-1">
                        {t.onboarding.fields.activeCustomers}
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={form.active_customers || ''}
                        onChange={(e) => update('active_customers', parseInt(e.target.value) || 0)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {!showMetrics && (
              <p className="text-xs text-zinc-600">
                {t.onboarding.fields.noRevenueNote}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(0)}
                className="flex-1 rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                {t.common.back}
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? t.onboarding.submitting : t.onboarding.submit}
              </button>
            </div>

            <button
              onClick={handleSkipStep2}
              disabled={loading}
              className="w-full text-xs text-zinc-500 hover:text-zinc-300 transition-colors py-1"
            >
              {t.onboarding.skipStep}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
