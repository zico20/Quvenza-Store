import { IPaymentGateway } from './payment.gateway';

export class StripeGateway implements IPaymentGateway {
  constructor() {
    console.warn('[PaymentGateway] Stripe not configured, using stub.');
  }
  async createPaymentIntent(amount: number, currency: string, metadata: object) {
    return { id: `pi_stub_${Date.now()}`, clientSecret: `pi_stub_secret_${Date.now()}`, status: 'requires_payment_method' };
  }
  async confirmPayment(paymentIntentId: string) {
    return { status: 'succeeded' };
  }
  async refund(paymentIntentId: string, amount?: number) {
    return { status: 'succeeded' };
  }
}
