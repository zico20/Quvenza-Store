'use client';

import Link from 'next/link';

const BASE = 'https://quvenza.com';

const CHANNELS = [
  { icon: '💬', name: 'WhatsApp',  desc: 'الأسرع — رد خلال دقائق',   href: 'https://wa.me/9647700000000',        label: 'ابدأ محادثة',        color: '#25D366' },
  { icon: '✈️', name: 'Telegram',  desc: 'متاح 24/7',                 href: 'https://t.me/quvenza',            label: 'تواصل عبر Telegram', color: '#0088cc' },
  { icon: '📧', name: 'Email',     desc: 'للاستفسارات الرسمية',       href: 'mailto:support@quvenza.com', label: 'أرسل إيميل',         color: '#2563EB' },
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
      <h1 style={{ fontSize: 40, fontWeight: 700, color: '#111827', marginBottom: 12, letterSpacing: '-0.02em' }}>اتصل بنا</h1>
      <p style={{ color: '#4B5563', fontSize: 18, lineHeight: 1.7, marginBottom: 48 }}>
        فريقنا متاح 24/7 للإجابة على أسئلتك وحل أي مشكلة خلال دقائق.
      </p>

      <div style={{ display: 'grid', gap: 16, marginBottom: 48 }}>
        {CHANNELS.map((ch) => (
          <a
            key={ch.name}
            href={ch.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', border: '1px solid #EAECEF', borderRadius: 8, padding: '20px 24px', textDecoration: 'none' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 32 }}>{ch.icon}</span>
              <div>
                <div style={{ fontWeight: 600, color: '#111827', fontSize: 16 }}>{ch.name}</div>
                <div style={{ color: '#9097A1', fontSize: 13, marginTop: 2 }}>{ch.desc}</div>
              </div>
            </div>
            <span style={{ background: ch.color, color: '#fff', padding: '8px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
              {ch.label}
            </span>
          </a>
        ))}
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid #EAECEF', borderRadius: 8, padding: 32, marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: '#111827', marginBottom: 16 }}>ساعات الدعم</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {HOURS.map((item) => (
            <div key={item.day} style={{ background: '#F7F8FA', borderRadius: 6, padding: '12px 16px' }}>
              <div style={{ color: '#2563EB', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{item.day}</div>
              <div style={{ color: '#4B5563', fontSize: 14 }}>{item.time}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#9097A1', fontSize: 13, marginTop: 16 }}>📍 بغداد، العراق — نخدم جميع المحافظات الـ 18</p>
      </div>

      <div style={{ textAlign: 'center', padding: 24, borderTop: '1px solid #EAECEF' }}>
        <p style={{ color: '#9097A1', fontSize: 13 }}>
          هل تريد معرفة المزيد؟{' '}
          <Link href="/faq" style={{ color: '#2563EB', textDecoration: 'none' }}>تصفح الأسئلة الشائعة</Link>
        </p>
      </div>
    </div>
  );
}
