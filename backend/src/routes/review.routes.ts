import { Router } from 'express';
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} from '../controllers/review.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.post('/', authenticate, validate(['productId', 'rating']), createReview);
router.get('/product/:productId', getProductReviews);
router.put('/:id', authenticate, updateReview);
router.delete('/:id', authenticate, deleteReview);

export default router;
