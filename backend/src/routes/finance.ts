import { Router } from 'express';
import { 
  getTransactions, 
  getTransaction,
  createTransaction, 
  updateTransaction, 
  deleteTransaction,
  getStats,
  createTransactionValidation,
  updateTransactionValidation 
} from '../controllers/finance';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getTransactions);
router.get('/stats', getStats);
router.get('/:id', getTransaction);
router.post('/', createTransactionValidation, createTransaction);
router.put('/:id', updateTransactionValidation, updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;