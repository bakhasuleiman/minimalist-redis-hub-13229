import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../lib/db';
import { AuthRequest } from '../middleware/auth';

export const createGoalValidation = [
  body('title').trim().isLength({ min: 1 }).withMessage('Название цели обязательно'),
  body('description').optional().trim(),
  body('progress').optional().isInt({ min: 0, max: 100 }).withMessage('Прогресс должен быть от 0 до 100'),
  body('deadline').optional().isISO8601().withMessage('Некорректный формат даты'),
  body('privacy').optional().isIn(['PRIVATE', 'PUBLIC', 'SPECIFIC']).withMessage('Некорректное значение приватности'),
  body('sharedWith').optional().isArray().withMessage('sharedWith должен быть массивом'),
];

export const updateGoalValidation = [
  body('title').optional().trim().isLength({ min: 1 }).withMessage('Название не может быть пустым'),
  body('description').optional().trim(),
  body('progress').optional().isInt({ min: 0, max: 100 }).withMessage('Прогресс должен быть от 0 до 100'),
  body('deadline').optional().isISO8601().withMessage('Некорректный формат даты'),
  body('privacy').optional().isIn(['PRIVATE', 'PUBLIC', 'SPECIFIC']).withMessage('Некорректное значение приватности'),
  body('sharedWith').optional().isArray().withMessage('sharedWith должен быть массивом'),
];

export const getGoals = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    
    const goals = await db.goal.findMany({
      where: {
        OR: [
          { userId },
          { privacy: 'PUBLIC' },
          { shares: { some: { userId } } }
        ]
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        shares: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ goals });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Ошибка при получении целей' });
  }
};

export const getGoal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const goal = await db.goal.findFirst({
      where: {
        id,
        OR: [
          { userId },
          { privacy: 'PUBLIC' },
          { shares: { some: { userId } } }
        ]
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        shares: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });

    if (!goal) {
      return res.status(404).json({ error: 'Цель не найдена' });
    }

    res.json({ goal });
  } catch (error) {
    console.error('Get goal error:', error);
    res.status(500).json({ error: 'Ошибка при получении цели' });
  }
};

export const createGoal = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.userId!;
    const { title, description, progress = 0, deadline, privacy = 'PRIVATE', sharedWith = [] } = req.body;

    const goal = await db.goal.create({
      data: {
        title,
        description,
        progress,
        deadline: deadline ? new Date(deadline) : null,
        privacy,
        userId,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // Handle sharing if privacy is SPECIFIC
    if (privacy === 'SPECIFIC' && sharedWith.length > 0) {
      const validUsers = await db.user.findMany({
        where: {
          email: { in: sharedWith },
          NOT: { id: userId }
        },
        select: { id: true }
      });

      if (validUsers.length > 0) {
        await db.goalShare.createMany({
          data: validUsers.map((user: { id: string }) => ({
            goalId: goal.id,
            userId: user.id
          }))
        });
      }
    }

    // Log activity
    await db.activity.create({
      data: {
        action: 'Создана цель',
        details: title,
        type: 'GOAL',
        userId,
      }
    });

    res.status(201).json({ goal });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ error: 'Ошибка при создании цели' });
  }
};

export const updateGoal = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.userId!;
    const { id } = req.params;
    const { title, description, progress, deadline, privacy, sharedWith = [] } = req.body;

    // Check if goal exists and user has permission
    const existingGoal = await db.goal.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingGoal) {
      return res.status(404).json({ error: 'Цель не найдена или нет прав доступа' });
    }

    const goal = await db.goal.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(progress !== undefined && { progress }),
        ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
        ...(privacy !== undefined && { privacy }),
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // Handle sharing updates if privacy is SPECIFIC
    if (privacy === 'SPECIFIC') {
      // Remove existing shares
      await db.goalShare.deleteMany({
        where: { goalId: id }
      });

      // Add new shares
      if (sharedWith.length > 0) {
        const validUsers = await db.user.findMany({
          where: {
            email: { in: sharedWith },
            NOT: { id: userId }
          },
          select: { id: true }
        });

        if (validUsers.length > 0) {
          await db.goalShare.createMany({
            data: validUsers.map((user: { id: string }) => ({
              goalId: id,
              userId: user.id
            }))
          });
        }
      }
    }

    // Log activity for progress updates
    const progressChanged = progress !== undefined && progress !== existingGoal.progress;
    const progressCompleted = progress === 100 && existingGoal.progress < 100;
    
    let actionText = 'Цель обновлена';
    if (progressCompleted) {
      actionText = 'Цель выполнена';
    } else if (progressChanged) {
      actionText = `Прогресс цели обновлен (${progress}%)`;
    }

    await db.activity.create({
      data: {
        action: actionText,
        details: title || existingGoal.title,
        type: 'GOAL',
        userId,
      }
    });

    res.json({ goal });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ error: 'Ошибка при обновлении цели' });
  }
};

export const deleteGoal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    // Check if goal exists and user has permission
    const existingGoal = await db.goal.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingGoal) {
      return res.status(404).json({ error: 'Цель не найдена или нет прав доступа' });
    }

    await db.goal.delete({
      where: { id }
    });

    // Log activity
    await db.activity.create({
      data: {
        action: 'Цель удалена',
        details: existingGoal.title,
        type: 'GOAL',
        userId,
      }
    });

    res.json({ message: 'Цель удалена' });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ error: 'Ошибка при удалении цели' });
  }
};