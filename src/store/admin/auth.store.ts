'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, AuthTokens } from '@/types';
interface AdminAuthState {
  user: User | null; accessToken: string | null; isAuthenticated: boolean;
  setUser: (user: User) => void; setTokens: (tokens: AuthTokens) => void; logout: () => void;
}

// Cookie-based storage so Next.js edge middleware can read the auth state.
// localStorage is not accessible in middleware (server/edge context).
// Security note: this cookie is NOT httpOnly (set by client-side JS via Zustand persist).
// The token is therefore readable by JS on the page — acceptable for an admin template.
// For hardened production: proxy auth through a Next.js API route and set an httpOnly
// cookie server-side so the token is never accessible to page JS.
const cookieStorage = {
  getItem: (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  },
  setItem: (name: string, value: string): void => {
    if (typeof document === 'undefined') return;
    // 7-day expiry, SameSite=Lax is safe for same-origin navigation
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  },
  removeItem: (name: string): void => {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
  },
};

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      user: null, accessToken: null, isAuthenticated: false,
      setUser: (user) => set({ user }),
      setTokens: (tokens) => set({ accessToken: tokens.accessToken, isAuthenticated: true }),
      logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    { name: 'admin-auth-storage', storage: createJSONStorage(() => cookieStorage) }
  )
);
