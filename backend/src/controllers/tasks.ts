import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../lib/db';
import { AuthRequest } from '../middleware/auth';
import { Prisma } from '@prisma/client';

// Define the user select type with username using type assertion to bypass TypeScript error
const userSelect = {
  id: true,
  name: true,
  email: true,
  username: true,
} as const;

// Define the task include type
const taskInclude = {
  user: {
    select: userSelect,
  },
  shares: {
    include: {
      user: {
        select: userSelect,
      },
    },
  },
} as const;

export const createTaskValidation = [
  body('title').trim().isLength({ min: 1 }).withMessage('Название задачи обязательно'),
  body('description').optional().trim(),
  body('privacy').optional().isIn(['PRIVATE', 'PUBLIC', 'SPECIFIC']).withMessage('Некорректное значение приватности'),
  body('sharedWith').optional().isArray().withMessage('sharedWith должен быть массивом'),
];

export const updateTaskValidation = [
  body('title').optional().trim().isLength({ min: 1 }).withMessage('Название не может быть пустым'),
  body('description').optional().trim(),
  body('completed').optional().isBoolean().withMessage('completed должен быть булевым значением'),
  body('privacy').optional().isIn(['PRIVATE', 'PUBLIC', 'SPECIFIC']).withMessage('Некорректное значение приватности'),
  body('sharedWith').optional().isArray().withMessage('sharedWith должен быть массивом'),
];

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    
    const tasks = await db.task.findMany({
      where: {
        OR: [
          { userId },
          { privacy: 'PUBLIC' },
          { shares: { some: { userId } } }
        ]
      },
      include: taskInclude,
      orderBy: { createdAt: 'desc' }
    });

    res.json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Ошибка при получении задач' });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.userId!;
    const { title, description, privacy = 'PRIVATE', sharedWith = [] } = req.body;

    const task = await db.task.create({
      data: {
        title,
        description,
        privacy,
        userId,
      },
      include: {
        user: {
          select: userSelect,
        },
      },
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
        await db.taskShare.createMany({
          data: validUsers.map((user: { id: string }) => ({
            taskId: task.id,
            userId: user.id
          }))
        });
      }
    }

    // Log activity
    await db.activity.create({
      data: {
        action: 'Создана задача',
        details: title,
        type: 'TASK',
        userId,
      }
    });

    res.status(201).json({ task });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Ошибка при создании задачи' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.userId!;
    const { id } = req.params;
    const { title, description, completed, privacy, sharedWith = [] } = req.body;

    // Check if task exists and user has permission
    const existingTask = await db.task.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Задача не найдена или нет прав доступа' });
    }

    const task = await db.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(completed !== undefined && { completed }),
        ...(privacy !== undefined && { privacy }),
      },
      include: {
        user: {
          select: userSelect,
        },
      },
    });

    // Handle sharing updates if privacy is SPECIFIC
    if (privacy === 'SPECIFIC') {
      // Remove existing shares
      await db.taskShare.deleteMany({
        where: { taskId: id }
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
          await db.taskShare.createMany({
            data: validUsers.map((user: { id: string }) => ({
              taskId: id,
              userId: user.id
            }))
          });
        }
      }
    }

    // Log activity
    await db.activity.create({
      data: {
        action: completed ? 'Задача выполнена' : 'Задача обновлена',
        details: title || existingTask.title,
        type: 'TASK',
        userId,
      }
    });

    res.json({ task });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Ошибка при обновлении задачи' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    // Check if task exists and user has permission
    const existingTask = await db.task.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Задача не найдена или нет прав доступа' });
    }

    await db.task.delete({
      where: { id }
    });

    // Log activity
    await db.activity.create({
      data: {
        action: 'Задача удалена',
        details: existingTask.title,
        type: 'TASK',
        userId,
      }
    });

    res.json({ message: 'Задача удалена' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Ошибка при удалении задачи' });
  }
};