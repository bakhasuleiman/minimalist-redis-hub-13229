import { Router } from 'express';
import { 
  getArticles, 
  getArticle,
  createArticle, 
  updateArticle, 
  deleteArticle,
  createArticleValidation,
  updateArticleValidation 
} from '../controllers/articles';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getArticles);
router.get('/:id', getArticle);
router.post('/', createArticleValidation, createArticle);
router.put('/:id', updateArticleValidation, updateArticle);
router.delete('/:id', deleteArticle);

export default router;