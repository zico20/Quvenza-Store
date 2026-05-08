'use client';
import { useCurrencyStore } from '@/store/currency.store';
import { formatPrice as fmt } from '@/lib/utils';
import { storeConfig } from '@/config/store.config';

export function useCurrency() {
  const { currency, toggleCurrency, setCurrency } = useCurrencyStore();
  // inline — no useCallback, same pattern as useLang.ts
  const formatPrice = (price: number | string | undefined) =>
    fmt(price, currency, storeConfig.exchangeRates.IQD_PER_USD);
  return { currency, formatPrice, toggleCurrency, setCurrency };
}
