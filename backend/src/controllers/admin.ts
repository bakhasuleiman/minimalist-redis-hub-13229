import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../lib/db';
import { hashPassword, comparePassword, generateToken } from '../lib/auth';
import bcrypt from 'bcryptjs';

// Admin login
export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    // Find admin user
    const admin = await db.user.findUnique({
      where: { email }
    });

    if (!admin || admin.email !== 'admin@system.local') {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    // Check password
    const isValidPassword = await comparePassword(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    // Generate admin token
    const token = generateToken(admin.id);

    const { password: _, ...adminWithoutPassword } = admin;

    res.json({
      message: 'Вход в админ панель выполнен успешно',
      admin: adminWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};

// Get dashboard statistics
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [usersResult, tasks, notes, goals, transactions, articles, feedbacksResult] = await Promise.all([
      db.user.count({ where: { email: { not: 'admin@system.local' } } }),
      db.task.count(),
      db.note.count(),
      db.goal.count(),
      db.transaction.count(),
      db.article.count(),
      db.$queryRaw`SELECT COUNT(*) as count FROM feedbacks`
    ]);

    // Convert BigInt to number for JSON serialization
    const feedbacks = Number((feedbacksResult as any)[0]?.count || 0);
    const users = Number(usersResult);

    res.json({
      users,
      tasks: Number(tasks),
      notes: Number(notes),
      goals: Number(goals),
      transactions: Number(transactions),
      articles: Number(articles),
      feedbacks
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Ошибка при загрузке статистики' });
  }
};

// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await db.user.findMany({
      where: { email: { not: 'admin@system.local' } },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            tasks: true,
            notes: true,
            goals: true,
            transactions: true,
            articles: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Ошибка при загрузке пользователей' });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await db.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    if (user.email === 'admin@system.local') {
      return res.status(400).json({ error: 'Нельзя удалить администратора' });
    }

    await db.user.delete({
      where: { id: userId }
    });

    res.json({ message: 'Пользователь успешно удален' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Ошибка при удалении пользователя' });
  }
};

// Reset user password
export const resetUserPassword = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Пароль должен содержать минимум 6 символов' });
    }

    const user = await db.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const hashedPassword = await hashPassword(newPassword);

    await db.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    // Log activity
    await db.activity.create({
      data: {
        action: 'Сброс пароля администратором',
        details: `Пароль сброшен для пользователя ${user.name}`,
        type: 'USER',
        userId: user.id,
      }
    });

    res.json({ message: 'Пароль успешно сброшен' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Ошибка при сбросе пароля' });
  }
};

// Get all feedbacks
export const getFeedbacks = async (req: Request, res: Response) => {
  try {
    const feedbacks = await db.$queryRaw`
      SELECT f.*, u.name as userName, u.email as userEmail
      FROM feedbacks f
      LEFT JOIN users u ON f.userId = u.id
      ORDER BY f.createdAt DESC
    `;

    res.json({ feedbacks });
  } catch (error) {
    console.error('Get feedbacks error:', error);
    res.status(500).json({ error: 'Ошибка при загрузке обращений' });
  }
};

// Update feedback status
export const updateFeedbackStatus = async (req: Request, res: Response) => {
  try {
    const { feedbackId } = req.params;
    const { status, adminReply } = req.body;

    const feedback = await db.$queryRaw`
      SELECT * FROM feedbacks WHERE id = ${feedbackId}
    `;

    if (!feedback || (feedback as any).length === 0) {
      return res.status(404).json({ error: 'Обращение не найдено' });
    }

    await db.$executeRaw`
      UPDATE feedbacks 
      SET status = ${status}, adminReply = ${adminReply || null}, updatedAt = ${new Date().toISOString()}
      WHERE id = ${feedbackId}
    `;

    res.json({ message: 'Статус обращения обновлен' });
  } catch (error) {
    console.error('Update feedback status error:', error);
    res.status(500).json({ error: 'Ошибка при обновлении статуса' });
  }
};

// Create feedback (update existing function to save to database)
export const createFeedback = async (req: Request, res: Response) => {
  try {
    const { type, title, message, email } = req.body;
    
    if (!type || !title || !message) {
      return res.status(400).json({ error: 'Заполните все обязательные поля' });
    }

    // Get user ID if authenticated
    const userId = (req as any).userId || null;
    const feedbackId = `fb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    // Save to database using raw SQL
    await db.$executeRaw`
      INSERT INTO feedbacks (id, type, title, message, email, userId, status, createdAt, updatedAt)
      VALUES (${feedbackId}, ${type}, ${title}, ${message}, ${email}, ${userId}, 'OPEN', ${now}, ${now})
    `;

    console.log('📧 Новое обращение сохранено в БД:', {
      id: feedbackId,
      type,
      title,
      message,
      email,
      timestamp: now
    });

    res.status(201).json({ 
      message: 'Ваше обращение отправлено',
      feedbackId
    });
  } catch (error) {
    console.error('Create feedback error:', error);
    res.status(500).json({ error: 'Ошибка при отправке обращения' });
  }
};

// Get site settings
export const getSiteSettings = async (req: Request, res: Response) => {
  try {
    const settings = await db.$queryRaw`
      SELECT * FROM site_settings ORDER BY key ASC
    `;

    res.json({ settings });
  } catch (error) {
    console.error('Get site settings error:', error);
    res.status(500).json({ error: 'Ошибка при загрузке настроек' });
  }
};

// Update site setting
export const updateSiteSetting = async (req: Request, res: Response) => {
  try {
    const { key, value, description } = req.body;

    if (!key || !value) {
      return res.status(400).json({ error: 'Ключ и значение обязательны' });
    }

    const settingId = `set_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    // Try to update first, then insert if not exists
    await db.$executeRaw`
      INSERT OR REPLACE INTO site_settings (id, key, value, description, updatedAt)
      VALUES (${settingId}, ${key}, ${value}, ${description || null}, ${now})
    `;

    res.json({ message: 'Настройка обновлена' });
  } catch (error) {
    console.error('Update site setting error:', error);
    res.status(500).json({ error: 'Ошибка при обновлении настройки' });
  }
};

// Get database statistics
export const getDatabaseStats = async (req: Request, res: Response) => {
  try {
    const stats = await Promise.all([
      db.user.count(),
      db.task.count(),
      db.note.count(),
      db.goal.count(),
      db.transaction.count(),
      db.article.count(),
      db.$queryRaw`SELECT COUNT(*) as count FROM feedbacks`,
      db.activity.count(),
      db.$queryRaw`SELECT COUNT(*) as count FROM site_settings`
    ]);

    // Convert BigInt values to numbers for JSON serialization
    const tableStats = [
      { table: 'users', count: Number(stats[0]) },
      { table: 'tasks', count: Number(stats[1]) },
      { table: 'notes', count: Number(stats[2]) },
      { table: 'goals', count: Number(stats[3]) },
      { table: 'transactions', count: Number(stats[4]) },
      { table: 'articles', count: Number(stats[5]) },
      { table: 'feedbacks', count: Number((stats[6] as any)[0]?.count || 0) },
      { table: 'activities', count: Number(stats[7]) },
      { table: 'site_settings', count: Number((stats[8] as any)[0]?.count || 0) }
    ];

    const totalRecords = tableStats.reduce((sum: number, stat) => sum + stat.count, 0);

    res.json({ 
      tableStats,
      totalRecords,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get database stats error:', error);
    res.status(500).json({ error: 'Ошибка при загрузке статистики БД' });
  }
};