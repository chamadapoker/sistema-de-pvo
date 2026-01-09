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
        query = query.eq('category_id', params.categoryId);
      }

      if (params?.search) {
        query = query.ilike('name', `%${params.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Map return data to camelCase
      const mappedData = data.map((item: any) => ({
        ...item,
        categoryId: item.category_id,
        imagePath: item.image_path,
        thumbnailPath: item.thumbnail_path,
        descriptionSource: item.description_source,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));

      return { equipment: mappedData as Equipment[] };
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

      const mappedItem: any = {
        ...data,
        categoryId: data.category_id,
        imagePath: data.image_path,
        thumbnailPath: data.thumbnail_path,
        descriptionSource: data.description_source,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      return { equipment: mappedItem as Equipment };
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
      const name = formData.get('name') as string;
      const code = formData.get('code') as string;
      const categoryId = Number(formData.get('categoryId'));
      const description = formData.get('description') as string;
      const country = formData.get('country') as string;

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
          category_id: categoryId,
          description,
          country,
          image_path: imagePath
        })
        .select()
        .single();

      if (error) throw error;

      const mappedItem: any = {
        ...data,
        categoryId: data.category_id,
        imagePath: data.image_path,
        thumbnailPath: data.thumbnail_path,
        descriptionSource: data.description_source,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      return { message: 'Equipamento criado com sucesso', equipment: mappedItem as Equipment };
    } catch (error: any) {
      throw new Error(error.message || "Erro ao criar equipamento.");
    }
  },

  async updateEquipment(id: string, data: Partial<Equipment>): Promise<{ message: string; equipment: Equipment }> {
    try {
      const updatePayload: any = { ...data };

      // Convert camelCase params to snake_case for DB
      if (data.categoryId) updatePayload.category_id = data.categoryId;
      if (data.imagePath) updatePayload.image_path = data.imagePath;
      if (data.thumbnailPath) updatePayload.thumbnail_path = data.thumbnailPath;

      // Clean up camelCase keys
      delete updatePayload.categoryId;
      delete updatePayload.imagePath;
      delete updatePayload.thumbnailPath;
      delete updatePayload.category; // nested object not needed for update

      // Clean undefined keys
      Object.keys(updatePayload).forEach(key => updatePayload[key] === undefined && delete updatePayload[key]);

      const { data: updated, error } = await supabase
        .from('equipment')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const mappedItem: any = {
        ...updated,
        categoryId: updated.category_id,
        imagePath: updated.image_path,
        thumbnailPath: updated.thumbnail_path,
        descriptionSource: updated.description_source,
        createdAt: updated.created_at,
        updatedAt: updated.updated_at,
      };

      return { message: 'Equipamento atualizado', equipment: mappedItem as Equipment };
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

  // --- CATEGORY CRUD ---

  async createCategory(name: string, description?: string): Promise<Category> {
    try {
      // Get max order
      const { data: maxOrderData } = await supabase.from('categories').select('order').order('order', { ascending: false }).limit(1);
      const nextOrder = (maxOrderData?.[0]?.order || 0) + 1;

      const { data, error } = await supabase
        .from('categories')
        .insert({ name, description, order: nextOrder })
        .select()
        .single();

      if (error) throw error;
      return data as Category;
    } catch (error: any) {
      throw new Error(error.message || "Erro ao criar categoria.");
    }
  },

  async updateCategory(id: number, updates: Partial<Category>): Promise<Category> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Category;
    } catch (error: any) {
      throw new Error(error.message || "Erro ao atualizar categoria.");
    }
  },

  async deleteCategory(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error: any) {
      throw new Error(error.message || "Erro ao excluir categoria.");
    }
  }
};
