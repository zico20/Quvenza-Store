'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag, Heart, Truck, Tag, Settings, LogOut,
  Star, Trash2, ChevronRight, MapPin, Plus, Check,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useWishlistStore } from '@/store/wishlist.store';
import { useCartStore } from '@/store/cart.store';
import { orders as ordersApi } from '@/lib/api';
import type { Order, Address } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import { showToast } from '@/lib/toast';
import { useLang } from '@/hooks/useLang';
import { useCurrency } from '@/hooks/useCurrency';

// ── helpers ────────────────────────────────────────────────────
function fmtDate(s: string): string {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(s));
}

const STATUS_COLOR: Record<string, string> = {
  PENDING:    '#fbbf24',
  PROCESSING: '#60a5fa',
  SHIPPED:    '#FF7A33',
  DELIVERED:  '#34D399',
  CANCELLED:  '#6C6C76',
  REFUNDED:   '#6C6C76',
};

const ADDR_KEY = 'store-addresses';

// ── sub-components ──────────────────────────────────────────────
function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="mono" style={{ fontSize: 10, color: '#A6A6AE', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: '#F7F7F8', marginTop: 4, letterSpacing: '-0.01em' }}>{value}</div>
    </div>
  );
}

// ── main ────────────────────────────────────────────────────────
type Tab = 'orders' | 'wishlist' | 'addresses' | 'payment' | 'settings';

export default function AccountPage() {
  const { user, logout } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();
  const { t, lang } = useLang();
  const { formatPrice: fmtPrice } = useCurrency();
  const [tab, setTab] = useState<Tab>('orders');
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [nameVal, setNameVal] = useState('');
  const [emailVal, setEmailVal] = useState('');
  const [saving, setSaving] = useState(false);

  const TABS: { key: Tab; icon: React.ElementType; label: string }[] = [
    { key: 'orders',    icon: ShoppingBag, label: t('account.tabs.orders') },
    { key: 'wishlist',  icon: Heart,       label: t('account.tabs.wishlist') },
    { key: 'addresses', icon: Truck,       label: t('account.tabs.addresses') },
    { key: 'payment',   icon: Tag,         label: t('account.tabs.payment') },
    { key: 'settings',  icon: Settings,    label: t('account.tabs.settings') },
  ];

  useEffect(() => {
    if (user) { setNameVal(user.name); setEmailVal(user.email); }
  }, [user]);

  useEffect(() => {
    ordersApi.getAll()
      .then(r => { if (r.success) setOrdersList(r.data); })
      .catch(() => {})
      .finally(() => setOrdersLoading(false));
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ADDR_KEY);
      if (raw) setAddresses(JSON.parse(raw));
    } catch {}
  }, []);

  function persistAddresses(next: Address[]) {
    setAddresses(next);
    localStorage.setItem(ADDR_KEY, JSON.stringify(next));
  }

  function removeAddress(id: string) {
    persistAddresses(addresses.filter(a => a.id !== id));
    showToast(t('toasts.addressRemoved'));
  }

  function setDefault(id: string) {
    persistAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
    showToast(t('toasts.defaultUpdated'));
  }

  if (!user) {
    return (
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 32px', textAlign: 'center' }}>
        <p style={{ color: '#A6A6AE', marginBottom: 20 }}>{t('account.signInPrompt')}</p>
        <Link href="/login" className="btn-accent" style={{ textDecoration: 'none' }}>{t('common.signIn')}</Link>
      </div>
    );
  }

  const initials = user.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <main style={{ maxWidth: 1280, margin: '0 auto', padding: '32px' }}>

      {/* ── Profile Header ── */}
      <div style={{
        background: '#121216', border: '1px solid #26262E', borderRadius: 8,
        padding: 32, marginBottom: 24,
        display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 36, flexShrink: 0,
          background: 'rgba(255,122,51,0.14)', color: '#FF7A33',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace',
        }}>{initials}</div>

        <div style={{ flex: 1 }}>
          <div className="mono" style={{ fontSize: 11, color: '#A6A6AE' }}>
            {t('account.memberSince')} {new Date(user.createdAt).getFullYear()}
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#F7F7F8', margin: '4px 0 0', letterSpacing: '-0.01em' }}>
            {`${t('account.hello')} ${user.name.split(' ')[0]}`}
          </h1>
          <div style={{ color: '#A6A6AE', fontSize: 13, marginTop: 2 }}>{user.email}</div>
        </div>

        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          <Stat label={t('account.stats.orders')}    value={ordersLoading ? '—' : ordersList.length} />
          <Stat label={t('account.stats.saved')}     value={wishlistItems.length} />
          <Stat label={t('account.stats.addresses')} value={addresses.length} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24, alignItems: 'start' }}>

        {/* ── Sidebar ── */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {TABS.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', textAlign: 'left',
                background: tab === key ? '#121216' : 'transparent',
                border: `1px solid ${tab === key ? '#26262E' : 'transparent'}`,
                borderLeft: `2px solid ${tab === key ? '#FF7A33' : 'transparent'}`,
                color: tab === key ? '#F7F7F8' : '#A6A6AE',
                borderRadius: 6, cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 13,
                fontWeight: tab === key ? 600 : 500,
                transition: 'all 0.15s',
              }}
            >
              <Icon size={16} strokeWidth={1.6} />
              {label}
            </button>
          ))}

          <button
            onClick={() => { logout(); window.location.href = '/'; }}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', textAlign: 'left',
              background: 'transparent', border: '1px solid transparent',
              color: '#FB7185', borderRadius: 6, cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 13, marginTop: 16,
            }}
          >
            <LogOut size={16} strokeWidth={1.6} />
            {t('common.signOut')}
          </button>
        </aside>

        {/* ── Content ── */}
        <div>
          {/* ORDERS */}
          {tab === 'orders' && (
            <div>
              <SectionHeader kicker={t('account.orders.kicker')} title={t('account.orders.title')} />
              {ordersLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} style={{ height: 72, background: '#121216', border: '1px solid #26262E', borderRadius: 6, animation: 'pulse 1.5s infinite' }} />
                  ))}
                </div>
              ) : ordersList.length === 0 ? (
                <EmptyState icon={ShoppingBag} title={t('account.orders.empty')} sub={t('account.orders.emptySub')} href="/products" cta={t('account.orders.shopNow')} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {ordersList.map(o => {
                    const statusColor = STATUS_COLOR[o.status] ?? '#A6A6AE';
                    return (
                      <Link
                        key={o.id}
                        href={`/account/orders/${o.id}`}
                        style={{
                          background: '#121216', border: '1px solid #26262E', borderRadius: 6,
                          padding: 18, textDecoration: 'none',
                          display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr auto', gap: 16, alignItems: 'center',
                        }}
                      >
                        <div>
                          <div className="mono" style={{ fontSize: 12, color: '#F7F7F8', fontWeight: 600 }}>
                            {o.id.slice(-10).toUpperCase()}
                          </div>
                          <div style={{ color: '#A6A6AE', fontSize: 11, marginTop: 4 }}>{fmtDate(o.createdAt)}</div>
                        </div>
                        <div>
                          <div className="mono" style={{ fontSize: 10, color: '#6C6C76', letterSpacing: '0.1em' }}>{t('account.orders.statusCol')}</div>
                          <div style={{ color: statusColor, fontSize: 13, fontWeight: 600, marginTop: 4 }}>
                            ● {t(`orders.status.${o.status}`)}
                          </div>
                        </div>
                        <div>
                          <div className="mono" style={{ fontSize: 10, color: '#6C6C76' }}>{t('account.orders.itemsCol')}</div>
                          <div style={{ color: '#F7F7F8', fontSize: 13, marginTop: 4 }}>{o.items?.length ?? '—'}</div>
                        </div>
                        <div>
                          <div className="mono" style={{ fontSize: 10, color: '#6C6C76' }}>{t('account.orders.totalCol')}</div>
                          <div style={{ color: '#F7F7F8', fontSize: 15, fontWeight: 700, marginTop: 4 }}>{fmtPrice(o.total)}</div>
                        </div>
                        <ChevronRight size={14} style={{ color: '#6C6C76' }} />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* WISHLIST */}
          {tab === 'wishlist' && (
            <div>
              <SectionHeader kicker={t('account.wishlist.kicker')} title={t('account.wishlist.title')} />
              {wishlistItems.length === 0 ? (
                <EmptyState icon={Heart} title={t('account.wishlist.empty')} sub={t('account.wishlist.emptySub')} href="/products" cta={t('account.wishlist.browse')} />
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  {wishlistItems.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              )}
            </div>
          )}

          {/* ADDRESSES */}
          {tab === 'addresses' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24, borderBottom: '1px solid #26262E', paddingBottom: 16 }}>
                <div>
                  <div className="mono" style={{ fontSize: 11, color: '#A6A6AE', marginBottom: 6 }}>{t('account.addresses.kicker')}</div>
                  <h2 style={{ margin: 0, fontSize: 26, fontWeight: 600, color: '#F7F7F8', letterSpacing: '-0.01em' }}>{t('account.addresses.title')}</h2>
                </div>
                <Link href="/account/addresses" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '9px 16px', background: '#FF7A33', color: '#fff',
                  borderRadius: 4, fontSize: 12, fontWeight: 600, textDecoration: 'none',
                }}>
                  <Plus size={14} /> {t('account.addresses.newAddress')}
                </Link>
              </div>

              {addresses.length === 0 ? (
                <EmptyState icon={MapPin} title={t('account.addresses.noAddresses')} sub={t('account.addresses.noAddressSub')} href="/account/addresses" cta={t('account.addresses.addFirst')} />
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {addresses.map(addr => (
                    <div key={addr.id} style={{ background: '#121216', border: '1px solid #26262E', borderRadius: 6, padding: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#F7F7F8' }}>{addr.fullName}</div>
                        {addr.isDefault && (
                          <span className="mono" style={{ fontSize: 10, padding: '3px 8px', background: '#1A1A20', color: '#A6A6AE', borderRadius: 3 }}>{t('account.addresses.default')}</span>
                        )}
                      </div>
                      <div style={{ color: '#A6A6AE', fontSize: 13, lineHeight: 1.6 }}>
                        <div>{addr.phone}</div>
                        <div>{addr.address}</div>
                        <div>{addr.city}, {(addr as any).governorate}, {addr.country}</div>
                      </div>
                      <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                        {!addr.isDefault && (
                          <button onClick={() => setDefault(addr.id!)} style={ghostBtn}>
                            <Star size={12} /> {t('account.addresses.setDefault')}
                          </button>
                        )}
                        <button onClick={() => removeAddress(addr.id!)} style={{ ...ghostBtn, color: '#FB7185' }}>
                          <Trash2 size={12} /> {t('account.addresses.remove')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PAYMENT */}
          {tab === 'payment' && (
            <div>
              <SectionHeader kicker={t('account.payment.kicker')} title={t('account.payment.title')} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { type: 'Visa',       last: '4242', exp: '08/28' },
                  { type: 'Mastercard', last: '1847', exp: '11/27' },
                ].map((c, i) => (
                  <div key={i} style={{ background: '#121216', border: '1px solid #26262E', borderRadius: 6, padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 50, height: 32, background: '#1A1A20', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="mono" style={{ fontSize: 10, color: '#F7F7F8' }}>{c.type}</span>
                      </div>
                      <div className="mono" style={{ flex: 1, color: '#F7F7F8', fontSize: 14 }}>•••• •••• •••• {c.last}</div>
                      <div className="mono" style={{ color: '#A6A6AE', fontSize: 12 }}>EXP {c.exp}</div>
                      <button style={{ ...ghostBtn, marginLeft: 8 }}>{t('account.payment.remove')}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {tab === 'settings' && (
            <div>
              <SectionHeader kicker={t('account.settings.kicker')} title={t('account.settings.title')} />
              <div style={{ background: '#121216', border: '1px solid #26262E', borderRadius: 6, padding: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <FieldInput label={t('account.settings.firstName')} value={nameVal.split(' ')[0]} onChange={() => {}} />
                  <FieldInput label={t('account.settings.lastName')} value={nameVal.split(' ').slice(1).join(' ')} onChange={() => {}} />
                  <div style={{ gridColumn: 'span 2' }}>
                    <FieldInput label={t('account.settings.email')} value={emailVal} onChange={setEmailVal} type="email" />
                  </div>
                </div>
                <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => { setSaving(true); setTimeout(() => { setSaving(false); showToast(t('toasts.changesSaved')); }, 800); }}
                    style={{
                      padding: '10px 20px', background: '#FF7A33', color: '#fff',
                      border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 600,
                      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
                      fontFamily: 'inherit',
                    }}
                  >
                    {saving ? t('account.settings.saving') : <><Check size={14} /> {t('account.settings.save')}</>}
                  </button>
                  <button onClick={() => { setNameVal(user.name); setEmailVal(user.email); }} style={ghostBtn}>{t('account.settings.cancel')}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

// ── shared helpers ──────────────────────────────────────────────
function SectionHeader({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div style={{ marginBottom: 24, borderBottom: '1px solid #26262E', paddingBottom: 16 }}>
      <div className="mono" style={{ fontSize: 11, color: '#A6A6AE', marginBottom: 6 }}>{kicker}</div>
      <h2 style={{ margin: 0, fontSize: 26, fontWeight: 600, color: '#F7F7F8', letterSpacing: '-0.01em' }}>{title}</h2>
    </div>
  );
}

function EmptyState({ icon: Icon, title, sub, href, cta }: { icon: React.ElementType; title: string; sub: string; href: string; cta: string }) {
  return (
    <div style={{ background: '#121216', border: '1px solid #26262E', borderRadius: 6, padding: '64px 32px', textAlign: 'center' }}>
      <Icon size={44} strokeWidth={1.2} style={{ color: '#6C6C76', marginBottom: 16 }} />
      <h3 style={{ color: '#F7F7F8', fontSize: 18, fontWeight: 600, margin: 0 }}>{title}</h3>
      <p style={{ color: '#A6A6AE', fontSize: 14, marginTop: 8 }}>{sub}</p>
      <Link href={href} style={{
        display: 'inline-flex', marginTop: 20, padding: '10px 20px',
        background: '#FF7A33', color: '#fff', borderRadius: 4,
        fontSize: 13, fontWeight: 600, textDecoration: 'none',
      }}>{cta}</Link>
    </div>
  );
}

function FieldInput({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label style={{ display: 'block' }}>
      <div className="mono" style={{ fontSize: 10, color: '#A6A6AE', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
      <input
        type={type}
        defaultValue={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '12px 14px',
          background: '#0A0A0C', border: '1px solid #26262E', borderRadius: 4,
          color: '#F7F7F8', fontFamily: 'inherit', fontSize: 14, outline: 'none',
          boxSizing: 'border-box' as const,
        }}
      />
    </label>
  );
}

const ghostBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 4,
  padding: '7px 12px', background: 'transparent',
  border: '1px solid #26262E', borderRadius: 4,
  color: '#A6A6AE', fontSize: 12, cursor: 'pointer',
  fontFamily: 'inherit',
};
