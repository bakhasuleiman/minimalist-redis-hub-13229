import { Router } from 'express';
import { createFeedback, getFeedback } from '../controllers/feedback';
import { authenticate } from '../middleware/auth';

const router = Router();

// Create feedback (can be used by logged in users or anonymous)
router.post('/', createFeedback);

// Get user's feedback (requires auth)
router.get('/', authenticate, getFeedback);

export default router;