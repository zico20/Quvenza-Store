import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema, faqSchema, speakableSpec } from '@/lib/schema';
import type { FAQItem } from '@/lib/schema';

const BASE = 'https://quvenza.com';
const WHATSAPP = '9647700000000';

export const metadata: Metadata = {
  title: 'الأسئلة الشائعة — كل ما تريد معرفته عن Quvenza',
  description: 'إجابات على كل أسئلتك حول الاشتراكات الرقمية في العراق: طرق الدفع، التوصيل، الضمان، التفعيل، ChatGPT Plus، Canva Pro وأكثر. متجر عراقي 100%.',
  alternates: { canonical: `${BASE}/faq` },
  openGraph: {
    title: 'الأسئلة الشائعة — Quvenza',
    description: 'إجابات شاملة عن الاشتراكات الرقمية في العراق.',
    url: `${BASE}/faq`,
    images: [{ url: `${BASE}/og-image.svg`, width: 1200, height: 630, alt: 'Quvenza FAQ' }],
  },
};

const FAQS: FAQItem[] = [
  { question: 'ما هو متجر Quvenza؟', answer: 'Quvenza هو متجر عراقي متخصص ببيع الاشتراكات الرقمية الأصلية في العراق، مثل ChatGPT Plus، Canva Pro، CapCut Pro، Coursera Plus وأكثر. تأسس في بغداد عام 2026 ويخدم كل محافظات العراق.' },
  { question: 'هل Quvenza متجر عراقي حقيقي؟', answer: 'نعم. Quvenza متجر عراقي 100% مقره بغداد، وليس وسيطاً من خارج العراق. كل المعاملات تتم بالدينار العراقي والدعم باللهجة العربية العراقية.' },
  { question: 'في أي محافظات تعملون؟', answer: 'نخدم كل المحافظات الـ 18 في العراق: بغداد، البصرة، أربيل، الموصل، النجف، كربلاء، السليمانية، دهوك، الأنبار، صلاح الدين، ديالى، كركوك، بابل، واسط، القادسية، ميسان، ذي قار، المثنى. لأن الاشتراكات رقمية، التفعيل عبر الإنترنت ويصلك أينما كنت.' },
  { question: 'ما هي طرق الدفع المتاحة؟', answer: 'نقبل عدة طرق دفع محلية: كاش عند الاستلام (في بغداد)، زين كاش (ZainCash)، آسيا حوالة (AsiaHawala)، فاست باي (FastPay)، والتحويل البنكي. لا حاجة لبطاقة فيزا أو حساب بنكي دولي.' },
  { question: 'هل يمكن الدفع كاش عند الاستلام؟', answer: 'نعم — الدفع كاش عند الاستلام متاح في بغداد فقط حالياً. لباقي المحافظات، استخدم زين كاش أو آسيا حوالة أو فاست باي وسيتم تفعيل اشتراكك خلال 30 دقيقة.' },
  { question: 'هل أحتاج لبطاقة فيزا للاشتراك؟', answer: 'لا. واحدة من أهم مميزاتنا هي أنك لا تحتاج لبطاقة فيزا أو ماستركارد. ندفع نحن للمزود العالمي بالدولار، وأنت تدفع لنا بالدينار العراقي بأي طريقة محلية.' },
  { question: 'كم يستغرق تفعيل الاشتراك؟', answer: 'عادة خلال 30 دقيقة من تأكيد الدفع، وقد يصل لساعتين كحد أقصى في الأوقات المزدحمة.' },
  { question: 'كيف يصلني الاشتراك بعد الدفع؟', answer: '1. تطلب الاشتراك من الموقع. 2. تدفع بالطريقة المناسبة. 3. ترسل لنا ايميلك الشخصي على واتساب. 4. نفعّل الاشتراك على نفس ايميلك خلال 30 دقيقة. 5. تستخدم الاشتراك مباشرة.' },
  { question: 'هل الاشتراك يفعّل على ايميلي الشخصي؟', answer: 'نعم في معظم المنتجات (ChatGPT Plus، Canva Pro، Coursera Plus). الاشتراك يفعّل على ايميلك الخاص ويبقى ملكك.' },
  { question: 'ما هو ضمان Quvenza؟', answer: 'كل اشتراكاتنا مضمونة طوال فترة الاشتراك. لو حدث أي مشكلة (خطأ في التفعيل، توقف الاشتراك، مشكلة في الحساب)، نعالجها مجاناً خلال ساعات. لو لم نستطع الإصلاح، نعوّضك بفترة إضافية أو استرداد كامل.' },
  { question: 'ماذا أفعل لو حدثت مشكلة في الاشتراك؟', answer: 'تواصل معنا فوراً على واتساب أو تيليجرام، اشرح المشكلة، وأرسل screenshot إذا أمكن. سنرد خلال دقائق ونعالج المشكلة مجاناً.' },
  { question: 'هل يمكنني استرداد المبلغ؟', answer: 'الاسترداد ممكن في حالات محددة: عدم تفعيل الاشتراك خلال 24 ساعة، توقف الاشتراك بسبب فني من جانبنا، أو خطأ في الطلب. للحالات الأخرى، نقدم استبدال بمنتج آخر أو تعويض.' },
  { question: 'هل الاشتراكات أصلية 100%؟', answer: 'نعم، كل اشتراكاتنا أصلية ومباشرة من الشركات الأم (OpenAI لـ ChatGPT، Canva، ByteDance لـ CapCut، Coursera). يمكنك التحقق من ذلك بالدخول لإعدادات حسابك ومشاهدة "Subscribed" أو "Pro" مفعّلة.' },
  { question: 'ما هي أشهر المنتجات في Quvenza؟', answer: 'المنتجات الأكثر مبيعاً: ChatGPT Plus (للذكاء الاصطناعي)، Canva Pro (للتصميم)، CapCut Pro (لمونتاج الفيديو)، Coursera Plus (للكورسات والشهادات).' },
  { question: 'ما الفرق بين ChatGPT Plus و ChatGPT Pro؟', answer: 'ChatGPT Plus (20$/شهر) كافٍ لـ 95% من المستخدمين — يعطي وصول كامل لـ GPT-5 و DALL-E و Voice. ChatGPT Pro (200$/شهر) للمستخدمين المتقدمين — وصول غير محدود + Sora للفيديو.' },
  { question: 'هل يعمل CapCut Pro على iPhone و Android؟', answer: 'نعم، يعمل على كلا النظامين بكل الميزات: إزالة العلامة المائية، فلاتر حصرية، تصدير 4K، AI Effects.' },
  { question: 'هل Canva Pro يدعم اللغة العربية و RTL؟', answer: 'نعم بالكامل — يدعم العربية والـ RTL، ويحوي خطوط عربية احترافية. مثالي للمصممين العراقيين والمحتوى العربي.' },
  { question: 'هل التوصيل مجاني؟', answer: 'نعم، التوصيل مجاني لكل الاشتراكات الرقمية لأنها تصلك عبر الإنترنت — لا توجد رسوم شحن.' },
  { question: 'هل يوجد خصومات للطلاب؟', answer: 'نعم. نقدم خصم 10% على الاشتراكات السنوية للطلاب عند تقديم بطاقة الجامعة أو الإيميل الجامعي. تواصل معنا قبل الشراء للحصول على كود الخصم.' },
  { question: 'هل أحتاج VPN لاستخدام الاشتراك؟', answer: 'في الغالب لا. ChatGPT و Canva و CapCut و Coursera كلها تعمل في العراق بدون VPN.' },
  { question: 'هل يمكنني استخدام الاشتراك على عدة أجهزة؟', answer: 'نعم — كل الاشتراكات تسمح باستخدام عدة أجهزة بنفس الحساب. مثلاً ChatGPT Plus يعمل على هاتفك وكمبيوترك في نفس الوقت.' },
  { question: 'هل بياناتي آمنة معكم؟', answer: 'نعم. نلتزم بأقصى معايير الخصوصية. لا نخزن كلمات مرورك ولا بيانات بطاقاتك. ايميلك يستخدم فقط لتفعيل الاشتراك ولا نشاركه مع أي طرف ثالث.' },
];

const GROUPS = [
  { title: 'عن المتجر', items: FAQS.slice(0, 3) },
  { title: 'طرق الدفع', items: FAQS.slice(3, 6) },
  { title: 'التفعيل والتوصيل', items: FAQS.slice(6, 9) },
  { title: 'الضمان والاسترداد', items: FAQS.slice(9, 12) },
  { title: 'المنتجات', items: FAQS.slice(12, 16) },
  { title: 'التقنية والأمان', items: FAQS.slice(16) },
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
          إجابات على أكثر الأسئلة شيوعاً عن متجر Quvenza والاشتراكات الرقمية في العراق.
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
