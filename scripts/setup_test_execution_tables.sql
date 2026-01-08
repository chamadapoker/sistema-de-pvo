-- Create test_attempts table
CREATE TABLE IF NOT EXISTS public.test_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    finished_at TIMESTAMPTZ,
    status TEXT DEFAULT 'IN_PROGRESS', -- IN_PROGRESS, COMPLETED
    score NUMERIC, -- Final score percentage or points
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create student_answers table
CREATE TABLE IF NOT EXISTS public.student_answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    attempt_id UUID REFERENCES public.test_attempts(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.test_questions(id) ON DELETE CASCADE, -- Assuming test_questions exists
    answer_text TEXT,
    time_spent_seconds INTEGER,
    is_correct BOOLEAN, -- NULL = not corrected yet
    points_earned NUMERIC DEFAULT 0,
    instructor_feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(attempt_id, question_id)
);

-- Enable RLS
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_answers ENABLE ROW LEVEL SECURITY;

-- Policies for test_attempts
CREATE POLICY "Users can insert their own attempts" ON public.test_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own attempts" ON public.test_attempts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Instructors can view all attempts" ON public.test_attempts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('INSTRUCTOR', 'ADMIN')
        )
    );

CREATE POLICY "Users can update their own attempts (e.g. finish)" ON public.test_attempts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Instructors/Admins can update attempts (grading)" ON public.test_attempts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('INSTRUCTOR', 'ADMIN')
        )
    );

-- Policies for student_answers
CREATE POLICY "Users can insert their own answers" ON public.student_answers
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.test_attempts 
            WHERE id = attempt_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view their own answers" ON public.student_answers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.test_attempts 
            WHERE id = attempt_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own answers" ON public.student_answers
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.test_attempts 
            WHERE id = attempt_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Instructors can view all answers" ON public.student_answers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('INSTRUCTOR', 'ADMIN')
        )
    );

CREATE POLICY "Instructors can update answers (grading)" ON public.student_answers
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('INSTRUCTOR', 'ADMIN')
        )
    );

-- Helper function to calculate score
CREATE OR REPLACE FUNCTION calculate_attempt_score(attempt_uuid UUID)
RETURNS VOID AS $$
DECLARE
    total_points NUMERIC;
    max_points NUMERIC;
    final_score NUMERIC;
BEGIN
    -- Sum points earned
    SELECT COALESCE(SUM(points_earned), 0) INTO total_points
    FROM public.student_answers
    WHERE attempt_id = attempt_uuid;

    -- Count total questions (assuming 1 point each for now, or count rows)
    -- Ideally we should join with test_questions to get max points per question, but assuming 1 for simplicity or count(*)
    SELECT COUNT(*) INTO max_points
    FROM public.student_answers
    WHERE attempt_id = attempt_uuid;
    
    -- Avoid division by zero
    IF max_points > 0 THEN
        final_score := (total_points / max_points) * 100;
    ELSE
        final_score := 0;
    END IF;

    -- Update attempt
    UPDATE public.test_attempts
    SET score = final_score,
        status = 'COMPLETED', -- Ensure it is marked completed
        finished_at = COALESCE(finished_at, NOW())
    WHERE id = attempt_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
