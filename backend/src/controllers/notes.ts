import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../lib/db';
import { AuthRequest } from '../middleware/auth';

export const createNoteValidation = [
  body('title').trim().isLength({ min: 1 }).withMessage('Название заметки обязательно'),
  body('content').trim().isLength({ min: 1 }).withMessage('Содержание заметки обязательно'),
  body('privacy').optional().isIn(['PRIVATE', 'PUBLIC', 'SPECIFIC']).withMessage('Некорректное значение приватности'),
  body('sharedWith').optional().isArray().withMessage('sharedWith должен быть массивом'),
];

export const updateNoteValidation = [
  body('title').optional().trim().isLength({ min: 1 }).withMessage('Название не может быть пустым'),
  body('content').optional().trim().isLength({ min: 1 }).withMessage('Содержание не может быть пустым'),
  body('privacy').optional().isIn(['PRIVATE', 'PUBLIC', 'SPECIFIC']).withMessage('Некорректное значение приватности'),
  body('sharedWith').optional().isArray().withMessage('sharedWith должен быть массивом'),
];

export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    
    const notes = await db.note.findMany({
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
      orderBy: { updatedAt: 'desc' }
    });

    res.json({ notes });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Ошибка при получении заметок' });
  }
};

export const getNote = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const note = await db.note.findFirst({
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

    if (!note) {
      return res.status(404).json({ error: 'Заметка не найдена' });
    }

    res.json({ note });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ error: 'Ошибка при получении заметки' });
  }
};

export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.userId!;
    const { title, content, privacy = 'PRIVATE', sharedWith = [] } = req.body;

    const note = await db.note.create({
      data: {
        title,
        content,
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
        await db.noteShare.createMany({
          data: validUsers.map((user: { id: string }) => ({
            noteId: note.id,
            userId: user.id
          }))
        });
      }
    }

    // Log activity
    await db.activity.create({
      data: {
        action: 'Создана заметка',
        details: title,
        type: 'NOTE',
        userId,
      }
    });

    res.status(201).json({ note });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ error: 'Ошибка при создании заметки' });
  }
};

export const updateNote = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.userId!;
    const { id } = req.params;
    const { title, content, privacy, sharedWith = [] } = req.body;

    // Check if note exists and user has permission
    const existingNote = await db.note.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingNote) {
      return res.status(404).json({ error: 'Заметка не найдена или нет прав доступа' });
    }

    const note = await db.note.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
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
      await db.noteShare.deleteMany({
        where: { noteId: id }
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
          await db.noteShare.createMany({
            data: validUsers.map((user: { id: string }) => ({
              noteId: id,
              userId: user.id
            }))
          });
        }
      }
    }

    // Log activity
    await db.activity.create({
      data: {
        action: 'Заметка обновлена',
        details: title || existingNote.title,
        type: 'NOTE',
        userId,
      }
    });

    res.json({ note });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ error: 'Ошибка при обновлении заметки' });
  }
};

export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    // Check if note exists and user has permission
    const existingNote = await db.note.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingNote) {
      return res.status(404).json({ error: 'Заметка не найдена или нет прав доступа' });
    }

    await db.note.delete({
      where: { id }
    });

    // Log activity
    await db.activity.create({
      data: {
        action: 'Заметка удалена',
        details: existingNote.title,
        type: 'NOTE',
        userId,
      }
    });

    res.json({ message: 'Заметка удалена' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ error: 'Ошибка при удалении заметки' });
  }
};