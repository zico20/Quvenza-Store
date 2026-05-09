'use client';

import { useRouter } from 'next/navigation';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import { AddressForm, type AddressFormData } from '@/components/checkout/AddressForm';
import { useLang } from '@/hooks/useLang';

export default function CheckoutPage() {
  const router = useRouter();
  const { t } = useLang();

  async function handleAddressSubmit(data: AddressFormData) {
    const shippingAddress = {
      fullName: data.fullName,
      phone: data.phone,
      governorate: data.governorate,
      city: data.city,
      address: data.address,
      nearestLandmark: data.nearestLandmark || '',
      country: 'Iraq',
      isDefault: Boolean(data.isDefault),
    };

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
    }
    router.push('/checkout/payment');
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-xl">
      <CheckoutSteps currentStep={1} />
      <h1 className="text-xl font-bold text-text-primary mb-4">{t('checkout.shippingAddress')}</h1>
      <div className="bg-bg-surface border border-border rounded-lg p-4">
        <AddressForm onSubmit={handleAddressSubmit} />
      </div>
    </div>
  );
}
