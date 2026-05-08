import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/auth';
import { AppError } from '@/lib/errors';

export async function listAdminUsers() {
  return prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: {
      id: true,
      name: true,
      email: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createAdminUser(data: { name: string; email: string; password: string }) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new AppError('Email already in use.', 409);
  const hash = await hashPassword(data.password);
  return prisma.user.create({
    data: { name: data.name, email: data.email, password: hash, role: 'ADMIN' },
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
  });
}

export async function updateAdminUser(
  id: string,
  data: { name?: string; email?: string; isActive?: boolean }
) {
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) throw new AppError('Admin not found.', 404);
  if (target.role !== 'ADMIN') throw new AppError('Not an admin account.', 400);
  if (data.email) {
    const existing = await prisma.user.findFirst({ where: { email: data.email, NOT: { id } } });
    if (existing) throw new AppError('Email already in use.', 409);
  }
  return prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, isActive: true, updatedAt: true },
  });
}

export async function deleteAdminUser(id: string, requestingAdminId: string) {
  if (id === requestingAdminId) throw new AppError('Cannot delete your own account.', 400);
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) throw new AppError('Admin not found.', 404);
  if (target.role !== 'ADMIN') throw new AppError('Not an admin account.', 400);
  const activeAdmins = await prisma.user.count({ where: { role: 'ADMIN', isActive: true } });
  if (activeAdmins <= 1) throw new AppError('Cannot delete the last active admin.', 400);
  await prisma.user.delete({ where: { id } });
}

export async function resetAdminPassword(id: string, newPassword: string) {
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) throw new AppError('Admin not found.', 404);
  if (target.role !== 'ADMIN') throw new AppError('Not an admin account.', 400);
  const hash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id }, data: { password: hash, refreshToken: null } });
}

export async function changeOwnAdminPassword(
  adminId: string,
  currentPassword: string,
  newPassword: string
) {
  const admin = await prisma.user.findUnique({ where: { id: adminId } });
  if (!admin) throw new AppError('Admin not found.', 404);
  const valid = await verifyPassword(currentPassword, admin.password);
  if (!valid) throw new AppError('Current password is incorrect.', 401);
  const hash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: adminId }, data: { password: hash, refreshToken: null } });
}

export async function updateOwnAdminProfile(
  adminId: string,
  data: { name?: string; email?: string }
) {
  if (data.email) {
    const existing = await prisma.user.findFirst({ where: { email: data.email, NOT: { id: adminId } } });
    if (existing) throw new AppError('Email already in use.', 409);
  }
  return prisma.user.update({
    where: { id: adminId },
    data,
    select: { id: true, name: true, email: true, role: true, updatedAt: true },
  });
}
