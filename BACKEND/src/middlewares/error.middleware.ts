import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }
  if (err instanceof ZodError) {
    res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
    });
    return;
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') { res.status(409).json({ success: false, message: 'Record already exists.' }); return; }
    if (err.code === 'P2025') { res.status(404).json({ success: false, message: 'Record not found.' }); return; }
  }
  if (err instanceof TokenExpiredError) { res.status(401).json({ success: false, message: 'Token expired.' }); return; }
  if (err instanceof JsonWebTokenError) { res.status(401).json({ success: false, message: 'Invalid token.' }); return; }
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
}
