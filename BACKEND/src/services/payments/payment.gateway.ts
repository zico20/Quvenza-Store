export interface IPaymentGateway {
  createPaymentIntent(amount: number, currency: string, metadata: object): Promise<{ id: string; clientSecret: string; status: string }>;
  confirmPayment(paymentIntentId: string): Promise<{ status: string }>;
  refund(paymentIntentId: string, amount?: number): Promise<{ status: string }>;
}
