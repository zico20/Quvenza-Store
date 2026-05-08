export const storeConfig = {
  name: 'softodeviq',
  tagline: 'Tech, curated for pros',

  // ── SEO ──────────────────────────────────────────────────────────
  seo: {
    domain: 'softodeviqstore.com',
    siteUrl: 'https://softodeviqstore.com',
    ogImage: '/og-image.svg',
    organizationLogo: '/logo.png',
    defaultDescription:
      'أكبر متجر اشتراكات رقمية أصلية في العراق. اشترك في ChatGPT Plus، Canva Pro، CapCut Pro، Coursera Plus بأسعار بالدينار العراقي — تفعيل فوري، ضمان كامل.',
  },

  // ── Business ─────────────────────────────────────────────────────
  business: {
    legalName: 'SoftoDev',
    arabicName: 'سوفتوديف',
    foundingDate: '2026',
    phone: '+9647700000000',
    email: 'support@softodeviqstore.com',
    whatsapp: '+9647700000000',
    paymentMethods: ['Cash on Delivery', 'ZainCash', 'AsiaHawala', 'FastPay'] as string[],
    socialMedia: {
      facebook:  'https://www.facebook.com/softodeviq',
      instagram: 'https://www.instagram.com/softodeviq',
      tiktok:    '',
      twitter:   '',
      telegram:  'https://t.me/softodeviq',
      youtube:   '',
    },
  },

  // ── Support (legacy — keep for Footer/existing components) ────────
  support: {
    email: 'support@softodeviqstore.com',
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
  copyright: `© ${new Date().getFullYear()} SOFTODEVIQ · ALL RIGHTS RESERVED`,
} as const;

export type StoreConfig = typeof storeConfig;
