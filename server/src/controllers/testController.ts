import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/database';

export const createStandardTest = async (req: Request, res: Response) => {
  try {
    const { name, description, password, duration, questionCount, questions } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    // Hash da senha se fornecida
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const test = await prisma.standardTest.create({
      data: {
        name,
        description,
        password: hashedPassword,
        duration,
        questionCount,
        creatorId: userId,
        questions: {
          create: questions.map((q: any, index: number) => ({
            equipmentId: q.equipmentId,
            order: index + 1,
            displayTime: q.displayTime || 5,
          })),
        },
      },
      include: {
        questions: {
          include: {
            equipment: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Teste criado com sucesso',
      test,
    });
  } catch (error) {
    console.error('Erro ao criar teste:', error);
    res.status(500).json({ error: 'Erro ao criar teste' });
  }
};

export const getStandardTests = async (req: Request, res: Response) => {
  try {
    const tests = await prisma.standardTest.findMany({
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            questions: true,
            results: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({ tests });
  } catch (error) {
    console.error('Erro ao buscar testes:', error);
    res.status(500).json({ error: 'Erro ao buscar testes' });
  }
};

export const getTestById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { password } = req.query;

    const test = await prisma.standardTest.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            equipment: {
              include: {
                category: true,
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!test) {
      return res.status(404).json({ error: 'Teste não encontrado' });
    }

    // Verificar senha se necessário
    if (test.password) {
      if (!password) {
        return res.status(401).json({
          error: 'Este teste requer senha',
          requiresPassword: true
        });
      }

      const isValidPassword = await bcrypt.compare(password as string, test.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Senha incorreta' });
      }
    }

    // Remover senha do retorno
    const { password: _, ...testData } = test;

    res.json({ test: testData });
  } catch (error) {
    console.error('Erro ao buscar teste:', error);
    res.status(500).json({ error: 'Erro ao buscar teste' });
  }
};

export const submitTestResult = async (req: Request, res: Response) => {
  try {
    const { testId, answers, totalTime, testType } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    // Calcular pontuação
    const correctAnswers = answers.filter((a: any) => a.isCorrect).length;
    const totalQuestions = answers.length;
    const score = (correctAnswers / totalQuestions) * 100;

    const result = await prisma.testResult.create({
      data: {
        userId,
        testId: testId || null,
        score,
        correctAnswers,
        totalQuestions,
        totalTime,
        testType: testType || 'FREE',
        answers: JSON.stringify(answers),
      },
    });

    res.status(201).json({
      message: 'Resultado salvo com sucesso',
      result: {
        id: result.id,
        score: result.score,
        correctAnswers: result.correctAnswers,
        totalQuestions: result.totalQuestions,
        totalTime: result.totalTime,
      },
    });
  } catch (error) {
    console.error('Erro ao salvar resultado:', error);
    res.status(500).json({ error: 'Erro ao salvar resultado' });
  }
};

export const getUserResults = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const results = await prisma.testResult.findMany({
      where: { userId },
      include: {
        test: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        completedAt: 'desc',
      },
    });

    res.json({ results });
  } catch (error) {
    console.error('Erro ao buscar resultados:', error);
    res.status(500).json({ error: 'Erro ao buscar resultados' });
  }
};

export const getAllResults = async (req: Request, res: Response) => {
  try {
    const { testId, userId } = req.query;

    const where: any = {};
    if (testId) where.testId = testId;
    if (userId) where.userId = userId;

    const results = await prisma.testResult.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        test: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        completedAt: 'desc',
      },
    });

    res.json({ results });
  } catch (error) {
    console.error('Erro ao buscar resultados:', error);
    res.status(500).json({ error: 'Erro ao buscar resultados' });
  }
};
