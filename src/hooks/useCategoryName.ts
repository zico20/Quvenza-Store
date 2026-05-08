'use client';

import { useLang } from './useLang';
import { getCategoryName } from '@/lib/i18n';

/**
 * Returns the translated category name for the current UI language.
 * Falls back to the original DB name (Arabic) when slug has no map entry.
 */
export function useCategoryName(slug: string, fallback: string): string {
  const { lang } = useLang();
  return getCategoryName(slug, fallback, lang);
}
