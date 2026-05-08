import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { storeConfig } from '@/config/store.config';

export function cn(...inputs: ClassValue[]): string { return twMerge(clsx(inputs)); }
export function formatPrice(
  price: number | string | undefined,
  currency: 'IQD' | 'USD' = 'USD',
  iqdPerUsd: number = storeConfig.exchangeRates.IQD_PER_USD,
): string {
  if (price == null) return '';
  const usd = Number(price); // prices stored in USD
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD',
      minimumFractionDigits: 0, maximumFractionDigits: 2,
    }).format(usd);
  }
  // convert USD → IQD
  const iqd = usd * iqdPerUsd;
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(iqd) + ' د.ع';
}
export function formatDate(dateString: string, locale?: string): string {
  const resolvedLocale = locale ?? storeConfig.locale;
  return new Intl.DateTimeFormat(resolvedLocale, {
    year: 'numeric', month: 'short', day: 'numeric',
  }).format(new Date(dateString));
}
