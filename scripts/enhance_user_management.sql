-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Detailed User Management RPC
CREATE OR REPLACE FUNCTION public.admin_update_user(
    target_user_id UUID,
    new_email TEXT DEFAULT NULL,
    new_password TEXT DEFAULT NULL,
    new_name TEXT DEFAULT NULL,
    is_blocked BOOLEAN DEFAULT NULL,
    access_until TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    current_admin_role TEXT;
    updates JSONB;
BEGIN
    -- 1. Security Check: Executor must be ADMIN
    SELECT raw_user_meta_data->>'role' INTO current_admin_role
    FROM auth.users
    WHERE id = auth.uid();

    IF current_admin_role IS DISTINCT FROM 'ADMIN' THEN
        RAISE EXCEPTION 'Access Denied: Only Admins can manage users.';
    END IF;

    -- 2. Prepare Metadata Updates
    updates := '{}'::jsonb;
    
    IF new_name IS NOT NULL THEN
        updates := updates || jsonb_build_object('name', new_name);
    END IF;

    IF is_blocked IS NOT NULL THEN
        updates := updates || jsonb_build_object('blocked', is_blocked);
    END IF;

    IF access_until IS NOT NULL THEN
        updates := updates || jsonb_build_object('access_until', access_until);
    ELSE
        -- If strictly passed as NULL, we might want to clear it, 
        -- but default arg is NULL. Let's assume we pass specific 'infinity' or similar to clear? 
        -- Or we can add a flag. For now, let's say if we want to clear, we pass a far future date?
        -- Actually, let's handle "clearing" separate.
        -- For simplicity, if we pass a date, set it. If we don't pass it (null), don't touch it.
        NULL; 
    END IF;

    -- 3. Update auth.users
    UPDATE auth.users
    SET
        email = COALESCE(new_email, email),
        encrypted_password = CASE 
            WHEN new_password IS NOT NULL AND LENGTH(new_password) >= 6 
            THEN crypt(new_password, gen_salt('bf')) 
            ELSE encrypted_password 
        END,
        raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || updates
    WHERE id = target_user_id;

    -- 4. public.users trigger should auto-sync, but we can force update for custom cols if needed
    -- (The existing trigger handles email and metadata sync)
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- RPC to DELETE user
CREATE OR REPLACE FUNCTION public.admin_delete_user(target_user_id UUID)
RETURNS VOID AS $$
DECLARE
    current_admin_role TEXT;
BEGIN
    -- Security Check
    SELECT raw_user_meta_data->>'role' INTO current_admin_role
    FROM auth.users
    WHERE id = auth.uid();

    IF current_admin_role IS DISTINCT FROM 'ADMIN' THEN
        RAISE EXCEPTION 'Access Denied: Only Admins can delete users.';
    END IF;

    -- Delete from auth.users (Cascades to public.users)
    DELETE FROM auth.users WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
