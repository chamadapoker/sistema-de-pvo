
-- Enable RLS on tables (just to be safe/sure)
ALTER TABLE test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_questions ENABLE ROW LEVEL SECURITY;

-- 1. Policies for test_attempts
DROP POLICY IF EXISTS "Users can view their own attempts" ON test_attempts;
DROP POLICY IF EXISTS "Users can create their own attempts" ON test_attempts;
DROP POLICY IF EXISTS "Users can update their own attempts" ON test_attempts;

CREATE POLICY "Users can view their own attempts" 
ON test_attempts FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own attempts" 
ON test_attempts FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own attempts" 
ON test_attempts FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- 2. Policies for student_answers
DROP POLICY IF EXISTS "Users can view their own answers" ON student_answers;
DROP POLICY IF EXISTS "Users can create their own answers" ON student_answers;
DROP POLICY IF EXISTS "Users can update their own answers" ON student_answers;

CREATE POLICY "Users can view their own answers" 
ON student_answers FOR SELECT 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM test_attempts 
        WHERE test_attempts.id = student_answers.attempt_id 
        AND test_attempts.user_id = auth.uid()
    )
);

CREATE POLICY "Users can create their own answers" 
ON student_answers FOR INSERT 
TO authenticated 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM test_attempts 
        WHERE test_attempts.id = student_answers.attempt_id 
        AND test_attempts.user_id = auth.uid()
    )
);

CREATE POLICY "Users can update their own answers" 
ON student_answers FOR UPDATE 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM test_attempts 
        WHERE test_attempts.id = student_answers.attempt_id 
        AND test_attempts.user_id = auth.uid()
    )
);

-- 3. Policies for test_questions
-- Everyone authenticated should be able to see questions for a test
DROP POLICY IF EXISTS "Authenticated users can view test questions" ON test_questions;

CREATE POLICY "Authenticated users can view test questions" 
ON test_questions FOR SELECT 
TO authenticated 
USING (true);

-- 4. Policies for tests (viewing)
-- Everyone authenticated needs to see the test details to take it
DROP POLICY IF EXISTS "Authenticated users can view tests" ON tests;
CREATE POLICY "Authenticated users can view tests" 
ON tests FOR SELECT 
TO authenticated 
USING (true);
