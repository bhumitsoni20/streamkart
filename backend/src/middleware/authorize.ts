import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { sendError } from '../utils/response';

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Authentication required.', 401);
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, 'You do not have permission to perform this action.', 403);
    }

    next();
  };
};
