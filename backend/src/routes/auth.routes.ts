import { Router } from 'express';
import { register, login, getMe, updateProfile, updateFCMToken, sendVerificationEmail } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', authLimiter, authenticate, register);
router.post('/login', authLimiter, authenticate, login);
router.post('/send-verification', authLimiter, authenticate, sendVerificationEmail);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);
router.put('/fcm-token', authenticate, updateFCMToken);

export default router;
