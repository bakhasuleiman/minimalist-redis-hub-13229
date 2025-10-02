import { Router } from 'express';
import { 
  getFeed,
  getUserActivity,
  getActivityStats
} from '../controllers/feed';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getFeed);
router.get('/user', getUserActivity);
router.get('/stats', getActivityStats);

export default router;