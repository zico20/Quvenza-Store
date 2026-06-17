'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';

export const COMPARE_MAX = 4;

interface CompareStore {
  items: Product[];
  /** Returns false (and no-ops) when the list is already full and the item is new. */
  addItem: (product: Product) => boolean;
  removeItem: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  /** Returns the resulting state: 'added' | 'removed' | 'full'. */
  toggleItem: (product: Product) => 'added' | 'removed' | 'full';
  clear: () => void;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const { items } = get();
        if (items.some((i) => i.id === product.id)) return true;
        if (items.length >= COMPARE_MAX) return false;
        set({ items: [...items, product] });
        return true;
      },
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== productId) })),
      isInCompare: (productId) => get().items.some((i) => i.id === productId),
      toggleItem: (product) => {
        const { isInCompare, removeItem, addItem } = get();
        if (isInCompare(product.id)) {
          removeItem(product.id);
          return 'removed';
        }
        return addItem(product) ? 'added' : 'full';
      },
      clear: () => set({ items: [] }),
    }),
    { name: 'compare-storage' }
  )
);
