-- 1. Create a helper function to read role safely (bypassing RLS on auth.users)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
DECLARE
  role_text TEXT;
BEGIN
  -- Read strictly from auth.users using SECURITY DEFINER (superuser privileges for this function)
  SELECT raw_user_meta_data->>'role' INTO role_text
  FROM auth.users
  WHERE id = auth.uid();
  
  RETURN role_text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update the RLS Policy for viewing users
DROP POLICY IF EXISTS "Admins read all data" ON public.users;

CREATE POLICY "Admins and Instructors read all data" ON public.users
  FOR SELECT USING (
    public.get_my_role() IN ('ADMIN', 'INSTRUCTOR')
  );

-- 3. Ensure the existing user created has a role in metadata
-- (Self-healing: if role is missing, default to STUDENT, but ideally it is set)
UPDATE auth.users
SET raw_user_meta_data = '{"role": "student"}'::jsonb
WHERE raw_user_meta_data IS NULL;

-- 4. Re-sync public.users to be 100% sure
INSERT INTO public.users (id, email, raw_user_meta_data, created_at)
SELECT id, email, raw_user_meta_data, created_at FROM auth.users
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  raw_user_meta_data = EXCLUDED.raw_user_meta_data;
