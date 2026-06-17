export const storeConfig = {
  name: 'quvenza',
  tagline: 'Tech, curated for pros',

  // ── SEO ──────────────────────────────────────────────────────────
  seo: {
    domain: 'quvenzaiq.com',
    siteUrl: 'https://quvenzaiq.com',
    ogImage: '/og-image.svg',
    organizationLogo: '/logo.png',
    defaultDescription:
      'متجر إلكترونيات أصلية في العراق — هواتف، لابتوبات، أجهزة لوحية وسماعات من Apple وSamsung وSony وDell والمزيد. أسعار بالدينار العراقي، توصيل سريع، ضمان رسمي.',
  },

  // ── Business ─────────────────────────────────────────────────────
  business: {
    legalName: 'Quvenza',
    arabicName: 'كوفينزا',
    foundingDate: '2026',
    phone: '+9647700000000',
    email: 'support@quvenzaiq.com',
    whatsapp: '+9647700000000',
    paymentMethods: ['Cash on Delivery', 'ZainCash', 'AsiaHawala', 'FastPay'] as string[],
    socialMedia: {
      facebook:  'https://www.facebook.com/quvenza',
      instagram: 'https://www.instagram.com/quvenza',
      tiktok:    '',
      twitter:   '',
      telegram:  'https://t.me/quvenza',
      youtube:   '',
    },
  },

  // ── Support (legacy — keep for Footer/existing components) ────────
  support: {
    email: 'support@quvenzaiq.com',
    phone: '+964 770 000 0000',
    hours: 'Sun–Thu, 9am–6pm',
  },

  social: {
    instagram: '',
    facebook:  '',
    twitter:   '',
  },

  legal: {
    privacyUrl: '/privacy',
    termsUrl:   '/terms',
  },

  currency:              'USD',
  locale:                'en-US',
  country:               'Iraq',
  exchangeRates: {
    IQD_PER_USD: 1540,
  },
  freeShippingThreshold: 99,
  copyright: `© ${new Date().getFullYear()} QUVENZA · ALL RIGHTS RESERVED`,
} as const;

export type StoreConfig = typeof storeConfig;
