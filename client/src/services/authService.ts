import { api } from './api';
import type { AuthResponse, User } from '../types/index.ts';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
      });

      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.error || 'Erro ao fazer login');
    }
  },

  getRoleFromEmail(email: string): 'ADMIN' | 'INSTRUCTOR' | 'STUDENT' {
    if (email.includes('admin')) return 'ADMIN';
    if (email.includes('instrutor')) return 'INSTRUCTOR';
    return 'STUDENT';
  },

  async register(email: string, password: string, name: string, role: string = 'STUDENT'): Promise<{ message: string; user: User }> {
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        name,
        role,
      });

      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.error || error.response?.data?.errors?.[0]?.msg || 'Erro ao registrar');
    }
  },

  async getProfile(): Promise<{ user: User }> {
    try {
      const response = await api.get<{ user: User }>('/auth/profile');
      return response.data;
    } catch (error: any) {
      console.error('Get profile error:', error);
      throw new Error(error.response?.data?.error || 'Erro ao buscar perfil');
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
};
