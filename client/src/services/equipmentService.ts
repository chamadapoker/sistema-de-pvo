import { api } from './api';
import type { Equipment, Category } from '../types/index';

// Prisma returns camelCase, so we don't need heavy mapping if the interface matches.
// We just need to handle dates if they need to be Date objects, but types say string.

export const equipmentService = {
  async getAllEquipment(params?: { categoryId?: number; search?: string }): Promise<{ equipment: Equipment[] }> {
    try {
      const response = await api.get<{ equipment: Equipment[] }>('/equipment', {
        params: {
          categoryId: params?.categoryId,
          search: params?.search,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar equipamentos:', error);
      return { equipment: [] };
    }
  },

  async getEquipmentById(id: string): Promise<{ equipment: Equipment }> {
    try {
      const response = await api.get<{ equipment: Equipment }>(`/equipment/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar equipamento:', error);
      throw error;
    }
  },

  async getCategories(): Promise<{ categories: Category[] }> {
    try {
      const response = await api.get<{ categories: Category[] }>('/equipment/categories');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return { categories: [] };
    }
  },

  async createEquipment(formData: FormData): Promise<{ message: string; equipment: Equipment }> {
    try {
      // Local API supports create with role check
      const response = await api.post<{ message: string; equipment: Equipment }>('/equipment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Erro ao criar equipamento.");
    }
  },

  async updateEquipment(id: string, data: Partial<Equipment>): Promise<{ message: string; equipment: Equipment }> {
    try {
      const response = await api.put<{ message: string; equipment: Equipment }>(`/equipment/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Erro ao editar equipamento.");
    }
  },

  async deleteEquipment(id: string): Promise<{ message: string }> {
    try {
      const response = await api.delete<{ message: string }>(`/equipment/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Erro ao excluir equipamento.");
    }
  },
};
