'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@/components/ui/Icon';
import type { Product } from '@/types';
import { adminProducts } from '@/lib/admin/api';
import Topbar from '@/components/admin/layout/Topbar';
import { useLang } from '@/hooks/admin/useLang';
import { formatPrice } from '@/lib/utils';

export default function ProductsPage() {
  const { t } = useLang();
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminProducts.getAll({ limit: 50 })
      .then(r => { if (r.success) setData(r.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = search.trim()
    ? data.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    : data;

  async function handleDelete(id: string) {
    if (!confirm(t('products.deleteConfirmTitle'))) return;
    try { await adminProducts.delete(id); setData(d => d.filter(x => x.id !== id)); }
    catch (e) { console.error(e); }
  }

  // Tone hue for placeholder
  const hues = [18, 220, 280, 140, 40, 320];

  return (
    <div className="flex flex-col">
      <Topbar title={t('products.title')} />
      <div style={{ padding: 32 }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, alignItems: 'center' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#121216', border: '1px solid #26262E', borderRadius: 4 }}>
            <Icon name="search" size={15} style={{ color: '#6C6C76', flexShrink: 0 }} stroke={1.6} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('products.search')}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#F7F7F8', fontSize: 13, fontFamily: 'inherit' }}
            />
          </div>
          <Link
            href="/admin/dashboard/products/new"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 18px', background: '#FF7A33', color: '#fff',
              borderRadius: 4, fontSize: 13, fontWeight: 600, textDecoration: 'none',
            }}
          >
            <Icon name="plus" size={14} stroke={2} />
            {t('products.new')}
          </Link>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ height: 60, background: '#121216', border: '1px solid #26262E', borderRadius: 4 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ background: '#121216', border: '1px solid #26262E', borderRadius: 6, padding: '64px 32px', textAlign: 'center' }}>
            <Icon name="package" size={40} stroke={1.2} style={{ color: '#6C6C76', marginBottom: 16 }} />
            <p style={{ color: '#F7F7F8', fontSize: 16, fontWeight: 600, margin: 0 }}>{t('products.noProducts')}</p>
          </div>
        ) : (
          <div style={{ background: '#121216', border: '1px solid #26262E', borderRadius: 6, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '2.5fr 1fr 100px 80px 100px 80px',
              padding: '10px 20px', background: '#1A1A20', borderBottom: '1px solid #26262E', gap: 12,
            }}>
              {[t('products.columns.product'), t('products.columns.category'), t('products.columns.price'), t('products.columns.stock'), t('products.columns.status'), t('products.columns.actions')].map((h, i) => (
                <div key={i} className="mono" style={{ fontSize: 10, color: '#6C6C76' }}>{h}</div>
              ))}
            </div>
            {/* Rows */}
            {filtered.map((p, idx) => {
              const hue = hues[idx % hues.length];
              const placeholderBg = `repeating-linear-gradient(135deg, oklch(0.78 0.04 ${hue}) 0 2px, transparent 2px 14px), linear-gradient(160deg, oklch(0.88 0.03 ${hue}), oklch(0.72 0.05 ${hue}))`;
              return (
                <div key={p.id} style={{
                  display: 'grid', gridTemplateColumns: '2.5fr 1fr 100px 80px 100px 80px',
                  padding: '12px 20px', borderBottom: '1px solid #1A1A20',
                  alignItems: 'center', gap: 12, transition: 'background 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#1A1A20')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Product */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 4, overflow: 'hidden', flexShrink: 0, background: p.images?.[0] ? '#1A1A20' : placeholderBg }}>
                      {p.images?.[0] && (
                        <Image src={p.images[0]} alt={p.name} width={40} height={40} className="object-cover w-full h-full"
                          unoptimized={p.images[0].startsWith('http://localhost')} />
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#F7F7F8' }}>{p.name}</div>
                      <div className="mono" style={{ fontSize: 10, color: '#6C6C76' }}>{p.slug}</div>
                    </div>
                  </div>
                  {/* Category */}
                  <div style={{ fontSize: 12, color: '#A6A6AE' }}>{(p as any).category?.name ?? '—'}</div>
                  {/* Price */}
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#F7F7F8' }}>{formatPrice(p.price)}</div>
                  {/* Stock */}
                  <div style={{ fontSize: 13, fontWeight: 600, color: p.stock === 0 ? '#FB7185' : p.stock <= 10 ? '#fbbf24' : '#34D399' }}>
                    {p.stock}
                  </div>
                  {/* Status */}
                  <div>
                    <span style={{
                      display: 'inline-flex', padding: '3px 10px', borderRadius: 3, fontSize: 10, fontWeight: 600,
                      fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em', textTransform: 'uppercase',
                      background: p.isActive ? 'rgba(52,211,153,0.1)' : 'rgba(251,113,133,0.1)',
                      color: p.isActive ? '#34D399' : '#FB7185',
                      border: `1px solid ${p.isActive ? 'rgba(52,211,153,0.2)' : 'rgba(251,113,133,0.2)'}`,
                    }}>
                      {p.isActive ? t('common.active') : t('common.inactive')}
                    </span>
                  </div>
                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 4 }}>
                    <Link href={`/admin/dashboard/products/${p.id}`} style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 30, height: 30, borderRadius: 4,
                      background: 'transparent', color: '#A6A6AE', border: 'none', cursor: 'pointer', textDecoration: 'none',
                    }}>
                      <Icon name="edit" size={14} stroke={1.6} />
                    </Link>
                    <button onClick={() => handleDelete(p.id)} style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 30, height: 30, borderRadius: 4,
                      background: 'transparent', color: '#A6A6AE', border: 'none', cursor: 'pointer',
                    }}>
                      <Icon name="trash" size={14} stroke={1.6} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* Count */}
        <p className="mono" style={{ fontSize: 10, color: '#6C6C76', marginTop: 12 }}>
          {filtered.length} {t('products.columns.product')}
        </p>
      </div>
    </div>
  );
}
