import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { getServerLang, t } from '@/lib/i18n';

export default async function SuccessPage() {
  const lang = await getServerLang();

  return (
    <div className="w-full mx-auto px-4 py-16 text-center max-w-md">
      <Icon name="checkCircle" className="h-16 w-16 text-success mx-auto mb-6" size={64} />
      <h1 className="text-3xl font-bold text-text-primary mb-4">{t('checkout.success.title', lang)}</h1>
      <p className="text-text-secondary mb-8">{t('checkout.success.body', lang)}</p>
      <div className="flex flex-col gap-3">
        <Link href="/account/orders" className="btn-primary py-3 px-6">{t('checkout.success.viewOrders', lang)}</Link>
        <Link href="/products" className="btn-secondary py-3 px-6">{t('checkout.success.continue', lang)}</Link>
      </div>
    </div>
  );
}
