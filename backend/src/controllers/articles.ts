import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../lib/db';
import { AuthRequest } from '../middleware/auth';

export const createArticleValidation = [
  body('title').trim().isLength({ min: 1 }).withMessage('Название статьи обязательно'),
  body('content').trim().isLength({ min: 1 }).withMessage('Содержание статьи обязательно'),
  body('published').optional().isBoolean().withMessage('published должен быть булевым значением'),
  body('privacy').optional().isIn(['PRIVATE', 'PUBLIC', 'SPECIFIC']).withMessage('Некорректное значение приватности'),
  body('sharedWith').optional().isArray().withMessage('sharedWith должен быть массивом'),
];

export const updateArticleValidation = [
  body('title').optional().trim().isLength({ min: 1 }).withMessage('Название не может быть пустым'),
  body('content').optional().trim().isLength({ min: 1 }).withMessage('Содержание не может быть пустым'),
  body('published').optional().isBoolean().withMessage('published должен быть булевым значением'),
  body('privacy').optional().isIn(['PRIVATE', 'PUBLIC', 'SPECIFIC']).withMessage('Некорректное значение приватности'),
  body('sharedWith').optional().isArray().withMessage('sharedWith должен быть массивом'),
];

export const getArticles = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { published } = req.query;
    
    let whereClause: any = {
      OR: [
        { userId },
        { privacy: 'PUBLIC' },
        { shares: { some: { userId } } }
      ]
    };

    // Filter by published status if specified
    if (published !== undefined) {
      whereClause.published = published === 'true';
    }
    
    const articles = await db.article.findMany({
      where: whereClause,
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

    res.json({ articles });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ error: 'Ошибка при получении статей' });
  }
};

export const getArticle = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const article = await db.article.findFirst({
      where: {
        id,
        OR: [
          { userId },
          { privacy: 'PUBLIC', published: true },
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

    if (!article) {
      return res.status(404).json({ error: 'Статья не найдена' });
    }

    res.json({ article });
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({ error: 'Ошибка при получении статьи' });
  }
};

export const createArticle = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.userId!;
    const { title, content, published = false, privacy = 'PRIVATE', sharedWith = [] } = req.body;

    const article = await db.article.create({
      data: {
        title,
        content,
        published,
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
        await db.articleShare.createMany({
          data: validUsers.map((user: { id: string }) => ({
            articleId: article.id,
            userId: user.id
          }))
        });
      }
    }

    // Log activity
    const actionText = published ? 'Опубликована статья' : 'Создана статья';
    await db.activity.create({
      data: {
        action: actionText,
        details: title,
        type: 'ARTICLE',
        userId,
      }
    });

    res.status(201).json({ article });
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({ error: 'Ошибка при создании статьи' });
  }
};

export const updateArticle = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.userId!;
    const { id } = req.params;
    const { title, content, published, privacy, sharedWith = [] } = req.body;

    // Check if article exists and user has permission
    const existingArticle = await db.article.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingArticle) {
      return res.status(404).json({ error: 'Статья не найдена или нет прав доступа' });
    }

    const article = await db.article.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(published !== undefined && { published }),
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
      await db.articleShare.deleteMany({
        where: { articleId: id }
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
          await db.articleShare.createMany({
            data: validUsers.map((user: { id: string }) => ({
              articleId: id,
              userId: user.id
            }))
          });
        }
      }
    }

    // Log activity
    let actionText = 'Статья обновлена';
    if (published !== undefined && published !== existingArticle.published) {
      actionText = published ? 'Статья опубликована' : 'Публикация статьи отменена';
    }

    await db.activity.create({
      data: {
        action: actionText,
        details: title || existingArticle.title,
        type: 'ARTICLE',
        userId,
      }
    });

    res.json({ article });
  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({ error: 'Ошибка при обновлении статьи' });
  }
};

export const deleteArticle = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    // Check if article exists and user has permission
    const existingArticle = await db.article.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingArticle) {
      return res.status(404).json({ error: 'Статья не найдена или нет прав доступа' });
    }

    await db.article.delete({
      where: { id }
    });

    // Log activity
    await db.activity.create({
      data: {
        action: 'Статья удалена',
        details: existingArticle.title,
        type: 'ARTICLE',
        userId,
      }
    });

    res.json({ message: 'Статья удалена' });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ error: 'Ошибка при удалении статьи' });
  }
};