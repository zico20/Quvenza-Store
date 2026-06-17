import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';

const BASE = 'https://quvenzaiq.com';

export const metadata: Metadata = {
  title: 'طرق الدفع — كاش، زين كاش، آسيا حوالة، فاست باي',
  description: 'تعرف على كل طرق الدفع المتاحة في Quvenza: كاش عند الاستلام في بغداد، زين كاش، آسيا حوالة، فاست باي. دفع آمن بالدينار العراقي 100% — لا حاجة لفيزا.',
  alternates: { canonical: `${BASE}/payment-methods` },
  openGraph: {
    title: 'طرق الدفع — Quvenza',
    description: 'كاش، زين كاش، آسيا حوالة، فاست باي — بالدينار العراقي.',
    url: `${BASE}/payment-methods`,
    images: [{ url: `${BASE}/og-image.svg`, width: 1200, height: 630, alt: 'Quvenza' }],
  },
};

const methods = [
  {
    icon: '💵',
    name: 'كاش عند الاستلام',
    nameEn: 'Cash on Delivery',
    desc: 'ادفع نقداً عند استلام جهازك. افحص المنتج قبل الدفع. لا رسوم إضافية.',
    note: 'متاح في بغداد حالياً',
    color: '#16A34A',
  },
  {
    icon: '📱',
    name: 'زين كاش',
    nameEn: 'ZainCash',
    desc: 'حوّل المبلغ من تطبيق زين كاش إلى رقمنا. نؤكّد طلبك ونجهّز الشحن فوراً.',
    note: 'متاح في كل المحافظات',
    color: '#3b82f6',
  },
  {
    icon: '💸',
    name: 'آسيا حوالة',
    nameEn: 'AsiaHawala',
    desc: 'حوّل المبلغ عبر آسيا حوالة. تأكيد سريع وآمن لطلبك.',
    note: 'متاح في كل المحافظات',
    color: '#a78bfa',
  },
  {
    icon: '⚡',
    name: 'فاست باي',
    nameEn: 'FastPay',
    desc: 'ادفع عبر تطبيق فاست باي ونبدأ بتجهيز طلبك مباشرة.',
    note: 'متاح في كل المحافظات',
    color: '#F59E0B',
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
        <h1 style={{ fontSize: 40, fontWeight: 700, color: '#111827', marginBottom: 12, letterSpacing: '-0.02em' }}>طرق الدفع المتاحة</h1>
        <p style={{ color: '#4B5563', fontSize: 18, lineHeight: 1.7, marginBottom: 48 }}>
          اختر الطريقة الأنسب لك — كل خياراتنا محلية، آمنة، وبالدينار العراقي. لا حاجة لأي بطاقة دولية.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 48 }}>
          {methods.map((m) => (
            <div key={m.name} style={{ background: '#FFFFFF', border: '1px solid #EAECEF', borderRadius: 8, padding: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{m.icon}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 }}>{m.name}</h2>
                <span style={{ fontSize: 12, color: '#9097A1' }}>({m.nameEn})</span>
              </div>
              <p style={{ color: '#4B5563', fontSize: 14, lineHeight: 1.65, marginBottom: 12 }}>{m.desc}</p>
              <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.06)', borderRadius: 4, padding: '4px 10px', fontSize: 12, color: m.color }}>
                {m.note}
              </span>
            </div>
          ))}
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #EAECEF', borderRadius: 8, padding: 32, marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#111827', marginBottom: 16 }}>ماذا لا نقبل؟</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['بطاقات فيزا أو ماستركارد دولية', 'PayPal', 'تحويلات Western Union', 'عملات رقمية (Crypto)'].map((item) => (
              <li key={item} style={{ color: '#4B5563', fontSize: 14, display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ color: '#EF4444' }}>✗</span> {item}
              </li>
            ))}
          </ul>
          <p style={{ color: '#9097A1', fontSize: 13, marginTop: 16 }}>
            هدفنا تبسيط عملية الشراء للعراقي بطرق دفع محلية مألوفة وموثوقة.
          </p>
        </div>

        <div style={{ textAlign: 'center', padding: 32, background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 8 }}>
          <p style={{ color: '#4B5563', marginBottom: 16 }}>لديك سؤال عن طريقة الدفع؟</p>
          <a href="/contact" style={{ display: 'inline-block', background: '#2563EB', color: '#fff', padding: '10px 28px', borderRadius: 6, fontWeight: 600, textDecoration: 'none' }}>
            تواصل معنا
          </a>
        </div>
      </div>
    </>
  );
}
