import api from './api';
import type { AuthResponse, User } from '../types/index.ts';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  },

  async register(email: string, password: string, name: string, role: string = 'STUDENT'): Promise<{ message: string; user: User }> {
    const response = await api.post('/auth/register', { email, password, name, role });
    return response.data;
  },

  async getProfile(): Promise<{ user: User }> {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
