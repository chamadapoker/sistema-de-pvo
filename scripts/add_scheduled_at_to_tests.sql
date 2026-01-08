-- Add scheduled_at column to tests if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tests' AND column_name = 'scheduled_at') THEN
        ALTER TABLE public.tests ADD COLUMN scheduled_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;
