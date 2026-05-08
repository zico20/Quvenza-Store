'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { adminProducts } from '@/lib/admin/api';
import type { Product } from '@/types';

export default function LowStockAlert() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminProducts.getLowStock(5)
      .then((res) => { if (res.success) setProducts(res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-bg-surface border border-border rounded-lg p-5 shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-4 w-4 text-warning" />
        <h3 className="text-base font-semibold text-text-primary">Low Stock Products</h3>
      </div>
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-8 bg-bg-elevated rounded animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-success text-sm py-4 text-center">✓ All products have sufficient stock</p>
      ) : (
        <div className="space-y-2">
          {products.map((p) => (
            <div key={p.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <div className="flex-1 min-w-0 mr-3">
                <p className="text-sm font-medium text-text-primary truncate">{p.name}</p>
                {p.category && <p className="text-xs text-text-muted">{p.category.name}</p>}
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`text-sm font-bold ${p.stock === 0 ? 'text-error' : 'text-warning'}`}>
                  {p.stock} left
                </span>
                <Link
                  href={`/admin/dashboard/products?edit=${p.id}`}
                  className="text-xs text-accent hover:underline"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
