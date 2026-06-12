import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { SellerApplication } from '../models/SellerApplication';
import { sendSuccess, sendError } from '../utils/response';

// POST /api/seller/application
export const applySeller = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return sendError(res, 'User not found.', 404);

    if (user.role === 'seller' || user.role === 'admin') {
      return sendError(res, 'User is already a seller or admin.', 400);
    }

    const existingApplication = await SellerApplication.findOne({ user: user._id });
    if (existingApplication && existingApplication.status !== 'rejected') {
      return sendError(res, 'You already have a pending or approved application.', 400);
    }

    const { fullName, email, phone, businessName, description, additionalInfo } = req.body;

    const application = await SellerApplication.create({
      user: user._id,
      fullName,
      email,
      phone,
      businessName,
      description,
      additionalInfo,
      status: 'pending',
    });

    return sendSuccess(res, application, 'Application submitted successfully.', 201);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

// GET /api/seller/application/me
export const getMyApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return sendError(res, 'User not found.', 404);

    const application = await SellerApplication.findOne({ user: user._id }).sort({ createdAt: -1 });
    return sendSuccess(res, application);
  } catch (error: any) {
    return sendError(res, error.message);
  }
};
