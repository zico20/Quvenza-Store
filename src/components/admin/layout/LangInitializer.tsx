'use client';
import { useEffect } from 'react';
import { useAdminLangStore } from '@/store/admin/lang.store';

export default function LangInitializer() {
  const { lang, isRTL } = useAdminLangStore();
  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
  }, [lang, isRTL]);
  return null;
}
