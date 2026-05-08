'use client';
import { useCartStore } from '@/store/cart.store';
import { cartApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import type { CartItem } from '@/types';

export function useCart() {
  const store = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const total = store.items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
  async function syncWithServer() {
    if (!isAuthenticated) return;
    const response = await cartApi.get();
    if (response.success && response.data?.items) store.setItems(response.data.items as CartItem[]);
  }
  return { ...store, total, syncWithServer };
}
