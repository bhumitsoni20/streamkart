import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export const validate = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingFields = requiredFields.filter((field) => {
      const value = req.body[field];
      return value === undefined || value === null || value === '';
    });

    if (missingFields.length > 0) {
      return sendError(
        res,
        `Missing required fields: ${missingFields.join(', ')}`,
        400
      );
    }

    next();
  };
};
