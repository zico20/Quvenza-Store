export const adminConfig = {
  storeName: 'quvenza',
  adminTitle: 'quvenza Admin',
  support: {
    email: 'support@quvenza.com',
  },
  currency: 'USD',
  locale: 'en-US',
} as const;

export type AdminConfig = typeof adminConfig;
