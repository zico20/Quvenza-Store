'use client';

import Link from 'next/link';

const BASE = 'https://softodeviqstore.com';

const CHANNELS = [
  { icon: '💬', name: 'WhatsApp',  desc: 'الأسرع — رد خلال دقائق',   href: 'https://wa.me/9647700000000',        label: 'ابدأ محادثة',        color: '#25D366' },
  { icon: '✈️', name: 'Telegram',  desc: 'متاح 24/7',                 href: 'https://t.me/softodeviq',            label: 'تواصل عبر Telegram', color: '#0088cc' },
  { icon: '📧', name: 'Email',     desc: 'للاستفسارات الرسمية',       href: 'mailto:support@softodeviqstore.com', label: 'أرسل إيميل',         color: '#FF7A33' },
];

const HOURS = [
  { day: 'الأحد — الخميس', time: '9 صباحاً — منتصف الليل' },
  { day: 'الجمعة — السبت', time: '11 صباحاً — 10 مساءً'  },
  { day: 'WhatsApp',        time: '24/7 للاستفسارات العاجلة' },
  { day: 'الرد على الإيميل', time: 'خلال 12 ساعة عمل'     },
];

export default function ContactPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '64px 24px' }}>
      <h1 style={{ fontSize: 40, fontWeight: 700, color: '#F7F7F8', marginBottom: 12, letterSpacing: '-0.02em' }}>اتصل بنا</h1>
      <p style={{ color: '#A6A6AE', fontSize: 18, lineHeight: 1.7, marginBottom: 48 }}>
        فريقنا متاح 24/7 للإجابة على أسئلتك وحل أي مشكلة خلال دقائق.
      </p>

      <div style={{ display: 'grid', gap: 16, marginBottom: 48 }}>
        {CHANNELS.map((ch) => (
          <a
            key={ch.name}
            href={ch.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#121216', border: '1px solid #26262E', borderRadius: 8, padding: '20px 24px', textDecoration: 'none' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 32 }}>{ch.icon}</span>
              <div>
                <div style={{ fontWeight: 600, color: '#F7F7F8', fontSize: 16 }}>{ch.name}</div>
                <div style={{ color: '#6C6C76', fontSize: 13, marginTop: 2 }}>{ch.desc}</div>
              </div>
            </div>
            <span style={{ background: ch.color, color: '#fff', padding: '8px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
              {ch.label}
            </span>
          </a>
        ))}
      </div>

      <div style={{ background: '#121216', border: '1px solid #26262E', borderRadius: 8, padding: 32, marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: '#F7F7F8', marginBottom: 16 }}>ساعات الدعم</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {HOURS.map((item) => (
            <div key={item.day} style={{ background: '#0A0A0C', borderRadius: 6, padding: '12px 16px' }}>
              <div style={{ color: '#FF7A33', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{item.day}</div>
              <div style={{ color: '#A6A6AE', fontSize: 14 }}>{item.time}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#6C6C76', fontSize: 13, marginTop: 16 }}>📍 بغداد، العراق — نخدم جميع المحافظات الـ 18</p>
      </div>

      <div style={{ textAlign: 'center', padding: 24, borderTop: '1px solid #26262E' }}>
        <p style={{ color: '#6C6C76', fontSize: 13 }}>
          هل تريد معرفة المزيد؟{' '}
          <Link href="/faq" style={{ color: '#FF7A33', textDecoration: 'none' }}>تصفح الأسئلة الشائعة</Link>
        </p>
      </div>
    </div>
  );
}
