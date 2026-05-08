'use client';
import { useAdminLangStore } from '@/store/admin/lang.store';
import { t as translate, type Lang } from '@/lib/i18n';

export function useLang() {
  const { lang, isRTL, setLang, toggleLang } = useAdminLangStore();
  const t = (path: string) => translate(path, lang);
  return { lang, isRTL, t, setLang, toggleLang };
}
