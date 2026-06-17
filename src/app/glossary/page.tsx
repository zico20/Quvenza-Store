import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';

const BASE = 'https://quvenzaiq.com';

export const metadata: Metadata = {
  title: 'قاموس مصطلحات الإلكترونيات في العراق',
  description: 'دليل شامل لكل مصطلحات الإلكترونيات في العراق: الذاكرة RAM، التخزين SSD، المعالج SoC، شاشة OLED/AMOLED، معدل التحديث، عزل الضوضاء ANC، البطارية mAh، الشحن السريع، الضمان الرسمي، زين كاش، آسيا حوالة، فاست باي وأكثر.',
  alternates: { canonical: `${BASE}/glossary` },
  openGraph: {
    title: 'قاموس المصطلحات — Quvenza',
    description: 'تعريف كل مصطلحات الإلكترونيات المستخدمة في سوق العراق.',
    url: `${BASE}/glossary`,
    images: [{ url: `${BASE}/og-image.svg`, width: 1200, height: 630, alt: 'Quvenza Glossary' }],
  },
};

const TERMS = [
  { term: 'الذاكرة العشوائية (RAM)', definition: 'ذاكرة الوصول العشوائي التي تحدّد عدد التطبيقات التي يشغّلها الجهاز في الوقت نفسه بسلاسة. كلما زادت سعتها (مثل 8GB أو 12GB أو 16GB) كان الجهاز أسرع في تعدد المهام. مهمة جداً في الهواتف مثل Samsung Galaxy واللابتوبات مثل Dell و HP.' },
  { term: 'التخزين الداخلي (SSD / UFS)', definition: 'المساحة التي تُخزَّن فيها الملفات والتطبيقات والصور. اللابتوبات الحديثة تستخدم قرص SSD سريع (مثل 256GB أو 512GB أو 1TB)، والهواتف تستخدم ذاكرة UFS. كلما زادت السعة وسرعة القراءة كان الأداء أفضل.' },
  { term: 'المعالج / الشريحة (SoC)', definition: 'القلب الذي يشغّل الجهاز، ويُسمّى System on Chip لأنه يدمج المعالج وكرت الشاشة في شريحة واحدة. أمثلة: Apple A18 في iPhone، Apple M3 في MacBook، Snapdragon في Samsung Galaxy. كلما كان أحدث وأقوى زادت السرعة وكفاءة البطارية.' },
  { term: 'كرت الشاشة (GPU)', definition: 'وحدة معالجة الرسوميات المسؤولة عن الألعاب والتصميم وتحرير الفيديو. في الهواتف يكون مدمجاً ضمن الشريحة، وفي اللابتوبات قد يكون منفصلاً (مثل NVIDIA) لأداء أعلى في الألعاب وبرامج المونتاج.' },
  { term: 'شاشة OLED / AMOLED', definition: 'تقنية شاشات تعرض ألواناً أعمق وأسوداً حقيقياً مع استهلاك أقل للطاقة، لأن كل بكسل يضيء بنفسه. تستخدمها هواتف iPhone و Samsung Galaxy ولابتوبات احترافية. تمنح صورة أوضح وتباين أعلى من شاشات LCD التقليدية.' },
  { term: 'معدل التحديث (Refresh Rate)', definition: 'عدد المرات التي تُحدَّث فيها الشاشة بالثانية، ويُقاس بالهرتز (Hz). شاشة 120Hz تعرض حركة وتمريراً أكثر سلاسة من شاشة 60Hz. مهم في الهواتف الحديثة والألعاب على اللابتوبات.' },
  { term: 'عزل الضوضاء النشط (ANC)', definition: 'تقنية Active Noise Cancellation في السماعات تلغي ضجيج المحيط إلكترونياً للحصول على صوت نقي وعزل أفضل. متوفرة في AirPods Pro وسماعات Sony و Bose، وهي من أهم مزايا السماعات الراقية.' },
  { term: 'البطارية (mAh)', definition: 'وحدة قياس سعة البطارية (ميلّي أمبير/ساعة). كلما زاد الرقم (مثل 5000mAh) طال عمر البطارية بين الشحنات. تُعدّ من أهم العوامل عند اختيار هاتف جديد.' },
  { term: 'الشحن السريع (Fast Charging)', definition: 'تقنية تشحن بطارية الجهاز بسرعة أكبر باستخدام طاقة أعلى (تُقاس بالواط W). تتيح شحن الهاتف من 0% إلى 50% خلال دقائق. متوفرة في معظم هواتف Samsung Galaxy و iPhone الحديثة.' },
  { term: 'eSIM', definition: 'شريحة اتصال رقمية مدمجة داخل الجهاز تغني عن الشريحة الفيزيائية، وتُفعَّل عبر مزوّد الخدمة. تدعمها هواتف iPhone و Samsung Galaxy الحديثة، وتسمح باستخدام أكثر من خط على الجهاز نفسه.' },
  { term: 'الإصدار / النسخة (Variant)', definition: 'الاختلاف في مواصفات الجهاز نفسه — مثل اختلاف سعة التخزين (128GB / 256GB) أو اللون أو سعة الذاكرة. في Quvenza نوضّح كل إصدار بسعره بالدينار العراقي حتى تختار الأنسب لك.' },
  { term: 'رمز المنتج (SKU)', definition: 'رمز تعريفي فريد لكل منتج وإصدار في المتجر (Stock Keeping Unit). يساعدنا على تتبّع المخزون وضمان حصولك على الجهاز الصحيح بالمواصفات واللون المطلوبين.' },
  { term: 'الضمان الرسمي (Warranty)', definition: 'تعهّد بإصلاح أو استبدال الجهاز خلال مدة محددة في حال وجود عيب مصنعي. كل أجهزة Quvenza أصلية وتأتي بضمان رسمي، حتى تشتري بثقة كاملة.' },
  { term: 'زين كاش (ZainCash)', definition: 'محفظة إلكترونية عراقية تابعة لشركة زين العراق. تسمح بالتحويلات والمدفوعات الفورية بالدينار العراقي. أحد أشهر طرق الدفع المحلية في Quvenza لتأكيد طلبك وبدء الشحن.' },
  { term: 'آسيا حوالة (AsiaHawala)', definition: 'خدمة مالية عراقية تقدم تحويلات سريعة. مقبولة في Quvenza كطريقة دفع رئيسية لكل المحافظات.' },
  { term: 'فاست باي (FastPay)', definition: 'نظام دفع إلكتروني عراقي للمعاملات الفورية. مقبول في Quvenza لتأكيد الطلب وتجهيز الشحن.' },
  { term: 'الدينار العراقي (IQD)', definition: 'العملة الرسمية لجمهورية العراق. كل أسعار Quvenza معروضة بالدينار العراقي مباشرة، بدون تحويلات أو رسوم خفية.' },
  { term: 'كاش عند الاستلام (COD)', definition: 'طريقة دفع تسمح للعميل بدفع المبلغ نقداً عند استلام الجهاز، مع إمكانية فحصه قبل الدفع. Quvenza من المتاجر القليلة في العراق التي توفر هذا الخيار للإلكترونيات في بغداد.' },
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
          دليل شامل لكل مصطلحات الإلكترونيات في العراق — يساعدك على فهم مواصفات الهواتف واللابتوبات والسماعات قبل الشراء.
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
