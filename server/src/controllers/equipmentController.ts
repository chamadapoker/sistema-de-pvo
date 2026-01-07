import { Request, Response } from 'express';
import prisma from '../config/database';

export const getAllEquipment = async (req: Request, res: Response) => {
  try {
    const { categoryId, search } = req.query;

    const where: any = {};

    if (categoryId) {
      where.categoryId = parseInt(categoryId as string);
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { code: { contains: search as string } },
        { description: { contains: search as string } },
      ];
    }

    const equipment = await prisma.equipment.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        code: 'asc',
      },
    });

    res.json({ equipment });
  } catch (error) {
    console.error('Erro ao buscar equipamentos:', error);
    res.status(500).json({ error: 'Erro ao buscar equipamentos' });
  }
};

export const getEquipmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const equipment = await prisma.equipment.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!equipment) {
      return res.status(404).json({ error: 'Equipamento não encontrado' });
    }

    res.json({ equipment });
  } catch (error) {
    console.error('Erro ao buscar equipamento:', error);
    res.status(500).json({ error: 'Erro ao buscar equipamento' });
  }
};

export const createEquipment = async (req: Request, res: Response) => {
  try {
    const { code, name, description, categoryId, country, manufacturer, year } = req.body;

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'Imagem do equipamento é obrigatória' });
    }

    // Verificar se código já existe
    const existing = await prisma.equipment.findUnique({ where: { code } });
    if (existing) {
      return res.status(400).json({ error: 'Código de equipamento já existe' });
    }

    const equipment = await prisma.equipment.create({
      data: {
        code,
        name,
        description,
        categoryId: parseInt(categoryId),
        imagePath: `/uploads/equipments/${file.filename}`,
        country,
        manufacturer,
        year: year ? parseInt(year) : null,
      },
      include: {
        category: true,
      },
    });

    res.status(201).json({
      message: 'Equipamento criado com sucesso',
      equipment,
    });
  } catch (error) {
    console.error('Erro ao criar equipamento:', error);
    res.status(500).json({ error: 'Erro ao criar equipamento' });
  }
};

export const updateEquipment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, country, manufacturer, year } = req.body;

    const equipment = await prisma.equipment.update({
      where: { id },
      data: {
        name,
        description,
        country,
        manufacturer,
        year: year ? parseInt(year) : null,
      },
      include: {
        category: true,
      },
    });

    res.json({
      message: 'Equipamento atualizado com sucesso',
      equipment,
    });
  } catch (error) {
    console.error('Erro ao atualizar equipamento:', error);
    res.status(500).json({ error: 'Erro ao atualizar equipamento' });
  }
};

export const deleteEquipment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.equipment.delete({ where: { id } });

    res.json({ message: 'Equipamento deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar equipamento:', error);
    res.status(500).json({ error: 'Erro ao deletar equipamento' });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        order: 'asc',
      },
      include: {
        _count: {
          select: {
            equipments: true,
          },
        },
      },
    });

    res.json({ categories });
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
};
