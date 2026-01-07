import { supabase } from '../lib/supabase';
import type { AuthResponse, User, Role } from '../types/index.ts';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('Usuário não encontrado');
      if (!data.session) throw new Error('Sessão não criada');

      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name || 'Usuário',
        role: (data.user.user_metadata?.role as Role) || 'STUDENT',
        createdAt: data.user.created_at,
      };

      return {
        message: 'Login realizado com sucesso',
        token: data.session.access_token,
        user,
      };
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Erro ao fazer login');
    }
  },

  getRoleFromEmail(email: string): Role {
    if (email.includes('admin')) return 'ADMIN';
    if (email.includes('instrutor')) return 'INSTRUCTOR';
    return 'STUDENT';
  },

  async register(email: string, password: string, name: string, role: string = 'STUDENT'): Promise<{ message: string; user: User }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (error) throw error;
      if (!data.user) throw new Error('Erro ao criar usuário');

      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name || name,
        role: (data.user.user_metadata?.role as Role) || (role as Role),
        createdAt: data.user.created_at,
      };

      return {
        message: 'Registro realizado com sucesso',
        user,
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Erro ao registrar');
    }
  },

  async getProfile(): Promise<{ user: User }> {
    try {
      const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();

      if (error) throw error;
      if (!supabaseUser) throw new Error('Usuário não autenticado');

      const user: User = {
        id: supabaseUser.id,
        email: supabaseUser.email!,
        name: supabaseUser.user_metadata?.name || 'Usuário',
        role: (supabaseUser.user_metadata?.role as Role) || 'STUDENT',
        createdAt: supabaseUser.created_at,
      };

      return { user };
    } catch (error: any) {
      console.error('Get profile error:', error);
      throw new Error(error.message || 'Erro ao buscar perfil');
    }
  },

  async logout() {
    await supabase.auth.signOut();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
};
