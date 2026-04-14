# Copiloto para Fundadores

Co-founder IA para startups LATAM. Valida tu idea, arma tus numeros, prepara tu pitch y encuentra funding — todo autonomo, en una sola conversacion.

## Que hace

Un agente agentico que actua como socio operativo: no da consejos genericos, ejecuta. Le contas tu idea y te devuelve artefactos concretos listos para usar.

### Journey guiado en 5 etapas

| Etapa | Que hace el agente | Artefactos generados |
|---|---|---|
| **1. Diagnostico** | Busca competidores y mercado, evalua problem-solution fit | Scorecard, BMC, Mapa de competidores |
| **2. Financiero** | Analiza unit economics con benchmarks LATAM reales | Modelo financiero, Roadmap de experimentos |
| **3. Pitch** | Arma dos pitch decks: uno para VCs y otro para hackathons/grants | Investor deck (ask/equity/valuacion), Funding map, Pitch adaptado |
| **4. Q&A Analista** | Simula due diligence con preguntas de VC real | Score de preparacion, Debilidades identificadas |
| **5. Funding** | Busca oportunidades y adapta pitch a la mejor | Mapa de oportunidades, Pitch adaptado, Estrategia LATAM |

Cada etapa se puede saltear o repetir. El progreso se guarda entre sesiones.

### Comportamiento autonomo

El agente NO hace preguntas si ya tiene contexto suficiente. En un solo mensaje ejecuta todo el flujo de herramientas:

```
Usuario: "Tengo una app de telemedicina veterinaria en Mexico, etapa MVP, 80 usuarios"
Agente: [busca competidores] → [busca mercado] → [genera scorecard] → [genera BMC] →
        [genera mapa competitivo] → [guarda en memoria] → analisis completo con proximos pasos
```

## Stack

- **Frontend**: Next.js 16 (App Router, Turbopack)
- **Auth + DB**: Supabase (Auth, PostgreSQL, RLS)
- **IA**: Claude API (Sonnet 4) con tool_use multi-turn
- **Busqueda web**: Anthropic native web_search tool
- **Streaming**: Server-Sent Events (SSE)
- **Styling**: Tailwind CSS
- **Deploy**: Vercel

## Arquitectura

```
app/
  (auth)/login, signup        Auth con Supabase
  (dashboard)/                Dashboard con journey guiado
    chat/[id]                 Chat agentico con streaming
    settings/                 Integraciones OAuth
    onboarding/               Setup de perfil del fundador
  api/
    chat/                     SSE streaming del agent loop
    conversations/            CRUD de conversaciones
    journey/                  Progreso del journey
    integrations/             OAuth (Google, Notion)

lib/agent/
  loop.ts                     Agent loop multi-turn (hasta 10 iteraciones)
  system-prompts.ts           System prompts con flujos autonomos por modo
  tool-definitions.ts         5 herramientas con schemas
  tools/
    web-search.ts             Anthropic native web search
    search-funding.ts         3 busquedas paralelas de funding
    gen-artifact.ts           9 tipos de artefactos estructurados
    save-memory.ts            Memoria persistente entre sesiones
    push-apps.ts              Push a Google Drive, Gmail, Notion

components/
  chat/                       ChatInterface, MessageBubble, ArtifactCard, ToolCallBadge
  dashboard/                  JourneyMap, ConversationList, SignOutButton
  settings/                   IntegrationsPanel (OAuth)
```

## 9 tipos de artefactos

| Tipo | Descripcion |
|---|---|
| `scorecard` | Puntaje de inversibilidad 1-10 por dimension |
| `bmc` | Business Model Canvas (9 bloques) |
| `competitor_map` | Mapa de competidores con posicionamiento |
| `financial_model` | Modelo financiero a 3 anios con supuestos por vertical |
| `experiment_roadmap` | 3-5 experimentos de validacion priorizados |
| `investor_deck` | Pitch deck para VCs: ask, equity, valuacion, use of funds, TAM/SAM/SOM |
| `pitch_outline` | Estructura slide-by-slide del pitch |
| `funding_map` | Mapa de hackathons, grants, aceleradoras con fit score |
| `adapted_pitch` | Pitch adaptado a oportunidad especifica |

## Setup local

### Pre-requisitos

- Node.js 18+
- Cuenta en [Supabase](https://supabase.com) (proyecto creado)
- API key de [Anthropic](https://console.anthropic.com)

### 1. Clonar e instalar

```bash
git clone https://github.com/lucascbacasp/founder-copilot.git
cd founder-copilot
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Editar `.env.local` con tus keys:

```env
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Ejecutar migraciones en Supabase

En el SQL Editor de Supabase, ejecutar en orden:

1. `supabase/migrations/001_initial_schema.sql` — tablas base + RLS
2. `supabase/migrations/002_add_artifact_types.sql` — funding_map, adapted_pitch
3. `supabase/migrations/003_journey_progress.sql` — journey tracking
4. `supabase/migrations/004_investor_deck_type.sql` — investor_deck

### 4. Levantar el servidor

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

### 5. (Opcional) Integraciones OAuth

Para Google Drive/Gmail y Notion, configurar en `.env.local`:

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NOTION_CLIENT_ID=...
NOTION_CLIENT_SECRET=...
```

## Deploy en Vercel

1. Push a GitHub
2. Importar en [vercel.com/new](https://vercel.com/new)
3. Configurar las environment variables
4. Deploy

## Construido con

- [Claude API](https://docs.anthropic.com) — Agente agentico con tool_use
- [Next.js](https://nextjs.org) — Framework fullstack
- [Supabase](https://supabase.com) — Auth + PostgreSQL
- [Tailwind CSS](https://tailwindcss.com) — Estilos

---

Construido para un hackaton. El agente piensa como Kaszek, habla como founder.
