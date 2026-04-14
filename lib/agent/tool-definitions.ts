import Anthropic from '@anthropic-ai/sdk';

export const TOOL_DEFINITIONS: Anthropic.Tool[] = [
  {
    name: 'web_search',
    description: `Busca informacion actualizada sobre mercados, competidores, regulacion y tendencias del ecosistema startup en LATAM y globalmente.

CUANDO USARLO:
- El fundador menciona un mercado o vertical y necesitas datos reales de tamaño
- Se necesita identificar quien mas esta haciendo algo similar
- Se pregunta por regulacion especifica (fintech, salud, educacion)
- Se necesita validar si existe una solucion ya en el mercado

NO usar para generar artefactos o guardar informacion.`,
    input_schema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: 'La consulta de busqueda. Ser especifico con el mercado geografico (LATAM, Argentina, Mexico, etc.) y el vertical.',
        },
        focus: {
          type: 'string',
          enum: ['competitors', 'market_size', 'regulation', 'trends', 'funding_landscape', 'technology'],
          description: 'El angulo de investigacion para orientar la busqueda.',
        },
        region: {
          type: 'string',
          enum: ['latam', 'argentina', 'mexico', 'colombia', 'brasil', 'chile', 'global'],
          description: 'Region geografica de interes.',
        },
      },
      required: ['query', 'focus'],
    },
  },

  {
    name: 'gen_artifact',
    description: `Genera un artefacto estructurado y personalizado basado en la informacion del fundador.

TIPOS DISPONIBLES:
- bmc: Business Model Canvas con los 9 bloques
- scorecard: Puntaje de inversibilidad 1-10 por dimension
- financial_model: Modelo financiero scaffold con supuestos por vertical
- experiment_roadmap: Roadmap de 3-5 experimentos priorizados
- competitor_map: Mapa de posicionamiento con competidores
- pitch_outline: Estructura slide por slide del pitch deck
- funding_map: Mapa de oportunidades de financiamiento (hackathons, grants, aceleradoras, VCs) con deadlines, montos y fit score
- adapted_pitch: Pitch deck adaptado a una oportunidad especifica (hackathon, grant, aceleradora) con enfasis en lo que evaluan
- investor_deck: Pitch deck para inversores (VC/angels) con estructura clasica de fundraising: Ask (monto + equity + valuacion), Use of Funds, TAM/SAM/SOM, proyecciones financieras

CUANDO USARLO: Cuando tenes suficiente contexto de la idea (al menos 2-3 turnos de conversacion). Siempre generarlo DESPUES de hacer preguntas y recopilar informacion.
Para funding_map: generarlo despues de search_funding.
Para adapted_pitch: generarlo cuando se identifica una oportunidad concreta y el fundador quiere aplicar.
Para investor_deck: generarlo en modo pitch cuando el fundador tiene datos financieros y quiere levantar capital de inversores.`,
    input_schema: {
      type: 'object' as const,
      properties: {
        type: {
          type: 'string',
          enum: ['bmc', 'scorecard', 'financial_model', 'experiment_roadmap', 'competitor_map', 'pitch_outline', 'funding_map', 'adapted_pitch', 'investor_deck'],
          description: 'El tipo de artefacto a generar.',
        },
        title: {
          type: 'string',
          description: 'Titulo del artefacto (ej: "BMC — Fintech de pagos B2B para PYMEs")',
        },
        context: {
          type: 'object' as const,
          description: 'Toda la informacion del fundador relevante para este artefacto.',
          properties: {
            idea_description: { type: 'string' },
            target_customer: { type: 'string' },
            problem: { type: 'string' },
            solution: { type: 'string' },
            business_model: { type: 'string' },
            stage: { type: 'string' },
            vertical: { type: 'string' },
            key_metrics: { type: 'object' as const },
            competitors_found: { type: 'array' as const, items: { type: 'string' } },
          },
        },
      },
      required: ['type', 'title', 'context'],
    },
  },

  {
    name: 'save_memory',
    description: `Guarda informacion importante del fundador o su startup en la memoria persistente entre sesiones.

CUANDO USARLO:
- El fundador valida o invalida una hipotesis importante
- Se menciona una metrica clave (MRR, CAC, churn, clientes)
- Se toma una decision estrategica importante
- Se identifica un aprendizaje que deberia recordarse en futuras sesiones
- El fundador menciona un competidor relevante

NO usarlo para todo — solo para informacion que cambiaria el analisis futuro.`,
    input_schema: {
      type: 'object' as const,
      properties: {
        category: {
          type: 'string',
          enum: ['hypothesis', 'validation', 'metric', 'competitor', 'experiment', 'decision', 'milestone', 'risk'],
          description: 'Categoria de la informacion a guardar.',
        },
        key: {
          type: 'string',
          description: 'Identificador unico y descriptivo (ej: "cac_canal_google_ads", "hipotesis_pricing_freemium")',
        },
        value: {
          type: 'object' as const,
          description: 'El contenido de la memoria. Incluir datos, fecha, contexto.',
        },
        summary: {
          type: 'string',
          description: 'Resumen en 1-2 oraciones de que se esta guardando y por que importa.',
        },
      },
      required: ['category', 'key', 'value', 'summary'],
    },
  },

  {
    name: 'search_funding',
    description: `Busca oportunidades de financiamiento relevantes para la startup: hackathons, grants, aceleradoras, concursos, angel investors y fondos de VC early-stage.

CUANDO USARLO:
- El fundador tiene una idea o startup en etapa temprana (idea, prototipo, MVP)
- Se necesita identificar fuentes de financiamiento no-dilutivas (grants, premios)
- El fundador pregunta por hackathons, concursos o programas para aplicar
- Despues de generar un scorecard o BMC y la startup parece viable
- El fundador esta en LATAM y busca oportunidades regionales

COMPORTAMIENTO AUTONOMO:
- Si detectas que la startup esta en etapa idea/prototipo/mvp, busca oportunidades proactivamente
- Despues de buscar, genera automaticamente un funding_map y sugiere adaptar el pitch`,
    input_schema: {
      type: 'object' as const,
      properties: {
        startup_description: {
          type: 'string',
          description: 'Descripcion breve de la startup (que hace, para quien, en que etapa esta)',
        },
        vertical: {
          type: 'string',
          description: 'Vertical de la startup (fintech, healthtech, edtech, saas, marketplace, climate, etc.)',
        },
        stage: {
          type: 'string',
          enum: ['idea', 'prototipo', 'mvp', 'traccion', 'revenue'],
          description: 'Etapa actual de la startup.',
        },
        country: {
          type: 'string',
          description: 'Pais base de la startup.',
        },
        funding_types: {
          type: 'array' as const,
          items: { type: 'string', enum: ['hackathon', 'grant', 'accelerator', 'angel', 'vc', 'competition'] },
          description: 'Tipos de financiamiento a buscar. Si no se especifica, busca todos.',
        },
      },
      required: ['startup_description', 'vertical', 'stage', 'country'],
    },
  },

  {
    name: 'push_apps',
    description: `Envia un artefacto generado a las aplicaciones conectadas del fundador (Google Drive, Notion, Gmail).

CUANDO USARLO:
- El fundador pide explicitamente "guardalo en Drive", "mandamelo por mail", etc.
- Se completo un artefacto importante y el fundador quiere compartirlo

IMPORTANTE: Solo llamar si el fundador tiene la integracion conectada. Siempre confirmar antes de enviar.`,
    input_schema: {
      type: 'object' as const,
      properties: {
        destination: {
          type: 'string',
          enum: ['google_drive', 'notion', 'gmail'],
          description: 'Destino del artefacto.',
        },
        artifact_id: {
          type: 'string',
          description: 'ID del artefacto en la base de datos.',
        },
        format: {
          type: 'string',
          enum: ['doc', 'page', 'email'],
          description: 'Formato de destino segun la plataforma.',
        },
      },
      required: ['destination', 'artifact_id', 'format'],
    },
  },
];
