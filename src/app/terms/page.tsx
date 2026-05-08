import { storeConfig } from '@/config/store.config';

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-text-primary mb-4">Terms of Service</h1>
      <p className="text-text-muted text-sm mb-8">{storeConfig.copyright}</p>
      <div className="prose prose-invert max-w-none space-y-4 text-text-secondary text-sm leading-relaxed">
        <p>
          By using {storeConfig.name} you agree to these terms. Please read them carefully before
          placing an order.
        </p>
        <p>
          All purchases are subject to product availability. We reserve the right to refuse or cancel
          any order at our discretion. Prices are subject to change without notice.
        </p>
        <p>
          For questions about these terms, please contact us at{' '}
          <a href={`mailto:${storeConfig.support.email}`} className="text-accent hover:underline">
            {storeConfig.support.email}
          </a>.
        </p>
      </div>
    </div>
  );
}
