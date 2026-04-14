'use client';

import Link from 'next/link';

interface ArtifactCardProps {
  type: string;
  title: string;
  content: Record<string, unknown>;
  artifactId?: string;
}

const TYPE_INFO: Record<string, { label: string; icon: string }> = {
  bmc: { label: 'Business Model Canvas', icon: 'grid' },
  scorecard: { label: 'Scorecard de Inversibilidad', icon: 'chart' },
  financial_model: { label: 'Modelo Financiero', icon: 'dollar' },
  experiment_roadmap: { label: 'Roadmap de Experimentos', icon: 'flask' },
  competitor_map: { label: 'Mapa de Competidores', icon: 'map' },
  pitch_outline: { label: 'Outline de Pitch', icon: 'presentation' },
  funding_map: { label: 'Mapa de Oportunidades', icon: 'funding' },
  adapted_pitch: { label: 'Pitch Adaptado', icon: 'target' },
  investor_deck: { label: 'Deck para Inversores', icon: 'rocket' },
};

export function ArtifactCard({ type, title, content, artifactId }: ArtifactCardProps) {
  const info = TYPE_INFO[type] || { label: type, icon: 'doc' };

  // Render a summary based on type
  function renderSummary() {
    switch (type) {
      case 'scorecard': {
        const score = (content as { overall_score?: number }).overall_score;
        const dims = (content as { dimensions?: { name: string; score: number }[] }).dimensions;
        return (
          <div className="space-y-2">
            {score !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">{score}</span>
                <span className="text-sm text-zinc-400">/10 score general</span>
              </div>
            )}
            {dims && (
              <div className="grid grid-cols-2 gap-1.5">
                {dims.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">{d.name}</span>
                    <span className="font-medium text-white">{d.score}/10</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }

      case 'bmc': {
        const vp = (content as { value_proposition?: string }).value_proposition;
        const segments = (content as { customer_segments?: string[] }).customer_segments;
        return (
          <div className="space-y-1.5 text-xs">
            {vp && (
              <div>
                <span className="text-zinc-500">Propuesta de valor: </span>
                <span className="text-zinc-300">{vp}</span>
              </div>
            )}
            {segments && segments.length > 0 && (
              <div>
                <span className="text-zinc-500">Segmentos: </span>
                <span className="text-zinc-300">{segments.join(', ')}</span>
              </div>
            )}
          </div>
        );
      }

      case 'financial_model': {
        const y1 = (content as { year1?: { revenue?: number; mrr?: number } }).year1;
        const ratio = (content as { ltv_cac_ratio?: number }).ltv_cac_ratio;
        return (
          <div className="space-y-1.5 text-xs">
            {y1?.revenue !== undefined && (
              <div>
                <span className="text-zinc-500">Revenue Año 1: </span>
                <span className="text-zinc-300">${y1.revenue.toLocaleString()}</span>
              </div>
            )}
            {ratio !== undefined && (
              <div>
                <span className="text-zinc-500">LTV:CAC: </span>
                <span className="text-zinc-300">{ratio}:1</span>
              </div>
            )}
          </div>
        );
      }

      case 'experiment_roadmap': {
        const exps = (content as { experiments?: { name: string; priority: string }[] }).experiments;
        return (
          <div className="space-y-1 text-xs">
            {exps?.slice(0, 3).map((e, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  e.priority === 'high' ? 'bg-red-400' : e.priority === 'medium' ? 'bg-amber-400' : 'bg-green-400'
                }`} />
                <span className="text-zinc-300">{e.name}</span>
              </div>
            ))}
          </div>
        );
      }

      case 'funding_map': {
        const opps = (content as { opportunities?: { name: string; type: string; amount: string; fit_score: number }[] }).opportunities;
        const quickWins = (content as { quick_wins?: string[] }).quick_wins;
        return (
          <div className="space-y-2">
            {opps?.slice(0, 4).map((o, i) => (
              <div key={i} className="flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${
                    o.fit_score >= 7 ? 'bg-green-400' : o.fit_score >= 5 ? 'bg-amber-400' : 'bg-zinc-400'
                  }`} />
                  <span className="text-zinc-300 truncate">{o.name}</span>
                  <span className="flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500">{o.type}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {o.amount && <span className="text-emerald-400 font-medium">{o.amount}</span>}
                  <span className="text-zinc-500">fit {o.fit_score}/10</span>
                </div>
              </div>
            ))}
            {opps && opps.length > 4 && (
              <p className="text-[10px] text-zinc-600">+{opps.length - 4} oportunidades mas</p>
            )}
            {quickWins && quickWins.length > 0 && (
              <div className="mt-1 pt-1 border-t border-zinc-800">
                <p className="text-[10px] text-emerald-500 font-medium">Quick wins: {quickWins.join(', ')}</p>
              </div>
            )}
          </div>
        );
      }

      case 'adapted_pitch': {
        const target = (content as { target_opportunity?: string }).target_opportunity;
        const angle = (content as { pitch_angle?: string }).pitch_angle;
        const slides = (content as { slides?: { title: string }[] }).slides;
        const tips = (content as { tips_for_presentation?: string[] }).tips_for_presentation;
        return (
          <div className="space-y-1.5 text-xs">
            {target && (
              <div>
                <span className="text-zinc-500">Para: </span>
                <span className="text-indigo-400 font-medium">{target}</span>
              </div>
            )}
            {angle && (
              <div>
                <span className="text-zinc-500">Angulo: </span>
                <span className="text-zinc-300">{angle}</span>
              </div>
            )}
            {slides && (
              <div>
                <span className="text-zinc-500">{slides.length} slides: </span>
                <span className="text-zinc-400">{slides.map(s => s.title).join(' → ')}</span>
              </div>
            )}
            {tips && tips.length > 0 && (
              <div className="mt-1 pt-1 border-t border-zinc-800">
                <p className="text-[10px] text-amber-400">Tip: {tips[0]}</p>
              </div>
            )}
          </div>
        );
      }

      case 'investor_deck': {
        const ask = (content as { fundraising_ask?: { amount_usd?: string; equity_offered?: string; pre_money_valuation?: string; round_type?: string; use_of_funds?: { category: string; percentage: number }[]; runway_months?: number } }).fundraising_ask;
        const deckSlides = (content as { slides?: { title: string }[] }).slides;
        const tamSamSom = (content as { tam_sam_som?: { tam?: { value: string }; sam?: { value: string }; som?: { value: string } } }).tam_sam_som;
        const deckTips = (content as { tips_for_presentation?: string[] }).tips_for_presentation;
        return (
          <div className="space-y-2">
            {ask && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  {ask.amount_usd && (
                    <div className="text-center">
                      <span className="text-lg font-bold text-emerald-400">{ask.amount_usd}</span>
                      <p className="text-[10px] text-zinc-500">Levantamiento</p>
                    </div>
                  )}
                  {ask.equity_offered && (
                    <div className="text-center">
                      <span className="text-lg font-bold text-indigo-400">{ask.equity_offered}</span>
                      <p className="text-[10px] text-zinc-500">Equity</p>
                    </div>
                  )}
                  {ask.pre_money_valuation && (
                    <div className="text-center">
                      <span className="text-lg font-bold text-amber-400">{ask.pre_money_valuation}</span>
                      <p className="text-[10px] text-zinc-500">Valuacion</p>
                    </div>
                  )}
                </div>
                {ask.round_type && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">{ask.round_type}</span>
                )}
                {ask.use_of_funds && ask.use_of_funds.length > 0 && (
                  <div className="mt-1">
                    <p className="text-[10px] text-zinc-500 font-medium mb-1">Use of Funds:</p>
                    {ask.use_of_funds.map((f, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px]">
                        <span className="text-zinc-400">{f.category}</span>
                        <span className="text-zinc-300 font-medium">{f.percentage}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {tamSamSom && (
              <div className="flex items-center gap-3 text-[11px] pt-1 border-t border-zinc-800">
                {tamSamSom.tam?.value && <span className="text-zinc-400">TAM: <span className="text-zinc-300">{tamSamSom.tam.value}</span></span>}
                {tamSamSom.sam?.value && <span className="text-zinc-400">SAM: <span className="text-zinc-300">{tamSamSom.sam.value}</span></span>}
                {tamSamSom.som?.value && <span className="text-zinc-400">SOM: <span className="text-zinc-300">{tamSamSom.som.value}</span></span>}
              </div>
            )}
            {deckSlides && (
              <div className="text-[11px] text-zinc-500">
                {deckSlides.length} slides: <span className="text-zinc-400">{deckSlides.map(s => s.title).join(' → ')}</span>
              </div>
            )}
            {deckTips && deckTips.length > 0 && (
              <div className="pt-1 border-t border-zinc-800">
                <p className="text-[10px] text-amber-400">Tip: {deckTips[0]}</p>
              </div>
            )}
          </div>
        );
      }

      default:
        return (
          <p className="text-xs text-zinc-500">
            Artefacto generado. Ver detalle completo en el dashboard.
          </p>
        );
    }
  }

  const card = (
    <div className={`rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4 my-2 max-w-[80%] ${artifactId ? 'hover:bg-indigo-500/10 hover:border-indigo-500/50 transition-colors cursor-pointer' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">
          {info.label}
        </span>
        {artifactId && (
          <span className="text-[10px] text-zinc-500 ml-auto">Ver detalle &rarr;</span>
        )}
      </div>
      <p className="text-sm font-medium text-white mb-2">{title}</p>
      {renderSummary()}
    </div>
  );

  if (artifactId) {
    return <Link href={`/artifacts/${artifactId}`}>{card}</Link>;
  }

  return card;
}
