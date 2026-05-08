'use client';
import { useState, useEffect, useCallback } from 'react';
import { products as productsApi } from '@/lib/api';
import type { Product } from '@/types';

export function useProducts(options: { page?: number; limit?: number; categoryId?: string; search?: string; sort?: string } = {}) {
  const [data, setData] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const response = await productsApi.getAll(options as Record<string, unknown>);
      if (response.success) { setData(response.data); setPagination(response.pagination); }
    } catch { setError('Failed to load products.'); } finally { setLoading(false); }
  }, [options.page, options.limit, options.categoryId, options.search, options.sort]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  return { data, pagination, loading, error, refetch: fetchProducts };
}
