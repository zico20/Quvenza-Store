'use client';
import { useState, useEffect, useCallback } from 'react';
import { products as productsApi } from '@/lib/api';
import type { Product } from '@/types';

export interface UseProductsOptions {
  page?: number;
  limit?: number;
  categoryId?: string;
  brandSlug?: string;
  kind?: 'PHONE' | 'LAPTOP' | 'TABLET' | 'HEADPHONE';
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  search?: string;
  sort?: string;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [data, setData] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      // Strip undefined so they don't become "?minPrice=undefined" query strings.
      const params = Object.fromEntries(
        Object.entries(options).filter(([, v]) => v !== undefined && v !== '')
      );
      const response = await productsApi.getAll(params as Record<string, unknown>);
      if (response.success) { setData(response.data); setPagination(response.pagination); }
    } catch { setError('Failed to load products.'); } finally { setLoading(false); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.page, options.limit, options.categoryId, options.brandSlug, options.kind, options.minPrice, options.maxPrice, options.featured, options.search, options.sort]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  return { data, pagination, loading, error, refetch: fetchProducts };
}
