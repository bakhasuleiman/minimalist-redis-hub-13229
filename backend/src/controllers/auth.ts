import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../lib/db';
import { hashPassword, comparePassword, generateToken } from '../lib/auth';

export const registerValidation = [
  body('email').isEmail().withMessage('Некорректный email'),
  body('password').isLength({ min: 6 }).withMessage('Пароль должен содержать минимум 6 символов'),
  body('name').trim().isLength({ min: 2 }).withMessage('Имя должно содержать минимум 2 символа'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Некорректный email'),
  body('password').notEmpty().withMessage('Пароль обязателен'),
];

export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }

    // Generate unique username
    let username = '';
    let userCount = Math.floor(Math.random() * 10000) + 1; // Start with random number to avoid conflicts
    let usernameExists = true;
    
    while (usernameExists) {
      username = `user${userCount}`;
      // Check if username exists using raw SQL
      const existingUsername = await db.$queryRaw`
        SELECT id FROM users WHERE username = ${username} LIMIT 1
      `;
      
      if ((existingUsername as any).length === 0) {
        usernameExists = false;
      } else {
        userCount++;
      }
    }

    // Hash password and create user using raw SQL to avoid Prisma client issues
    const hashedPassword = await hashPassword(password);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    await db.$executeRaw`
      INSERT INTO users (id, email, username, password, name, createdAt, updatedAt)
      VALUES (${userId}, ${email}, ${username}, ${hashedPassword}, ${name}, ${now}, ${now})
    `;
    
    const user = {
      id: userId,
      email,
      name,
      createdAt: now
    };

    // Generate token
    const token = generateToken(userId);

    // Log activity using raw SQL
    const activityId = `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await db.$executeRaw`
      INSERT INTO activities (id, action, details, type, userId, createdAt)
      VALUES (${activityId}, ${'Регистрация'}, ${`Новый пользователь ${name} (${username})`}, ${'USER'}, ${userId}, ${now})
    `;

    res.status(201).json({
      message: 'Регистрация успешна',
      user,
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await db.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    // Check password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    // Generate token
    const token = generateToken(user.id);

    // Log activity
    await db.activity.create({
      data: {
        action: 'Вход в систему',
        details: `Пользователь ${user.name}`,
        type: 'USER',
        userId: user.id,
      }
    });

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Вход выполнен успешно',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};

export const getProfile = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const user = await db.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};

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