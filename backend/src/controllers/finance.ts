import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../lib/db';
import { AuthRequest } from '../middleware/auth';

export const createTransactionValidation = [
  body('title').trim().isLength({ min: 1 }).withMessage('Название транзакции обязательно'),
  body('amount').isFloat({ gt: 0 }).withMessage('Сумма должна быть положительным числом'),
  body('type').isIn(['INCOME', 'EXPENSE']).withMessage('Тип должен быть INCOME или EXPENSE'),
  body('privacy').optional().isIn(['PRIVATE', 'PUBLIC', 'SPECIFIC']).withMessage('Некорректное значение приватности'),
];

export const updateTransactionValidation = [
  body('title').optional().trim().isLength({ min: 1 }).withMessage('Название не может быть пустым'),
  body('amount').optional().isFloat({ gt: 0 }).withMessage('Сумма должна быть положительным числом'),
  body('type').optional().isIn(['INCOME', 'EXPENSE']).withMessage('Тип должен быть INCOME или EXPENSE'),
  body('privacy').optional().isIn(['PRIVATE', 'PUBLIC', 'SPECIFIC']).withMessage('Некорректное значение приватности'),
];

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    
    const transactions = await db.transaction.findMany({
      where: {
        OR: [
          { userId },
          { privacy: 'PUBLIC' }
        ]
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate balance for user's transactions only
    const userTransactions = transactions.filter((t: any) => t.userId === userId);
    const balance = userTransactions.reduce((acc: number, transaction: any) => {
      return acc + (transaction.type === 'INCOME' ? transaction.amount : -transaction.amount);
    }, 0);

    res.json({ transactions, balance });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Ошибка при получении транзакций' });
  }
};

export const getTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const transaction = await db.transaction.findFirst({
      where: {
        id,
        OR: [
          { userId },
          { privacy: 'PUBLIC' }
        ]
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Транзакция не найдена' });
    }

    res.json({ transaction });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ error: 'Ошибка при получении транзакции' });
  }
};

export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.userId!;
    const { title, amount, type, privacy = 'PRIVATE' } = req.body;

    const transaction = await db.transaction.create({
      data: {
        title,
        amount: parseFloat(amount),
        type,
        privacy,
        userId,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // Log activity
    const actionText = type === 'INCOME' ? 'Добавлен доход' : 'Добавлен расход';
    const amountText = type === 'INCOME' ? `+${amount}` : `-${amount}`;
    
    await db.activity.create({
      data: {
        action: actionText,
        details: `${amountText} ₽ ${title}`,
        type: 'TRANSACTION',
        userId,
      }
    });

    res.status(201).json({ transaction });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Ошибка при создании транзакции' });
  }
};

export const updateTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.userId!;
    const { id } = req.params;
    const { title, amount, type, privacy } = req.body;

    // Check if transaction exists and user has permission
    const existingTransaction = await db.transaction.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingTransaction) {
      return res.status(404).json({ error: 'Транзакция не найдена или нет прав доступа' });
    }

    const transaction = await db.transaction.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(amount !== undefined && { amount: parseFloat(amount) }),
        ...(type !== undefined && { type }),
        ...(privacy !== undefined && { privacy }),
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // Log activity
    await db.activity.create({
      data: {
        action: 'Транзакция обновлена',
        details: title || existingTransaction.title,
        type: 'TRANSACTION',
        userId,
      }
    });

    res.json({ transaction });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ error: 'Ошибка при обновлении транзакции' });
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    // Check if transaction exists and user has permission
    const existingTransaction = await db.transaction.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingTransaction) {
      return res.status(404).json({ error: 'Транзакция не найдена или нет прав доступа' });
    }

    await db.transaction.delete({
      where: { id }
    });

    // Log activity
    await db.activity.create({
      data: {
        action: 'Транзакция удалена',
        details: existingTransaction.title,
        type: 'TRANSACTION',
        userId,
      }
    });

    res.json({ message: 'Транзакция удалена' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ error: 'Ошибка при удалении транзакции' });
  }
};

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    
    const transactions = await db.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    const totalIncome = transactions
      .filter((t: any) => t.type === 'INCOME')
      .reduce((sum: number, t: any) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter((t: any) => t.type === 'EXPENSE')
      .reduce((sum: number, t: any) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpenses;

    // Get monthly stats for current year
    const currentYear = new Date().getFullYear();
    const monthlyStats = [];
    
    for (let month = 0; month < 12; month++) {
      const monthTransactions = transactions.filter((t: any) => {
        const transactionMonth = new Date(t.createdAt).getMonth();
        const transactionYear = new Date(t.createdAt).getFullYear();
        return transactionMonth === month && transactionYear === currentYear;
      });

      const monthIncome = monthTransactions
        .filter((t: any) => t.type === 'INCOME')
        .reduce((sum: number, t: any) => sum + t.amount, 0);
      
      const monthExpenses = monthTransactions
        .filter((t: any) => t.type === 'EXPENSE')
        .reduce((sum: number, t: any) => sum + t.amount, 0);

      monthlyStats.push({
        month: month + 1,
        income: monthIncome,
        expenses: monthExpenses,
        balance: monthIncome - monthExpenses
      });
    }

    res.json({
      totalIncome,
      totalExpenses,
      balance,
      transactionCount: transactions.length,
      monthlyStats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Ошибка при получении статистики' });
  }
};