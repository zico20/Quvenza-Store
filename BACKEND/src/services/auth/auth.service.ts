import bcrypt from 'bcryptjs';
import { prisma } from '../../config/database';
import { AppError } from '../../middlewares/error.middleware';
import { generateTokens, verifyRefreshToken } from './token.service';
import { BCRYPT_ROUNDS } from '../../config/constants';

export async function register(name: string, email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError('Email already in use.', 409);
  const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  const tokens = generateTokens({ id: user.id, email: user.email, role: user.role });
  await prisma.user.update({ where: { id: user.id }, data: { refreshToken: tokens.refreshToken } });
  return { user, tokens };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) throw new AppError('Invalid email or password.', 401);
  const tokens = generateTokens({ id: user.id, email: user.email, role: user.role });
  await prisma.user.update({ where: { id: user.id }, data: { refreshToken: tokens.refreshToken } });
  const { password: _, ...safeUser } = user;
  return { user: safeUser, tokens };
}

export async function refreshToken(token: string) {
  const payload = verifyRefreshToken(token);
  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  if (!user || user.refreshToken !== token) throw new AppError('Invalid refresh token.', 401);
  const tokens = generateTokens({ id: user.id, email: user.email, role: user.role });
  await prisma.user.update({ where: { id: user.id }, data: { refreshToken: tokens.refreshToken } });
  return tokens;
}

export async function logout(userId: string) {
  await prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
}
