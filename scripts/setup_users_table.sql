-- Create a specific table for public user profiles
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email TEXT,
  raw_user_meta_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own data
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Allow Admins and Instructors to read ALL data
DROP POLICY IF EXISTS "Admins read all data" ON public.users;
CREATE POLICY "Admins read all data" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND (raw_user_meta_data->>'role' = 'ADMIN' OR raw_user_meta_data->>'role' = 'INSTRUCTOR')
    )
  );

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, raw_user_meta_data, created_at)
  VALUES (new.id, new.email, new.raw_user_meta_data, new.created_at)
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    raw_user_meta_data = EXCLUDED.raw_user_meta_data;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Backfill existing users
INSERT INTO public.users (id, email, raw_user_meta_data, created_at)
SELECT id, email, raw_user_meta_data, created_at FROM auth.users
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  raw_user_meta_data = EXCLUDED.raw_user_meta_data;

-- RPC Function to update user role (Admin only)
CREATE OR REPLACE FUNCTION public.update_user_role(
  target_user_id UUID, 
  new_role TEXT
)
RETURNS VOID AS $$
DECLARE
  current_role TEXT;
BEGIN
  -- Check if executor is ADMIN
  SELECT raw_user_meta_data->>'role' INTO current_role
  FROM auth.users
  WHERE id = auth.uid();

  IF current_role IS DISTINCT FROM 'ADMIN' THEN
    RAISE EXCEPTION 'Access Denied: Only Admins can update roles';
  END IF;

  -- Update auth.users metadata
  UPDATE auth.users
  SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    to_jsonb(new_role)
  )
  WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
