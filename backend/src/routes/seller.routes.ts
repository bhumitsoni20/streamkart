import { Router } from 'express';
import { applySeller, getMyApplicationStatus } from '../controllers/seller.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/application', applySeller);
router.get('/application/me', getMyApplicationStatus);

export default router;
