import { Router } from 'express';
import { register, login, getProfile, registerValidation, loginValidation, createFeedback } from '../controllers/auth';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', authenticate, getProfile);
router.post('/feedback', createFeedback);

export default router;