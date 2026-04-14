'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const STAGES = [
  { value: 'idea', label: 'Idea', description: 'Tengo una idea pero no empece a construir' },
  { value: 'prototipo', label: 'Prototipo', description: 'Tengo un prototipo o mockup' },
  { value: 'mvp', label: 'MVP', description: 'Tengo un producto minimo viable en manos de usuarios' },
  { value: 'traccion', label: 'Traccion', description: 'Tengo usuarios activos y metricas de uso' },
  { value: 'revenue', label: 'Revenue', description: 'Estoy generando ingresos' },
];

const VERTICALS = [
  { value: 'saas', label: 'SaaS' },
  { value: 'fintech', label: 'Fintech' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'consumer', label: 'Consumer' },
  { value: 'deeptech', label: 'Deep Tech' },
  { value: 'otro', label: 'Otro' },
];

const COUNTRIES = [
  { value: 'ARG', label: 'Argentina' },
  { value: 'MEX', label: 'Mexico' },
  { value: 'COL', label: 'Colombia' },
  { value: 'BRA', label: 'Brasil' },
  { value: 'CHL', label: 'Chile' },
  { value: 'PER', label: 'Peru' },
  { value: 'URY', label: 'Uruguay' },
  { value: 'OTHER', label: 'Otro' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
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

  function update(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
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

  return (
    <div className="flex items-center justify-center min-h-full p-8">
      <div className="w-full max-w-lg space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Configura tu perfil</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Esto ayuda al copiloto a darte analisis mas relevantes
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex gap-2">
          {[0, 1, 2].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-indigo-500' : 'bg-zinc-800'}`}
            />
          ))}
        </div>

        {/* Step 0: Startup basics */}
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Nombre de tu startup
              </label>
              <input
                type="text"
                value={form.company_name}
                onChange={(e) => update('company_name', e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Ej: MiFintech"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Descripcion corta
              </label>
              <textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                placeholder="Que problema resuelve tu startup y para quien?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                One-liner del pitch
              </label>
              <input
                type="text"
                value={form.pitch_summary}
                onChange={(e) => update('pitch_summary', e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Ej: Automatizamos cobranzas para PYMEs en LATAM"
              />
            </div>

            <button
              onClick={() => setStep(1)}
              disabled={!form.company_name}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
          </div>
        )}

        {/* Step 1: Stage and vertical */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Etapa actual
              </label>
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
                Vertical
              </label>
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

            <div className="flex gap-3">
              <button
                onClick={() => setStep(0)}
                className="flex-1 rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                Atras
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!form.stage || !form.vertical}
                className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Country and metrics */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Pais principal
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  MRR (USD)
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
                  Clientes activos
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

            <p className="text-xs text-zinc-600">
              Si todavia no tenes revenue o clientes, dejalo en 0. Es normal en etapas tempranas.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                Atras
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Guardando...' : 'Empezar'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
