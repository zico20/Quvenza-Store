import { z } from 'zod';

const passwordSchema = z.string()
  .min(8, 'At least 8 characters')
  .regex(/[A-Z]/, 'Must contain an uppercase letter')
  .regex(/[0-9]/, 'Must contain a number')
  .regex(/[^A-Za-z0-9]/, 'Must contain a special character (@!#$%...)');

export const createAdminUserSchema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.string().email('Invalid email address'),
  password: passwordSchema,
});

export const updateAdminUserSchema = z.object({
  name:  z.string().min(2).optional(),
  email: z.string().email().optional(),
});

export const changeOwnPasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword:     passwordSchema,
});

export const resetAdminPasswordSchema = z.object({
  newPassword: passwordSchema,
});
