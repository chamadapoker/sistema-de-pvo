import api from './api';
import type { Equipment, Category } from '../types/index.ts';

export const equipmentService = {
  async getAllEquipment(params?: { categoryId?: number; search?: string }): Promise<{ equipment: Equipment[] }> {
    const response = await api.get('/equipment', { params });
    return response.data;
  },

  async getEquipmentById(id: string): Promise<{ equipment: Equipment }> {
    const response = await api.get(`/equipment/${id}`);
    return response.data;
  },

  async getCategories(): Promise<{ categories: Category[] }> {
    const response = await api.get('/equipment/categories');
    return response.data;
  },

  async createEquipment(formData: FormData): Promise<{ message: string; equipment: Equipment }> {
    const response = await api.post('/equipment', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateEquipment(id: string, data: Partial<Equipment>): Promise<{ message: string; equipment: Equipment }> {
    const response = await api.put(`/equipment/${id}`, data);
    return response.data;
  },

  async deleteEquipment(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/equipment/${id}`);
    return response.data;
  },
};
