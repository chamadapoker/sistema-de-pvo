import { supabase } from '../lib/supabase';
import type { Equipment, Category } from '../types/index';

export const equipmentService = {
  async getAllEquipment(params?: { categoryId?: number; search?: string }): Promise<{ equipment: Equipment[] }> {
    try {
      let query = supabase
        .from('equipment')
        .select(`
          *,
          category:categories(*)
        `)
        .order('name');

      if (params?.categoryId) {
        query = query.eq('categoryId', params.categoryId);
      }

      if (params?.search) {
        query = query.ilike('name', `%${params.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { equipment: data as Equipment[] };
    } catch (error) {
      console.error('Erro ao buscar equipamentos:', error);
      return { equipment: [] };
    }
  },

  async getEquipmentById(id: string): Promise<{ equipment: Equipment }> {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return { equipment: data as Equipment };
    } catch (error) {
      console.error('Erro ao buscar equipamento:', error);
      throw error;
    }
  },

  async getCategories(): Promise<{ categories: Category[] }> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('order');

      if (error) throw error;

      return { categories: data as Category[] };
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return { categories: [] };
    }
  },

  async createEquipment(formData: FormData): Promise<{ message: string; equipment: Equipment }> {
    try {
      // NOTE: File upload logic is complex to port directly without checking how the backend did it.
      // For now, we will extract text fields and insert the record. 
      // Image upload would typically require a separate Step to storage.

      const name = formData.get('name') as string;
      const code = formData.get('code') as string;
      const categoryId = Number(formData.get('categoryId'));
      const description = formData.get('description') as string;
      const country = formData.get('country') as string;

      // Upload image if present (Simplification: assuming a default path or handling it separately would be better, but we try a basic upload if file exists)
      const imageFile = formData.get('image') as File;
      let imagePath = '/placeholder.jpg';

      if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('equipment-images')
          .upload(fileName, imageFile);

        if (!uploadError && uploadData) {
          const { data: { publicUrl } } = supabase.storage.from('equipment-images').getPublicUrl(fileName);
          imagePath = publicUrl;
        }
      }

      const { data, error } = await supabase
        .from('equipment')
        .insert({
          name,
          code,
          categoryId,
          description,
          country,
          imagePath
        })
        .select()
        .single();

      if (error) throw error;

      return { message: 'Equipamento criado com sucesso', equipment: data as Equipment };
    } catch (error: any) {
      throw new Error(error.message || "Erro ao criar equipamento.");
    }
  },

  async updateEquipment(id: string, data: Partial<Equipment>): Promise<{ message: string; equipment: Equipment }> {
    try {
      // Remove nested objects or undefined fields that supabase doesn't like
      const { category, ...updateData } = data;

      const { data: updated, error } = await supabase
        .from('equipment')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { message: 'Equipamento atualizado', equipment: updated as Equipment };
    } catch (error: any) {
      throw new Error(error.message || "Erro ao editar equipamento.");
    }
  },

  async deleteEquipment(id: string): Promise<{ message: string }> {
    try {
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { message: 'Equipamento excluído com sucesso' };
    } catch (error: any) {
      throw new Error(error.message || "Erro ao excluir equipamento.");
    }
  },
};
