import type { Translations } from './es';

const en: Translations = {
  // Common
  common: {
    loading: 'Loading...',
    saving: 'Saving...',
    error: 'Error',
    back: 'Back',
    next: 'Next',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    connect: 'Connect',
    connected: 'Connected',
    disconnect: 'Disconnect',
    connecting: 'Connecting...',
    viewAll: 'View all',
    noTitle: 'Untitled',
  },

  // Auth
  auth: {
    appName: 'Founder Copilot',
    login: {
      subtitle: 'Sign in to continue',
      email: 'Email',
      emailPlaceholder: 'you@email.com',
      password: 'Password',
      passwordPlaceholder: '********',
      submit: 'Sign in',
      submitting: 'Signing in...',
      noAccount: "Don't have an account?",
      signupLink: 'Sign up →',
    },
    signup: {
      title: 'Create account',
      subtitle: 'Start validating your startup with AI',
      fullName: 'Full name',
      fullNamePlaceholder: 'Your name',
      email: 'Email',
      emailPlaceholder: 'you@email.com',
      password: 'Password',
      passwordPlaceholder: 'Minimum 6 characters',
      submit: 'Create account',
      submitting: 'Creating account...',
      hasAccount: 'Already have an account?',
      loginLink: 'Sign in',
    },
    signOut: 'Sign out',
  },

  // Sidebar
  sidebar: {
    brandSub: 'for Founders',
    nav: {
      dashboard: 'Dashboard',
      newChat: 'New conversation',
      artifacts: 'Artifacts',
      completeProfile: 'Complete your profile',
      settings: 'Settings',
    },
    history: 'History',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },

  // Dashboard
  dashboard: {
    welcome: 'Welcome',
    stagesCompleted: 'stages completed',
    completeProfile: {
      title: 'Complete your profile to get started',
      description: 'With your data, the copilot personalizes everything: the questions it asks, the competitors it researches, and the benchmarks it uses.',
      cta: 'Complete →',
    },
    nextStep: {
      title: 'Your next step',
      cta: 'Start →',
    },
    allComplete: {
      title: 'All stages completed!',
      description: 'You can repeat any stage or explore your generated artifacts.',
    },
    validationPath: 'Validation path',
    artifacts: {
      title: 'Generated artifacts',
      viewAll: 'View all →',
      empty: {
        title: 'No artifacts yet',
        description: 'Each conversation generates real deliverables: BMC, scorecard, financial model, and more.',
        cta: 'Start diagnostic',
      },
    },
    conversations: {
      title: 'Recent conversations',
      new: 'New +',
      empty: {
        title: 'No conversations',
        description: 'Share your idea and the copilot helps you validate it step by step.',
        cta: 'New conversation',
      },
    },
  },

  // Journey
  journey: {
    title: 'Your validation path',
    startValidating: 'Start by validating your idea',
    allComplete: 'All stages completed!',
    completed: 'completed',
    skipped: 'skipped',
    statusCompleted: 'Completed',
    statusNext: 'Next',
    statusSkipped: 'Skipped',
    deliverables: 'What you will get:',
    start: 'Start',
    repeat: 'Repeat',
    skip: 'Skip',
    undoSkip: 'Undo skip',
    steps: {
      diagnostico: {
        title: 'Diagnostic',
        shortDesc: 'Validate your problem',
        longDesc: 'Evaluate if your idea solves a real problem. The agent researches competitors, analyzes the market, and generates an investability scorecard.',
        deliverables: 'Scorecard, BMC, Competitor Map',
      },
      financiero: {
        title: 'Financial',
        shortDesc: 'Test the numbers',
        longDesc: 'Analyze unit economics, revenue model, and projections. The agent searches for market benchmarks to calibrate your numbers.',
        deliverables: 'Financial Model, Projections',
      },
      pitch: {
        title: 'Pitch',
        shortDesc: 'Build your narrative',
        longDesc: 'Build two pitch decks: a generic one and one adapted to a specific opportunity from your funding map.',
        deliverables: 'Pitch Deck, Adapted Pitch',
      },
      qa: {
        title: 'Q&A Analyst',
        shortDesc: 'Stress-test your story',
        longDesc: 'Simulate a due diligence session with a VC analyst. Tough questions about market, team, traction, and risks.',
        deliverables: 'Due Diligence Preparation',
      },
      funding: {
        title: 'Funding',
        shortDesc: 'Find resources',
        longDesc: 'Search for hackathons, grants, accelerators, and funding opportunities in LATAM and globally.',
        deliverables: 'Opportunity Map, Adapted Pitch',
      },
      challenge: {
        title: 'Challenge',
        shortDesc: 'Challenge your readiness',
        longDesc: 'YC-style training with 12 tough questions, follow-ups, and a final scorecard.',
        deliverables: 'Challenge Scorecard',
      },
    },
  },

  // Chat
  chat: {
    selectMode: 'Choose a mode',
    selectModeDesc: 'Each mode adapts the agent for a different goal',
    journeyStep: 'Journey step:',
    recommended: 'Recommended',
    completed: 'Completed',
    generates: 'Generates:',
    tip: 'Tip: use the',
    tipLink: 'dashboard path',
    tipSuffix: 'to follow the recommended path',
    inputPlaceholder: 'Type your message...',
    send: 'Send',
    savedMemory: 'Saved:',
    emptyChat: 'Share your idea and the copilot will help you validate it.',
    errorConnect: 'Error: could not connect to the agent. Try again.',
    modes: {
      diagnostico: {
        label: 'Diagnostic',
        description: 'Problem-solution fit validation, market and competitive analysis',
        artifacts: 'Scorecard + BMC + Competitor map',
        estimate: '~15 min',
      },
      financiero: {
        label: 'Financial',
        description: 'Unit economics analysis, revenue model, and projections',
        artifacts: 'Financial model + Projections',
        estimate: '~10 min',
      },
      pitch: {
        label: 'Pitch',
        description: 'Pitch deck construction and investor narrative',
        artifacts: 'Pitch deck + Adapted pitch',
        estimate: '~12 min',
      },
      qa: {
        label: 'Q&A Analyst',
        description: 'Due diligence simulation with a demanding VC',
        artifacts: 'Q&A Preparation',
        estimate: '~10 min',
      },
      latam: {
        label: 'LATAM Expansion',
        description: 'Regional expansion strategy and opportunity search',
        artifacts: 'Funding map + Adapted pitch',
        estimate: '~12 min',
      },
      challenge: {
        label: 'Challenge',
        description: '12 tough YC-style questions, follow-ups, and scorecard',
        artifacts: 'Challenge Scorecard',
        estimate: '~15 min',
      },
    },
    tools: {
      web_search: { label: 'Web search', active: 'Searching for information...' },
      gen_artifact: { label: 'Artifact generated', active: 'Generating artifact...' },
      save_memory: { label: 'Memory saved', active: 'Saving to memory...' },
      push_apps: { label: 'Sent to app', active: 'Sending to app...' },
      search_funding: { label: 'Opportunities found', active: 'Searching hackathons, grants & funding...' },
    },
  },

  // Artifact Card
  artifactCard: {
    scoreGeneral10: '/10 overall score',
    scoreGeneral5: '/5 overall score',
    valueProp: 'Value proposition: ',
    segments: 'Segments: ',
    revenueYear1: 'Year 1 Revenue: ',
    ltvCac: 'LTV:CAC: ',
    moreOpportunities: 'more opportunities',
    quickWins: 'Quick wins: ',
    for: 'For: ',
    angle: 'Angle: ',
    slides: 'slides: ',
    tip: 'Tip: ',
    fundraising: 'Fundraising',
    equity: 'Equity',
    valuation: 'Valuation',
    useOfFunds: 'Use of Funds:',
    defaultSummary: 'Artifact generated. View full detail in the dashboard.',
    viewDetail: 'View detail →',
  },

  // Onboarding
  onboarding: {
    title: 'Set up your profile',
    subtitle: 'With this data, the copilot personalizes everything: the questions it asks, the competitors it researches, and the benchmarks it uses.',
    steps: ['Your startup', 'Context'],
    fields: {
      companyName: 'Startup name',
      companyNamePlaceholder: 'E.g.: MyFintech',
      description: 'What problem do you solve and for whom?',
      descriptionPlaceholder: 'E.g.: We automate collections for SMBs losing up to 15% of revenue to late payments',
      stage: 'Current stage',
      vertical: 'Vertical',
      country: 'Primary country',
      pitchSummary: 'Pitch one-liner',
      pitchTemplate: '[Verb] [what] for [whom] in [where]',
      pitchExample: 'E.g.: "We automate collections for SMBs in LATAM"',
      metrics: 'Current metrics (help calibrate financial analysis)',
      mrr: 'MRR (USD)',
      activeCustomers: 'Active customers',
      noRevenueNote: "If you don't have revenue or customers yet, that's normal. The copilot adapts to your stage.",
    },
    required: '*',
    submit: 'Get started',
    submitting: 'Saving...',
    skipStep: 'Skip for now and complete later',
  },

  // Settings
  settings: {
    title: 'Settings',
    profile: {
      title: 'Startup profile',
      startup: 'Startup',
      stage: 'Stage',
      vertical: 'Vertical',
      country: 'Country',
      mrr: 'MRR',
      activeCustomers: 'Active customers',
      description: 'Description',
      emptyMessage: 'Complete your profile so the copilot can give you personalized analysis.',
      completeCta: 'Complete profile →',
    },
    memory: {
      title: 'What the copilot knows about your startup',
      subtitle: 'Information the agent saved from your conversations. You can delete any item.',
      empty: "The copilot hasn't saved any information yet. It fills up automatically during conversations.",
      deleteTitle: 'Delete',
    },
    integrations: {
      title: 'Integrations',
      subtitle: 'Connect your tools to export artifacts directly from the chat.',
      googleDesc: 'Drive + Gmail — export artifacts to Google Docs and send them by email',
      notionDesc: 'Export artifacts as pages in your Notion workspace',
      connectedOn: 'Connected on',
      loading: 'Loading integrations...',
    },
    account: {
      title: 'Account',
      email: 'Email',
    },
  },

  // Artifacts page
  artifactsPage: {
    title: 'Artifacts',
    all: 'All',
    empty: {
      title: 'No artifacts yet',
      description: 'The agent generates artifacts automatically during conversations.',
      cta: 'Start diagnostic',
    },
    notFound: 'Artifact not found.',
    backToArtifacts: 'Back to artifacts',
    dimensions: 'Dimensions',
    miniKpi: {
      opportunities: 'opportunities',
      experiments: 'experiments',
      competitors: 'competitors',
    },
    bmcLabels: {
      key_partners: 'Key Partners',
      key_activities: 'Key Activities',
      key_resources: 'Key Resources',
      value_proposition: 'Value Proposition',
      customer_relationships: 'Customer Relationships',
      channels: 'Channels',
      customer_segments: 'Customer Segments',
      cost_structure: 'Cost Structure',
      revenue_streams: 'Revenue Streams',
    },
  },

  // Stages
  stages: {
    idea: 'Idea',
    prototipo: 'Prototype',
    mvp: 'MVP',
    traccion: 'Traction',
    revenue: 'Revenue',
  },

  // Stage descriptions (onboarding)
  stageDescriptions: {
    idea: "I have an idea but haven't started building",
    prototipo: 'I have a prototype or mockup',
    mvp: 'I have an MVP in users hands',
    traccion: 'I have active users and usage metrics',
    revenue: "I'm generating revenue",
  },

  // Verticals
  verticals: {
    saas: 'SaaS',
    fintech: 'Fintech',
    marketplace: 'Marketplace',
    consumer: 'Consumer',
    deeptech: 'Deep Tech',
    otro: 'Other',
  },

  // Countries
  countries: {
    argentina: 'Argentina',
    mexico: 'Mexico',
    colombia: 'Colombia',
    brasil: 'Brazil',
    chile: 'Chile',
    peru: 'Peru',
    uruguay: 'Uruguay',
    otro: 'Other',
  },

  // Memory categories
  memoryCategories: {
    hypothesis: 'Hypothesis',
    validation: 'Validation',
    metric: 'Metric',
    competitor: 'Competitor',
    experiment: 'Experiment',
    decision: 'Decision',
    milestone: 'Milestone',
    risk: 'Risk',
  },

  // Artifact type labels
  artifactTypes: {
    bmc: 'Business Model Canvas',
    scorecard: 'Investability Scorecard',
    financial_model: 'Financial Model',
    experiment_roadmap: 'Experiment Roadmap',
    competitor_map: 'Competitor Map',
    pitch_outline: 'Pitch Outline',
    funding_map: 'Opportunity Map',
    adapted_pitch: 'Adapted Pitch',
    investor_deck: 'Investor Deck',
    challenge_scorecard: 'Challenge Scorecard',
  },

  // Mode labels
  modeLabels: {
    diagnostico: 'Diagnostic',
    financiero: 'Financial',
    pitch: 'Pitch',
    qa: 'Q&A Analyst',
    latam: 'LATAM Expansion',
    challenge: 'Challenge',
  },

  // Language
  language: {
    label: 'Language',
    es: 'Español',
    en: 'English',
  },
};

export default en;
