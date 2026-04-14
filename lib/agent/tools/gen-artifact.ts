import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface GenArtifactInput {
  type: string;
  title: string;
  context: Record<string, unknown>;
}

export interface GeneratedArtifact {
  id: string;
  type: string;
  title: string;
  content: Record<string, unknown>;
  created_at: string;
}

const ARTIFACT_PROMPTS: Record<string, string> = {
  bmc: `Genera un Business Model Canvas completo para esta startup.
Devolve un JSON con esta estructura exacta:
{
  "key_partners": ["..."],
  "key_activities": ["..."],
  "key_resources": ["..."],
  "value_proposition": "...",
  "customer_relationships": ["..."],
  "channels": ["..."],
  "customer_segments": ["..."],
  "cost_structure": ["..."],
  "revenue_streams": ["..."]
}`,

  scorecard: `Evalua esta startup en cada dimension con una puntuacion del 1 al 10 y una justificacion.
Devolve un JSON:
{
  "dimensions": [
    { "name": "Problema", "score": 0, "justification": "", "flags": [] },
    { "name": "Mercado", "score": 0, "justification": "", "flags": [] },
    { "name": "Diferenciacion", "score": 0, "justification": "", "flags": [] },
    { "name": "Equipo", "score": 0, "justification": "", "flags": [] },
    { "name": "Modelo de negocio", "score": 0, "justification": "", "flags": [] },
    { "name": "Traccion", "score": 0, "justification": "", "flags": [] }
  ],
  "overall_score": 0,
  "investor_readiness": "",
  "top_3_strengths": [],
  "top_3_risks": []
}`,

  financial_model: `Genera un modelo financiero scaffold con supuestos pre-cargados segun el vertical.
Devolve un JSON:
{
  "model_type": "saas|marketplace|fintech|other",
  "assumptions": {
    "avg_revenue_per_user": 0,
    "cac": 0,
    "churn_monthly": 0,
    "gross_margin": 0,
    "growth_rate_monthly": 0
  },
  "year1": { "users": 0, "mrr": 0, "revenue": 0, "costs": 0, "ebitda": 0 },
  "year2": { "users": 0, "mrr": 0, "revenue": 0, "costs": 0, "ebitda": 0 },
  "year3": { "users": 0, "mrr": 0, "revenue": 0, "costs": 0, "ebitda": 0 },
  "ltv_cac_ratio": 0,
  "payback_months": 0,
  "red_flags": []
}`,

  experiment_roadmap: `Disenia un roadmap de experimentos de validacion priorizados.
Devolve un JSON:
{
  "experiments": [
    {
      "name": "",
      "type": "fake_door|wizard_of_oz|smoke_test|concierge|survey",
      "hypothesis": "",
      "method": "",
      "success_metric": "",
      "time_days": 0,
      "cost_usd": 0,
      "priority": "high|medium|low",
      "rationale": ""
    }
  ],
  "recommended_order": [],
  "total_weeks": 0
}`,

  competitor_map: `Genera un mapa de competidores basado en el contexto.
Devolve un JSON:
{
  "competitors": [
    {
      "name": "",
      "country": "",
      "stage": "",
      "funding": "",
      "differentiator": "",
      "threat_level": "high|medium|low"
    }
  ],
  "positioning": {
    "x_axis": "",
    "y_axis": "",
    "startup_position": { "x": "", "y": "" }
  },
  "gaps_identified": [],
  "key_insight": ""
}`,

  pitch_outline: `Genera una estructura de pitch deck slide por slide.
Devolve un JSON:
{
  "slides": [
    {
      "number": 1,
      "title": "",
      "type": "cover|problem|solution|product|market|model|traction|gtm|competition|team|financials|ask",
      "key_message": "",
      "talking_points": [],
      "data_needed": ""
    }
  ],
  "estimated_duration_minutes": 0,
  "strongest_slide": "",
  "weakest_slide": "",
  "recommendations": []
}`,

  funding_map: `Genera un mapa estructurado de oportunidades de financiamiento para esta startup.
Incluye hackathons, grants, aceleradoras, competencias y fondos relevantes.
Para cada oportunidad, evalua el "fit_score" (1-10) segun que tan bien encaja la startup.
Devolve un JSON:
{
  "opportunities": [
    {
      "name": "",
      "type": "hackathon|grant|accelerator|competition|angel|vc",
      "organizer": "",
      "amount": "",
      "deadline": "",
      "url": "",
      "requirements": [],
      "region": "",
      "fit_score": 0,
      "fit_reason": "",
      "effort_to_apply": "low|medium|high"
    }
  ],
  "total_potential_funding": "",
  "recommended_priority": [],
  "quick_wins": [],
  "strategic_long_term": [],
  "summary": ""
}`,

  investor_deck: `Genera un pitch deck completo para presentar a inversores (VCs, angels) con el objetivo de levantar capital.
Este deck debe seguir la estructura clasica de fundraising y ser directo sobre cuanto capital busca, a que valuacion, y como se usarian los fondos.
Devolve un JSON:
{
  "fundraising_ask": {
    "amount_usd": "",
    "equity_offered": "",
    "pre_money_valuation": "",
    "round_type": "pre-seed|seed|series-a",
    "use_of_funds": [
      { "category": "", "percentage": 0, "description": "" }
    ],
    "runway_months": 0,
    "key_milestones_with_funding": []
  },
  "slides": [
    {
      "number": 1,
      "title": "",
      "type": "cover|problem|solution|product|market|model|traction|gtm|competition|team|financials|ask|appendix",
      "content_bullet_points": [],
      "speaker_notes": "",
      "visual_suggestion": "",
      "data_points": []
    }
  ],
  "tam_sam_som": {
    "tam": { "value": "", "description": "" },
    "sam": { "value": "", "description": "" },
    "som": { "value": "", "description": "" }
  },
  "traction_highlights": [],
  "competitive_advantages": [],
  "team_highlights": [],
  "financial_projections_summary": {
    "year1_revenue": "",
    "year2_revenue": "",
    "year3_revenue": "",
    "path_to_profitability": ""
  },
  "investor_faq": [
    { "question": "", "answer": "" }
  ],
  "tips_for_presentation": []
}`,

  adapted_pitch: `Genera un pitch deck completo adaptado a la oportunidad especifica indicada en el contexto.
El pitch debe enfatizar los criterios de evaluacion de esa oportunidad (hackathon, grant, aceleradora).
Devolve un JSON:
{
  "target_opportunity": "",
  "pitch_angle": "",
  "evaluation_criteria_addressed": [],
  "slides": [
    {
      "number": 1,
      "title": "",
      "content_bullet_points": [],
      "speaker_notes": "",
      "visual_suggestion": ""
    }
  ],
  "key_differentiators_for_judges": [],
  "potential_questions_from_judges": [
    { "question": "", "suggested_answer": "" }
  ],
  "tips_for_presentation": [],
  "estimated_duration_minutes": 0
}`,
};

export async function executeGenArtifact(
  input: GenArtifactInput,
  userId: string,
  conversationId: string
): Promise<{ summary: string; artifact: GeneratedArtifact }> {
  const prompt = ARTIFACT_PROMPTS[input.type] || ARTIFACT_PROMPTS.bmc;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 3000,
    system:
      'Sos un analista experto en startups LATAM. Tu tarea es generar artefactos estructurados en JSON valido. Devolve SOLO el JSON, sin texto adicional, sin markdown, sin explicaciones.',
    messages: [
      {
        role: 'user',
        content: `Contexto de la startup:\n${JSON.stringify(input.context, null, 2)}\n\nTarea: ${prompt}`,
      },
    ],
  });

  const textBlock = response.content.find(
    (b): b is Anthropic.TextBlock => b.type === 'text'
  );
  const jsonText = textBlock?.text || '{}';

  let content: Record<string, unknown>;
  try {
    content = JSON.parse(jsonText.replace(/```json\n?|\n?```/g, '').trim());
  } catch {
    content = { raw: jsonText };
  }

  // Save to database
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: artifact, error } = await supabase
    .from('artifacts')
    .insert({
      user_id: userId,
      conversation_id: conversationId,
      type: input.type,
      title: input.title,
      content,
    })
    .select()
    .single();

  if (error) {
    return {
      summary: `Error guardando artefacto: ${error.message}`,
      artifact: { id: '', type: input.type, title: input.title, content, created_at: new Date().toISOString() },
    };
  }

  return {
    summary: `Artefacto "${input.title}" generado exitosamente (tipo: ${input.type}, ID: ${artifact.id})`,
    artifact: artifact as GeneratedArtifact,
  };
}
