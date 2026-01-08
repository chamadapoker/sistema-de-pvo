-- Create test_questions table if it doesn't exist
CREATE TABLE IF NOT EXISTS test_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
    equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
    question_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_test_questions_test_id ON test_questions(test_id);

-- Ensure categories table is ready for CRUD (it likely is, just being safe)
-- (No extra action needed for categories usually, just ensuring RLS policies if we were doing RLS, but we are using anon key for now which is open or service_role)

-- Add missing columns to tests if needed (e.g. status)
ALTER TABLE tests ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'SCHEDULED'; -- SCHEDULED, ACTIVE, FINISHED
ALTER TABLE tests ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE tests ADD COLUMN IF NOT EXISTS category_id BIGINT REFERENCES categories(id);

-- Enable RLS for test_questions if enabled for others (optional but good practice)
ALTER TABLE test_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON test_questions FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON test_questions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for creators" ON test_questions FOR UPDATE USING (auth.uid() = (SELECT creator_id FROM tests WHERE id = test_id));
CREATE POLICY "Enable delete for creators" ON test_questions FOR DELETE USING (auth.uid() = (SELECT creator_id FROM tests WHERE id = test_id));
