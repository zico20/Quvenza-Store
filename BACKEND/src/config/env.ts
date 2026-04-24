import dotenv from 'dotenv';
dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}

const JWT_SECRET = requireEnv('JWT_SECRET');
const JWT_REFRESH_SECRET = requireEnv('JWT_REFRESH_SECRET');
if (JWT_SECRET.length < 32) throw new Error('JWT_SECRET too short — minimum 32 characters required');
if (JWT_REFRESH_SECRET.length < 32) throw new Error('JWT_REFRESH_SECRET too short — minimum 32 characters required');

export const config = {
  DATABASE_URL: requireEnv('DATABASE_URL'),
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  FRONTEND_URL: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  ADMIN_URL: process.env.ADMIN_URL ?? 'http://localhost:3001',
  BACKEND_URL: process.env.BACKEND_URL ?? 'http://localhost:5000',
  PORT: parseInt(process.env.PORT ?? '5000', 10),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  CLOUDINARY_URL: process.env.CLOUDINARY_URL,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
};
