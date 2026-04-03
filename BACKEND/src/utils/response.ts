import { Response } from 'express';

export function sendSuccess<T>(res: Response, data: T, message?: string, statusCode = 200): void {
  res.status(statusCode).json({ success: true, data, message });
}

export function sendError(res: Response, message: string, statusCode = 400, errors?: unknown): void {
  res.status(statusCode).json({ success: false, message, ...(errors ? { errors } : {}) });
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  pagination: { page: number; limit: number; total: number; pages: number }
): void {
  res.status(200).json({ success: true, data, pagination });
}
