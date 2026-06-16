import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';

const BASE = 'https://quvenza.com';

export const metadata: Metadata = {
  title: 'قاموس مصطلحات الاشتراكات الرقمية في العراق',
  description: 'دليل شامل لكل المصطلحات المتعلقة بالاشتراكات الرقمية في العراق: ChatGPT Plus، Canva Pro، CapCut، Coursera، زين كاش، آسيا حوالة، فاست باي وأكثر.',
  alternates: { canonical: `${BASE}/glossary` },
  openGraph: {
    title: 'قاموس المصطلحات — Quvenza',
    description: 'تعريف كل المصطلحات الرقمية المستخدمة في سوق العراق.',
    url: `${BASE}/glossary`,
    images: [{ url: `${BASE}/og-image.svg`, width: 1200, height: 630, alt: 'Quvenza Glossary' }],
  },
};

const TERMS = [
  { term: 'ChatGPT Plus', definition: 'اشتراك مدفوع من OpenAI يمنح وصول كامل لنموذج GPT-5، DALL-E 3 لتوليد الصور، Advanced Voice Mode، وتحليل الملفات. السعر العالمي 20 دولار شهرياً، وفي Quvenza متوفر للمستخدمين العراقيين بالدينار العراقي.' },
  { term: 'Canva Pro', definition: 'النسخة الاحترافية من منصة Canva للتصميم. توفر مليون+ قالب، Magic AI، إزالة الخلفيات، Brand Kit، و 1TB تخزين سحابي. متوفر في Quvenza بالدينار العراقي للسنة الكاملة.' },
  { term: 'CapCut Pro', definition: 'النسخة المدفوعة من تطبيق CapCut للمونتاج. تزيل العلامة المائية، تفتح كل الفلاتر والمؤثرات، وتسمح بتصدير 4K. مشهور بين صناع محتوى TikTok وYouTube.' },
  { term: 'Coursera Plus', definition: 'اشتراك سنوي يفتح وصول لـ 7000+ كورس وشهادة احترافية من جامعات عالمية مثل Yale و Stanford و Imperial College. يشمل Professional Certificates من Google و Meta و IBM.' },
  { term: 'زين كاش (ZainCash)', definition: 'محفظة إلكترونية عراقية تابعة لشركة زين العراق. تسمح بالتحويلات والمدفوعات الفورية بالدينار العراقي. أحد أشهر طرق الدفع المحلية في Quvenza.' },
  { term: 'آسيا حوالة (AsiaHawala)', definition: 'خدمة مالية عراقية تقدم تحويلات سريعة. مقبولة في Quvenza كطريقة دفع رئيسية لكل المحافظات.' },
  { term: 'فاست باي (FastPay)', definition: 'نظام دفع إلكتروني عراقي للمعاملات الفورية. مقبول في Quvenza.' },
  { term: 'الدينار العراقي (IQD)', definition: 'العملة الرسمية لجمهورية العراق. كل أسعار Quvenza معروضة بالدينار العراقي مباشرة، بدون تحويلات أو رسوم خفية.' },
  { term: 'GPT-5', definition: 'أحدث نموذج لغة ذكي من OpenAI. يتفوق على GPT-4 في فهم السياق والترجمة والكتابة الإبداعية وكتابة الكود. يُتاح فقط مع اشتراك ChatGPT Plus أو Pro.' },
  { term: 'DALL-E 3', definition: 'نموذج توليد الصور بالذكاء الاصطناعي من OpenAI. متاح ضمن اشتراك ChatGPT Plus. يحوّل الوصف النصي إلى صور احترافية عالية الدقة.' },
  { term: 'Magic AI (Canva)', definition: 'مجموعة أدوات الذكاء الاصطناعي المدمجة في Canva Pro. تشمل Magic Design، Magic Write، Magic Eraser (إزالة عناصر من الصور).' },
  { term: 'Brand Kit', definition: 'ميزة في Canva Pro تسمح بحفظ شعار العلامة التجارية، الألوان، والخطوط في مكان واحد لاستخدامها في كل التصاميم.' },
  { term: 'تفعيل الاشتراك', definition: 'العملية التي يتم فيها ربط الاشتراك المدفوع بحساب المستخدم. في Quvenza، التفعيل يتم على ايميل المستخدم الشخصي خلال 30 دقيقة من الدفع.' },
  { term: 'كاش عند الاستلام (COD)', definition: 'طريقة دفع تسمح للعميل بدفع المبلغ نقداً عند استلام الخدمة. Quvenza من المتاجر القليلة في العراق التي توفر هذا الخيار للاشتراكات الرقمية في بغداد.' },
];

export default function GlossaryPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'الرئيسية', url: BASE },
        { name: 'قاموس المصطلحات', url: `${BASE}/glossary` },
      ])} />
      <JsonLd data={faqSchema(TERMS.map((t) => ({
        question: `ما هو ${t.term}؟`,
        answer: t.definition,
      })))} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '64px 24px' }}>
        <h1 style={{ fontSize: 40, fontWeight: 700, color: '#111827', marginBottom: 12, letterSpacing: '-0.02em' }}>
          قاموس المصطلحات
        </h1>
        <p className="lead-paragraph" style={{ color: '#4B5563', fontSize: 18, lineHeight: 1.7, marginBottom: 56 }}>
          دليل شامل لكل المصطلحات المتعلقة بالاشتراكات الرقمية في العراق.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {TERMS.map((t) => (
            <article
              key={t.term}
              itemScope
              itemType="https://schema.org/DefinedTerm"
              style={{ background: '#FFFFFF', border: '1px solid #EAECEF', borderRadius: 8, padding: '24px 28px' }}
            >
              <h2
                itemProp="name"
                style={{ fontSize: 22, fontWeight: 700, color: '#2563EB', marginBottom: 12, letterSpacing: '-0.01em' }}
              >
                {t.term}
              </h2>
              <p
                itemProp="description"
                className="faq-answer"
                style={{ color: '#4B5563', lineHeight: 1.75, fontSize: 14, margin: 0 }}
              >
                {t.definition}
              </p>
            </article>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48, padding: '24px', borderTop: '1px solid #EAECEF' }}>
          <p style={{ color: '#9097A1', fontSize: 13 }}>
            هل تريد معرفة أكثر؟{' '}
            <a href="/faq" style={{ color: '#2563EB', textDecoration: 'none' }}>راجع الأسئلة الشائعة</a>
          </p>
        </div>
      </div>
    </>
  );
}
