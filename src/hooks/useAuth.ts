'use client';
import { useAuthStore } from '@/store/auth.store';
import { auth } from '@/lib/api';
import type { LoginInput } from '@/lib/validators/auth.validator';

export function useAuth() {
  const { user, accessToken, isAuthenticated, setUser, setTokens, logout: clearAuth } = useAuthStore();
  async function login(credentials: LoginInput) {
    const response = await auth.login(credentials);
    if (response.success) { setUser(response.data.user); setTokens(response.data.tokens); }
    return response;
  }
  async function logout() { try { await auth.logout(); } finally { clearAuth(); } }
  return { user, accessToken, isAuthenticated, login, logout };
}
