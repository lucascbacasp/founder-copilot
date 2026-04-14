-- ============================================================
-- FOUNDER PROFILES
-- ============================================================
CREATE TABLE founder_profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name       TEXT,
  company_name    TEXT,
  stage           TEXT CHECK (stage IN ('idea','prototipo','mvp','traccion','revenue')),
  vertical        TEXT CHECK (vertical IN ('saas','fintech','marketplace','consumer','deeptech','otro')),
  country         TEXT DEFAULT 'ARG',
  description     TEXT,
  pitch_summary   TEXT,
  mrr             INTEGER DEFAULT 0,
  active_customers INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CONVERSATIONS
-- ============================================================
CREATE TABLE conversations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mode        TEXT NOT NULL CHECK (mode IN ('diagnostico','financiero','pitch','qa','latam')),
  title       TEXT,
  status      TEXT DEFAULT 'active' CHECK (status IN ('active','archived')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_conversations_user_id ON conversations(user_id);

-- ============================================================
-- MESSAGES
-- ============================================================
CREATE TABLE messages (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id     UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role                TEXT NOT NULL CHECK (role IN ('user','assistant','tool')),
  content             JSONB NOT NULL,
  tool_calls          JSONB,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);

-- ============================================================
-- FOUNDER MEMORY
-- ============================================================
CREATE TABLE founder_memory (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category                TEXT NOT NULL CHECK (category IN (
                            'hypothesis','validation','metric','competitor',
                            'experiment','decision','milestone','risk'
                          )),
  key                     TEXT NOT NULL,
  value                   JSONB NOT NULL,
  summary                 TEXT,
  source_conversation_id  UUID REFERENCES conversations(id),
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, category, key)
);

CREATE INDEX idx_memory_user_id ON founder_memory(user_id);

-- ============================================================
-- ARTIFACTS
-- ============================================================
CREATE TABLE artifacts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id     UUID REFERENCES conversations(id),
  type                TEXT NOT NULL CHECK (type IN (
                        'bmc','scorecard','financial_model',
                        'experiment_roadmap','competitor_map','pitch_outline'
                      )),
  title               TEXT NOT NULL,
  content             JSONB NOT NULL,
  external_url        TEXT,
  external_provider   TEXT CHECK (external_provider IN ('google_drive','notion')),
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_artifacts_user_id ON artifacts(user_id);

-- ============================================================
-- USER INTEGRATIONS
-- ============================================================
CREATE TABLE user_integrations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider        TEXT NOT NULL CHECK (provider IN ('google','notion','gmail')),
  access_token    TEXT,
  refresh_token   TEXT,
  expires_at      TIMESTAMPTZ,
  scope           TEXT,
  metadata        JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
CREATE TABLE subscriptions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  stripe_customer_id  TEXT UNIQUE,
  stripe_sub_id       TEXT UNIQUE,
  plan                TEXT DEFAULT 'free' CHECK (plan IN ('free','pro','team')),
  status              TEXT DEFAULT 'active',
  current_period_end  TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE founder_profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations      ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages           ENABLE ROW LEVEL SECURITY;
ALTER TABLE founder_memory     ENABLE ROW LEVEL SECURITY;
ALTER TABLE artifacts          ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_integrations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions      ENABLE ROW LEVEL SECURITY;

-- Each user can only access their own data
CREATE POLICY "users_own_data" ON founder_profiles
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_own_data" ON conversations
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_own_data" ON founder_memory
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_own_data" ON artifacts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_own_data" ON user_integrations
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_own_data" ON subscriptions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_own_messages" ON messages
  FOR ALL
  USING (conversation_id IN (
    SELECT id FROM conversations WHERE user_id = auth.uid()
  ))
  WITH CHECK (conversation_id IN (
    SELECT id FROM conversations WHERE user_id = auth.uid()
  ));
