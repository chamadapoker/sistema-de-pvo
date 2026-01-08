-- Add user_id to test_attempts if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'test_attempts' AND column_name = 'user_id') THEN
        ALTER TABLE public.test_attempts ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Force Foreign Key Relationship for PostgREST on test_attempts
ALTER TABLE public.test_attempts 
  DROP CONSTRAINT IF EXISTS test_attempts_user_id_fkey,
  ADD CONSTRAINT test_attempts_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- Refresh schema cache
NOTIFY pgrst, 'reload config';
