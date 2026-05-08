'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { type Lang, LANG_COOKIE, DEFAULT_LANG } from '@/lib/i18n';

interface LangState {
  lang: Lang;
  isRTL: boolean;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
}

export const useAdminLangStore = create<LangState>()(
  persist(
    (set, get) => ({
      lang: DEFAULT_LANG,
      isRTL: false,
      setLang: (lang) => {
        const isRTL = lang === 'ar';
        set({ lang, isRTL });
        if (typeof document !== 'undefined') {
          document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=31536000; SameSite=Lax`;
          document.documentElement.setAttribute('lang', lang);
          document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
        }
      },
      toggleLang: () => get().setLang(get().lang === 'en' ? 'ar' : 'en'),
    }),
    {
      name: 'admin-lang-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ lang: s.lang }),
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== 'undefined') {
          const lang = state.lang;
          state.isRTL = lang === 'ar';
          document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=31536000; SameSite=Lax`;
          document.documentElement.setAttribute('lang', lang);
          document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        }
      },
    }
  )
);
