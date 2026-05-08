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
