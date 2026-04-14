const es = {
  // Common
  common: {
    loading: 'Cargando...',
    saving: 'Guardando...',
    error: 'Error',
    back: 'Atrás',
    next: 'Siguiente',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    close: 'Cerrar',
    connect: 'Conectar',
    connected: 'Conectado',
    disconnect: 'Desconectar',
    connecting: 'Conectando...',
    viewAll: 'Ver todos',
    noTitle: 'Sin título',
  },

  // Auth
  auth: {
    appName: 'Copiloto para Fundadores',
    login: {
      subtitle: 'Iniciá sesión para continuar',
      email: 'Email',
      emailPlaceholder: 'tu@email.com',
      password: 'Password',
      passwordPlaceholder: '********',
      submit: 'Ingresar',
      submitting: 'Ingresando...',
      noAccount: '¿No tenés cuenta?',
      signupLink: 'Registrate →',
    },
    signup: {
      title: 'Crear cuenta',
      subtitle: 'Empezá a validar tu startup con IA',
      fullName: 'Nombre completo',
      fullNamePlaceholder: 'Tu nombre',
      email: 'Email',
      emailPlaceholder: 'tu@email.com',
      password: 'Password',
      passwordPlaceholder: 'Mínimo 6 caracteres',
      submit: 'Crear cuenta',
      submitting: 'Creando cuenta...',
      hasAccount: '¿Ya tenés cuenta?',
      loginLink: 'Iniciá sesión',
    },
    signOut: 'Cerrar sesión',
  },

  // Sidebar
  sidebar: {
    brandSub: 'para Fundadores',
    nav: {
      dashboard: 'Dashboard',
      newChat: 'Nueva conversación',
      artifacts: 'Artefactos',
      completeProfile: 'Completá tu perfil',
      settings: 'Configuración',
    },
    history: 'Historial',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
  },

  // Dashboard
  dashboard: {
    welcome: 'Bienvenido',
    stagesCompleted: 'etapas completadas',
    completeProfile: {
      title: 'Completá tu perfil para empezar',
      description: 'Con tus datos, el copiloto personaliza: las preguntas que te hace, los competidores que busca y los benchmarks que usa.',
      cta: 'Completar →',
    },
    nextStep: {
      title: 'Tu siguiente paso',
      cta: 'Empezar →',
    },
    allComplete: {
      title: '¡Completaste todas las etapas!',
      description: 'Podés repetir cualquier etapa o explorar tus artefactos generados.',
    },
    validationPath: 'Camino de validación',
    artifacts: {
      title: 'Artefactos generados',
      viewAll: 'Ver todos →',
      empty: {
        title: 'Sin artefactos todavía',
        description: 'Cada conversación genera deliverables reales: BMC, scorecard, modelo financiero y más.',
        cta: 'Empezar diagnóstico',
      },
    },
    conversations: {
      title: 'Conversaciones recientes',
      new: 'Nueva +',
      empty: {
        title: 'Sin conversaciones',
        description: 'Contá tu idea y el copiloto te ayuda a validarla paso a paso.',
        cta: 'Nueva conversación',
      },
    },
  },

  // Journey
  journey: {
    title: 'Tu camino de validación',
    startValidating: 'Empezá por validar tu idea',
    allComplete: '¡Completaste todas las etapas!',
    completed: 'completadas',
    skipped: 'salteadas',
    statusCompleted: 'Completado',
    statusNext: 'Siguiente',
    statusSkipped: 'Salteado',
    deliverables: 'Qué vas a obtener:',
    start: 'Empezar',
    repeat: 'Repetir',
    skip: 'Saltear',
    undoSkip: 'Deshacer skip',
    steps: {
      diagnostico: {
        title: 'Diagnóstico',
        shortDesc: 'Validá tu problema',
        longDesc: 'Evaluá si tu idea resuelve un problema real. El agente investiga competidores, analiza el mercado y genera un scorecard de inversibilidad.',
        deliverables: 'Scorecard, BMC, Mapa de Competidores',
      },
      financiero: {
        title: 'Financiero',
        shortDesc: 'Probá los números',
        longDesc: 'Analizá unit economics, modelo de revenue y proyecciones. El agente busca benchmarks del mercado para calibrar tus números.',
        deliverables: 'Modelo Financiero, Proyecciones',
      },
      pitch: {
        title: 'Pitch',
        shortDesc: 'Armá tu narrativa',
        longDesc: 'Construí dos pitch decks: uno genérico y uno adaptado a una oportunidad específica de tu funding map.',
        deliverables: 'Pitch Deck, Pitch Adaptado',
      },
      qa: {
        title: 'Q&A Analista',
        shortDesc: 'Stress-test tu historia',
        longDesc: 'Simulá una due diligence con un analista VC. Preguntas difíciles sobre mercado, equipo, tracción y riesgos.',
        deliverables: 'Preparación para Due Diligence',
      },
      funding: {
        title: 'Funding',
        shortDesc: 'Conseguí recursos',
        longDesc: 'Buscá hackathons, grants, aceleradoras y oportunidades de financiamiento en LATAM y globales.',
        deliverables: 'Mapa de Oportunidades, Pitch Adaptado',
      },
      challenge: {
        title: 'Challenge',
        shortDesc: 'Desafiá tu preparación',
        longDesc: 'Entrenamiento estilo Y Combinator con 12 preguntas duras, repreguntas y un scorecard final.',
        deliverables: 'Challenge Scorecard',
      },
    },
  },

  // Chat
  chat: {
    selectMode: 'Elegí un modo',
    selectModeDesc: 'Cada modo adapta al agente para un objetivo distinto',
    journeyStep: 'Paso del journey:',
    recommended: 'Recomendado',
    completed: 'Completado',
    generates: 'Genera:',
    tip: 'Tip: usá el',
    tipLink: 'camino del dashboard',
    tipSuffix: 'para seguir el camino recomendado',
    inputPlaceholder: 'Escribí tu mensaje...',
    send: 'Enviar',
    savedMemory: 'Guardado:',
    emptyChat: 'Contá tu idea y el copiloto te va a ayudar a validarla.',
    errorConnect: 'Error: no se pudo conectar con el agente. Intentá de nuevo.',
    modes: {
      diagnostico: {
        label: 'Diagnóstico',
        description: 'Validación de problem-solution fit, análisis de mercado y competencia',
        artifacts: 'Scorecard + BMC + Mapa competitivo',
        estimate: '~15 min',
      },
      financiero: {
        label: 'Financiero',
        description: 'Análisis de unit economics, modelo de revenue y proyecciones',
        artifacts: 'Modelo financiero + Proyecciones',
        estimate: '~10 min',
      },
      pitch: {
        label: 'Pitch',
        description: 'Construcción de pitch deck y narrativa para inversores',
        artifacts: 'Pitch deck + Pitch adaptado',
        estimate: '~12 min',
      },
      qa: {
        label: 'Q&A Analista',
        description: 'Simulación de due diligence con un VC exigente',
        artifacts: 'Preparación Q&A',
        estimate: '~10 min',
      },
      latam: {
        label: 'Expansión LATAM',
        description: 'Estrategia de expansión regional y búsqueda de oportunidades',
        artifacts: 'Funding map + Pitch adaptado',
        estimate: '~12 min',
      },
      challenge: {
        label: 'Challenge',
        description: '12 preguntas duras estilo YC, repreguntas y scorecard',
        artifacts: 'Challenge Scorecard',
        estimate: '~15 min',
      },
    },
    tools: {
      web_search: { label: 'Búsqueda web', active: 'Buscando información...' },
      gen_artifact: { label: 'Artefacto generado', active: 'Generando artefacto...' },
      save_memory: { label: 'Memoria guardada', active: 'Guardando en memoria...' },
      push_apps: { label: 'Enviado a app', active: 'Enviando a app...' },
      search_funding: { label: 'Oportunidades encontradas', active: 'Buscando hackathons, grants y fondeo...' },
    },
  },

  // Artifact Card
  artifactCard: {
    scoreGeneral10: '/10 score general',
    scoreGeneral5: '/5 score general',
    valueProp: 'Propuesta de valor: ',
    segments: 'Segmentos: ',
    revenueYear1: 'Revenue Año 1: ',
    ltvCac: 'LTV:CAC: ',
    moreOpportunities: 'oportunidades más',
    quickWins: 'Quick wins: ',
    for: 'Para: ',
    angle: 'Ángulo: ',
    slides: 'slides: ',
    tip: 'Tip: ',
    fundraising: 'Levantamiento',
    equity: 'Equity',
    valuation: 'Valuación',
    useOfFunds: 'Use of Funds:',
    defaultSummary: 'Artefacto generado. Ver detalle completo en el dashboard.',
    viewDetail: 'Ver detalle →',
  },

  // Onboarding
  onboarding: {
    title: 'Configurá tu perfil',
    subtitle: 'Con estos datos, el copiloto personaliza todo: las preguntas que te hace, los competidores que busca y los benchmarks que usa.',
    steps: ['Tu startup', 'Contexto'],
    fields: {
      companyName: 'Nombre de tu startup',
      companyNamePlaceholder: 'Ej: MiFintech',
      description: '¿Qué problema resolvés y para quién?',
      descriptionPlaceholder: 'Ej: Automatizamos cobranzas para PYMEs que pierden hasta 15% de facturación por mora',
      stage: 'Etapa actual',
      vertical: 'Vertical',
      country: 'País principal',
      pitchSummary: 'One-liner del pitch',
      pitchTemplate: '[Verbo] [qué] para [quién] en [dónde]',
      pitchExample: 'Ej: "Automatizamos cobranzas para PYMEs en LATAM"',
      metrics: 'Métricas actuales (ayudan a calibrar el análisis financiero)',
      mrr: 'MRR (USD)',
      activeCustomers: 'Clientes activos',
      noRevenueNote: 'Si todavía no tenés revenue o clientes, es normal. El copiloto se adapta a tu etapa.',
    },
    required: '*',
    submit: 'Empezar',
    submitting: 'Guardando...',
    skipStep: 'Saltear por ahora y completar después',
  },

  // Settings
  settings: {
    title: 'Configuración',
    profile: {
      title: 'Perfil de la startup',
      startup: 'Startup',
      stage: 'Etapa',
      vertical: 'Vertical',
      country: 'País',
      mrr: 'MRR',
      activeCustomers: 'Clientes activos',
      description: 'Descripción',
      emptyMessage: 'Completá tu perfil para que el copiloto te dé análisis personalizados.',
      completeCta: 'Completar perfil →',
    },
    memory: {
      title: 'Lo que el copiloto sabe de tu startup',
      subtitle: 'Información que el agente guardó de tus conversaciones. Podés eliminar cualquier item.',
      empty: 'El copiloto todavía no guardó información. Se llena automáticamente durante las conversaciones.',
      deleteTitle: 'Eliminar',
    },
    integrations: {
      title: 'Integraciones',
      subtitle: 'Conectá tus herramientas para exportar artefactos directamente desde el chat.',
      googleDesc: 'Drive + Gmail — exportá artefactos a Google Docs y envialos por email',
      notionDesc: 'Exportá artefactos como páginas en tu workspace de Notion',
      connectedOn: 'Conectado el',
      loading: 'Cargando integraciones...',
    },
    account: {
      title: 'Cuenta',
      email: 'Email',
    },
  },

  // Artifacts page
  artifactsPage: {
    title: 'Artefactos',
    all: 'Todos',
    empty: {
      title: 'Sin artefactos todavía',
      description: 'El agente genera artefactos automáticamente durante las conversaciones.',
      cta: 'Empezar diagnóstico',
    },
    notFound: 'Artefacto no encontrado.',
    backToArtifacts: 'Volver a artefactos',
    dimensions: 'Dimensiones',
    miniKpi: {
      opportunities: 'oportunidades',
      experiments: 'experimentos',
      competitors: 'competidores',
    },
    bmcLabels: {
      key_partners: 'Socios Clave',
      key_activities: 'Actividades Clave',
      key_resources: 'Recursos Clave',
      value_proposition: 'Propuesta de Valor',
      customer_relationships: 'Relación con Clientes',
      channels: 'Canales',
      customer_segments: 'Segmentos de Clientes',
      cost_structure: 'Estructura de Costos',
      revenue_streams: 'Fuentes de Ingresos',
    },
  },

  // Stages
  stages: {
    idea: 'Idea',
    prototipo: 'Prototipo',
    mvp: 'MVP',
    traccion: 'Tracción',
    revenue: 'Revenue',
  },

  // Stage descriptions (onboarding)
  stageDescriptions: {
    idea: 'Tengo una idea pero no empecé a construir',
    prototipo: 'Tengo un prototipo o mockup',
    mvp: 'Tengo un producto mínimo viable en manos de usuarios',
    traccion: 'Tengo usuarios activos y métricas de uso',
    revenue: 'Estoy generando ingresos',
  },

  // Verticals
  verticals: {
    saas: 'SaaS',
    fintech: 'Fintech',
    marketplace: 'Marketplace',
    consumer: 'Consumer',
    deeptech: 'Deep Tech',
    otro: 'Otro',
  },

  // Countries
  countries: {
    argentina: 'Argentina',
    mexico: 'México',
    colombia: 'Colombia',
    brasil: 'Brasil',
    chile: 'Chile',
    peru: 'Perú',
    uruguay: 'Uruguay',
    otro: 'Otro',
  },

  // Memory categories
  memoryCategories: {
    hypothesis: 'Hipótesis',
    validation: 'Validación',
    metric: 'Métrica',
    competitor: 'Competidor',
    experiment: 'Experimento',
    decision: 'Decisión',
    milestone: 'Hito',
    risk: 'Riesgo',
  },

  // Artifact type labels
  artifactTypes: {
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
  },

  // Mode labels
  modeLabels: {
    diagnostico: 'Diagnóstico',
    financiero: 'Financiero',
    pitch: 'Pitch',
    qa: 'Q&A Analista',
    latam: 'Expansión LATAM',
    challenge: 'Challenge',
  },

  // Language
  language: {
    label: 'Idioma',
    es: 'Español',
    en: 'English',
  },
};

export default es;

// Deep recursive type that converts all leaf values to string
type DeepStringify<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends readonly string[]
      ? string[]
      : T[K] extends Record<string, unknown>
        ? DeepStringify<T[K]>
        : T[K];
};

export type Translations = DeepStringify<typeof es>;
