import { IPaymentGateway } from './payment.gateway';
import { StripeGateway } from './stripe.gateway';
import { config } from '../../config/env';
import { prisma } from '../../config/database';
import { AppError } from '../../middlewares/error.middleware';

function getGateway(): IPaymentGateway { return new StripeGateway(); }

export async function initiatePayment(orderId: string, currency = 'usd') {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new AppError('Order not found.', 404);
  return getGateway().createPaymentIntent(order.total * 100, currency, { orderId });
}

export async function confirmOrderPayment(orderId: string, paymentIntentId: string) {
  const result = await getGateway().confirmPayment(paymentIntentId);
  if (result.status === 'succeeded') await prisma.order.update({ where: { id: orderId }, data: { paymentStatus: 'PAID', status: 'PROCESSING' } });
  return result;
}

export async function refundOrderPayment(orderId: string, paymentIntentId: string, amount?: number) {
  const result = await getGateway().refund(paymentIntentId, amount);
  if (result.status === 'succeeded') await prisma.order.update({ where: { id: orderId }, data: { paymentStatus: 'REFUNDED', status: 'REFUNDED' } });
  return result;
}
