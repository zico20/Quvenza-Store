import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof AppError) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        message: 'Validation failed',
        errors: error.issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
      { status: 422 }
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      const field = (error.meta?.target as string[])?.[0] ?? 'field';
      return NextResponse.json(
        { success: false, message: `${field} already exists.` },
        { status: 409 }
      );
    }
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, message: 'Record not found.' },
        { status: 404 }
      );
    }
  }

  if (error instanceof Error) {
    if (error.name === 'JWTExpired') {
      return NextResponse.json(
        { success: false, message: 'Token expired.' },
        { status: 401 }
      );
    }
    if (error.name === 'JWSInvalid' || error.name === 'JWTInvalid') {
      return NextResponse.json(
        { success: false, message: 'Invalid token.' },
        { status: 401 }
      );
    }
  }

  console.error('[API Error]', error);
  return NextResponse.json(
    { success: false, message: 'Internal server error.' },
    { status: 500 }
  );
}
