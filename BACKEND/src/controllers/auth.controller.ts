import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth/auth.service';
import { sendSuccess } from '../utils/response';
import { prisma } from '../config/database';

export async function registerController(req: Request, res: Response, next: NextFunction) {
  try { sendSuccess(res, await authService.register(req.body.name, req.body.email, req.body.password), 'Registered', 201); } catch (e) { next(e); }
}
export async function loginController(req: Request, res: Response, next: NextFunction) {
  try { sendSuccess(res, await authService.login(req.body.email, req.body.password), 'Login successful'); } catch (e) { next(e); }
}
export async function refreshController(req: Request, res: Response, next: NextFunction) {
  try { sendSuccess(res, await authService.refreshToken(req.body.refreshToken), 'Tokens refreshed'); } catch (e) { next(e); }
}
export async function logoutController(req: Request, res: Response, next: NextFunction) {
  try { await authService.logout(req.user!.id); sendSuccess(res, null, 'Logged out'); } catch (e) { next(e); }
}
export async function meController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id }, select: { id: true, name: true, email: true, role: true, createdAt: true } });
    sendSuccess(res, user);
  } catch (e) { next(e); }
}
