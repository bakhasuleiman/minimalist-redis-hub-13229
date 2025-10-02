import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../lib/db';

export interface AdminRequest extends Request {
  userId?: string;
  user?: any;
}

export const authenticateAdmin = async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Токен не предоставлен' });
    }

    const token = authHeader.substring(7);
    
    if (!token) {
      return res.status(401).json({ error: 'Токен не предоставлен' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    
    // Get user with role check
    const user = await db.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return res.status(401).json({ error: 'Недействительный токен' });
    }

    // Check if user is admin (check by email for now)
    if (user.email !== 'admin@system.local') {
      return res.status(403).json({ error: 'Доступ запрещен. Требуются права администратора' });
    }

    req.userId = user.id;
    req.user = user;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(401).json({ error: 'Недействительный токен' });
  }
};