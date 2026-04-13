-- Civitas initial schema (TECHSTACK.md)
-- Apply in Supabase SQL Editor or via: supabase db push

-- ---------------------------------------------------------------------------
-- Core tables
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(50) UNIQUE NOT NULL,
  icon VARCHAR(50),
  color VARCHAR(20),
  order_index INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT categories_color_check CHECK (
    color IS NULL OR color IN ('blue', 'green')
  )
);

CREATE TABLE IF NOT EXISTS public.category_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories (id) ON DELETE CASCADE,
  language_code VARCHAR(10) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  UNIQUE (category_id, language_code)
);

CREATE TABLE IF NOT EXISTS public.topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories (id) ON DELETE CASCADE,
  slug VARCHAR(100) UNIQUE NOT NULL,
  order_index INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.topic_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES public.topics (id) ON DELETE CASCADE,
  language_code VARCHAR(10) NOT NULL,
  title VARCHAR(200) NOT NULL,
  what_it_is TEXT,
  why_it_matters TEXT,
  what_you_can_do TEXT,
  generated_at TIMESTAMPTZ,
  UNIQUE (topic_id, language_code)
);

CREATE TABLE IF NOT EXISTS public.chat_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_hash VARCHAR(64) UNIQUE NOT NULL,
  question TEXT NOT NULL,
  language_code VARCHAR(10) NOT NULL,
  response TEXT NOT NULL,
  sources JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.local_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL,
  city VARCHAR(100),
  state VARCHAR(50),
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT local_data_type_check CHECK (
    type IN ('representative', 'organization', 'event')
  )
);

CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES public.topics (id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, topic_id)
);

CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES public.topics (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, topic_id)
);

-- ---------------------------------------------------------------------------
-- Indexes (read paths)
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_category_translations_lang
  ON public.category_translations (language_code);

CREATE INDEX IF NOT EXISTS idx_topic_translations_lang
  ON public.topic_translations (language_code);

CREATE INDEX IF NOT EXISTS idx_topics_category
  ON public.topics (category_id);

CREATE INDEX IF NOT EXISTS idx_chat_cache_lang
  ON public.chat_cache (language_code);

CREATE INDEX IF NOT EXISTS idx_local_data_city_state_active
  ON public.local_data (city, state)
  WHERE active = TRUE;

CREATE INDEX IF NOT EXISTS idx_user_progress_user
  ON public.user_progress (user_id);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user
  ON public.bookmarks (user_id);

-- ---------------------------------------------------------------------------
-- Row Level Security (CLAUDE.md: user_progress + bookmarks only)
-- ---------------------------------------------------------------------------

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_progress_select_own" ON public.user_progress;
DROP POLICY IF EXISTS "user_progress_insert_own" ON public.user_progress;
DROP POLICY IF EXISTS "user_progress_update_own" ON public.user_progress;
DROP POLICY IF EXISTS "user_progress_delete_own" ON public.user_progress;

CREATE POLICY "user_progress_select_own"
  ON public.user_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "user_progress_insert_own"
  ON public.user_progress FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_progress_update_own"
  ON public.user_progress FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_progress_delete_own"
  ON public.user_progress FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "bookmarks_select_own" ON public.bookmarks;
DROP POLICY IF EXISTS "bookmarks_insert_own" ON public.bookmarks;
DROP POLICY IF EXISTS "bookmarks_delete_own" ON public.bookmarks;

CREATE POLICY "bookmarks_select_own"
  ON public.bookmarks FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "bookmarks_insert_own"
  ON public.bookmarks FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bookmarks_delete_own"
  ON public.bookmarks FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Seed: languages (CLAUDE.md — en, es, zh)
-- ---------------------------------------------------------------------------

INSERT INTO public.languages (code, name) VALUES
  ('en', 'English'),
  ('es', 'Español'),
  ('zh', '中文')
ON CONFLICT (code) DO NOTHING;
