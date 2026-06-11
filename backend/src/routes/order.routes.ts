import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  getSellerOrders,
} from '../controllers/order.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

router.post('/', authenticate, createOrder);
router.get('/', authenticate, getMyOrders);
router.get('/seller/me', authenticate, authorize('seller', 'admin'), getSellerOrders);
router.get('/:id', authenticate, getOrder);
router.put('/:id/status', authenticate, authorize('seller', 'admin'), updateOrderStatus);

export default router;
