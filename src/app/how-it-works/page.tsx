import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema, howToSchema } from '@/lib/schema';

const BASE = 'https://quvenzaiq.com';

export const metadata: Metadata = {
  title: 'كيف يعمل المتجر — خطوات بسيطة لشراء جهازك',
  description: 'اشترِ جهازك الإلكتروني الأصلي في 4 خطوات بسيطة: اختر الجهاز → أضفه للسلة وأدخل عنوانك → ادفع → توصيل سريع مع ضمان رسمي. Quvenza — أسهل طريقة لشراء iPhone 15 Pro وMacBook Air في العراق.',
  alternates: { canonical: `${BASE}/how-it-works` },
  openGraph: {
    title: 'كيف يعمل Quvenza',
    description: '4 خطوات بسيطة لشراء iPhone 15 Pro، MacBook Air، Galaxy S24 وأكثر في العراق.',
    url: `${BASE}/how-it-works`,
    images: [{ url: `${BASE}/og-image.svg`, width: 1200, height: 630, alt: 'Quvenza' }],
  },
};

const STEPS = [
  {
    num: '01',
    icon: '🛍️',
    title: 'اختر جهازك',
    desc: 'تصفّح متجرنا واختر الجهاز المناسب وموديله ولونه وسعته — iPhone 15 Pro، MacBook Air، Galaxy S24، AirPods Pro، Sony WH-1000XM5، Dell XPS وغيرها. كل الأسعار بالدينار العراقي وواضحة، مع مواصفات كاملة لكل منتج.',
  },
  {
    num: '02',
    icon: '🛒',
    title: 'أضفه للسلة وأدخل عنوانك',
    desc: 'أضِف الجهاز إلى السلة، ثم أكمل الطلب بإدخال عنوان الشحن ورقم هاتفك. نوصّل لكل المحافظات الـ 18، مع توصيل سريع داخل بغداد خلال 24 ساعة.',
  },
  {
    num: '03',
    icon: '💳',
    title: 'ادفع بطريقتك',
    desc: 'اختر طريقة الدفع الأنسب لك: كاش عند الاستلام في بغداد، زين كاش، آسيا حوالة، أو فاست باي. كل الأسعار بالدينار العراقي بدون رسوم خفية ولا حاجة لبطاقة فيزا.',
  },
  {
    num: '04',
    icon: '🚚',
    title: 'استلم جهازك مع الضمان',
    desc: 'نجهّز جهازك الأصلي المختوم ونشحنه إليك. افحصه عند الاستلام، ادفع (إن كان كاش عند الاستلام)، وابدأ استخدامه فوراً — مع ضمان رسمي وحق الإرجاع أو الاستبدال خلال 7 أيام.',
  },
];

export default function HowItWorksPage() {
  const howTo = howToSchema({
    name: 'كيف تشتري جهازاً إلكترونياً من Quvenza في العراق',
    description: 'دليل خطوة بخطوة لشراء جهاز إلكتروني أصلي — iPhone 15 Pro، MacBook Air، Galaxy S24، AirPods Pro أو غيرها — من متجر Quvenza في العراق مع توصيل سريع وضمان رسمي.',
    totalTime: 'P1D',
    estimatedCost: { value: 8000, currency: 'IQD' },
    supply: ['عنوان شحن', 'هاتف للتواصل عبر واتساب'],
    tool: ['زين كاش أو آسيا حوالة أو فاست باي أو كاش عند الاستلام'],
    steps: [
      { name: 'اختر الجهاز المناسب',  text: 'تصفح الموقع واختر الجهاز الذي تريده وموديله ولونه وسعته — iPhone 15 Pro، MacBook Air، Galaxy S24، AirPods Pro، Sony WH-1000XM5، Dell XPS أو غيرها. لكل منتج صفحة تحتوي على المواصفات الكاملة والأسعار بالدينار العراقي.', url: `${BASE}/products` },
      { name: 'أضف الجهاز للسلة وأدخل عنوانك', text: 'أضف الجهاز إلى السلة ثم أكمل الطلب بإدخال عنوان الشحن ورقم هاتفك. نوصّل لكل المحافظات الـ 18 في العراق مع توصيل سريع داخل بغداد خلال 24 ساعة.' },
      { name: 'ادفع بالطريقة المناسبة', text: 'اختر طريقة الدفع: كاش عند الاستلام (في بغداد)، زين كاش، آسيا حوالة، أو فاست باي. كل الأسعار بالدينار العراقي بدون رسوم خفية.', url: `${BASE}/payment-methods` },
      { name: 'استلم جهازك مع الضمان الرسمي', text: 'نجهّز جهازك الأصلي المختوم ونشحنه إليك بسرعة. افحصه عند الاستلام، وابدأ استخدامه فوراً مع ضمان رسمي وحق الإرجاع أو الاستبدال خلال 7 أيام.' },
    ],
  });

  return (
    <>
      <JsonLd data={howTo} />
      <JsonLd data={breadcrumbSchema([
        { name: 'الرئيسية', url: BASE },
        { name: 'كيف يعمل المتجر', url: `${BASE}/how-it-works` },
      ])} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '64px 24px' }}>
        <h1 style={{ fontSize: 40, fontWeight: 700, color: '#111827', marginBottom: 12, letterSpacing: '-0.02em' }}>كيف يعمل المتجر؟</h1>
        <p style={{ color: '#4B5563', fontSize: 18, lineHeight: 1.7, marginBottom: 56 }}>
          اشترِ جهازك الإلكتروني الأصلي في 4 خطوات بسيطة. توصيل سريع، ضمان رسمي، وبدون تعقيد.
        </p>

        <div style={{ position: 'relative' }}>
          {STEPS.map((step, i) => (
            <div key={step.num} style={{ display: 'flex', gap: 24, marginBottom: i < STEPS.length - 1 ? 40 : 0, alignItems: 'flex-start' }}>
              {/* Number + connector */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(37,99,235,0.12)', border: '2px solid #2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#2563EB', fontFamily: 'JetBrains Mono, monospace' }}>
                  {step.num}
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ width: 2, height: 40, background: '#EAECEF', marginTop: 8 }} />
                )}
              </div>

              {/* Content */}
              <div style={{ background: '#FFFFFF', border: '1px solid #EAECEF', borderRadius: 8, padding: '20px 24px', flex: 1, paddingBottom: i < STEPS.length - 1 ? 20 : 20 }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{step.icon}</div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 8px', letterSpacing: '-0.01em' }}>{step.title}</h2>
                <p style={{ color: '#4B5563', fontSize: 14, lineHeight: 1.75, margin: 0 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Time indicator */}
        <div style={{ background: '#FFFFFF', border: '1px solid #EAECEF', borderRadius: 8, padding: 24, marginTop: 48, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(52,211,153,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🚚</div>
          <div>
            <div style={{ fontWeight: 700, color: '#16A34A', fontSize: 18 }}>توصيل سريع: خلال 24 ساعة في بغداد</div>
            <div style={{ color: '#4B5563', fontSize: 14, marginTop: 4 }}>ولكل المحافظات خلال 2–4 أيام عمل — جهاز أصلي مختوم مع ضمان رسمي</div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <a href="/products" style={{ display: 'inline-block', background: '#2563EB', color: '#fff', padding: '14px 40px', borderRadius: 6, fontWeight: 700, textDecoration: 'none', fontSize: 16 }}>
            ابدأ التسوق الآن
          </a>
          <p style={{ color: '#9097A1', fontSize: 13, marginTop: 12 }}>لديك سؤال؟ <a href="/faq" style={{ color: '#2563EB', textDecoration: 'none' }}>راجع الأسئلة الشائعة</a> أو <a href="/contact" style={{ color: '#2563EB', textDecoration: 'none' }}>تواصل معنا</a></p>
        </div>
      </div>
    </>
  );
}
