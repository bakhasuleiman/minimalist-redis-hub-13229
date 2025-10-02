import express from 'express';
import { 
  adminLogin,
  getDashboardStats,
  getUsers,
  deleteUser,
  resetUserPassword,
  getFeedbacks,
  updateFeedbackStatus,
  getSiteSettings,
  updateSiteSetting,
  getDatabaseStats
} from '../controllers/admin';
import { authenticateAdmin } from '../middleware/adminAuth';

const router = express.Router();

// Admin login (no auth required)
router.post('/login', adminLogin);

// Protected admin routes
router.get('/stats', authenticateAdmin, getDashboardStats);
router.get('/users', authenticateAdmin, getUsers);
router.delete('/users/:userId', authenticateAdmin, deleteUser);
router.post('/users/:userId/reset-password', authenticateAdmin, resetUserPassword);
router.get('/feedbacks', authenticateAdmin, getFeedbacks);
router.put('/feedbacks/:feedbackId', authenticateAdmin, updateFeedbackStatus);
router.get('/settings', authenticateAdmin, getSiteSettings);
router.put('/settings', authenticateAdmin, updateSiteSetting);
router.get('/database', authenticateAdmin, getDatabaseStats);

export default router;