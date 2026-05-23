import express from 'express';
import {
  createCoverLetter,
  getUserCoverLetters,
  getCoverLetter,
  updateCoverLetter,
  deleteCoverLetter
} from '../controllers/coverLetterController.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post('/create', createCoverLetter);
router.get('/all', getUserCoverLetters);
router.get('/:id', getCoverLetter);
router.put('/:id', updateCoverLetter);
router.delete('/:id', deleteCoverLetter);

export default router;