import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';

const BASE = 'https://softodeviqstore.com';

export const metadata: Metadata = {
  title: 'طرق الدفع — كاش، زين كاش، آسيا حوالة، فاست باي',
  description: 'تعرف على كل طرق الدفع المتاحة في SoftoDev: كاش عند الاستلام في بغداد، زين كاش، آسيا حوالة، فاست باي. دفع آمن بالدينار العراقي 100% — لا حاجة لفيزا.',
  alternates: { canonical: `${BASE}/payment-methods` },
  openGraph: {
    title: 'طرق الدفع — SoftoDev',
    description: 'كاش، زين كاش، آسيا حوالة، فاست باي — بالدينار العراقي.',
    url: `${BASE}/payment-methods`,
    images: [{ url: `${BASE}/og-image.svg`, width: 1200, height: 630, alt: 'SoftoDev' }],
  },
};

const methods = [
  {
    icon: '💵',
    name: 'كاش عند الاستلام',
    nameEn: 'Cash on Delivery',
    desc: 'ادفع نقداً بعد التفعيل. لا رسوم إضافية.',
    note: 'متاح في بغداد حالياً',
    color: '#4ade80',
  },
  {
    icon: '📱',
    name: 'زين كاش',
    nameEn: 'ZainCash',
    desc: 'حوّل المبلغ من تطبيق زين كاش إلى رقمنا. تفعيل فوري.',
    note: 'متاح في كل المحافظات',
    color: '#3b82f6',
  },
  {
    icon: '💸',
    name: 'آسيا حوالة',
    nameEn: 'AsiaHawala',
    desc: 'حوّل المبلغ عبر آسيا حوالة. سريع وآمن.',
    note: 'متاح في كل المحافظات',
    color: '#a78bfa',
  },
  {
    icon: '⚡',
    name: 'فاست باي',
    nameEn: 'FastPay',
    desc: 'دفع فوري عبر تطبيق فاست باي.',
    note: 'متاح في كل المحافظات',
    color: '#fbbf24',
  },
];

export default function PaymentMethodsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'الرئيسية', url: BASE },
        { name: 'طرق الدفع', url: `${BASE}/payment-methods` },
      ])} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '64px 24px' }}>
        <h1 style={{ fontSize: 40, fontWeight: 700, color: '#f5f5f4', marginBottom: 12, letterSpacing: '-0.02em' }}>طرق الدفع المتاحة</h1>
        <p style={{ color: '#a1a1a6', fontSize: 18, lineHeight: 1.7, marginBottom: 48 }}>
          اختر الطريقة الأنسب لك — كل خياراتنا محلية، آمنة، وبالدينار العراقي. لا حاجة لأي بطاقة دولية.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 48 }}>
          {methods.map((m) => (
            <div key={m.name} style={{ background: '#17171a', border: '1px solid #2a2a30', borderRadius: 8, padding: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{m.icon}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f5f5f4', margin: 0 }}>{m.name}</h2>
                <span style={{ fontSize: 12, color: '#6b6b70' }}>({m.nameEn})</span>
              </div>
              <p style={{ color: '#a1a1a6', fontSize: 14, lineHeight: 1.65, marginBottom: 12 }}>{m.desc}</p>
              <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.06)', borderRadius: 4, padding: '4px 10px', fontSize: 12, color: m.color }}>
                {m.note}
              </span>
            </div>
          ))}
        </div>

        <div style={{ background: '#17171a', border: '1px solid #2a2a30', borderRadius: 8, padding: 32, marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#f5f5f4', marginBottom: 16 }}>ماذا لا نقبل؟</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['بطاقات فيزا أو ماستركارد دولية', 'PayPal', 'تحويلات Western Union', 'عملات رقمية (Crypto)'].map((item) => (
              <li key={item} style={{ color: '#a1a1a6', fontSize: 14, display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ color: '#f87171' }}>✗</span> {item}
              </li>
            ))}
          </ul>
          <p style={{ color: '#6b6b70', fontSize: 13, marginTop: 16 }}>
            هدفنا تبسيط عملية الشراء للعراقي بطرق دفع محلية مألوفة وموثوقة.
          </p>
        </div>

        <div style={{ textAlign: 'center', padding: 32, background: 'rgba(255,106,43,0.06)', border: '1px solid rgba(255,106,43,0.2)', borderRadius: 8 }}>
          <p style={{ color: '#a1a1a6', marginBottom: 16 }}>لديك سؤال عن طريقة الدفع؟</p>
          <a href="/contact" style={{ display: 'inline-block', background: '#ff6a2b', color: '#fff', padding: '10px 28px', borderRadius: 6, fontWeight: 600, textDecoration: 'none' }}>
            تواصل معنا
          </a>
        </div>
      </div>
    </>
  );
}
