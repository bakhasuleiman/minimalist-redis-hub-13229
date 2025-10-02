import { Router } from 'express';
import { 
  getNotes, 
  getNote,
  createNote, 
  updateNote, 
  deleteNote,
  createNoteValidation,
  updateNoteValidation 
} from '../controllers/notes';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getNotes);
router.get('/:id', getNote);
router.post('/', createNoteValidation, createNote);
router.put('/:id', updateNoteValidation, updateNote);
router.delete('/:id', deleteNote);

export default router;