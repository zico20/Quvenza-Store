import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';

const BASE = 'https://quvenzaiq.com';

export const metadata: Metadata = {
  title: 'من نحن — متجر إلكترونيات أصلية موثوق في العراق',
  description: 'Quvenza متجر عراقي متخصص ببيع الإلكترونيات الأصلية في العراق — هواتف، لابتوبات، أجهزة لوحية، وسماعات من أفضل العلامات العالمية. تعرف على قصتنا ورؤيتنا ولماذا اختارنا أكثر من 500 عميل من كل محافظات العراق.',
  alternates: { canonical: `${BASE}/about` },
  openGraph: {
    title: 'من نحن — Quvenza',
    description: 'متجر عراقي للإلكترونيات الأصلية — iPhone، MacBook، Samsung Galaxy، AirPods، سماعات Sony.',
    url: `${BASE}/about`,
    images: [{ url: `${BASE}/og-image.svg`, width: 1200, height: 630, alt: 'Quvenza' }],
  },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'الرئيسية', url: BASE },
        { name: 'من نحن', url: `${BASE}/about` },
      ])} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '64px 24px' }}>
        <h1 style={{ fontSize: 40, fontWeight: 700, color: '#111827', marginBottom: 24, letterSpacing: '-0.02em' }}>
          من نحن
        </h1>

        <p style={{ fontSize: 18, color: '#4B5563', lineHeight: 1.8, marginBottom: 32 }}>
          <strong style={{ color: '#111827' }}>Quvenza</strong> هو متجر عراقي 100% متخصص في بيع الإلكترونيات الأصلية للسوق العراقي.
          تأسسنا في بغداد عام 2026 بهدف واضح: إيصال أفضل الأجهزة العالمية للمستخدم العراقي — هواتف، لابتوبات، أجهزة لوحية، وسماعات — بأسعار محلية، بضمان رسمي، وبدون أي تعقيدات.
        </p>

        <h2 style={{ fontSize: 28, fontWeight: 600, color: '#111827', margin: '48px 0 16px', letterSpacing: '-0.01em' }}>رؤيتنا</h2>
        <p style={{ color: '#4B5563', lineHeight: 1.8, marginBottom: 32 }}>
          نؤمن أن المستخدم العراقي يستحق امتلاك نفس الأجهزة التي يستخدمها أقرانه في العالم — iPhone، MacBook، Samsung Galaxy، AirPods، سماعات Sony، ولابتوبات Dell و HP وأكثر — أصلية 100%، بضمان رسمي، وبنفس السهولة والثقة.
        </p>

        {/* ── Statistics ── */}
        <h2 style={{ fontSize: 28, fontWeight: 600, color: '#111827', margin: '48px 0 16px', letterSpacing: '-0.01em' }}>Quvenza بالأرقام</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 48 }}>
          {[
            { value: '+500',      label: 'عميل راضٍ' },
            { value: '18',        label: 'محافظة عراقية' },
            { value: 'ضمان رسمي', label: 'على كل جهاز' },
            { value: '24/7',      label: 'دعم فني' },
          ].map((stat) => (
            <div key={stat.label} style={{ background: '#FFFFFF', border: '1px solid #EAECEF', borderRadius: 8, padding: '24px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: '#2563EB', letterSpacing: '-0.02em' }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: '#9097A1', marginTop: 8 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 28, fontWeight: 600, color: '#111827', margin: '48px 0 16px', letterSpacing: '-0.01em' }}>لماذا Quvenza؟</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { icon: '✅', text: 'أجهزة أصلية 100% من علامات عالمية' },
            { icon: '💵', text: 'دفع بالدينار العراقي' },
            { icon: '🚚', text: 'توصيل سريع لكل المحافظات' },
            { icon: '🛡️', text: 'ضمان رسمي على كل جهاز' },
            { icon: '💬', text: 'دعم عربي عراقي 24/7 على واتساب' },
            { icon: '👥', text: '+500 عميل راضٍ في كل المحافظات' },
          ].map((item) => (
            <div key={item.text} style={{ background: '#FFFFFF', border: '1px solid #EAECEF', borderRadius: 8, padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'center', color: '#4B5563', fontSize: 14 }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 28, fontWeight: 600, color: '#111827', margin: '48px 0 16px', letterSpacing: '-0.01em' }}>قصتنا</h2>
        <p style={{ color: '#4B5563', lineHeight: 1.8, marginBottom: 16 }}>
          بدأت الفكرة عندما لاحظنا أن العراقي يدفع أسعاراً أعلى مما يدفعه نظراؤه في الدول المجاورة عند شراء جهاز جديد، أو يضطر للتعامل مع باعة غير موثوقين على Facebook وTelegram، أو يخاطر بشراء أجهزة مقلّدة أو بلا ضمان. قررنا أن نغيّر ذلك ونقدّم إلكترونيات أصلية بضمان رسمي.
        </p>
        <p style={{ color: '#4B5563', lineHeight: 1.8, marginBottom: 48 }}>
          اليوم، Quvenza هو الخيار الأول للطلاب، أصحاب الأعمال، صنّاع المحتوى، والعائلات العراقية الذين يريدون هواتف ولابتوبات وسماعات أصلية من أفضل العلامات العالمية، بثقة محلية وسعر بالدينار العراقي.
        </p>

        <div style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.25)', borderRadius: 8, padding: 32, textAlign: 'center' }}>
          <p style={{ color: '#4B5563', marginBottom: 16, fontSize: 16 }}>هل لديك سؤال؟ نحن هنا</p>
          <a
            href="/contact"
            style={{ display: 'inline-block', background: '#2563EB', color: '#fff', padding: '12px 32px', borderRadius: 6, fontWeight: 600, textDecoration: 'none', fontSize: 15 }}
          >
            تواصل معنا
          </a>
        </div>
      </div>
    </>
  );
}
