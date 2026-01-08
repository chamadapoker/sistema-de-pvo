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
            blocked: u.raw_user_meta_data?.blocked || false,
            accessUntil: u.raw_user_meta_data?.access_until || null,
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

    async updateUser(userId: string, data: {
        name?: string;
        email?: string;
        password?: string;
        blocked?: boolean;
        accessUntil?: string | null;
    }): Promise<void> {
        const { error } = await supabase.rpc('admin_update_user', {
            target_user_id: userId,
            new_name: data.name || null,
            new_email: data.email || null,
            new_password: data.password || null,
            is_blocked: data.blocked, // Keep boolean or undefined
            access_until: data.accessUntil
        });

        if (error) throw new Error(error.message);
    },

    async deleteUser(userId: string): Promise<void> {
        const { error } = await supabase.rpc('admin_delete_user', {
            target_user_id: userId
        });

        if (error) throw new Error(error.message);
    },

    async createUser(userData: any): Promise<void> {
        if (!supabaseUrl || !supabaseAnonKey) throw new Error("Supabase not configured");

        const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false,
                storageKey: `temp_signup_${Date.now()}_${Math.random()}`
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

        if (data.user && data.user.identities && data.user.identities.length === 0) {
            throw new Error("Este email já está registrado no sistema.");
        }

        if (!data.user) {
            throw new Error("Erro desconhecido ao criar usuário.");
        }
    }
};
