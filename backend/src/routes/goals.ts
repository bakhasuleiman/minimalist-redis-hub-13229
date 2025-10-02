import { Router } from 'express';
import { 
  getGoals, 
  getGoal,
  createGoal, 
  updateGoal, 
  deleteGoal,
  createGoalValidation,
  updateGoalValidation 
} from '../controllers/goals';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getGoals);
router.get('/:id', getGoal);
router.post('/', createGoalValidation, createGoal);
router.put('/:id', updateGoalValidation, updateGoal);
router.delete('/:id', deleteGoal);

export default router;