import { supabase } from '../lib/supabase';
import { createClient } from '@supabase/supabase-js';
import type { User, Role } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const userService = {
    async getAllUsers(): Promise<User[]> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('email');

        if (error) throw new Error(error.message);

        return data.map((u: any) => ({
            id: u.id,
            email: u.email,
            name: u.raw_user_meta_data?.name || 'Usuário',
            role: (u.raw_user_meta_data?.role as Role) || 'STUDENT',
            createdAt: u.created_at
        }));
    },

    async updateUserRole(userId: string, newRole: Role): Promise<void> {
        const { error } = await supabase.rpc('update_user_role', {
            target_user_id: userId,
            new_role: newRole
        });

        if (error) throw new Error(error.message);
    },

    async createUser(userData: any): Promise<void> {
        if (!supabaseUrl || !supabaseAnonKey) throw new Error("Supabase not configured");

        // Create a temporary client to avoid logging out the admin
        const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false
            }
        });

        const { data, error } = await tempClient.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
                data: {
                    name: userData.name,
                    role: userData.role
                }
            }
        });

        if (error) throw error;

        // Wait a small moment for trigger to propagate if needed, though usually instant
        // The trigger on auth.users will handle the insert into public.users
    },

    async deleteUser(userId: string): Promise<void> {
        // Deleting from public.users doesn't delete from auth.users easily without Service Key
        // But we can delete from public.users if RLS allows.
        // HOWEVER, deleting from public.users DOES NOT delete from auth.users automatically unless we have a trigger.
        // AND public.users is referencing auth.users(id) ON DELETE CASCADE, meaning we must delete AUTH user to delete PUBLIC user.
        // We CANNOT delete auth user from Client side without Service Key.
        // We can only use RPC if we set "SECURITY DEFINER" on a function that calls admin API? No, PLPGSQL can't call admin API.
        // WE CAN use an RPC that does "DELETE FROM auth.users WHERE id = ..." if the Postgres Role has permissions.
        // By default, the postgres role for RLS/RPC is 'postgres' or 'service_role' ONLY if configured.
        // Usually, `auth.users` is protected.

        // For now, let's implement a 'soft delete' or just try to delete and see if it fails.
        // Actually, the user didn't ask for delete, he asked for ADD.
        // I'll leave delete out or mocked for now unless I'm sure I can do it.
        // The previous file didn't have delete, so I won't add it to avoid breaking things.

        throw new Error("Exclusão de usuário requer acesso direto ao painel do Supabase");
    }
};
