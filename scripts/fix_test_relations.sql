-- Create test_questions table if it doesn't exist (it should, but safety first)
CREATE TABLE IF NOT EXISTS public.test_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE,
  equipment_id TEXT NOT NULL, -- Assuming equipment uses text IDs
  question_order INTEGER NOT NULL,
  points INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Force Foreign Key Relationship for PostgREST
-- Supabase needs explicit foreign keys to detect relationships for joins
-- This re-adds the FK to be absolutely sure
ALTER TABLE public.test_questions 
  DROP CONSTRAINT IF EXISTS test_questions_test_id_fkey,
  ADD CONSTRAINT test_questions_test_id_fkey 
  FOREIGN KEY (test_id) 
  REFERENCES public.tests(id) 
  ON DELETE CASCADE;

-- Refresh schema cache (usually happens automatically but good to trigger if needed)
NOTIFY pgrst, 'reload config';
