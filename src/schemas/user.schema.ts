import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
  email: z.string().email('Invalid email').optional(),
});

export const addAddressSchema = z.object({
  fullName: z.string().min(2).max(100),
  phone: z.string().min(7).max(20),
  governorate: z.string().min(2).max(100),
  city: z.string().min(1).max(100),
  address: z.string().min(5).max(500),
  nearestLandmark: z.string().max(200).optional(),
  country: z.string().min(2).max(100),
  isDefault: z.boolean().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AddAddressInput = z.infer<typeof addAddressSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[0-9]/, 'Must contain a digit'),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => !data.confirmPassword || data.newPassword === data.confirmPassword,
    { message: 'Passwords do not match', path: ['confirmPassword'] }
  );

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
