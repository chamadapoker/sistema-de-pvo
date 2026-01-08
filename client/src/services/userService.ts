import { supabase } from '../lib/supabase';
import type { User, Role } from '../types';

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
    }
};
