'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import type { Address } from '@/types';
import { AddressForm, type AddressFormData } from '@/components/checkout/AddressForm';
import { showToast } from '@/lib/toast';
import { useLang } from '@/hooks/useLang';

const STORAGE_KEY = 'store-addresses';

function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `addr_${Date.now()}`;
}

export default function AddressesPage() {
  const { t } = useLang();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setAddresses(JSON.parse(raw));
    } catch { setAddresses([]); }
  }, []);

  function persist(next: Address[]) {
    setAddresses(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  async function handleSave(data: AddressFormData) {
    setSaving(true);
    try {
      const incoming: Address = {
        id: newId(),
        fullName: data.fullName, phone: data.phone,
        governorate: data.governorate, city: data.city,
        address: data.address, nearestLandmark: data.nearestLandmark || '',
        country: 'Iraq', isDefault: Boolean(data.isDefault),
      };
      const normalized = (incoming.isDefault || addresses.length === 0)
        ? [incoming, ...addresses.map(a => ({ ...a, isDefault: false }))]
        : [...addresses, incoming];
      persist(normalized);
      showToast(t('toasts.addressSaved'));
      setShowForm(false);
    } finally { setSaving(false); }
  }

  function setDefault(id: string) {
    persist(addresses.map(a => ({ ...a, isDefault: a.id === id })));
    showToast(t('toasts.defaultUpdated'));
  }

  function remove(id: string) {
    const remaining = addresses.filter(a => a.id !== id);
    const normalized = remaining.some(a => a.isDefault)
      ? remaining
      : remaining.map((a, i) => ({ ...a, isDefault: i === 0 }));
    persist(normalized);
    showToast(t('toasts.addressRemoved'));
  }

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 32px' }}>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/account" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 4, border: '1px solid #EAECEF', color: '#4B5563', textDecoration: 'none', transition: 'color 0.15s' }}>
            <Icon name="arrowLeft" size={16} stroke={1.6} />
          </Link>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#9097A1', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>{t('address.breadcrumb')}</div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: '#111827', letterSpacing: '-0.01em' }}>{t('address.deliveryAddresses')}</h1>
          </div>
        </div>

        <button
          onClick={() => setShowForm(v => !v)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '10px 18px', background: showForm ? '#F3F4F6' : '#2563EB',
            color: showForm ? '#4B5563' : '#fff',
            border: `1px solid ${showForm ? '#EAECEF' : '#2563EB'}`,
            borderRadius: 4, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
          }}
        >
          <Icon name="plus" size={14} stroke={2} />
          {showForm ? t('common.cancel') : t('address.newAddress')}
        </button>
      </div>

      {/* Add address form */}
      {showForm && (
        <div style={{ background: '#FFFFFF', border: '1px solid #EAECEF', borderRadius: 6, padding: 28, marginBottom: 28 }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#4B5563', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>
            {t('address.newAddress')}
          </div>
          <AddressForm onSubmit={handleSave} loading={saving} />
        </div>
      )}

      {/* Saved addresses */}
      {addresses.length === 0 && !showForm ? (
        <div style={{ background: '#FFFFFF', border: '1px solid #EAECEF', borderRadius: 6, padding: '60px 32px', textAlign: 'center' }}>
          <Icon name="pin" size={40} stroke={1.2} style={{ color: '#9097A1', marginBottom: 16 }} />
          <h3 style={{ color: '#111827', fontSize: 18, fontWeight: 600, margin: 0 }}>{t('account.addresses.noAddresses')}</h3>
          <p style={{ color: '#4B5563', fontSize: 14, marginTop: 8 }}>{t('account.addresses.noAddressSub')}</p>
          <button
            onClick={() => setShowForm(true)}
            style={{ marginTop: 20, padding: '10px 20px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {t('account.addresses.addFirst')}
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
          {addresses.map(addr => (
            <div
              key={addr.id}
              style={{
                background: '#FFFFFF',
                border: `1px solid ${addr.isDefault ? 'rgba(37,99,235,0.4)' : '#EAECEF'}`,
                borderRadius: 6, padding: 20,
                position: 'relative',
              }}
            >
              {/* Default badge */}
              {addr.isDefault && (
                <div style={{
                  position: 'absolute', top: 16, right: 16,
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
                  padding: '3px 8px', background: 'rgba(37,99,235,0.12)',
                  color: '#2563EB', borderRadius: 3, letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>{t('account.addresses.default')}</div>
              )}

              {/* Name + phone */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(37,99,235,0.10)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="pin" size={16} style={{ color: '#2563EB' }} stroke={1.6} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{addr.fullName}</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#4B5563', marginTop: 2 }}>{addr.phone}</div>
                </div>
              </div>

              {/* Address details */}
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #F3F4F6', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.5 }}>{addr.address}</div>
                <div style={{ fontSize: 12, color: '#9097A1', fontFamily: 'JetBrains Mono, monospace' }}>
                  {addr.city} · {(addr as any).governorate} · {addr.country}
                </div>
                {addr.nearestLandmark && (
                  <div style={{ fontSize: 12, color: '#9097A1', fontStyle: 'italic', marginTop: 2 }}>
                    Near: {addr.nearestLandmark}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                {!addr.isDefault && (
                  <button onClick={() => setDefault(addr.id!)} style={actionBtn}>
                    <Icon name="star" size={12} stroke={1.6} />
                    {t('account.addresses.setDefault')}
                  </button>
                )}
                <button onClick={() => remove(addr.id!)} style={{ ...actionBtn, color: '#EF4444', borderColor: 'rgba(251,113,133,0.2)' }}>
                  <Icon name="trash" size={12} stroke={1.6} />
                  {t('account.addresses.remove')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

const actionBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 4,
  padding: '6px 12px', background: 'transparent',
  border: '1px solid #EAECEF', borderRadius: 4,
  color: '#4B5563', fontSize: 12, cursor: 'pointer',
  fontFamily: 'inherit', transition: 'border-color 0.15s',
};
