'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const TYPE_LABELS: Record<string, string> = {
  bmc: 'Business Model Canvas',
  scorecard: 'Scorecard de Inversibilidad',
  financial_model: 'Modelo Financiero',
  experiment_roadmap: 'Roadmap de Experimentos',
  competitor_map: 'Mapa de Competidores',
  pitch_outline: 'Outline de Pitch',
  funding_map: 'Mapa de Oportunidades',
  adapted_pitch: 'Pitch Adaptado',
  investor_deck: 'Deck para Inversores',
  challenge_scorecard: 'Challenge Scorecard',
};

interface Artifact {
  id: string;
  type: string;
  title: string;
  content: Record<string, unknown>;
  created_at: string;
}

export default function ArtifactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from('artifacts')
        .select('*')
        .eq('id', id)
        .single();
      setArtifact(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 max-w-4xl">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-zinc-800 rounded" />
          <div className="h-4 w-32 bg-zinc-800 rounded" />
          <div className="h-64 bg-zinc-800 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!artifact) {
    return (
      <div className="p-8 max-w-4xl">
        <p className="text-zinc-500">Artefacto no encontrado.</p>
        <button onClick={() => router.push('/artifacts')} className="text-indigo-400 text-sm mt-2 hover:underline">
          Volver a artefactos
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl">
      <button
        onClick={() => router.push('/artifacts')}
        className="text-sm text-zinc-500 hover:text-zinc-300 mb-6 flex items-center gap-1 transition-colors"
      >
        <span>&larr;</span> Volver a artefactos
      </button>

      <div className="mb-4 flex items-center gap-3">
        <span className="text-[11px] font-bold uppercase px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-400">
          {TYPE_LABELS[artifact.type] || artifact.type}
        </span>
        <span className="text-xs text-zinc-500">
          {new Date(artifact.created_at).toLocaleDateString('es-AR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </span>
      </div>

      <h1 className="text-2xl font-bold text-white mb-6">{artifact.title}</h1>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <ArtifactContent type={artifact.type} content={artifact.content} />
      </div>
    </div>
  );
}

function ArtifactContent({ type, content }: { type: string; content: Record<string, unknown> }) {
  switch (type) {
    case 'scorecard':
      return <ScorecardView content={content} />;
    case 'bmc':
      return <BmcView content={content} />;
    case 'financial_model':
      return <FinancialModelView content={content} />;
    case 'experiment_roadmap':
      return <ExperimentRoadmapView content={content} />;
    case 'competitor_map':
      return <CompetitorMapView content={content} />;
    case 'pitch_outline':
      return <PitchOutlineView content={content} />;
    case 'funding_map':
      return <FundingMapView content={content} />;
    case 'adapted_pitch':
      return <AdaptedPitchView content={content} />;
    case 'investor_deck':
      return <InvestorDeckView content={content} />;
    case 'challenge_scorecard':
      return <ChallengeScorecardView content={content} />;
    default:
      return <GenericView content={content} />;
  }
}

/* ---------- Scorecard ---------- */
function ScorecardView({ content }: { content: Record<string, unknown> }) {
  const c = content as {
    overall_score?: number;
    verdict?: string;
    dimensions?: { name: string; score: number; rationale?: string }[];
    strengths?: string[];
    risks?: string[];
    next_steps?: string[];
  };
  return (
    <div className="space-y-6">
      {c.overall_score !== undefined && (
        <div className="flex items-center gap-4">
          <span className="text-5xl font-bold text-white">{c.overall_score}</span>
          <div>
            <span className="text-zinc-400 text-lg">/10</span>
            {c.verdict && <p className="text-sm text-zinc-400 mt-1">{c.verdict}</p>}
          </div>
        </div>
      )}
      {c.dimensions && (
        <div>
          <h3 className="text-sm font-semibold text-zinc-300 mb-3">Dimensiones</h3>
          <div className="space-y-2">
            {c.dimensions.map((d) => (
              <div key={d.name} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-20 text-right">
                  <span className={`font-bold ${d.score >= 7 ? 'text-emerald-400' : d.score >= 5 ? 'text-amber-400' : 'text-red-400'}`}>
                    {d.score}/10
                  </span>
                </div>
                <div className="flex-1">
                  <span className="text-sm text-white font-medium">{d.name}</span>
                  {d.rationale && <p className="text-xs text-zinc-500 mt-0.5">{d.rationale}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <StrengthsRisks strengths={c.strengths} risks={c.risks} />
      <NextSteps steps={c.next_steps} />
    </div>
  );
}

/* ---------- BMC ---------- */
function BmcView({ content }: { content: Record<string, unknown> }) {
  const blocks = [
    { key: 'key_partners', label: 'Socios Clave' },
    { key: 'key_activities', label: 'Actividades Clave' },
    { key: 'key_resources', label: 'Recursos Clave' },
    { key: 'value_proposition', label: 'Propuesta de Valor' },
    { key: 'customer_relationships', label: 'Relacion con Clientes' },
    { key: 'channels', label: 'Canales' },
    { key: 'customer_segments', label: 'Segmentos de Clientes' },
    { key: 'cost_structure', label: 'Estructura de Costos' },
    { key: 'revenue_streams', label: 'Fuentes de Ingresos' },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {blocks.map((b) => {
        const val = content[b.key];
        if (!val) return null;
        return (
          <div key={b.key} className="rounded-lg border border-zinc-800 p-4">
            <h4 className="text-xs font-bold text-indigo-400 uppercase mb-2">{b.label}</h4>
            {Array.isArray(val) ? (
              <ul className="space-y-1">
                {(val as string[]).map((item, i) => (
                  <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                    <span className="text-zinc-600 mt-1">-</span>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-zinc-300">{String(val)}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Financial Model ---------- */
function FinancialModelView({ content }: { content: Record<string, unknown> }) {
  const c = content as {
    assumptions?: Record<string, unknown>;
    year1?: Record<string, unknown>;
    year2?: Record<string, unknown>;
    year3?: Record<string, unknown>;
    unit_economics?: Record<string, unknown>;
    ltv_cac_ratio?: number;
    red_flags?: string[];
    summary?: string;
  };

  function renderYear(label: string, data?: Record<string, unknown>) {
    if (!data) return null;
    return (
      <div className="rounded-lg border border-zinc-800 p-4">
        <h4 className="text-xs font-bold text-indigo-400 uppercase mb-3">{label}</h4>
        <div className="space-y-1.5">
          {Object.entries(data).map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm">
              <span className="text-zinc-400">{k.replace(/_/g, ' ')}</span>
              <span className="text-white font-medium">{typeof v === 'number' ? `$${v.toLocaleString()}` : String(v)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {c.summary && <p className="text-sm text-zinc-300">{c.summary}</p>}
      {c.unit_economics && (
        <div className="rounded-lg border border-zinc-800 p-4">
          <h4 className="text-xs font-bold text-emerald-400 uppercase mb-3">Unit Economics</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(c.unit_economics).map(([k, v]) => (
              <div key={k}>
                <p className="text-xs text-zinc-500">{k.replace(/_/g, ' ')}</p>
                <p className="text-sm font-medium text-white">{typeof v === 'number' ? (k.includes('ratio') ? `${v}:1` : `$${v.toLocaleString()}`) : String(v)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {c.ltv_cac_ratio && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-400">LTV:CAC Ratio:</span>
          <span className={`text-lg font-bold ${c.ltv_cac_ratio >= 3 ? 'text-emerald-400' : c.ltv_cac_ratio >= 2 ? 'text-amber-400' : 'text-red-400'}`}>
            {c.ltv_cac_ratio}:1
          </span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderYear('Año 1', c.year1)}
        {renderYear('Año 2', c.year2)}
        {renderYear('Año 3', c.year3)}
      </div>
      {c.assumptions && (
        <div className="rounded-lg border border-zinc-800 p-4">
          <h4 className="text-xs font-bold text-zinc-500 uppercase mb-3">Supuestos</h4>
          <div className="space-y-1">
            {Object.entries(c.assumptions).map(([k, v]) => (
              <div key={k} className="flex justify-between text-xs">
                <span className="text-zinc-500">{k.replace(/_/g, ' ')}</span>
                <span className="text-zinc-400">{String(v)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {c.red_flags && c.red_flags.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-red-400 mb-2">Red Flags</h3>
          <ul className="space-y-1">
            {c.red_flags.map((f, i) => (
              <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                <span className="text-red-400 mt-0.5">!</span> {f}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ---------- Experiment Roadmap ---------- */
function ExperimentRoadmapView({ content }: { content: Record<string, unknown> }) {
  const c = content as {
    experiments?: {
      name: string;
      priority: string;
      hypothesis?: string;
      metric?: string;
      timeline?: string;
      description?: string;
      success_criteria?: string;
    }[];
  };
  if (!c.experiments) return <GenericView content={content} />;
  return (
    <div className="space-y-4">
      {c.experiments.map((e, i) => (
        <div key={i} className="rounded-lg border border-zinc-800 p-4">
          <div className="flex items-center gap-3 mb-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              e.priority === 'high' ? 'bg-red-500/20 text-red-400' :
              e.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
              'bg-green-500/20 text-green-400'
            }`}>
              {e.priority}
            </span>
            <h4 className="text-sm font-medium text-white">{e.name}</h4>
            {e.timeline && <span className="text-xs text-zinc-500 ml-auto">{e.timeline}</span>}
          </div>
          {e.hypothesis && <p className="text-xs text-zinc-400 mb-1"><span className="text-zinc-500">Hipotesis:</span> {e.hypothesis}</p>}
          {e.description && <p className="text-xs text-zinc-400 mb-1">{e.description}</p>}
          {e.metric && <p className="text-xs text-zinc-400"><span className="text-zinc-500">Metrica:</span> {e.metric}</p>}
          {e.success_criteria && <p className="text-xs text-zinc-400"><span className="text-zinc-500">Criterio de exito:</span> {e.success_criteria}</p>}
        </div>
      ))}
    </div>
  );
}

/* ---------- Competitor Map ---------- */
function CompetitorMapView({ content }: { content: Record<string, unknown> }) {
  const c = content as {
    competitors?: {
      name: string;
      description?: string;
      strengths?: string[];
      weaknesses?: string[];
      positioning?: string;
      market_share?: string;
      funding?: string;
    }[];
    differentiation?: string;
    gaps?: string[];
  };
  return (
    <div className="space-y-6">
      {c.differentiation && (
        <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-4">
          <h4 className="text-xs font-bold text-indigo-400 uppercase mb-1">Diferenciacion</h4>
          <p className="text-sm text-zinc-300">{c.differentiation}</p>
        </div>
      )}
      {c.competitors && (
        <div className="space-y-3">
          {c.competitors.map((comp, i) => (
            <div key={i} className="rounded-lg border border-zinc-800 p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-white">{comp.name}</h4>
                <div className="flex gap-2">
                  {comp.market_share && <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">{comp.market_share}</span>}
                  {comp.funding && <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">{comp.funding}</span>}
                </div>
              </div>
              {comp.description && <p className="text-xs text-zinc-400 mb-2">{comp.description}</p>}
              {comp.positioning && <p className="text-xs text-zinc-400 mb-2"><span className="text-zinc-500">Posicionamiento:</span> {comp.positioning}</p>}
              <div className="grid grid-cols-2 gap-3">
                {comp.strengths && (
                  <div>
                    <p className="text-[10px] text-emerald-400 font-medium mb-1">Fortalezas</p>
                    {comp.strengths.map((s, j) => <p key={j} className="text-xs text-zinc-400">+ {s}</p>)}
                  </div>
                )}
                {comp.weaknesses && (
                  <div>
                    <p className="text-[10px] text-red-400 font-medium mb-1">Debilidades</p>
                    {comp.weaknesses.map((w, j) => <p key={j} className="text-xs text-zinc-400">- {w}</p>)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {c.gaps && c.gaps.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-amber-400 mb-2">Oportunidades / Gaps</h3>
          <ul className="space-y-1">
            {c.gaps.map((g, i) => <li key={i} className="text-sm text-zinc-300">- {g}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ---------- Pitch Outline ---------- */
function PitchOutlineView({ content }: { content: Record<string, unknown> }) {
  const c = content as {
    slides?: { title: string; content?: string; notes?: string; talking_points?: string[] }[];
    tips?: string[];
  };
  if (!c.slides) return <GenericView content={content} />;
  return (
    <div className="space-y-4">
      {c.slides.map((s, i) => (
        <div key={i} className="rounded-lg border border-zinc-800 p-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-bold text-zinc-600 w-6">{i + 1}</span>
            <h4 className="text-sm font-medium text-white">{s.title}</h4>
          </div>
          {s.content && <p className="text-xs text-zinc-400 ml-9">{s.content}</p>}
          {s.notes && <p className="text-xs text-zinc-500 ml-9 mt-1 italic">{s.notes}</p>}
          {s.talking_points && (
            <ul className="ml-9 mt-1 space-y-0.5">
              {s.talking_points.map((tp, j) => <li key={j} className="text-xs text-zinc-400">- {tp}</li>)}
            </ul>
          )}
        </div>
      ))}
      {c.tips && c.tips.length > 0 && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
          <h4 className="text-xs font-bold text-amber-400 uppercase mb-2">Tips de presentacion</h4>
          {c.tips.map((t, i) => <p key={i} className="text-xs text-zinc-300 mb-1">- {t}</p>)}
        </div>
      )}
    </div>
  );
}

/* ---------- Funding Map ---------- */
function FundingMapView({ content }: { content: Record<string, unknown> }) {
  const c = content as {
    opportunities?: {
      name: string;
      type: string;
      amount?: string;
      fit_score: number;
      deadline?: string;
      description?: string;
      requirements?: string[];
      url?: string;
    }[];
    quick_wins?: string[];
    strategy?: string;
  };
  return (
    <div className="space-y-6">
      {c.strategy && <p className="text-sm text-zinc-300">{c.strategy}</p>}
      {c.opportunities && (
        <div className="space-y-3">
          {c.opportunities.map((o, i) => (
            <div key={i} className="rounded-lg border border-zinc-800 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    o.fit_score >= 7 ? 'bg-emerald-400' : o.fit_score >= 5 ? 'bg-amber-400' : 'bg-zinc-500'
                  }`} />
                  <h4 className="text-sm font-medium text-white">{o.name}</h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">{o.type}</span>
                </div>
                <div className="flex items-center gap-3">
                  {o.amount && <span className="text-sm font-medium text-emerald-400">{o.amount}</span>}
                  <span className="text-xs text-zinc-500">fit {o.fit_score}/10</span>
                </div>
              </div>
              {o.description && <p className="text-xs text-zinc-400 mb-1">{o.description}</p>}
              {o.deadline && <p className="text-xs text-zinc-500"><span className="text-zinc-600">Deadline:</span> {o.deadline}</p>}
              {o.requirements && o.requirements.length > 0 && (
                <div className="mt-2">
                  <p className="text-[10px] text-zinc-500 font-medium mb-1">Requisitos:</p>
                  {o.requirements.map((r, j) => <p key={j} className="text-xs text-zinc-400">- {r}</p>)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {c.quick_wins && c.quick_wins.length > 0 && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
          <h4 className="text-xs font-bold text-emerald-400 uppercase mb-2">Quick Wins</h4>
          {c.quick_wins.map((w, i) => <p key={i} className="text-xs text-zinc-300 mb-1">- {w}</p>)}
        </div>
      )}
    </div>
  );
}

/* ---------- Adapted Pitch ---------- */
function AdaptedPitchView({ content }: { content: Record<string, unknown> }) {
  const c = content as {
    target_opportunity?: string;
    pitch_angle?: string;
    slides?: { title: string; content?: string; talking_points?: string[] }[];
    key_adaptations?: string[];
    tips_for_presentation?: string[];
  };
  return (
    <div className="space-y-6">
      {c.target_opportunity && (
        <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-4">
          <h4 className="text-xs font-bold text-indigo-400 uppercase mb-1">Oportunidad objetivo</h4>
          <p className="text-sm text-white">{c.target_opportunity}</p>
          {c.pitch_angle && <p className="text-xs text-zinc-400 mt-1">Angulo: {c.pitch_angle}</p>}
        </div>
      )}
      {c.key_adaptations && c.key_adaptations.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-zinc-300 mb-2">Adaptaciones clave</h3>
          {c.key_adaptations.map((a, i) => <p key={i} className="text-xs text-zinc-400 mb-1">- {a}</p>)}
        </div>
      )}
      {c.slides && (
        <div className="space-y-3">
          {c.slides.map((s, i) => (
            <div key={i} className="rounded-lg border border-zinc-800 p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold text-zinc-600 w-6">{i + 1}</span>
                <h4 className="text-sm font-medium text-white">{s.title}</h4>
              </div>
              {s.content && <p className="text-xs text-zinc-400 ml-9">{s.content}</p>}
              {s.talking_points && (
                <ul className="ml-9 mt-1 space-y-0.5">
                  {s.talking_points.map((tp, j) => <li key={j} className="text-xs text-zinc-400">- {tp}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
      {c.tips_for_presentation && c.tips_for_presentation.length > 0 && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
          <h4 className="text-xs font-bold text-amber-400 uppercase mb-2">Tips de presentacion</h4>
          {c.tips_for_presentation.map((t, i) => <p key={i} className="text-xs text-zinc-300 mb-1">- {t}</p>)}
        </div>
      )}
    </div>
  );
}

/* ---------- Investor Deck ---------- */
function InvestorDeckView({ content }: { content: Record<string, unknown> }) {
  const c = content as {
    fundraising_ask?: {
      amount_usd?: string;
      equity_offered?: string;
      pre_money_valuation?: string;
      round_type?: string;
      use_of_funds?: { category: string; percentage: number }[];
      runway_months?: number;
      key_milestones?: string[];
    };
    slides?: { title: string; content?: string; talking_points?: string[] }[];
    tam_sam_som?: { tam?: { value: string; description?: string }; sam?: { value: string; description?: string }; som?: { value: string; description?: string } };
    traction_highlights?: string[];
    competitive_advantages?: string[];
    financial_projections_summary?: string;
    investor_faq?: { question: string; answer: string }[];
    tips_for_presentation?: string[];
  };

  return (
    <div className="space-y-6">
      {c.fundraising_ask && (
        <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-5">
          <h4 className="text-xs font-bold text-indigo-400 uppercase mb-4">The Ask</h4>
          <div className="flex items-center gap-6 mb-4">
            {c.fundraising_ask.amount_usd && (
              <div className="text-center">
                <span className="text-3xl font-bold text-emerald-400">{c.fundraising_ask.amount_usd}</span>
                <p className="text-xs text-zinc-500 mt-1">Levantamiento</p>
              </div>
            )}
            {c.fundraising_ask.equity_offered && (
              <div className="text-center">
                <span className="text-3xl font-bold text-indigo-400">{c.fundraising_ask.equity_offered}</span>
                <p className="text-xs text-zinc-500 mt-1">Equity</p>
              </div>
            )}
            {c.fundraising_ask.pre_money_valuation && (
              <div className="text-center">
                <span className="text-3xl font-bold text-amber-400">{c.fundraising_ask.pre_money_valuation}</span>
                <p className="text-xs text-zinc-500 mt-1">Valuacion Pre-Money</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 mb-3">
            {c.fundraising_ask.round_type && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">{c.fundraising_ask.round_type}</span>
            )}
            {c.fundraising_ask.runway_months && (
              <span className="text-xs text-zinc-400">Runway: {c.fundraising_ask.runway_months} meses</span>
            )}
          </div>
          {c.fundraising_ask.use_of_funds && c.fundraising_ask.use_of_funds.length > 0 && (
            <div>
              <p className="text-xs text-zinc-500 font-medium mb-2">Use of Funds</p>
              <div className="space-y-1.5">
                {c.fundraising_ask.use_of_funds.map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500/50 rounded-full" style={{ width: `${f.percentage}%` }} />
                    </div>
                    <span className="text-xs text-zinc-400 w-28 truncate">{f.category}</span>
                    <span className="text-xs text-white font-medium w-10 text-right">{f.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {c.fundraising_ask.key_milestones && c.fundraising_ask.key_milestones.length > 0 && (
            <div className="mt-3 pt-3 border-t border-zinc-800">
              <p className="text-xs text-zinc-500 font-medium mb-1">Milestones con esta ronda</p>
              {c.fundraising_ask.key_milestones.map((m, i) => (
                <p key={i} className="text-xs text-zinc-300">- {m}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {c.tam_sam_som && (
        <div className="grid grid-cols-3 gap-4">
          {(['tam', 'sam', 'som'] as const).map((k) => {
            const d = c.tam_sam_som?.[k];
            if (!d) return null;
            return (
              <div key={k} className="rounded-lg border border-zinc-800 p-4 text-center">
                <p className="text-[10px] font-bold text-zinc-500 uppercase">{k}</p>
                <p className="text-lg font-bold text-white mt-1">{d.value}</p>
                {d.description && <p className="text-[10px] text-zinc-500 mt-1">{d.description}</p>}
              </div>
            );
          })}
        </div>
      )}

      {c.traction_highlights && c.traction_highlights.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-emerald-400 mb-2">Traccion</h3>
          {c.traction_highlights.map((t, i) => <p key={i} className="text-xs text-zinc-300 mb-1">- {t}</p>)}
        </div>
      )}

      {c.competitive_advantages && c.competitive_advantages.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-zinc-300 mb-2">Ventajas Competitivas</h3>
          {c.competitive_advantages.map((a, i) => <p key={i} className="text-xs text-zinc-300 mb-1">- {a}</p>)}
        </div>
      )}

      {c.financial_projections_summary && (
        <div className="rounded-lg border border-zinc-800 p-4">
          <h4 className="text-xs font-bold text-zinc-500 uppercase mb-2">Proyecciones Financieras</h4>
          <p className="text-sm text-zinc-300">{c.financial_projections_summary}</p>
        </div>
      )}

      {c.slides && (
        <div>
          <h3 className="text-sm font-semibold text-zinc-300 mb-3">Slides ({c.slides.length})</h3>
          <div className="space-y-3">
            {c.slides.map((s, i) => (
              <div key={i} className="rounded-lg border border-zinc-800 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-zinc-600 w-6">{i + 1}</span>
                  <h4 className="text-sm font-medium text-white">{s.title}</h4>
                </div>
                {s.content && <p className="text-xs text-zinc-400 ml-9">{s.content}</p>}
                {s.talking_points && (
                  <ul className="ml-9 mt-1 space-y-0.5">
                    {s.talking_points.map((tp, j) => <li key={j} className="text-xs text-zinc-400">- {tp}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {c.investor_faq && c.investor_faq.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-zinc-300 mb-3">FAQ para Inversores</h3>
          <div className="space-y-3">
            {c.investor_faq.map((faq, i) => (
              <div key={i} className="rounded-lg border border-zinc-800 p-4">
                <p className="text-sm font-medium text-white mb-1">{faq.question}</p>
                <p className="text-xs text-zinc-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {c.tips_for_presentation && c.tips_for_presentation.length > 0 && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
          <h4 className="text-xs font-bold text-amber-400 uppercase mb-2">Tips de presentacion</h4>
          {c.tips_for_presentation.map((t, i) => <p key={i} className="text-xs text-zinc-300 mb-1">- {t}</p>)}
        </div>
      )}
    </div>
  );
}

/* ---------- Challenge Scorecard ---------- */
function ChallengeScorecardView({ content }: { content: Record<string, unknown> }) {
  const c = content as {
    overall_score?: number;
    level?: string;
    criteria?: { name: string; score: number; feedback: string }[];
    responses_evaluated?: { question: string; response_summary: string; score: number; feedback: string; improved_version: string }[];
    strongest_response?: { question: string; why: string };
    weakest_response?: { question: string; why: string; how_to_improve: string };
    homework?: string[];
    yc_readiness_summary?: string;
  };

  return (
    <div className="space-y-6">
      {/* Overall score + level */}
      {c.overall_score !== undefined && (
        <div className="flex items-center gap-4">
          <span className="text-5xl font-bold text-white">{c.overall_score}</span>
          <div>
            <span className="text-zinc-400 text-lg">/5</span>
            {c.level && (
              <p className={`text-sm font-semibold mt-1 ${
                c.level === 'Excepcional' ? 'text-emerald-400' :
                c.level === 'Interview-ready' ? 'text-green-400' :
                c.level === 'Casi listo' ? 'text-amber-400' :
                c.level === 'En camino' ? 'text-orange-400' :
                'text-red-400'
              }`}>
                {c.level}
              </p>
            )}
          </div>
        </div>
      )}

      {/* YC readiness summary */}
      {c.yc_readiness_summary && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-sm text-zinc-300">{c.yc_readiness_summary}</p>
        </div>
      )}

      {/* Criteria scores */}
      {c.criteria && (
        <div>
          <h3 className="text-sm font-semibold text-zinc-300 mb-3">Criterios de evaluacion</h3>
          <div className="space-y-3">
            {c.criteria.map((cr) => (
              <div key={cr.name} className="rounded-lg border border-zinc-800 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{cr.name}</span>
                  <span className={`text-lg font-bold ${
                    cr.score >= 4 ? 'text-emerald-400' : cr.score >= 3 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {cr.score}/5
                  </span>
                </div>
                <p className="text-xs text-zinc-400">{cr.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strongest / Weakest response */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {c.strongest_response && (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
            <h4 className="text-xs font-bold text-emerald-400 uppercase mb-2">Respuesta mas fuerte</h4>
            <p className="text-sm text-white mb-1">{c.strongest_response.question}</p>
            <p className="text-xs text-zinc-400">{c.strongest_response.why}</p>
          </div>
        )}
        {c.weakest_response && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <h4 className="text-xs font-bold text-red-400 uppercase mb-2">Respuesta mas debil</h4>
            <p className="text-sm text-white mb-1">{c.weakest_response.question}</p>
            <p className="text-xs text-zinc-400 mb-2">{c.weakest_response.why}</p>
            {c.weakest_response.how_to_improve && (
              <p className="text-xs text-amber-400"><span className="text-zinc-500">Mejora:</span> {c.weakest_response.how_to_improve}</p>
            )}
          </div>
        )}
      </div>

      {/* Responses evaluated */}
      {c.responses_evaluated && c.responses_evaluated.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-zinc-300 mb-3">Respuestas evaluadas</h3>
          <div className="space-y-3">
            {c.responses_evaluated.map((r, i) => (
              <div key={i} className="rounded-lg border border-zinc-800 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-white">{r.question}</p>
                  <span className={`text-sm font-bold flex-shrink-0 ml-3 ${
                    r.score >= 4 ? 'text-emerald-400' : r.score >= 3 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {r.score}/5
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mb-1">{r.response_summary}</p>
                <p className="text-xs text-zinc-400 mb-2">{r.feedback}</p>
                {r.improved_version && (
                  <div className="mt-2 pt-2 border-t border-zinc-800">
                    <p className="text-[10px] text-indigo-400 font-medium mb-1">Version mejorada:</p>
                    <p className="text-xs text-zinc-300 italic">{r.improved_version}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Homework */}
      {c.homework && c.homework.length > 0 && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
          <h4 className="text-xs font-bold text-amber-400 uppercase mb-2">Tarea para mejorar</h4>
          <ul className="space-y-1.5">
            {c.homework.map((h, i) => (
              <li key={i} className="text-xs text-zinc-300 flex items-start gap-2">
                <span className="text-amber-400 mt-0.5 flex-shrink-0">{i + 1}.</span>
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ---------- Shared Components ---------- */
function StrengthsRisks({ strengths, risks }: { strengths?: string[]; risks?: string[] }) {
  if (!strengths?.length && !risks?.length) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {strengths && strengths.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-emerald-400 mb-2">Fortalezas</h3>
          {strengths.map((s, i) => <p key={i} className="text-xs text-zinc-300 mb-1">+ {s}</p>)}
        </div>
      )}
      {risks && risks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-red-400 mb-2">Riesgos</h3>
          {risks.map((r, i) => <p key={i} className="text-xs text-zinc-300 mb-1">! {r}</p>)}
        </div>
      )}
    </div>
  );
}

function NextSteps({ steps }: { steps?: string[] }) {
  if (!steps?.length) return null;
  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-300 mb-2">Proximos pasos</h3>
      {steps.map((s, i) => <p key={i} className="text-xs text-zinc-300 mb-1">- {s}</p>)}
    </div>
  );
}

/* ---------- Generic Fallback ---------- */
function GenericView({ content }: { content: Record<string, unknown> }) {
  return (
    <pre className="text-xs text-zinc-400 whitespace-pre-wrap overflow-auto max-h-[600px]">
      {JSON.stringify(content, null, 2)}
    </pre>
  );
}
