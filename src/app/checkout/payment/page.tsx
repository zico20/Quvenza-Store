'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart.store';
import { orders } from '@/lib/api';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import type { Address } from '@/types';
import { useLang } from '@/hooks/useLang';
import { useCurrency } from '@/hooks/useCurrency';

export default function PaymentPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const { t } = useLang();
  const { formatPrice } = useCurrency();
  const total = items.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handlePlaceOrder() {
    setLoading(true); setError('');
    try {
      const shippingAddress = typeof window !== 'undefined'
        ? JSON.parse(sessionStorage.getItem('shippingAddress') ?? '{}') as Partial<Address>
        : {};

      const requiredFields: (keyof Address)[] = ['fullName', 'phone', 'governorate', 'city', 'address', 'country'];
      const hasMissing = requiredFields.some((field) => !shippingAddress[field]);
      if (hasMissing) {
        setError(t('checkout.addressError'));
        router.push('/checkout');
        return;
      }

      const response = await orders.create({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        shippingAddress: shippingAddress as Address,
        paymentMethod,
      });
      if (response.success) { clearCart(); sessionStorage.removeItem('shippingAddress'); router.push('/checkout/success'); }
    } catch (err: any) { setError(err.response?.data?.message ?? 'Failed to place order.'); }
    finally { setLoading(false); }
  }

  const paymentOptions = [
    { id: 'credit_card', label: t('checkout.creditCard') },
    { id: 'cash_on_delivery', label: t('checkout.cashOnDelivery') },
  ];

  return (
    <div className="w-full mx-auto px-4 py-8 max-w-lg">
      <CheckoutSteps currentStep={3} />
      <h1 className="text-2xl font-bold text-text-primary mb-6">{t('checkout.paymentStep')}</h1>
      <div className="space-y-3 mb-6">
        {paymentOptions.map((m) => (
          <label
            key={m.id}
            className={`flex items-center gap-3 p-4 border rounded-md cursor-pointer transition-colors ${
              paymentMethod === m.id
                ? 'border-accent bg-accent-subtle/50'
                : 'border-border bg-bg-surface hover:border-border-strong'
            }`}
          >
            <input
              type="radio"
              name="payment"
              value={m.id}
              checked={paymentMethod === m.id}
              onChange={() => setPaymentMethod(m.id)}
              className="accent-accent"
            />
            <span className="font-medium text-text-primary">{m.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-error text-sm mb-4">{error}</p>}

      {/* Desktop place-order button (inline) */}
      <button onClick={handlePlaceOrder} disabled={loading} className="btn-accent w-full py-3 disabled:opacity-50 hidden sm:flex">
        {loading ? t('checkout.placingOrder') : t('checkout.placeOrder')}
      </button>

      {/* Spacer so the sticky bar never covers content on mobile */}
      <div className="h-24 sm:hidden" />

      {/* Mobile sticky pay bar — total never scrolls away */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-bg-surface/95 backdrop-blur px-4 py-3 flex items-center gap-3" style={{ boxShadow: 'var(--shadow-lg)' }}>
        <div className="ltr-nums shrink-0">
          <div className="text-[11px] text-text-muted">{t('cart.subtotal')}</div>
          <div className="text-lg font-bold text-text-primary font-[family-name:var(--font-display)]">{formatPrice(total)}</div>
        </div>
        <button onClick={handlePlaceOrder} disabled={loading} className="btn-accent flex-1 py-3 disabled:opacity-50 min-h-[48px]">
          {loading ? t('checkout.placingOrder') : t('checkout.placeOrder')}
        </button>
      </div>
    </div>
  );
}
