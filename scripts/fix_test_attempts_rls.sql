-- Enable RLS on test_attempts table
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;

-- Allow Students to insert their own attempts
CREATE POLICY "Students can create their own attempts" ON public.test_attempts
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Allow Students to view their own attempts
CREATE POLICY "Students can view their own attempts" ON public.test_attempts
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Allow Students to update their own attempts (e.g. status)
CREATE POLICY "Students can update their own attempts" ON public.test_attempts
FOR UPDATE
TO authenticated 
USING (auth.uid() = user_id);

-- Allow Admins/Instructors to view all attempts
CREATE POLICY "Admins and Instructors view all attempts" ON public.test_attempts
FOR SELECT
TO authenticated
USING (
  public.get_my_role() IN ('ADMIN', 'INSTRUCTOR')
);

-- Force refresh to apply
NOTIFY pgrst, 'reload config';
