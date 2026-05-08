export const adminConfig = {
  storeName: 'softodeviq',
  adminTitle: 'softodeviq Admin',
  support: {
    email: 'support@softodeviqstore.com',
  },
  currency: 'USD',
  locale: 'en-US',
} as const;

export type AdminConfig = typeof adminConfig;
