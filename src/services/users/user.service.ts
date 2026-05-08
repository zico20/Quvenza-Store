import { prisma } from '@/lib/prisma';
import { AppError } from '@/lib/errors';
import { hashPassword, verifyPassword } from '@/lib/auth';

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) throw new AppError('User not found.', 404);
  return user;
}

export async function updateUserProfile(
  userId: string,
  data: { name?: string; email?: string }
) {
  if (data.email) {
    const existing = await prisma.user.findFirst({
      where: { email: data.email, NOT: { id: userId } },
    });
    if (existing) throw new AppError('Email already in use.', 409);
  }
  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function changeUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found.', 404);
  const valid = await verifyPassword(currentPassword, user.password);
  if (!valid) throw new AppError('Current password is incorrect.', 401);
  const hash = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hash, refreshToken: null },
  });
}

export async function getUserAddresses(userId: string) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  });
}

/**
 * Add address.
 * NOTE: Prisma Address model has no governorate/nearestLandmark columns (audit-3 gap).
 * Iraqi-specific fields are composed into the address text string as a workaround.
 * The shippingAddress JSON on orders preserves them intact — only the saved-address
 * flow is affected by this limitation.
 */
export async function addUserAddress(
  userId: string,
  data: {
    fullName: string;
    phone: string;
    city: string;
    address: string;
    country: string;
    isDefault?: boolean;
    governorate?: string;
    nearestLandmark?: string;
  }
) {
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  // Compose Iraqi-specific fields into address text until schema gets dedicated columns
  let composedAddress = data.address;
  if (data.governorate) composedAddress = `${data.governorate} | ${composedAddress}`;
  if (data.nearestLandmark) composedAddress = `${composedAddress} | ${data.nearestLandmark}`;

  return prisma.address.create({
    data: {
      userId,
      fullName: data.fullName,
      phone: data.phone,
      city: data.city,
      address: composedAddress,
      country: data.country,
      isDefault: data.isDefault ?? false,
    },
  });
}

export async function deleteUserAddress(userId: string, addressId: string) {
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });
  if (!address) throw new AppError('Address not found.', 404);
  await prisma.address.delete({ where: { id: addressId } });
}
