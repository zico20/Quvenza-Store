import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { AppError } from './error.middleware';

interface JwtPayload { id: string; email: string; role: string; }

declare global {
  namespace Express {
    interface Request { user?: JwtPayload; }
  }
}

export function verifyToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return next(new AppError('No token provided.', 401));
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    next();
  } catch (err) { next(err); }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) return next(new AppError('Authentication required.', 401));
  if (req.user.role !== 'ADMIN') return next(new AppError('Admin access required.', 403));
  next();
}
