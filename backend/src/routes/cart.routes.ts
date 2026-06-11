import { Router } from 'express';
import { getCart, addToCart, removeFromCart, clearCart } from '../controllers/cart.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getCart);
router.post('/add', authenticate, addToCart);
router.delete('/remove/:productId', authenticate, removeFromCart);
router.delete('/clear', authenticate, clearCart);

export default router;
