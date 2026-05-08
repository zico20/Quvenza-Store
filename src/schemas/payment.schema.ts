import { z } from 'zod';

export const initiatePaymentSchema = z.object({
  orderId: z.string().min(1, 'Order ID required'),
  paymentMethod: z.enum(['zaincash', 'card', 'cod', 'fastpay']).optional(),
});

export const confirmPaymentSchema = z.object({
  orderId: z.string().min(1, 'Order ID required'),
  paymentIntentId: z.string().optional(),
  transactionId: z.string().optional(),
});

export const refundPaymentSchema = z.object({
  orderId: z.string().min(1, 'Order ID required'),
  reason: z.string().optional(),
});

export type InitiatePaymentInput = z.infer<typeof initiatePaymentSchema>;
export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>;
export type RefundPaymentInput = z.infer<typeof refundPaymentSchema>;
