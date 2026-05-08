import { z } from 'zod';

export const checkoutSchema = z.object({
  fullName: z.string().min(3),
  phone: z.string().min(11),
  governorate: z.string().min(1),
  city: z.string().min(1),
  address: z.string().min(10),
  nearestLandmark: z.string().optional(),
  country: z.string().min(1),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;
