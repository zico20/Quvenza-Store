import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema, howToSchema } from '@/lib/schema';

const BASE = 'https://softodeviqstore.com';

export const metadata: Metadata = {
  title: 'كيف يعمل المتجر — خطوات بسيطة للحصول على اشتراكك',
  description: 'احصل على اشتراكك الرقمي في 4 خطوات بسيطة: اختر → ادفع → أرسل ايميلك → استخدم خلال 30 دقيقة. SoftoDev — أسهل طريقة للحصول على ChatGPT Plus وCanva Pro في العراق.',
  alternates: { canonical: `${BASE}/how-it-works` },
  openGraph: {
    title: 'كيف يعمل SoftoDev',
    description: '4 خطوات بسيطة للحصول على ChatGPT Plus، Canva Pro وأكثر في العراق.',
    url: `${BASE}/how-it-works`,
    images: [{ url: `${BASE}/og-image.svg`, width: 1200, height: 630, alt: 'SoftoDev' }],
  },
};

const STEPS = [
  {
    num: '01',
    icon: '🛍️',
    title: 'اختر اشتراكك',
    desc: 'تصفّح متجرنا واختر الاشتراك المناسب — ChatGPT Plus، Canva Pro، CapCut Pro، Coursera Plus أو غيرها. كل الأسعار بالدينار العراقي وواضحة بدون تعقيد.',
  },
  {
    num: '02',
    icon: '💳',
    title: 'ادفع بطريقتك',
    desc: 'اختر طريقة الدفع الأنسب لك: زين كاش، آسيا حوالة، فاست باي، أو كاش عند الاستلام في بغداد. لا حاجة لبطاقة فيزا أو حساب دولي.',
  },
  {
    num: '03',
    icon: '📧',
    title: 'أرسل ايميلك',
    desc: 'بعد الدفع، أرسل لنا ايميلك الشخصي عبر واتساب. هذا هو الايميل الذي سيفعّل عليه الاشتراك. تأكد أنه ايميل Google (Gmail) أو أي بريد إلكتروني.',
  },
  {
    num: '04',
    icon: '🚀',
    title: 'استخدم فوراً',
    desc: 'خلال 30 دقيقة، تستلم رسالة تأكيد وتجد اشتراكك مفعّلاً. ادخل للمنصة (مثل ChatGPT.com أو Canva.com) وابدأ الاستخدام فوراً.',
  },
];

export default function HowItWorksPage() {
  const howTo = howToSchema({
    name: 'كيف تشتري اشتراك رقمي من SoftoDev في العراق',
    description: 'دليل خطوة بخطوة للحصول على اشتراك ChatGPT Plus، Canva Pro، CapCut Pro أو أي اشتراك رقمي من متجر SoftoDev في العراق.',
    totalTime: 'PT30M',
    estimatedCost: { value: 8000, currency: 'IQD' },
    supply: ['ايميل شخصي', 'هاتف للتواصل عبر واتساب'],
    tool: ['زين كاش أو آسيا حوالة أو فاست باي أو كاش'],
    steps: [
      { name: 'اختر الاشتراك المناسب',  text: 'تصفح الموقع واختر الاشتراك الذي تريده — ChatGPT Plus، Canva Pro، CapCut Pro، Coursera Plus أو غيرها. لكل منتج صفحة تحتوي على كل التفاصيل والأسعار بالدينار العراقي.', url: `${BASE}/products` },
      { name: 'ادفع بالطريقة المناسبة', text: 'اختر طريقة الدفع: كاش عند الاستلام (في بغداد)، زين كاش، آسيا حوالة، أو فاست باي. كل الأسعار بالدينار العراقي بدون رسوم خفية.', url: `${BASE}/payment-methods` },
      { name: 'أرسل ايميلك على واتساب', text: 'بعد تأكيد الدفع، أرسل لنا ايميلك الشخصي على واتساب. هذا الايميل سيتم تفعيل الاشتراك عليه ويبقى ملكك بالكامل.' },
      { name: 'استلم اشتراكك خلال 30 دقيقة', text: 'سنفعّل الاشتراك على ايميلك خلال 30 دقيقة كحد أقصى. ستستلم رسالة تأكيد على واتساب، ويمكنك الدخول مباشرة على المنصة (مثل ChatGPT.com) واستخدام الاشتراك.' },
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
          احصل على اشتراكك الرقمي في 4 خطوات بسيطة. بدون تعقيد، بدون انتظار.
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
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(52,211,153,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>⏱️</div>
          <div>
            <div style={{ fontWeight: 700, color: '#16A34A', fontSize: 18 }}>إجمالي الوقت: أقل من 30 دقيقة</div>
            <div style={{ color: '#4B5563', fontSize: 14, marginTop: 4 }}>من لحظة الدفع حتى بدء الاستخدام — أسرع من طلب بيتزا</div>
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
