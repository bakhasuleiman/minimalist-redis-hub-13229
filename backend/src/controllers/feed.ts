import { Request, Response } from 'express';
import { db } from '../lib/db';
import { AuthRequest } from '../middleware/auth';

export const getFeed = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { limit = 50, offset = 0 } = req.query;
    
    // Show only user's own activities (personal activity feed)
    const activities = await db.activity.findMany({
      where: {
        userId // Only show current user's activities
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string)
    });

    res.json({ activities });
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ error: 'Ошибка при получении ленты активности' });
  }
};

export const getUserActivity = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { limit = 50, offset = 0, type } = req.query;
    
    let whereClause: any = { userId };
    
    // Filter by activity type if specified
    if (type && typeof type === 'string') {
      whereClause.type = type.toUpperCase();
    }
    
    const activities = await db.activity.findMany({
      where: whereClause,
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string)
    });

    res.json({ activities });
  } catch (error) {
    console.error('Get user activity error:', error);
    res.status(500).json({ error: 'Ошибка при получении активности пользователя' });
  }
};

export const getActivityStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    
    // Get activity counts by type for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activities = await db.activity.findMany({
      where: {
        userId,
        createdAt: { gte: thirtyDaysAgo }
      },
      select: { type: true, createdAt: true }
    });

    // Count by type
    const countsByType = activities.reduce((acc: any, activity: any) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1;
      return acc;
    }, {});

    // Get daily activity for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentActivities = activities.filter((a: any) => new Date(a.createdAt) >= sevenDaysAgo);
    
    const dailyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const dayActivities = recentActivities.filter((a: any) => {
        const activityDate = new Date(a.createdAt);
        return activityDate >= dayStart && activityDate <= dayEnd;
      });
      
      dailyActivity.push({
        date: dayStart.toISOString().split('T')[0],
        count: dayActivities.length
      });
    }

    res.json({
      totalActivities: activities.length,
      countsByType,
      dailyActivity
    });
  } catch (error) {
    console.error('Get activity stats error:', error);
    res.status(500).json({ error: 'Ошибка при получении статистики активности' });
  }
};