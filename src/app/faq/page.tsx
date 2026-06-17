import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema, faqSchema, speakableSpec } from '@/lib/schema';
import type { FAQItem } from '@/lib/schema';

const BASE = 'https://quvenzaiq.com';
const WHATSAPP = '9647700000000';

export const metadata: Metadata = {
  title: 'الأسئلة الشائعة — كل ما تريد معرفته عن Quvenza',
  description: 'إجابات على كل أسئلتك حول شراء الأجهزة الإلكترونية في العراق: الأصالة والضمان الرسمي، التوصيل السريع، طرق الدفع، الإرجاع والاستبدال، iPhone 15 Pro، MacBook Air، Galaxy S24 وأكثر. متجر عراقي 100%.',
  alternates: { canonical: `${BASE}/faq` },
  openGraph: {
    title: 'الأسئلة الشائعة — Quvenza',
    description: 'إجابات شاملة عن شراء الأجهزة الإلكترونية الأصلية في العراق.',
    url: `${BASE}/faq`,
    images: [{ url: `${BASE}/og-image.svg`, width: 1200, height: 630, alt: 'Quvenza FAQ' }],
  },
};

const FAQS: FAQItem[] = [
  { question: 'ما هو متجر Quvenza؟', answer: 'Quvenza هو متجر عراقي متخصص ببيع الأجهزة الإلكترونية الأصلية في العراق — هواتف ولابتوبات وتابلت وسماعات من علامات عالمية مثل Apple وSamsung وSony وDell وHP وLenovo وAsus وBose وJBL وSennheiser. تأسس في بغداد عام 2026 ويخدم كل محافظات العراق.' },
  { question: 'هل Quvenza متجر عراقي حقيقي؟', answer: 'نعم. Quvenza متجر عراقي 100% مقره بغداد، وليس وسيطاً من خارج العراق. كل المعاملات تتم بالدينار العراقي والدعم باللهجة العربية العراقية، مع إمكانية المعاينة قبل الاستلام.' },
  { question: 'في أي محافظات تعملون والتوصيل؟', answer: 'نوصّل لكل المحافظات الـ 18 في العراق: بغداد، البصرة، أربيل، الموصل، النجف، كربلاء، السليمانية، دهوك، الأنبار، صلاح الدين، ديالى، كركوك، بابل، واسط، القادسية، ميسان، ذي قار، المثنى. التوصيل سريع داخل بغداد خلال 24 ساعة، وباقي المحافظات خلال 2–4 أيام عمل.' },
  { question: 'ما هي طرق الدفع المتاحة؟', answer: 'نقبل عدة طرق دفع محلية: كاش عند الاستلام (Cash on Delivery)، زين كاش (ZainCash)، آسيا حوالة (AsiaHawala)، فاست باي (FastPay)، والتحويل البنكي. كل الأسعار بالدينار العراقي (IQD) بدون رسوم خفية، ويمكن عرض السعر بالدولار للمقارنة.' },
  { question: 'هل يمكن الدفع كاش عند الاستلام؟', answer: 'نعم — الدفع كاش عند الاستلام متاح في بغداد فقط حالياً، حيث تدفع للمندوب وقت استلام الجهاز بعد فحصه. لباقي المحافظات، استخدم زين كاش أو آسيا حوالة أو فاست باي لتأكيد الطلب ثم يُشحن الجهاز إليك.' },
  { question: 'هل أحتاج لبطاقة فيزا للشراء؟', answer: 'لا. تستطيع الشراء بالكامل بطرق محلية بالدينار العراقي — كاش عند الاستلام في بغداد أو زين كاش أو آسيا حوالة أو فاست باي. لا حاجة لبطاقة فيزا أو ماستركارد أو حساب بنكي دولي.' },
  { question: 'كم يستغرق توصيل الجهاز؟', answer: 'داخل بغداد عادة خلال 24 ساعة من تأكيد الطلب. لباقي المحافظات من 2 إلى 4 أيام عمل حسب المنطقة وشركة الشحن. يصلك إشعار بحالة الطلب وإمكانية تتبّع الشحنة.' },
  { question: 'كيف تتم عملية الطلب والتوصيل؟', answer: '1. تختار الجهاز والموديل واللون من الموقع. 2. تضيفه للسلة وتُكمل الطلب بعنوان الشحن. 3. تختار طريقة الدفع المناسبة. 4. نجهّز الجهاز الأصلي المختوم ونشحنه إليك. 5. تستلمه وتفحصه، ثم تدفع (إن كان كاش عند الاستلام) وتبدأ الاستخدام مع الضمان الرسمي.' },
  { question: 'هل الجهاز يصل جديداً ومختوماً؟', answer: 'نعم. كل أجهزتنا جديدة وأصلية ومختومة (Sealed / Brand New) داخل علبتها الأصلية مع كامل الملحقات. تستلم الجهاز بحالته المصنعية الكاملة، ويمكنك فحصه عند الاستلام.' },
  { question: 'ما هو ضمان Quvenza؟', answer: 'كل أجهزتنا تأتي بضمان رسمي (ضمان الوكيل أو ضمان المتجر حسب المنتج). لو ظهر أي عيب مصنعي خلال فترة الضمان، نتولّى الإصلاح أو الاستبدال وفق سياسة الضمان. تفاصيل مدة الضمان موضّحة في صفحة كل منتج.' },
  { question: 'ماذا أفعل لو وصل الجهاز فيه عطل أو خلل؟', answer: 'تواصل معنا فوراً على واتساب أو تيليجرام، اشرح المشكلة، وأرسل صورة أو فيديو إن أمكن. إذا كان العيب مصنعياً، نوفّر لك استبدال أو إصلاح ضمن الضمان دون أي تكلفة إضافية.' },
  { question: 'ما هي سياسة الإرجاع والاستبدال؟', answer: 'يحق لك الإرجاع أو الاستبدال خلال 7 أيام من الاستلام إذا كان الجهاز بحالته الأصلية وبكامل ملحقاته وعلبته. في حال وجود عيب مصنعي يتم الاستبدال مجاناً، أما الإرجاع لتغيير الرأي فيخضع لشروط حالة المنتج.' },
  { question: 'هل الأجهزة أصلية 100%؟', answer: 'نعم، كل أجهزتنا أصلية بنسبة 100% ومصدرها موثوق من الوكلاء والموزعين المعتمدين. يمكنك التحقق من رقم الـ Serial / IMEI على موقع الشركة المصنّعة (Apple، Samsung، Sony...) للتأكد من أصالة الجهاز وحالة ضمانه.' },
  { question: 'ما هي أشهر المنتجات في Quvenza؟', answer: 'الأجهزة الأكثر مبيعاً: iPhone 15 Pro وGalaxy S24 (هواتف)، MacBook Air وDell XPS (لابتوبات)، AirPods Pro وSony WH-1000XM5 (سماعات)، إضافة إلى التابلت وسماعات Bose وJBL وSennheiser.' },
  { question: 'ما الفرق بين iPhone 15 و iPhone 15 Pro؟', answer: 'iPhone 15 مناسب لمعظم المستخدمين — شاشة OLED وكاميرا 48MP ومنفذ USB-C. iPhone 15 Pro للمستخدمين المتقدمين — هيكل تيتانيوم، شريحة A17 Pro الأقوى، نظام كاميرات احترافي، وزر Action قابل للتخصيص. السعران واضحان بالدينار العراقي في صفحة كل موديل.' },
  { question: 'كيف أعرف أن الجهاز يناسب احتياجي؟', answer: 'كل صفحة منتج تعرض المواصفات الكاملة: المعالج، الذاكرة، السعة التخزينية، حجم الشاشة، البطارية والتوافق. مثلاً MacBook Air يناسب العمل والدراسة اليومية، وDell XPS للأعمال الأثقل. وفريقنا جاهز لمساعدتك على اختيار الموديل المناسب عبر واتساب.' },
  { question: 'هل التوصيل مجاني؟', answer: 'التوصيل مجاني داخل بغداد على معظم الأجهزة. لباقي المحافظات قد تُطبّق رسوم شحن رمزية حسب الوزن والمنطقة، وتظهر لك بوضوح عند إتمام الطلب قبل الدفع.' },
  { question: 'هل يوجد خصومات للطلاب؟', answer: 'نعم. نقدّم عروضاً خاصة وخصومات للطلاب على بعض الأجهزة (لابتوبات وتابلت) عند تقديم البطاقة الجامعية أو الإيميل الجامعي. تواصل معنا قبل الشراء للحصول على كود الخصم المتاح.' },
  { question: 'هل تتوفر ملحقات وإكسسوارات مع الجهاز؟', answer: 'نعم. يصلك الجهاز بكامل ملحقاته الأصلية داخل العلبة (شاحن/كيبل/سماعة حسب المنتج)، كما نوفّر إكسسوارات إضافية أصلية مثل الأغطية والشواحن وسماعات AirPods Pro لتكمل تجربتك.' },
  { question: 'هل الجهاز يدعم العربية وشبكات العراق؟', answer: 'نعم — كل الهواتف والتابلت تدعم واجهة عربية كاملة (RTL) وتعمل على شبكات الجيل الرابع/الخامس في العراق. أجهزة Apple وSamsung تدعم اللغة العربية ولوحة المفاتيح العربية بشكل افتراضي.' },
  { question: 'هل بياناتي آمنة معكم؟', answer: 'نعم. نلتزم بأقصى معايير الخصوصية. لا نخزّن بيانات بطاقاتك. عنوانك ورقم هاتفك يُستخدمان فقط لتوصيل طلبك ومتابعة الضمان، ولا نشاركهما مع أي طرف ثالث.' },
];

const GROUPS = [
  { title: 'عن المتجر', items: FAQS.slice(0, 3) },
  { title: 'طرق الدفع', items: FAQS.slice(3, 6) },
  { title: 'التوصيل والطلب', items: FAQS.slice(6, 9) },
  { title: 'الضمان والإرجاع', items: FAQS.slice(9, 12) },
  { title: 'الأجهزة', items: FAQS.slice(12, 16) },
  { title: 'الملحقات والأمان', items: FAQS.slice(16) },
];

export default function FAQPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'الرئيسية', url: BASE }, { name: 'الأسئلة الشائعة', url: `${BASE}/faq` }])} />
      <JsonLd data={{ ...faqSchema(FAQS), speakable: speakableSpec(['.faq-question', '.faq-answer']) }} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '64px 24px' }}>
        <h1 style={{ fontSize: 40, fontWeight: 700, color: '#111827', marginBottom: 12, letterSpacing: '-0.02em' }}>
          الأسئلة الشائعة
        </h1>
        <p style={{ color: '#4B5563', fontSize: 18, lineHeight: 1.7, marginBottom: 56 }}>
          إجابات على أكثر الأسئلة شيوعاً عن متجر Quvenza وشراء الأجهزة الإلكترونية الأصلية في العراق.
        </p>

        {GROUPS.map((group) => (
          <div key={group.title} style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 12, fontWeight: 700, color: '#2563EB', marginBottom: 16, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {group.title}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {group.items.map((faq, i) => (
                <details
                  key={i}
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                  style={{ background: '#FFFFFF', border: '1px solid #EAECEF', borderRadius: 8, overflow: 'hidden' }}
                >
                  <summary
                    itemProp="name"
                    className="faq-question"
                    style={{ padding: '16px 20px', cursor: 'pointer', fontWeight: 600, color: '#111827', fontSize: 15, listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <span>{faq.question}</span>
                    <span style={{ color: '#2563EB', flexShrink: 0, marginRight: 8 }}>+</span>
                  </summary>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p
                      itemProp="text"
                      className="faq-answer"
                      style={{ padding: '0 20px 16px', color: '#4B5563', lineHeight: 1.75, fontSize: 14, margin: 0 }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}

        <div style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.25)', borderRadius: 8, padding: 32, textAlign: 'center', marginTop: 16 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: '#111827', marginBottom: 8 }}>لم تجد إجابة؟</h2>
          <p style={{ color: '#4B5563', marginBottom: 20 }}>تواصل معنا مباشرة على واتساب وسنجيبك خلال دقائق.</p>
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', background: '#2563EB', color: '#fff', padding: '12px 32px', borderRadius: 6, fontWeight: 600, textDecoration: 'none', fontSize: 15 }}
          >
            تواصل عبر WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
