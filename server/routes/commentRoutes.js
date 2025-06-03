import express from 'express';
import {
  createComment,
  getComments,
  deleteComment,
  voteComment
} from '../controllers/commentController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, createComment);
router.get('/:postId', getComments);
router.delete('/:commentId', auth, deleteComment);
router.post('/:commentId/vote', auth, voteComment);

export default router;
