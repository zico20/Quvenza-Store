import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { AppError } from '../middlewares/error.middleware';
import { sendSuccess } from '../utils/response';
import { BCRYPT_ROUNDS } from '../config/constants';

const SAFE_SELECT = {
  id: true, name: true, email: true,
  role: true, isActive: true, createdAt: true, updatedAt: true,
};

export const listAdminUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: SAFE_SELECT,
      orderBy: { createdAt: 'asc' },
    });
    sendSuccess(res, admins);
  } catch (e) { next(e); }
};

export const createAdminUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new AppError('Email already in use', 409);
    const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await prisma.user.create({
      data: { name, email, password: hash, role: 'ADMIN', isActive: true },
      select: SAFE_SELECT,
    });
    sendSuccess(res, user, 'Admin user created', 201);
  } catch (e) { next(e); }
};

export const updateAdminUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const target = await prisma.user.findUnique({ where: { id } });
    if (!target || target.role !== 'ADMIN') throw new AppError('Admin user not found', 404);
    if (email && email !== target.email) {
      const taken = await prisma.user.findUnique({ where: { email } });
      if (taken) throw new AppError('Email already in use', 409);
    }
    const updated = await prisma.user.update({
      where: { id },
      data: { ...(name && { name }), ...(email && { email }) },
      select: SAFE_SELECT,
    });
    sendSuccess(res, updated, 'Admin user updated');
  } catch (e) { next(e); }
};

export const deleteAdminUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const requesterId = (req as any).user.id;
    if (id === requesterId) throw new AppError('You cannot delete your own account', 400);
    const target = await prisma.user.findUnique({ where: { id } });
    if (!target || target.role !== 'ADMIN') throw new AppError('Admin user not found', 404);
    const adminCount = await prisma.user.count({ where: { role: 'ADMIN', isActive: true } });
    if (adminCount <= 1) throw new AppError('Cannot delete the last admin account', 400);
    await prisma.user.delete({ where: { id } });
    sendSuccess(res, null, 'Admin user deleted');
  } catch (e) { next(e); }
};

export const resetAdminPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    const target = await prisma.user.findUnique({ where: { id } });
    if (!target || target.role !== 'ADMIN') throw new AppError('Admin user not found', 404);
    const hash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await prisma.user.update({
      where: { id },
      data: { password: hash, refreshToken: null },
    });
    sendSuccess(res, null, 'Password reset successfully');
  } catch (e) { next(e); }
};

export const changeOwnPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requesterId = (req as any).user.id;
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: requesterId } });
    if (!user) throw new AppError('User not found', 404);
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) throw new AppError('Current password is incorrect', 401);
    const hash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await prisma.user.update({
      where: { id: requesterId },
      data: { password: hash, refreshToken: null },
    });
    sendSuccess(res, null, 'Password changed successfully');
  } catch (e) { next(e); }
};

export const updateOwnProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requesterId = (req as any).user.id;
    const { name, email } = req.body;
    if (email) {
      const taken = await prisma.user.findFirst({ where: { email, NOT: { id: requesterId } } });
      if (taken) throw new AppError('Email already in use', 409);
    }
    const updated = await prisma.user.update({
      where: { id: requesterId },
      data: { ...(name && { name }), ...(email && { email }) },
      select: SAFE_SELECT,
    });
    sendSuccess(res, updated, 'Profile updated');
  } catch (e) { next(e); }
};
