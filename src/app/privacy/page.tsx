import type { Metadata } from 'next';
import Link from 'next/link';
import { storeConfig } from '@/config/store.config';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية | Quvenza',
  description: 'سياسة الخصوصية وحماية البيانات في متجر Quvenza — كيف نتعامل مع معلوماتك الشخصية وبيانات الدفع.',
  alternates: { canonical: 'https://quvenzaiq.com/privacy' },
};

const SECTION: React.CSSProperties = { marginBottom: 36 };
const H2: React.CSSProperties = { fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 12, letterSpacing: '-0.01em' };
const P: React.CSSProperties = { color: '#4B5563', lineHeight: 1.8, fontSize: 15, marginBottom: 12 };
const UL: React.CSSProperties = { color: '#4B5563', lineHeight: 1.8, fontSize: 15, paddingRight: 24, marginBottom: 12 };

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '64px 24px' }}>
      <h1 style={{ fontSize: 40, fontWeight: 700, color: '#111827', marginBottom: 8, letterSpacing: '-0.02em' }}>
        سياسة الخصوصية
      </h1>
      <p style={{ color: '#9097A1', fontSize: 13, marginBottom: 48 }}>
        آخر تحديث: يناير ٢٠٢٦ · {storeConfig.copyright}
      </p>

      <div style={SECTION}>
        <h2 style={H2}>١. المقدمة</h2>
        <p style={P}>
          يُقدّر متجر <strong style={{ color: '#111827' }}>Quvenza</strong> ثقتك الكاملة بنا، ويلتزم بحماية خصوصيتك وبياناتك
          الشخصية بأعلى معايير الأمان. تُوضّح هذه السياسة كيفية جمع معلوماتك واستخدامها وحمايتها عند استخدامك
          موقع <strong style={{ color: '#111827' }}>quvenzaiq.com</strong>.
        </p>
        <p style={P}>
          باستخدامك الموقع أو إتمامك أي عملية شراء، فإنك توافق على شروط هذه السياسة. إذا كنت لا توافق على أي
          بند فيها، يُرجى التواصل معنا قبل الاستمرار.
        </p>
      </div>

      <div style={SECTION}>
        <h2 style={H2}>٢. المعلومات التي نجمعها</h2>
        <p style={P}>نجمع فقط المعلومات الضرورية لإتمام طلبك وتقديم خدمة دعم عالية الجودة، وتشمل:</p>
        <ul style={UL}>
          <li><strong style={{ color: '#111827' }}>معلومات الحساب:</strong> الاسم، البريد الإلكتروني، وكلمة المرور المشفّرة.</li>
          <li><strong style={{ color: '#111827' }}>معلومات الطلب:</strong> المنتجات المشتراة، التواريخ، وتفاصيل الدفع.</li>
          <li><strong style={{ color: '#111827' }}>معلومات التواصل:</strong> رقم الهاتف أو واتساب إن أرسلته لنا طوعاً.</li>
          <li><strong style={{ color: '#111827' }}>البيانات التقنية:</strong> عنوان IP، نوع المتصفح، والصفحات التي تزورها داخل الموقع.</li>
        </ul>
        <p style={P}>
          لا نجمع بيانات بطاقات الائتمان مباشرةً؛ إذ تتم كل معاملات الدفع عبر بوابات موثوقة (زين كاش،
          آسيا حوالة، فاست باي) التي تخضع لسياسات خصوصيتها الخاصة.
        </p>
      </div>

      <div style={SECTION}>
        <h2 style={H2}>٣. كيف نستخدم معلوماتك</h2>
        <p style={P}>نستخدم بياناتك حصراً للأغراض التالية:</p>
        <ul style={UL}>
          <li>معالجة طلباتك وتفعيل الاشتراكات الرقمية على بريدك الإلكتروني.</li>
          <li>التواصل معك بشأن حالة طلبك أو أي مشكلة تقنية.</li>
          <li>تحسين تجربة الاستخدام وتطوير خدماتنا بناءً على سلوك التصفح العام.</li>
          <li>الوفاء بالالتزامات القانونية المطلوبة في المملكة العراقية.</li>
        </ul>
        <p style={P}>
          لا نستخدم بياناتك لأغراض تسويقية بدون إذنك الصريح، ولا نبيعها أو نُشاركها مع أي طرف ثالث
          بهدف الربح.
        </p>
      </div>

      <div style={SECTION}>
        <h2 style={H2}>٤. حماية البيانات والأمان</h2>
        <p style={P}>
          نطبّق معايير أمان صناعية صارمة لحماية بياناتك:
        </p>
        <ul style={UL}>
          <li>تشفير كلمات المرور باستخدام خوارزمية <strong style={{ color: '#111827' }}>bcrypt</strong> بمعامل تكلفة ١٢.</li>
          <li>اتصالات مشفّرة بالكامل عبر بروتوكول <strong style={{ color: '#111827' }}>HTTPS/TLS</strong> مع رأس HSTS.</li>
          <li>رموز JWT قصيرة الأجل للجلسات، مع رمز تحديث منفصل ومؤمّن.</li>
          <li>لا نخزن أرقام بطاقات الدفع أو بيانات المحافظ الإلكترونية على خوادمنا.</li>
        </ul>
        <p style={P}>
          على الرغم من التزامنا بأعلى معايير الأمان، لا يمكن لأي نظام إلكتروني ضمان الحماية المطلقة من
          جميع التهديدات. نُوصيك باستخدام كلمة مرور قوية وعدم مشاركة بيانات حسابك مع أي شخص.
        </p>
      </div>

      <div style={SECTION}>
        <h2 style={H2}>٥. مشاركة البيانات مع الأطراف الثالثة</h2>
        <p style={P}>
          لا نُشارك معلوماتك الشخصية مع أطراف خارجية إلا في الحالات الضرورية الآتية:
        </p>
        <ul style={UL}>
          <li><strong style={{ color: '#111827' }}>مزودو الاشتراكات:</strong> نُشارك بريدك الإلكتروني فقط مع منصات المنتج (مثل OpenAI، Canva) لتفعيل اشتراكك.</li>
          <li><strong style={{ color: '#111827' }}>المتطلبات القانونية:</strong> نستجيب للطلبات القانونية الرسمية من الجهات المختصة في العراق.</li>
          <li><strong style={{ color: '#111827' }}>بوابات الدفع:</strong> تخضع معاملاتك لسياسات خصوصية زين كاش وآسيا حوالة وفاست باي المستقلة.</li>
        </ul>
      </div>

      <div style={SECTION}>
        <h2 style={H2}>٦. ملفات تعريف الارتباط (Cookies)</h2>
        <p style={P}>
          يستخدم الموقع ملفات تعريف ارتباط أساسية ضرورية لتشغيل الجلسة وسلة التسوق. لا نستخدم ملفات
          تتبّع إعلانية أو أدوات تحليل تابعة لأطراف ثالثة دون إشعار واضح. يمكنك تعطيل ملفات تعريف
          الارتباط من إعدادات متصفحك، غير أن بعض ميزات الموقع قد لا تعمل بشكل صحيح.
        </p>
      </div>

      <div style={SECTION}>
        <h2 style={H2}>٧. حقوقك</h2>
        <p style={P}>تتمتع بالحقوق التالية فيما يخص بياناتك الشخصية:</p>
        <ul style={UL}>
          <li><strong style={{ color: '#111827' }}>الاطلاع:</strong> طلب نسخة من بياناتك المحفوظة لدينا.</li>
          <li><strong style={{ color: '#111827' }}>التصحيح:</strong> تحديث أي معلومات غير دقيقة من خلال صفحة حسابك.</li>
          <li><strong style={{ color: '#111827' }}>الحذف:</strong> طلب حذف حسابك وبياناتك، مع مراعاة متطلبات الاحتفاظ القانونية.</li>
          <li><strong style={{ color: '#111827' }}>الاعتراض:</strong> رفض استخدام بياناتك لأغراض تسويقية في أي وقت.</li>
        </ul>
        <p style={P}>لممارسة أي من هذه الحقوق، تواصل معنا عبر البريد الإلكتروني أدناه.</p>
      </div>

      <div style={SECTION}>
        <h2 style={H2}>٨. التواصل بشأن الخصوصية</h2>
        <p style={P}>
          لأي استفسار أو طلب يتعلق بخصوصيتك وبياناتك الشخصية، تواصل معنا عبر:
        </p>
        <ul style={UL}>
          <li>
            البريد الإلكتروني:{' '}
            <a href={`mailto:${storeConfig.support.email}`} style={{ color: '#2563EB', textDecoration: 'none' }}>
              {storeConfig.support.email}
            </a>
          </li>
          <li>واتساب: متاح ٢٤/٧ للردّ على استفساراتك.</li>
          <li>العنوان: بغداد، جمهورية العراق.</li>
        </ul>
        <p style={P}>
          نلتزم بالردّ على جميع طلبات الخصوصية خلال ٧ أيام عمل كحدٍّ أقصى.
        </p>
      </div>

      <div style={{ borderTop: '1px solid #EAECEF', paddingTop: 24, marginTop: 8 }}>
        <p style={{ color: '#9097A1', fontSize: 13 }}>
          هل لديك سؤال آخر؟{' '}
          <Link href="/faq" style={{ color: '#2563EB', textDecoration: 'none' }}>راجع الأسئلة الشائعة</Link>
          {' '}أو{' '}
          <Link href="/contact" style={{ color: '#2563EB', textDecoration: 'none' }}>تواصل معنا</Link>.
        </p>
      </div>
    </div>
  );
}
