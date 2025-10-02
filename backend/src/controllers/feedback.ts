import { Request, Response } from 'express';
import { db } from '../lib/db';
import { AuthRequest } from '../middleware/auth';

export const createFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const { type, title, message, email } = req.body;
    const userId = req.userId;

    if (!type || !title || !message) {
      return res.status(400).json({ error: 'Заполните все обязательные поля' });
    }

    if (!['FEEDBACK', 'BUG'].includes(type)) {
      return res.status(400).json({ error: 'Неверный тип обращения' });
    }

    // Create a direct database query for now
    const feedback = await db.$queryRaw`
      INSERT INTO feedbacks (id, type, title, message, email, status, userId, createdAt, updatedAt)
      VALUES (${generateId()}, ${type}, ${title}, ${message}, ${email || null}, 'OPEN', ${userId || null}, datetime('now'), datetime('now'))
      RETURNING *
    `;

    res.status(201).json({ 
      message: 'Ваше обращение отправлено',
      id: feedback
    });
  } catch (error) {
    console.error('Create feedback error:', error);
    res.status(500).json({ error: 'Ошибка при отправке обращения' });
  }
};

export const getFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    
    // Get user's feedback using raw query
    const feedbacks = await db.$queryRaw`
      SELECT * FROM feedbacks 
      WHERE userId = ${userId} 
      ORDER BY createdAt DESC
    `;

    res.json({ feedbacks });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ error: 'Ошибка при получении обращений' });
  }
};

function generateId(): string {
  return 'fb_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}