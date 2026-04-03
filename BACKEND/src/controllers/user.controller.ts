import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { sendSuccess, sendPaginated } from '../utils/response';
import { AppError } from '../middlewares/error.middleware';
import bcrypt from 'bcryptjs';
import { BCRYPT_ROUNDS } from '../config/constants';
import { parsePaginationQuery, buildPaginationMeta } from '../utils/pagination';

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try { sendSuccess(res, await prisma.user.findUnique({ where: { id: req.user!.id }, select: { id: true, name: true, email: true, role: true, createdAt: true } })); } catch (e) { next(e); }
}
export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try { sendSuccess(res, await prisma.user.update({ where: { id: req.user!.id }, data: { name: req.body.name, email: req.body.email }, select: { id: true, name: true, email: true, role: true, createdAt: true } }), 'Updated'); } catch (e) { next(e); }
}
export async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) throw new AppError('User not found.', 404);
    if (!(await bcrypt.compare(req.body.currentPassword, user.password))) throw new AppError('Current password incorrect.', 400);
    await prisma.user.update({ where: { id: user.id }, data: { password: await bcrypt.hash(req.body.newPassword, BCRYPT_ROUNDS) } });
    sendSuccess(res, null, 'Password changed');
  } catch (e) { next(e); }
}
export async function getAddresses(req: Request, res: Response, next: NextFunction) {
  try { sendSuccess(res, await prisma.address.findMany({ where: { userId: req.user!.id } })); } catch (e) { next(e); }
}
export async function addAddress(req: Request, res: Response, next: NextFunction) {
  try { sendSuccess(res, await prisma.address.create({ data: { ...req.body, userId: req.user!.id } }), 'Added', 201); } catch (e) { next(e); }
}
export async function deleteAddress(req: Request, res: Response, next: NextFunction) {
  try {
    const addr = await prisma.address.findFirst({ where: { id: req.params.id, userId: req.user!.id } });
    if (!addr) throw new AppError('Address not found.', 404);
    await prisma.address.delete({ where: { id: addr.id } });
    sendSuccess(res, null, 'Deleted');
  } catch (e) { next(e); }
}
export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const p = parsePaginationQuery(req);
    const [users, total] = await Promise.all([
      prisma.user.findMany({ skip: p.skip, take: p.limit, select: { id: true, name: true, email: true, role: true, createdAt: true }, orderBy: { createdAt: 'desc' } }),
      prisma.user.count(),
    ]);
    sendPaginated(res, users, buildPaginationMeta(total, p.page, p.limit));
  } catch (e) { next(e); }
}
