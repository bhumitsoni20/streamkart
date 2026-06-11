import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { sendSuccess, sendError } from '../utils/response';
import { sendWelcomeEmail } from '../services/email.service';

// POST /api/auth/register
export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone } = req.body;
    const firebaseUser = req.firebaseUser;

    let user = await User.findOne({ firebaseUid: firebaseUser.uid });

    if (user) {
      return sendSuccess(res, user, 'User already exists. Logged in.');
    }

    user = await User.create({
      name: name || firebaseUser.name || email?.split('@')[0] || 'User',
      email: email || firebaseUser.email || '',
      phone: phone || firebaseUser.phone_number || '',
      firebaseUid: firebaseUser.uid,
      avatar: firebaseUser.picture || '',
      isVerified: firebaseUser.email_verified || false,
    });

    await sendWelcomeEmail(user.email, user.name);

    return sendSuccess(res, user, 'User registered successfully.', 201);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

// POST /api/auth/login
export const login = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    return sendSuccess(res, user, 'Login successful.');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

// GET /api/auth/me
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return sendError(res, 'User not found.', 404);
    return sendSuccess(res, user);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

// PUT /api/auth/profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, avatar },
      { new: true, runValidators: true }
    );

    if (!user) return sendError(res, 'User not found.', 404);
    return sendSuccess(res, user, 'Profile updated.');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

// PUT /api/auth/fcm-token
export const updateFCMToken = async (req: AuthRequest, res: Response) => {
  try {
    const { fcmToken } = req.body;

    await User.findByIdAndUpdate(req.user._id, { fcmToken });
    return sendSuccess(res, null, 'FCM token updated.');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};
