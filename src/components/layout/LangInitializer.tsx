'use client';
import { useEffect } from 'react';
import { useLangStore } from '@/store/lang.store';

export default function LangInitializer() {
  const { lang, isRTL } = useLangStore();
  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
  }, [lang, isRTL]);
  return null;
}
