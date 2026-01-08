-- Drop tables if they exist to be clean (optional, maybe just IF NOT EXISTS)
-- DROP TABLE IF EXISTS test_questions;
-- DROP TABLE IF EXISTS test_results;
-- DROP TABLE IF EXISTS tests;

-- 1. Table: tests
CREATE TABLE IF NOT EXISTS tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    duration INTEGER DEFAULT 0, -- in seconds
    question_count INTEGER DEFAULT 0,
    creator_id UUID, -- REFERENCES auth.users(id) if possible, or just UUID
    location TEXT,
    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'SCHEDULED', -- SCHEDULED, ACTIVE, FINISHED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Table: test_questions (for specific questions in a test)
CREATE TABLE IF NOT EXISTS test_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
    equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
    question_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Table: test_results (storing student results)
CREATE TABLE IF NOT EXISTS test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- auth user id
    test_id UUID REFERENCES tests(id) ON DELETE SET NULL,
    score NUMERIC, -- percentage or points
    correct_answers INTEGER,
    total_questions INTEGER,
    total_time INTEGER, -- in seconds
    test_type TEXT, -- 'WRITTEN' or 'MULTIPLE_CHOICE'
    answers JSONB, -- Store full details
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- Tests RLS
CREATE POLICY "Public read tests" ON tests FOR SELECT USING (true);
CREATE POLICY "Instructors insert tests" ON tests FOR INSERT WITH CHECK (true); -- Relaxed for demo, ideally check role
CREATE POLICY "Instructors update tests" ON tests FOR UPDATE USING (true);
CREATE POLICY "Instructors delete tests" ON tests FOR DELETE USING (true);

-- Test Questions RLS
CREATE POLICY "Public read test_questions" ON test_questions FOR SELECT USING (true);
CREATE POLICY "Instructors insert test_questions" ON test_questions FOR INSERT WITH CHECK (true);

-- Test Results RLS
CREATE POLICY "Users read own results" ON test_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Instructors read all results" ON test_results FOR SELECT USING (
  -- In a real app, check if user is instructor. For now, we might allow all authenticated to read? 
  -- actually strictly:
  auth.uid() = user_id 
  OR 
  EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' IN ('INSTRUCTOR', 'ADMIN'))
);
CREATE POLICY "Users insert own results" ON test_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Fix indexes
CREATE INDEX IF NOT EXISTS idx_tests_category ON tests(category_id);
CREATE INDEX IF NOT EXISTS idx_test_questions_test ON test_questions(test_id);
CREATE INDEX IF NOT EXISTS idx_test_results_user ON test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_test_results_test ON test_results(test_id);
