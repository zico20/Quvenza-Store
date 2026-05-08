import { z } from 'zod';

export const createOrderSchema = z.object({
  items: z.array(z.object({ productId: z.string().min(1), quantity: z.number().int().positive() })).min(1),
  shippingAddress: z.object({
    fullName: z.string().min(1),
    phone: z.string().min(1),
    governorate: z.string().min(1),
    city: z.string().min(1),
    address: z.string().min(1),
    nearestLandmark: z.string().optional(),
    country: z.string().min(1),
  }),
  paymentMethod: z.string().min(1),
});
export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
  note: z.string().optional(),
});
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
