import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { getServerLang, t } from '@/lib/i18n';

export default async function SuccessPage() {
  const lang = await getServerLang();

  return (
    <div className="container mx-auto px-4 py-16 text-center max-w-md">
      <CheckCircle className="h-16 w-16 text-success mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-text-primary mb-4">{t('checkout.success.title', lang)}</h1>
      <p className="text-text-secondary mb-8">{t('checkout.success.body', lang)}</p>
      <div className="flex flex-col gap-3">
        <Link href="/account/orders" className="btn-primary py-3 px-6">{t('checkout.success.viewOrders', lang)}</Link>
        <Link href="/products" className="btn-secondary py-3 px-6">{t('checkout.success.continue', lang)}</Link>
      </div>
    </div>
  );
}
