import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';

const BASE = 'https://softodeviqstore.com';

export const metadata: Metadata = {
  title: 'من نحن — متجر اشتراكات رقمية موثوق في العراق',
  description: 'SoftoDev متجر عراقي متخصص ببيع الاشتراكات الرقمية الأصلية في العراق. تعرف على قصتنا ورؤيتنا ولماذا اختارنا أكثر من 500 عميل من كل محافظات العراق.',
  alternates: { canonical: `${BASE}/about` },
  openGraph: {
    title: 'من نحن — SoftoDev',
    description: 'متجر عراقي للاشتراكات الرقمية الأصلية — ChatGPT Plus، Canva Pro، CapCut، Coursera.',
    url: `${BASE}/about`,
    images: [{ url: `${BASE}/og-image.svg`, width: 1200, height: 630, alt: 'SoftoDev' }],
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
        <h1 style={{ fontSize: 40, fontWeight: 700, color: '#F7F7F8', marginBottom: 24, letterSpacing: '-0.02em' }}>
          من نحن
        </h1>

        <p style={{ fontSize: 18, color: '#A6A6AE', lineHeight: 1.8, marginBottom: 32 }}>
          <strong style={{ color: '#F7F7F8' }}>SoftoDev</strong> هو متجر عراقي 100% متخصص في بيع الاشتراكات الرقمية الأصلية للسوق العراقي.
          تأسسنا في بغداد عام 2026 بهدف واضح: إيصال أفضل الأدوات الرقمية العالمية للمستخدم العراقي بأسعار محلية وبدون أي تعقيدات.
        </p>

        <h2 style={{ fontSize: 28, fontWeight: 600, color: '#F7F7F8', margin: '48px 0 16px', letterSpacing: '-0.01em' }}>رؤيتنا</h2>
        <p style={{ color: '#A6A6AE', lineHeight: 1.8, marginBottom: 32 }}>
          نؤمن أن المستخدم العراقي يستحق الوصول لنفس الأدوات التي يستخدمها أقرانه في العالم — ChatGPT Plus، Canva Pro، CapCut Pro، Coursera Plus وأكثر — بنفس السهولة والثقة.
        </p>

        {/* ── Statistics ── */}
        <h2 style={{ fontSize: 28, fontWeight: 600, color: '#F7F7F8', margin: '48px 0 16px', letterSpacing: '-0.01em' }}>SoftoDev بالأرقام</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 48 }}>
          {[
            { value: '+500',      label: 'عميل راضٍ' },
            { value: '18',        label: 'محافظة عراقية' },
            { value: '30 دقيقة', label: 'متوسط التفعيل' },
            { value: '24/7',      label: 'دعم فني' },
          ].map((stat) => (
            <div key={stat.label} style={{ background: '#121216', border: '1px solid #26262E', borderRadius: 8, padding: '24px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: '#FF7A33', letterSpacing: '-0.02em' }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: '#6C6C76', marginTop: 8 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 28, fontWeight: 600, color: '#F7F7F8', margin: '48px 0 16px', letterSpacing: '-0.01em' }}>لماذا SoftoDev؟</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { icon: '✅', text: 'متجر عراقي مرخص في بغداد' },
            { icon: '💵', text: 'دفع بالدينار العراقي' },
            { icon: '⚡', text: 'تفعيل خلال 30 دقيقة' },
            { icon: '🛡️', text: 'ضمان كامل طوال فترة الاشتراك' },
            { icon: '💬', text: 'دعم عربي عراقي 24/7 على واتساب' },
            { icon: '👥', text: '+500 عميل راضٍ في كل المحافظات' },
          ].map((item) => (
            <div key={item.text} style={{ background: '#121216', border: '1px solid #26262E', borderRadius: 8, padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'center', color: '#A6A6AE', fontSize: 14 }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 28, fontWeight: 600, color: '#F7F7F8', margin: '48px 0 16px', letterSpacing: '-0.01em' }}>قصتنا</h2>
        <p style={{ color: '#A6A6AE', lineHeight: 1.8, marginBottom: 16 }}>
          بدأت الفكرة عندما لاحظنا أن العراقي يدفع أسعاراً أعلى مما يدفعه نظراؤه في الدول المجاورة، أو يضطر للتعامل مع وسطاء غير موثوقين على Facebook وTelegram، أو يتنازل عن استخدام أدوات الذكاء الاصطناعي والتصميم لأنها "غير متوفرة في العراق". قررنا أن نغيّر ذلك.
        </p>
        <p style={{ color: '#A6A6AE', lineHeight: 1.8, marginBottom: 48 }}>
          اليوم، SoftoDev هو الخيار الأول للطلاب، صناع المحتوى، أصحاب الأعمال الصغيرة، والمصممين العراقيين الذين يريدون أدوات احترافية بثقة محلية.
        </p>

        <div style={{ background: 'rgba(255,106,43,0.08)', border: '1px solid rgba(255,106,43,0.25)', borderRadius: 8, padding: 32, textAlign: 'center' }}>
          <p style={{ color: '#A6A6AE', marginBottom: 16, fontSize: 16 }}>هل لديك سؤال؟ نحن هنا</p>
          <a
            href="/contact"
            style={{ display: 'inline-block', background: '#FF7A33', color: '#fff', padding: '12px 32px', borderRadius: 6, fontWeight: 600, textDecoration: 'none', fontSize: 15 }}
          >
            تواصل معنا
          </a>
        </div>
      </div>
    </>
  );
}
