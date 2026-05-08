import { IPaymentGateway } from './payment.gateway';
import { StripeGateway } from './stripe.gateway';
import { prisma } from '@/lib/prisma';
import { AppError } from '@/lib/errors';

function getGateway(): IPaymentGateway { return new StripeGateway(); }

export async function initiatePayment(orderId: string, userId: string, currency = 'usd') {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new AppError('Order not found.', 404);
  if (order.userId !== userId) throw new AppError('Access denied.', 403);
  return getGateway().createPaymentIntent(Number(order.total) * 100, currency, { orderId });
}

export async function confirmOrderPayment(orderId: string, userId: string, paymentIntentId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new AppError('Order not found.', 404);
  if (order.userId !== userId) throw new AppError('Access denied.', 403);
  const result = await getGateway().confirmPayment(paymentIntentId);
  if (result.status === 'succeeded') await prisma.order.update({ where: { id: orderId }, data: { paymentStatus: 'PAID', status: 'PROCESSING' } });
  return result;
}

export async function refundOrderPayment(orderId: string, paymentIntentId: string, amount?: number) {
  const result = await getGateway().refund(paymentIntentId, amount);
  if (result.status === 'succeeded') await prisma.order.update({ where: { id: orderId }, data: { paymentStatus: 'REFUNDED', status: 'REFUNDED' } });
  return result;
}
