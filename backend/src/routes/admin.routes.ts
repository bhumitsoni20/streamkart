import { Router } from 'express';
import {
  getDashboardStats,
  getUsers,
  updateUserRole,
  updateProductStatus,
  getAllOrders,
} from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/products/:id/status', updateProductStatus);
router.get('/orders', getAllOrders);

export default router;
