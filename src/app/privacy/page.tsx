import { storeConfig } from '@/config/store.config';

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-text-primary mb-4">Privacy Policy</h1>
      <p className="text-text-muted text-sm mb-8">{storeConfig.copyright}</p>
      <div className="prose prose-invert max-w-none space-y-4 text-text-secondary text-sm leading-relaxed">
        <p>
          {storeConfig.name} is committed to protecting your privacy. This policy explains how we collect,
          use, and safeguard your personal information when you shop with us.
        </p>
        <p>
          We collect only the information necessary to process your orders — including your name, contact
          details, and shipping address. We do not sell or share your data with third parties except
          where required to fulfil your order or comply with applicable law.
        </p>
        <p>
          For any privacy-related inquiries, please contact us at{' '}
          <a href={`mailto:${storeConfig.support.email}`} className="text-accent hover:underline">
            {storeConfig.support.email}
          </a>.
        </p>
      </div>
    </div>
  );
}
