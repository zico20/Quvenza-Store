import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // ── Cleanup (FK order) ───────────────────────────────────────────
  await prisma.orderStatusHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // ── Users ────────────────────────────────────────────────────────
  const adminPassword    = await bcrypt.hash('Admin@2026!', 12);
  const customerPassword = await bcrypt.hash('Customer@2026!', 12);

  const admin = await prisma.user.create({
    data: { name: 'Ghaith Admin', email: 'admin@quvenzaiq.com', password: adminPassword, role: 'ADMIN' },
  });

  const customer = await prisma.user.create({
    data: { name: 'عميل تجريبي', email: 'customer@quvenzaiq.com', password: customerPassword, role: 'USER' },
  });

  console.log(`✅ Users: ${admin.email}, ${customer.email}`);

  // ── Categories ───────────────────────────────────────────────────
  const [catAI, catDesign, catEdu, catVideo, catEntertainment, catProductivity, catGaming, catCoins] =
    await Promise.all([
      prisma.category.create({ data: { name: 'أدوات الذكاء الاصطناعي', slug: 'ai-tools',        isActive: true } }),
      prisma.category.create({ data: { name: 'التصميم والإبداع',       slug: 'design',           isActive: true } }),
      prisma.category.create({ data: { name: 'التعليم والشهادات',       slug: 'education',        isActive: true } }),
      prisma.category.create({ data: { name: 'المونتاج والفيديو',       slug: 'video-editing',    isActive: true } }),
      prisma.category.create({ data: { name: 'الترفيه والموسيقى',       slug: 'entertainment',    isActive: true } }),
      prisma.category.create({ data: { name: 'الإنتاجية والعمل',        slug: 'productivity',     isActive: true } }),
      prisma.category.create({ data: { name: 'حسابات الألعاب',          slug: 'gaming-accounts',  isActive: true } }),
      prisma.category.create({ data: { name: 'عملات الألعاب',           slug: 'gaming-coins',     isActive: true } }),
    ]);

  console.log('✅ Categories: 8');

  // ── Products ─────────────────────────────────────────────────────
  const products = [

    // ════════════════════════════════════════════════════════════════
    // AI TOOLS
    // ════════════════════════════════════════════════════════════════
    {
      name:           'ChatGPT Plus — اشتراك شهرين',
      slug:           'chatgpt-plus-2months',
      categoryId:     catAI.id,
      price:          35,
      comparePrice:   60000,
      stock:          999,
      isFeatured:     true,
      images:         ['https://placehold.co/600x600/ff6a2b/ffffff?text=ChatGPT+Plus'],
      imageAlts:      ['اشتراك ChatGPT Plus شهرين في العراق — Quvenza'],
      description:    'اشتراك ChatGPT Plus لمدة شهرين بسعر خاص. وصول كامل لـ GPT-4o و DALL-E 3 وتحليل الملفات.',
      metaTitle:      'ChatGPT Plus شهرين — اشتراك في العراق | Quvenza',
      metaDescription:'اشترِ ChatGPT Plus لشهرين بـ 50,000 د.ع في العراق. GPT-4o + DALL-E 3. تفعيل فوري، دفع زين كاش.',
      metaKeywords:   'ChatGPT Plus العراق,اشتراك ChatGPT عراق,شراء ChatGPT العراق,ChatGPT Plus Iraq,GPT-4o عراق',
      longDescription: `## اشتراك ChatGPT Plus لشهرين في العراق

**ChatGPT Plus** هو الاشتراك المدفوع من OpenAI الذي يمنحك وصولاً كاملاً وغير محدود لأقوى نماذج الذكاء الاصطناعي في العالم.

### ما الذي تحصل عليه مع ChatGPT Plus؟

- **GPT-4o** — النموذج الأسرع والأذكى من OpenAI، يفهم العربية بشكل ممتاز
- **DALL-E 3** — أنشئ صوراً احترافية بمجرد وصف ما تريده بالكلمات
- **Advanced Voice Mode** — تحدث مع ChatGPT كأنك تتحدث مع إنسان حقيقي
- **تحليل الملفات** — ارفع PDF أو Excel أو صور وحللها مع ChatGPT
- **البحث على الويب** — ChatGPT يبحث لك في الإنترنت ويعطيك أحدث المعلومات
- **أولوية الوصول** — لا انقطاعات حتى في أوقات الذروة
- **GPT Store** — وصول لآلاف النماذج المخصصة من مجتمع OpenAI

### لماذا ChatGPT Plus يستحق الاشتراك من العراق؟

يستخدم ChatGPT Plus ملايين المهنيين حول العالم: مبرمجون، كتّاب، طلاب، أصحاب أعمال. في العراق، يساعدك على كتابة المحتوى بالعربية، ترجمة المستندات، تحليل البيانات، وكتابة الكود البرمجي.

### كيف تصلك الاشتراك؟

بعد إتمام الدفع، يصل الاشتراك إلى بريدك الإلكتروني خلال **30 دقيقة كحد أقصى**. فريقنا يعمل على مدار الساعة لضمان التسليم الفوري.

### طرق الدفع المتاحة في العراق

- **زين كاش** (ZainCash)
- **آسيا حوالة** (AsiaHawala)
- **فاست باي** (FastPay)
- **كاش عند الاستلام** في بغداد`,
      features: [
        { title: 'GPT-4o الأذكى', description: 'أقوى نموذج لغوي في العالم — يفهم العربية ويكتب كالمحترفين', icon: '🧠' },
        { title: 'DALL-E 3 للصور', description: 'أنشئ صوراً احترافية من نص عربي بجودة عالية', icon: '🎨' },
        { title: 'تحليل الملفات', description: 'ارفع PDF أو Excel وحللهم في ثوانٍ', icon: '📊' },
        { title: 'بحث على الويب', description: 'أحدث معلومات من الإنترنت مباشرة في المحادثة', icon: '🌐' },
        { title: 'تفعيل خلال 30 دقيقة', description: 'بريدك الإلكتروني يستقبل الاشتراك فوراً بعد الدفع', icon: '⚡' },
        { title: 'ضمان كامل', description: 'إذا لم يعمل الاشتراك نعيد لك المبلغ كاملاً', icon: '🛡️' },
      ],
      faqs: [
        { question: 'هل ChatGPT Plus يعمل في العراق؟', answer: 'نعم، اشتراك ChatGPT Plus من Quvenza يعمل بالكامل في العراق من أي جهاز أو متصفح.' },
        { question: 'كيف يصلني الاشتراك؟', answer: 'بعد الدفع، يصل الاشتراك إلى بريدك الإلكتروني خلال 30 دقيقة كحد أقصى. فريقنا يعمل 24/7.' },
        { question: 'ما الفرق بين ChatGPT المجاني وPlus؟', answer: 'النسخة المجانية محدودة وتستخدم GPT-3.5. Plus يمنحك GPT-4o + DALL-E 3 + بحث الويب + تحليل الملفات وأولوية الوصول بدون انقطاع.' },
        { question: 'هل يمكنني الدفع بالدينار العراقي؟', answer: 'نعم، السعر بالدينار العراقي مباشرة. ندفع بزين كاش أو آسيا حوالة أو فاست باي.' },
        { question: 'هل الاشتراك يُجدَّد تلقائياً؟', answer: 'لا، الاشتراك لفترة محددة (شهرين) وينتهي تلقائياً دون أي خصم إضافي.' },
      ],
    },

    {
      name:           'ChatGPT Plus — اشتراك 4 أشهر',
      slug:           'chatgpt-plus-4months',
      categoryId:     catAI.id,
      price:          65,
      comparePrice:   80,
      stock:          999,
      isFeatured:     true,
      images:         ['https://placehold.co/600x600/ff6a2b/ffffff?text=ChatGPT+Plus+4M'],
      imageAlts:      ['اشتراك ChatGPT Plus 4 أشهر في العراق — Quvenza'],
      description:    'اشتراك ChatGPT Plus لمدة 4 أشهر. الأكثر مبيعاً في Quvenza — وفر أكثر مع فترة أطول.',
      metaTitle:      'ChatGPT Plus 4 أشهر — الأكثر مبيعاً | Quvenza العراق',
      metaDescription:'ChatGPT Plus لـ 4 أشهر بـ 95,000 د.ع. وفر 25,000 د.ع مقارنة بالشراء المنفصل. تفعيل فوري بالعراق.',
      metaKeywords:   'ChatGPT Plus العراق,اشتراك ChatGPT 4 اشهر,ChatGPT بالدينار العراقي,GPT-4o عراق',
      longDescription: `## ChatGPT Plus لـ 4 أشهر — الأفضل قيمة في العراق

اشتراك **ChatGPT Plus لأربعة أشهر** هو الخيار الأذكى لمن يريد الاستفادة الكاملة من الذكاء الاصطناعي بأفضل سعر في العراق.

### وفر 25,000 دينار عراقي

بدلاً من شراء شهرين بـ 50,000، احصل على 4 أشهر بـ 95,000 فقط — توفير حقيقي على مدار الأشهر.

### مميزات ChatGPT Plus كاملة

- **GPT-4o** بأقصى إمكانياته — بلا قيود على عدد الرسائل
- **DALL-E 3** — مئات الصور الاحترافية شهرياً
- **تحليل الكود** — اكتب وراجع وصحح الأكواد البرمجية
- **Advanced Voice Mode** — محادثات صوتية طبيعية بالعربية
- **GPTs المخصصة** — وصول لأكثر من مليون نموذج GPT متخصص
- **ذاكرة المحادثة** — ChatGPT يتذكر معلوماتك وتفضيلاتك

### مثالي لـ

المستقلون، الطلاب الجامعيون، أصحاب المشاريع الصغيرة، المدونون والمحررون العرب، مطوري البرمجيات في العراق.`,
      features: [
        { title: 'وفر 25% على السعر', description: '4 أشهر بسعر أقل من شراء شهرين منفصلين', icon: '💰' },
        { title: 'رسائل غير محدودة', description: 'استخدم GPT-4o بلا قيود طوال 4 أشهر', icon: '♾️' },
        { title: 'GPTs متخصصة', description: 'وصول لأكثر من مليون نموذج GPT للمهام المختلفة', icon: '🤖' },
        { title: 'ذاكرة المحادثة', description: 'ChatGPT يتذكر اسمك وعملك وتفضيلاتك', icon: '🧩' },
        { title: 'دعم العربية الكامل', description: 'GPT-4o يفهم اللهجة العراقية والعربية الفصحى', icon: '🌍' },
        { title: 'تسليم فوري', description: 'الاشتراك يصل لبريدك خلال 30 دقيقة من الدفع', icon: '⚡' },
      ],
      faqs: [
        { question: 'ما هو الفرق بين اشتراك شهرين و4 أشهر؟', answer: 'اشتراك 4 أشهر يوفر لك 25,000 دينار عراقي مقارنة بشراء شهرين مرتين. المميزات نفسها تماماً.' },
        { question: 'هل يمكنني تجديد الاشتراك بعد انتهائه؟', answer: 'نعم، يمكنك الشراء مجدداً من Quvenza عند الانتهاء بنفس الطريقة.' },
        { question: 'هل ChatGPT Plus يعمل على الهاتف؟', answer: 'نعم، يعمل على iOS و Android عبر تطبيق ChatGPT الرسمي أو المتصفح.' },
        { question: 'كم رسالة يمكنني إرسالها يومياً؟', answer: 'مع ChatGPT Plus لا يوجد حد صارم للرسائل اليومية مع GPT-4o. الاستخدام غير محدود.' },
      ],
    },

    {
      name:           'ChatGPT Plus — اشتراك سنة كاملة',
      slug:           'chatgpt-plus-1year',
      categoryId:     catAI.id,
      price:          160,
      comparePrice:   200,
      stock:          999,
      isFeatured:     true,
      images:         ['https://placehold.co/600x600/ff6a2b/ffffff?text=ChatGPT+Plus+1Y'],
      imageAlts:      ['اشتراك ChatGPT Plus سنة كاملة في العراق — Quvenza'],
      description:    'اشتراك ChatGPT Plus لسنة كاملة. أفضل سعر في العراق — وفر 60,000 دينار عراقي.',
      metaTitle:      'ChatGPT Plus سنة كاملة — أفضل سعر في العراق',
      metaDescription:'ChatGPT Plus سنة كاملة بـ 240,000 د.ع فقط. وفر 60,000 د.ع. GPT-4o + DALL-E. تفعيل فوري.',
      metaKeywords:   'ChatGPT Plus سنة العراق,اشتراك سنوي ChatGPT,ChatGPT Plus Iraq yearly,GPT-4o سنوي',
      longDescription: `## ChatGPT Plus للسنة الكاملة — أقوى استثمار رقمي في العراق

الاشتراك السنوي في **ChatGPT Plus** هو الخيار الأذكى لكل من يريد الاستفادة من الذكاء الاصطناعي على مدار العام بأفضل سعر ممكن في العراق.

### وفر 60,000 دينار عراقي

السعر الكامل لـ 12 شهراً بشكل منفصل = 300,000 دينار. مع الاشتراك السنوي من Quvenza تدفع 240,000 فقط.

### 365 يوم من قوة الذكاء الاصطناعي

- كتابة المحتوى العربي الاحترافي
- برمجة وتطوير تطبيقات
- تحليل البيانات والتقارير
- إنشاء الصور بـ DALL-E 3
- الترجمة الدقيقة بين العربية والإنجليزية
- البحث والتحليل الأكاديمي

### من يستفيد أكثر من الاشتراك السنوي؟

الشركات الصغيرة والمتوسطة، المستقلون (فريلانسرز)، الطلاب الجامعيون، المدونون والمحتوى العربي، والمبرمجون في العراق.`,
      features: [
        { title: 'أفضل سعر في العراق', description: 'وفر 60,000 دينار مقارنة بالشراء الشهري', icon: '🏆' },
        { title: '365 يوم بلا انقطاع', description: 'اشتراك ثابت لسنة كاملة بدون تجديد', icon: '📅' },
        { title: 'جميع مميزات Plus', description: 'GPT-4o + DALL-E 3 + Voice + File Analysis كاملة', icon: '✨' },
        { title: 'أولوية قصوى', description: 'لا انتظار حتى في أوقات الذروة العالمية', icon: '🚀' },
        { title: 'ضمان استرجاع', description: 'ضمان كامل إذا لم يعمل الاشتراك كما وعدنا', icon: '🛡️' },
        { title: 'تفعيل فوري', description: 'الاشتراك يصل خلال 30 دقيقة في أي وقت', icon: '⚡' },
      ],
      faqs: [
        { question: 'هل الاشتراك السنوي يُجدَّد تلقائياً؟', answer: 'لا، الاشتراك ينتهي بعد سنة كاملة بدون أي خصم إضافي. تتحكم أنت.' },
        { question: 'ما هي طرق الدفع للاشتراك السنوي؟', answer: 'زين كاش، آسيا حوالة، فاست باي، أو كاش عند الاستلام في بغداد.' },
        { question: 'هل يشمل الاشتراك o1 و o3؟', answer: 'نعم، ChatGPT Plus يشمل وصول لجميع نماذج OpenAI المتاحة للمشتركين.' },
        { question: 'هل يمكن استخدامه مع حساب مؤسسي؟', answer: 'هذا اشتراك شخصي. للاستخدام المؤسسي تواصل معنا عبر واتساب.' },
        { question: 'ماذا لو لم يعمل الاشتراك؟', answer: 'نعيد لك المبلغ كاملاً أو نحل المشكلة خلال ساعة. ضمان كامل.' },
      ],
    },

    // ════════════════════════════════════════════════════════════════
    // DESIGN
    // ════════════════════════════════════════════════════════════════
    {
      name:           'Canva Pro — اشتراك سنة كاملة',
      slug:           'canva-pro-1year',
      categoryId:     catDesign.id,
      price:          55,
      comparePrice:   70,
      stock:          999,
      isFeatured:     true,
      images:         ['https://placehold.co/600x600/8b5cf6/ffffff?text=Canva+Pro'],
      imageAlts:      ['اشتراك Canva Pro سنة كاملة في العراق — Quvenza'],
      description:    'Canva Pro لسنة كاملة. مليون+ قالب احترافي، Magic AI، Brand Kit، 1TB تخزين سحابي.',
      metaTitle:      'Canva Pro سنة — اشتراك في العراق | Quvenza',
      metaDescription:'اشترِ Canva Pro سنة كاملة بـ 85,000 د.ع في العراق. Magic AI + Brand Kit + 1TB. تفعيل فوري.',
      metaKeywords:   'Canva Pro العراق,اشتراك Canva عراق,Canva Pro Iraq,Magic AI تصميم,Brand Kit عراق',
      longDescription: `## Canva Pro للسنة الكاملة في العراق

**Canva Pro** هو أقوى منصة تصميم في العالم للمستخدمين الذين لا يمتلكون خبرة احترافية في التصميم. مع Canva Pro، يمكن لأي شخص في العراق إنشاء تصاميم احترافية بدقائق.

### ما الذي يميز Canva Pro؟

- **مليون+ قالب احترافي** — لكل منصة وكل مناسبة
- **Magic AI Tools** — Magic Design، Magic Write، Magic Eraser، Magic Expand
- **Brand Kit** — احفظ ألوان وشعار وخطوط علامتك التجارية
- **1 تيرابايت تخزين سحابي** — لكل ملفاتك وتصاميمك
- **إزالة الخلفيات** — بنقرة واحدة بدون Photoshop
- **تصدير بدون علامة مائية** — PDF عالي الجودة، PNG، MP4
- **تصاميم فيديو** — أنشئ ريلز وتيك توك ويوتيوب احترافياً

### لمن Canva Pro؟

مدراء التسويق، أصحاب المشاريع على الإنستقرام، صانعو المحتوى، المعلمون، الشركات الصغيرة في العراق.`,
      features: [
        { title: 'مليون+ قالب', description: 'قوالب لكل منصة: انستقرام، يوتيوب، تيك توك، فيسبوك', icon: '🎨' },
        { title: 'Magic AI', description: 'أدوات ذكاء اصطناعي: Magic Design و Magic Write و Magic Eraser', icon: '✨' },
        { title: 'Brand Kit', description: 'احفظ هوية علامتك التجارية واستخدمها في كل التصاميم', icon: '🏷️' },
        { title: '1TB تخزين سحابي', description: 'مساحة ضخمة لكل ملفاتك وتصاميمك', icon: '☁️' },
        { title: 'إزالة الخلفيات', description: 'أزل خلفية أي صورة بنقرة واحدة بدون Photoshop', icon: '🖼️' },
        { title: 'تصدير احترافي', description: 'PDF أو PNG أو MP4 بأعلى جودة بدون علامة مائية', icon: '📤' },
      ],
      faqs: [
        { question: 'هل Canva Pro يدعم اللغة العربية؟', answer: 'نعم، Canva Pro يدعم العربية الكاملة مع RTL (يمين لليسار) وخطوط عربية احترافية.' },
        { question: 'هل يمكنني استخدام Canva Pro على جهاز إضافي؟', answer: 'نعم، يمكن تسجيل الدخول من أجهزة متعددة بنفس الحساب.' },
        { question: 'هل الاشتراك على حسابي الشخصي؟', answer: 'نعم، الاشتراك يُفعَّل على حساب Canva الخاص بك مباشرة.' },
        { question: 'ماذا يحدث عند انتهاء الاشتراك؟', answer: 'تعود للنسخة المجانية وتحتفظ بكل تصاميمك ولكن تفقد مميزات Pro.' },
      ],
    },

    {
      name:           'Adobe Creative Cloud — اشتراك شهر',
      slug:           'adobe-cc-1month',
      categoryId:     catDesign.id,
      price:          30,
      comparePrice:   40,
      stock:          999,
      isFeatured:     false,
      images:         ['https://placehold.co/600x600/eb0000/ffffff?text=Adobe+CC'],
      imageAlts:      ['اشتراك Adobe Creative Cloud شهر في العراق — Quvenza'],
      description:    'Adobe Creative Cloud لشهر كامل. Photoshop + Illustrator + Premiere + 20+ تطبيق احترافي.',
      metaTitle:      'Adobe Creative Cloud شهر — اشتراك العراق | Quvenza',
      metaDescription:'اشترِ Adobe Creative Cloud شهر بـ 45,000 د.ع في العراق. Photoshop + Premiere + 20 تطبيق. تفعيل فوري.',
      metaKeywords:   'Adobe Creative Cloud العراق,Adobe CC Iraq,Photoshop العراق,Premiere عراق,Illustrator',
      longDescription: `## Adobe Creative Cloud في العراق

**Adobe Creative Cloud** هو الباقة الاحترافية الأشهر في العالم للتصميم والمونتاج والإنتاج الإبداعي.

### التطبيقات المشمولة

- **Photoshop** — تحرير الصور الاحترافي الأول عالمياً
- **Illustrator** — تصاميم فيكتور وشعارات احترافية
- **Premiere Pro** — مونتاج الفيديو الاحترافي
- **After Effects** — مؤثرات بصرية ورسوم متحركة
- **Lightroom** — تعديل وتنظيم الصور
- **InDesign** — تخطيط المجلات والكتب
- **Audition** — تحرير الصوت والبودكاست
- **+20 تطبيق** آخر في باقة واحدة

### لمن Adobe CC؟

المصممون الاحترافيون، مصوري الأفراح والمناسبات، مديرو الإنتاج الإبداعي، صانعو اليوتيوب الاحترافيون في العراق.`,
      features: [
        { title: '20+ تطبيق Adobe', description: 'Photoshop + Illustrator + Premiere + After Effects وأكثر', icon: '🎭' },
        { title: '100GB تخزين سحابي', description: 'مزامنة ملفاتك بين أجهزتك المختلفة', icon: '☁️' },
        { title: 'Adobe Fonts', description: 'آلاف الخطوط الاحترافية بدون رسوم إضافية', icon: '✍️' },
        { title: 'Adobe Stock محدود', description: 'عينات من ملايين الصور الاحترافية', icon: '🖼️' },
        { title: 'تحديثات فورية', description: 'دائماً آخر إصدار من كل التطبيقات', icon: '🔄' },
        { title: 'دعم احترافي', description: 'Adobe تقدم دعماً فنياً على مدار الساعة', icon: '🎧' },
      ],
      faqs: [
        { question: 'هل Adobe CC يعمل في العراق؟', answer: 'نعم، اشتراك Adobe CC من Quvenza يعمل بالكامل في العراق على Windows وMac.' },
        { question: 'كم جهاز يمكن تفعيله؟', answer: 'يمكن تفعيل Adobe CC على جهازين في نفس الوقت.' },
        { question: 'هل يشمل اشتراك شهر واحد كل التطبيقات؟', answer: 'نعم، باقة All Apps تشمل كل تطبيقات Adobe Creative Cloud الـ 20+.' },
      ],
    },

    // ════════════════════════════════════════════════════════════════
    // EDUCATION
    // ════════════════════════════════════════════════════════════════
    {
      name:           'Coursera Plus — اشتراك سنة كاملة',
      slug:           'coursera-plus-1year',
      categoryId:     catEdu.id,
      price:          100,
      comparePrice:   130,
      stock:          999,
      isFeatured:     true,
      images:         ['https://placehold.co/600x600/0056d2/ffffff?text=Coursera+Plus'],
      imageAlts:      ['اشتراك Coursera Plus سنة في العراق — Quvenza'],
      description:    'Coursera Plus لسنة كاملة. 7000+ كورس وشهادة من Yale وStanford وGoogle وMeta وIBM.',
      metaTitle:      'Coursera Plus سنة — كورسات جامعية في العراق',
      metaDescription:'Coursera Plus سنة كاملة بـ 150,000 د.ع. 7000+ كورس من Yale وStanford وGoogle. شهادات معتمدة.',
      metaKeywords:   'Coursera Plus العراق,كورسات جامعية عراق,Coursera Iraq,شهادات Google IBM,تعلم اونلاين عراق',
      longDescription: `## Coursera Plus في العراق — بوابتك لجامعات العالم

**Coursera Plus** هو الاشتراك الأشمل لمنصة Coursera الذي يمنحك وصولاً غير محدود لأكثر من **7,000 كورس وشهادة مهنية** من أفضل الجامعات والشركات في العالم.

### الجامعات والمؤسسات المشمولة

- **Yale University** — علم النفس، القيادة، البيانات
- **Stanford University** — الذكاء الاصطناعي، Machine Learning
- **Imperial College London** — الهندسة والتكنولوجيا
- **University of Michigan** — علوم الحاسوب
- **Google** — Professional Certificates: Data Analytics, IT Support, UX Design
- **Meta (Facebook)** — Front-End و Back-End Development
- **IBM** — Data Science, AI Engineering, Cybersecurity
- **DeepLearning.AI** — Deep Learning Specialization

### ما الذي يميز Coursera Plus عن الكورسات المنفردة؟

مع Coursera Plus تحصل على وصول **غير محدود** لكل هذه الكورسات بسعر ثابت بدلاً من دفع كل كورس بشكل منفصل (بعض الكورسات تكلف 300-500 دولار منفردة).

### الشهادات المهنية المطلوبة في سوق العمل

- Google Data Analytics Certificate
- IBM Data Science Professional Certificate
- Meta Social Media Marketing Certificate
- Google Project Management Certificate
- IBM AI Engineering Professional Certificate`,
      features: [
        { title: '7000+ كورس', description: 'وصول غير محدود لكل مكتبة Coursera', icon: '📚' },
        { title: 'جامعات عالمية', description: 'Yale, Stanford, Imperial College, Michigan وغيرها', icon: '🎓' },
        { title: 'شهادات Google وIBM', description: 'Professional Certificates معترف بها عالمياً', icon: '📜' },
        { title: 'تعلم بدوامك', description: 'تعلم بالسرعة التي تناسبك — لا مواعيد ثابتة', icon: '⏰' },
        { title: 'مشاريع عملية', description: 'كل كورس يشمل تطبيقات حقيقية وليس نظرية فقط', icon: '💼' },
        { title: 'شهادة رقمية', description: 'شارة LinkedIn قابلة للإضافة لملفك الشخصي', icon: '🏅' },
      ],
      faqs: [
        { question: 'هل Coursera Plus يعمل في العراق؟', answer: 'نعم، بعد التفعيل يمكنك الوصول لكل الكورسات من العراق بدون قيود.' },
        { question: 'هل الشهادات معترف بها؟', answer: 'نعم، شهادات Coursera من Google وIBM وStanford معترف بها دولياً في سوق العمل.' },
        { question: 'هل الكورسات بالعربية؟', answer: 'بعض الكورسات لديها ترجمة عربية، لكن معظمها بالإنجليزية مع ترجمات مكتوبة.' },
        { question: 'كم كورس يمكنني إتمامه في السنة؟', answer: 'لا يوجد حد — يمكنك إتمام عشرات الكورسات طوال السنة.' },
        { question: 'هل الكورسات محفوظة لي؟', answer: 'نعم، تقدمك في الكورسات محفوظ حتى بعد انتهاء الاشتراك.' },
      ],
    },

    // ════════════════════════════════════════════════════════════════
    // VIDEO EDITING
    // ════════════════════════════════════════════════════════════════
    {
      name:           'CapCut Pro — اشتراك شهر',
      slug:           'capcut-pro-1month',
      categoryId:     catVideo.id,
      price:          8,
      comparePrice:   12,
      stock:          999,
      isFeatured:     false,
      images:         ['https://placehold.co/600x600/000000/ffffff?text=CapCut+Pro'],
      imageAlts:      ['اشتراك CapCut Pro شهر في العراق — Quvenza'],
      description:    'CapCut Pro لشهر واحد. أزل العلامة المائية، فلاتر حصرية، تصدير 4K. مثالي لتيك توك.',
      metaTitle:      'CapCut Pro شهر — بدون علامة مائية | العراق',
      metaDescription:'CapCut Pro شهر بـ 12,000 د.ع. أزل العلامة المائية + تصدير 4K + AI أدوات. تفعيل فوري.',
      metaKeywords:   'CapCut Pro العراق,CapCut بدون علامة مائية,CapCut Pro Iraq,مونتاج تيك توك عراق',
      longDescription: `## CapCut Pro في العراق — مونتاج احترافي من هاتفك

**CapCut Pro** هو النسخة المدفوعة من تطبيق CapCut الشهير، ويمنحك قدرات مونتاج احترافية من هاتفك مباشرة.

### لماذا CapCut Pro؟

- **إزالة العلامة المائية** — نشر محتوى نظيف بدون شعار CapCut
- **تصدير 4K** — جودة سينمائية لكل فيديوهاتك
- **فلاتر وتأثيرات حصرية** — تميز عن منافسيك
- **AI Auto Captions** — ترجمة وترتيب تلقائي للكلام
- **AI Background Remover** — أزل الخلفية من الفيديو بلمسة
- **Speed Ramping** — تأثيرات الحركة الاحترافية

### مثالي لصناع المحتوى العراقيين

إذا كنت تصنع محتوى لـ TikTok أو Instagram Reels أو YouTube Shorts، CapCut Pro هو أداتك الأفضل.`,
      features: [
        { title: 'بدون علامة مائية', description: 'انشر فيديوهات نظيفة بدون شعار CapCut', icon: '🚫' },
        { title: 'تصدير 4K', description: 'جودة سينمائية لكل فيديوهاتك', icon: '🎬' },
        { title: 'AI Auto Captions', description: 'ترجمة تلقائية للكلام بالعربية والإنجليزية', icon: '🤖' },
        { title: 'فلاتر حصرية', description: 'فلاتر وتأثيرات غير متاحة في النسخة المجانية', icon: '✨' },
        { title: 'إزالة خلفية الفيديو', description: 'أزل خلفية الفيديو بنقرة واحدة بالذكاء الاصطناعي', icon: '🎭' },
        { title: 'تطبيق خفيف', description: 'يعمل على معظم هواتف الأندرويد والآيفون', icon: '📱' },
      ],
      faqs: [
        { question: 'هل CapCut Pro يعمل في العراق؟', answer: 'نعم، يعمل بالكامل على الأندرويد والآيفون في العراق بعد التفعيل.' },
        { question: 'هل يمكنني استخدامه على أكثر من جهاز؟', answer: 'الاشتراك مرتبط بحساب TikTok/CapCut الخاص بك ويعمل على كل أجهزتك.' },
        { question: 'ما الفرق بين المجاني وPro؟', answer: 'Pro يزيل العلامة المائية، يفتح 4K، الفلاتر الحصرية، وأدوات AI المتقدمة.' },
      ],
    },

    {
      name:           'CapCut Pro — اشتراك سنة كاملة',
      slug:           'capcut-pro-1year',
      categoryId:     catVideo.id,
      price:          55,
      comparePrice:   80,
      stock:          999,
      isFeatured:     false,
      images:         ['https://placehold.co/600x600/000000/ffffff?text=CapCut+Pro+1Y'],
      imageAlts:      ['اشتراك CapCut Pro سنة في العراق — Quvenza'],
      description:    'CapCut Pro لسنة كاملة بأفضل سعر. وفر 59,000 دينار مقارنة بالشراء الشهري.',
      metaTitle:      'CapCut Pro سنة كاملة — أفضل سعر في العراق',
      metaDescription:'CapCut Pro سنة كاملة بـ 85,000 د.ع. وفر 59,000 د.ع. مونتاج 4K + AI. تسليم فوري في العراق.',
      metaKeywords:   'CapCut Pro سنوي العراق,CapCut سنة,CapCut Pro Iraq yearly,مونتاج احترافي عراق',
      longDescription: `## CapCut Pro للسنة الكاملة — قيمة لا تُقاوم

اشتراك **CapCut Pro السنوي** هو الخيار المثالي لصانعي المحتوى الجادين في العراق الذين ينشرون محتوى بانتظام على تيك توك ويوتيوب وانستقرام.

### وفر 59,000 دينار عراقي

12 شهر بالشراء الشهري = 144,000 دينار. مع الاشتراك السنوي تدفع 85,000 فقط.

### كل مميزات CapCut Pro لسنة كاملة

بدون علامة مائية، 4K، AI Caption، إزالة الخلفية، Speed Ramping، وكل التحديثات الجديدة طوال السنة.`,
      features: [
        { title: 'وفر 59,000 دينار', description: 'اشتراك سنوي بدل 12 شهر منفصلة', icon: '💰' },
        { title: '365 يوم بلا توقف', description: 'احصل على Pro لسنة كاملة بدون تجديد', icon: '📅' },
        { title: 'كل مميزات Pro', description: '4K + AI + فلاتر حصرية + بدون علامة مائية', icon: '⭐' },
        { title: 'تحديثات مجانية', description: 'كل ميزة جديدة تصلك تلقائياً طوال السنة', icon: '🔄' },
        { title: 'مناسب للمؤثرين', description: 'مثالي لصانعي المحتوى الذين ينشرون يومياً', icon: '📸' },
        { title: 'تفعيل فوري', description: 'تفعيل على حسابك خلال 30 دقيقة', icon: '⚡' },
      ],
      faqs: [
        { question: 'كيف يتم تفعيل الاشتراك السنوي؟', answer: 'نرسل لك رابط التفعيل أو بيانات الحساب على بريدك الإلكتروني خلال 30 دقيقة.' },
        { question: 'هل يشمل كل التحديثات المستقبلية؟', answer: 'نعم، كل تحديثات CapCut Pro خلال السنة تصلك تلقائياً.' },
      ],
    },

    // ════════════════════════════════════════════════════════════════
    // ENTERTAINMENT
    // ════════════════════════════════════════════════════════════════
    {
      name:           'Spotify Premium — اشتراك سنة كاملة',
      slug:           'spotify-premium-1year',
      categoryId:     catEntertainment.id,
      price:          40,
      comparePrice:   55,
      stock:          999,
      isFeatured:     false,
      images:         ['https://placehold.co/600x600/1db954/ffffff?text=Spotify+Premium'],
      imageAlts:      ['اشتراك Spotify Premium سنة في العراق — Quvenza'],
      description:    'Spotify Premium سنة كاملة. موسيقى بلا إعلانات، تحميل للاستماع بدون إنترنت، جودة عالية.',
      metaTitle:      'Spotify Premium سنة — استمع بدون إعلانات | العراق',
      metaDescription:'Spotify Premium سنة كاملة بـ 60,000 د.ع في العراق. بلا إعلانات + تحميل + جودة عالية. تفعيل فوري.',
      metaKeywords:   'Spotify Premium العراق,Spotify Iraq,اشتراك سبوتيفاي عراق,موسيقى بدون اعلانات',
      longDescription: `## Spotify Premium في العراق — موسيقى بلا حدود

**Spotify Premium** يمنحك تجربة موسيقية لا مثيل لها: 100 مليون أغنية و5 مليون بودكاست بدون إعلانات.

### مميزات Spotify Premium

- **بدون إعلانات** — استمع بدون مقاطعة
- **تحميل للاستماع أوفلاين** — استمع بدون إنترنت
- **جودة صوت عالية** — 320kbps على الأقل
- **تخطي لا محدود** — تخط أي أغنية بلا قيود
- **Spotify DJ** — DJ افتراضي بالذكاء الاصطناعي
- **Blending** — امزج قوائم تشغيل مع أصدقائك`,
      features: [
        { title: 'بدون إعلانات', description: 'استمع لساعات بلا انقطاع', icon: '🚫' },
        { title: 'تحميل أوفلاين', description: 'استمع بدون إنترنت في أي مكان', icon: '⬇️' },
        { title: 'جودة 320kbps', description: 'أفضل جودة صوت ممكنة في Spotify', icon: '🎵' },
        { title: '100M+ أغنية', description: 'مكتبة ضخمة بكل الأنواع والفنانين', icon: '🎸' },
        { title: 'Spotify DJ', description: 'DJ ذكاء اصطناعي يختار لك موسيقى تناسب مزاجك', icon: '🤖' },
        { title: 'iOS وAndroid', description: 'يعمل على كل الأجهزة وأجهزة الكمبيوتر', icon: '📱' },
      ],
      faqs: [
        { question: 'هل Spotify يعمل في العراق؟', answer: 'نعم، اشتراك Spotify Premium من Quvenza يعمل بالكامل في العراق.' },
        { question: 'كيف يتم التفعيل؟', answer: 'نفعّل الاشتراك على حسابك الشخصي أو نوفر لك حساباً جاهزاً.' },
        { question: 'كم جهاز يمكن الاستماع منه؟', answer: 'يمكن تشغيل الموسيقى على جهاز واحد في الوقت نفسه مع إمكانية الاستماع من أجهزة متعددة.' },
      ],
    },

    {
      name:           'YouTube Premium — اشتراك سنة كاملة',
      slug:           'youtube-premium-1year',
      categoryId:     catEntertainment.id,
      price:          36,
      comparePrice:   50,
      stock:          999,
      isFeatured:     false,
      images:         ['https://placehold.co/600x600/ff0000/ffffff?text=YouTube+Premium'],
      imageAlts:      ['اشتراك YouTube Premium سنة في العراق — Quvenza'],
      description:    'YouTube Premium سنة كاملة. بدون إعلانات، تشغيل خلفية، YouTube Music، تحميل فيديو.',
      metaTitle:      'YouTube Premium سنة — بدون إعلانات | العراق',
      metaDescription:'YouTube Premium سنة بـ 55,000 د.ع في العراق. بلا إعلانات + خلفية + YouTube Music. تفعيل فوري.',
      metaKeywords:   'YouTube Premium العراق,يوتيوب بريميوم عراق,YouTube Premium Iraq,يوتيوب بدون اعلانات',
      longDescription: `## YouTube Premium في العراق — يوتيوب بلا إعلانات للأبد

**YouTube Premium** يحول تجربة يوتيوب كاملاً — بدون إعلانات مزعجة ومع مميزات لا تجدها في النسخة المجانية.

### مميزات YouTube Premium

- **صفر إعلانات** — على كل الفيديوهات بدون استثناء
- **التشغيل في الخلفية** — استمع لليوتيوب وهاتفك مقفل
- **YouTube Music Premium** — مشمول مجاناً بنفس الاشتراك
- **تحميل الفيديوهات** — للمشاهدة بدون إنترنت
- **YouTube Originals** — محتوى حصري من يوتيوب
- **جودة 4K بدون قيود** — في كل الفيديوهات`,
      features: [
        { title: 'صفر إعلانات', description: 'استمتع بكل فيديو بدون أي إعلان', icon: '🚫' },
        { title: 'تشغيل خلفية', description: 'استمع لليوتيوب وهاتفك مقفل', icon: '🔒' },
        { title: 'YouTube Music', description: 'مشمول مجاناً — بديل Spotify القوي', icon: '🎵' },
        { title: 'تحميل الفيديو', description: 'احفظ فيديوهاتك المفضلة للمشاهدة أوفلاين', icon: '⬇️' },
        { title: 'جودة 4K', description: 'مشاهدة بأعلى جودة بدون قيود', icon: '📺' },
        { title: 'الأجهزة المتعددة', description: 'على كل أجهزتك — هاتف وتلفزيون وكمبيوتر', icon: '📱' },
      ],
      faqs: [
        { question: 'هل YouTube Premium يشمل YouTube Music؟', answer: 'نعم، YouTube Premium يشمل YouTube Music Premium تلقائياً بدون رسوم إضافية.' },
        { question: 'هل يعمل على التلفزيون الذكي؟', answer: 'نعم، يعمل على Smart TV عبر تطبيق YouTube وعلى كل الأجهزة الأخرى.' },
        { question: 'هل يمكن مشاركته مع العائلة؟', answer: 'الاشتراك الفردي لشخص واحد. تواصل معنا لمعرفة خيارات العائلة.' },
      ],
    },

    // ════════════════════════════════════════════════════════════════
    // PRODUCTIVITY
    // ════════════════════════════════════════════════════════════════
    {
      name:           'Notion Plus + AI — اشتراك سنة',
      slug:           'notion-plus-ai-1year',
      categoryId:     catProductivity.id,
      price:          45,
      comparePrice:   60,
      stock:          999,
      isFeatured:     false,
      images:         ['https://placehold.co/600x600/000000/ffffff?text=Notion+Plus+AI'],
      imageAlts:      ['اشتراك Notion Plus AI سنة في العراق — Quvenza'],
      description:    'Notion Plus مع AI لسنة كاملة. مساحة غير محدودة + Notion AI لكتابة المحتوى وتلخيص الملفات.',
      metaTitle:      'Notion Plus AI سنة — إنتاجية ذكية | العراق',
      metaDescription:'Notion Plus + AI سنة بـ 70,000 د.ع في العراق. مساحة غير محدودة + Notion AI. تفعيل فوري.',
      metaKeywords:   'Notion Plus العراق,Notion AI عراق,Notion Iraq,تنظيم العمل AI,إنتاجية عراق',
      longDescription: `## Notion Plus + AI في العراق — أذكى مساحة عمل

**Notion Plus** مع قدرات **Notion AI** هو أفضل أداة لتنظيم حياتك المهنية والشخصية في مكان واحد.

### ما الذي يمنحك إياه Notion Plus + AI؟

- **مساحة عمل غير محدودة** — صفحات وقواعد بيانات بلا حد
- **Notion AI** — اكتب محتوى، لخص ملفات، ترجم، اشرح بالذكاء الاصطناعي
- **Synced Databases** — قواعد بيانات متزامنة بين المشاريع
- **Templates Library** — آلاف القوالب الجاهزة
- **API Access** — اربط Notion مع أدواتك الأخرى
- **Guest Collaboration** — شارك مع 100 ضيف

### أمثلة على استخدام Notion AI

- اكتب مقال بالعربية في 30 ثانية
- لخص اجتماعاً بالكامل بنقرة
- حول قائمة نقاط إلى نص متكامل
- ترجم محتوى بين العربية والإنجليزية`,
      features: [
        { title: 'Notion AI', description: 'اكتب ولخص وترجم باستخدام الذكاء الاصطناعي', icon: '🤖' },
        { title: 'مساحة غير محدودة', description: 'صفحات وقواعد بيانات بلا حد للمشتركين', icon: '♾️' },
        { title: 'تعاون الفريق', description: 'شارك مع 100 ضيف في نفس مساحة العمل', icon: '👥' },
        { title: 'API كامل', description: 'اربط Notion مع Zapier وMake والأدوات الأخرى', icon: '🔗' },
        { title: 'iOS وAndroid وWeb', description: 'وصول كامل من كل جهاز', icon: '📱' },
        { title: 'آلاف القوالب', description: 'قوالب جاهزة للمشاريع والعادات والدراسة', icon: '📋' },
      ],
      faqs: [
        { question: 'هل Notion AI يدعم العربية؟', answer: 'نعم، Notion AI يفهم ويكتب ويترجم بالعربية بشكل ممتاز.' },
        { question: 'هل يمكن استخدام Notion مع الفريق؟', answer: 'نعم، Plus يسمح بمشاركة مساحة العمل مع حتى 100 ضيف.' },
        { question: 'هل البيانات محمية وخاصة؟', answer: 'نعم، Notion تستخدم تشفيراً كاملاً لحماية بياناتك.' },
      ],
    },

    {
      name:           'LinkedIn Premium — اشتراك شهرين',
      slug:           'linkedin-premium-2months',
      categoryId:     catProductivity.id,
      price:          52,
      comparePrice:   65,
      stock:          999,
      isFeatured:     false,
      images:         ['https://placehold.co/600x600/0077b5/ffffff?text=LinkedIn+Premium'],
      imageAlts:      ['اشتراك LinkedIn Premium شهرين في العراق — Quvenza'],
      description:    'LinkedIn Premium Career لشهرين. InMail، رؤية من شاهد ملفك، كورسات LinkedIn Learning مجانية.',
      metaTitle:      'LinkedIn Premium شهرين — اشتراك في العراق',
      metaDescription:'LinkedIn Premium شهرين بـ 80,000 د.ع في العراق. InMail + رؤية الزوار + LinkedIn Learning. تفعيل فوري.',
      metaKeywords:   'LinkedIn Premium العراق,لينكدان بريميوم عراق,LinkedIn Iraq,InMail عراق,وظائف عراق',
      longDescription: `## LinkedIn Premium في العراق — ميزتك في سوق العمل

**LinkedIn Premium Career** يمنحك أدوات لا تقدر بثمن لإيجاد وظيفة أحلامك أو تطوير شبكة علاقاتك المهنية.

### مميزات LinkedIn Premium Career

- **InMail Credits** — تواصل مع أي شخص بدون الانتظار
- **من شاهد ملفك؟** — رؤية كل من زار ملفك في آخر 90 يوم
- **AI Resume Assistant** — تحسين سيرتك الذاتية بالذكاء الاصطناعي
- **LinkedIn Learning** — 16,000+ كورس مجاني مشمول
- **Job Insights** — معلومات مخفية عن فرص العمل
- **Open Profile** — يمكن لأي شخص التواصل معك`,
      features: [
        { title: 'InMail Credits', description: 'تواصل مع أي مسؤول توظيف أو قائد في العالم', icon: '✉️' },
        { title: 'من زار ملفك', description: 'رؤية اسم كل شخص زار ملفك في 90 يوم', icon: '👁️' },
        { title: 'AI Resume', description: 'تحسين سيرتك الذاتية بالذكاء الاصطناعي', icon: '📄' },
        { title: 'LinkedIn Learning', description: '16,000+ كورس في التقنية والأعمال والإبداع', icon: '📚' },
        { title: 'Job Insights', description: 'ارتبك بالنسبة للمتقدمين الآخرين ونصائح للنجاح', icon: '💼' },
        { title: 'Open Profile', description: 'يسمح لكل الناس بالتواصل معك بدون InMail', icon: '🌐' },
      ],
      faqs: [
        { question: 'ما الفرق بين LinkedIn Premium Career وBusiness؟', answer: 'Career مخصص للباحثين عن عمل. Business مخصص لأصحاب الأعمال. نوفر Career هنا.' },
        { question: 'كم InMail Credits تحصل عليها؟', answer: 'مع Premium Career تحصل على 5 InMail Credits شهرياً.' },
        { question: 'هل LinkedIn Learning مشمول كاملاً؟', answer: 'نعم، تحصل على وصول كامل لمكتبة LinkedIn Learning التي تحتوي 16,000+ كورس.' },
      ],
    },

    {
      name:           'Grammarly Premium — اشتراك سنة',
      slug:           'grammarly-premium-1year',
      categoryId:     catProductivity.id,
      price:          42,
      comparePrice:   55,
      stock:          999,
      isFeatured:     false,
      images:         ['https://placehold.co/600x600/15c39a/ffffff?text=Grammarly+Premium'],
      imageAlts:      ['اشتراك Grammarly Premium سنة في العراق — Quvenza'],
      description:    'Grammarly Premium سنة كاملة. تصحيح القواعد، الأسلوب، وضوح الكتابة بالذكاء الاصطناعي للإنجليزية.',
      metaTitle:      'Grammarly Premium سنة — كتابة إنجليزية مثالية | العراق',
      metaDescription:'Grammarly Premium سنة بـ 65,000 د.ع في العراق. AI كتابة إنجليزية + تصحيح كامل. تفعيل فوري.',
      metaKeywords:   'Grammarly Premium العراق,Grammarly Iraq,تصحيح الإنجليزية عراق,AI كتابة عراق',
      longDescription: `## Grammarly Premium في العراق — لا أخطاء إنجليزية بعد الآن

**Grammarly Premium** هو المساعد الذكي الذي يجعل كتابتك بالإنجليزية احترافية ومتقنة في كل الأوقات.

### ما يميز Grammarly Premium؟

- **تصحيح القواعد المتقدم** — يفهم السياق ويصحح المعنى لا الحروف فقط
- **تحسين الوضوح والأسلوب** — تحويل الجمل المعقدة لأسلوب بسيط ومؤثر
- **Grammarly AI** — اكتب جمل كاملة أو أعد صياغة فقرات
- **كشف الانتحال** — تحقق من أصالة النصوص
- **tone detection** — تعرف على النبرة المناسبة للرسالة
- **يعمل في كل مكان** — Chrome, Gmail, Word, Google Docs

### مثالي للعراقيين الذين يكتبون بالإنجليزية

طلاب الجامعات، المقدمون للوظائف الأجنبية، المطورون البرمجيون، كتّاب المحتوى الإنجليزي.`,
      features: [
        { title: 'تصحيح متقدم', description: 'يصحح القواعد والأسلوب والوضوح بفهم السياق', icon: '✅' },
        { title: 'Grammarly AI', description: 'اكتب وأعد الصياغة باستخدام الذكاء الاصطناعي', icon: '🤖' },
        { title: 'كشف الانتحال', description: 'تحقق من أصالة النصوص وتجنب الانتحال', icon: '🔍' },
        { title: 'كل الأجهزة', description: 'Chrome + Word + Gmail + Google Docs + Mobile', icon: '💻' },
        { title: 'اقتراحات الأسلوب', description: 'تحسين النبرة والوضوح حسب الجمهور المستهدف', icon: '🎯' },
        { title: 'تحليل الكتابة', description: 'تقرير أسبوعي عن تقدمك في الكتابة', icon: '📊' },
      ],
      faqs: [
        { question: 'هل Grammarly يعمل مع العربية؟', answer: 'Grammarly متخصص للإنجليزية فقط حالياً. لا يدعم العربية.' },
        { question: 'هل يعمل مع Word وGmail؟', answer: 'نعم، يعمل كامتداد Chrome وتطبيق Windows/Mac مع كل برامج الكتابة.' },
        { question: 'هل كشف الانتحال مشمول؟', answer: 'نعم، Grammarly Premium يشمل فحص الانتحال بشكل كامل.' },
      ],
    },

    {
      name:           'Microsoft 365 Personal — اشتراك سنة',
      slug:           'microsoft-365-personal-1year',
      categoryId:     catProductivity.id,
      price:          58,
      comparePrice:   75,
      stock:          999,
      isFeatured:     false,
      images:         ['https://placehold.co/600x600/d83b01/ffffff?text=Microsoft+365'],
      imageAlts:      ['اشتراك Microsoft 365 Personal سنة في العراق — Quvenza'],
      description:    'Microsoft 365 Personal سنة كاملة. Word + Excel + PowerPoint + Outlook + 1TB OneDrive.',
      metaTitle:      'Microsoft 365 Personal سنة — Office كامل | العراق',
      metaDescription:'Microsoft 365 سنة بـ 90,000 د.ع في العراق. Word+Excel+PowerPoint+1TB OneDrive. تفعيل فوري.',
      metaKeywords:   'Microsoft 365 العراق,Office 365 عراق,Word Excel PowerPoint,Microsoft Iraq,OneDrive عراق',
      longDescription: `## Microsoft 365 Personal في العراق — Office الكامل لسنة

**Microsoft 365 Personal** يمنحك النسخة الكاملة والمحدّثة من Office على كل أجهزتك مع مساحة OneDrive ضخمة.

### ما يشمله Microsoft 365 Personal

- **Word** — معالجة النصوص الأفضل في العالم
- **Excel** — جداول وتحليل بيانات احترافي
- **PowerPoint** — عروض تقديمية مؤثرة
- **Outlook** — إدارة البريد الإلكتروني
- **OneNote** — ملاحظات ذكية متزامنة
- **Teams** — اجتماعات واتصالات
- **1 تيرابايت OneDrive** — تخزين سحابي آمن
- **Copilot AI** — الذكاء الاصطناعي المدمج في Office

### لماذا Microsoft 365 أفضل من Office المشترى مرة واحدة؟

التحديثات المستمرة، OneDrive 1TB، الوصول من كل الأجهزة، وMicrosoft Copilot AI المدمج.`,
      features: [
        { title: 'Office الكامل', description: 'Word + Excel + PowerPoint + Outlook + OneNote + Teams', icon: '💼' },
        { title: '1TB OneDrive', description: 'تخزين سحابي آمن ومزامنة تلقائية', icon: '☁️' },
        { title: 'Copilot AI', description: 'ذكاء اصطناعي مدمج في كل تطبيقات Office', icon: '🤖' },
        { title: '5 أجهزة', description: 'فعّل على PC وMac وiOS وAndroid في وقت واحد', icon: '📱' },
        { title: 'تحديثات مجانية', description: 'دائماً آخر إصدار بدون رسوم إضافية', icon: '🔄' },
        { title: 'دعم عربي كامل', description: 'Word وExcel يدعمان RTL والعربية الكاملة', icon: '🌍' },
      ],
      faqs: [
        { question: 'هل Microsoft 365 يعمل في العراق؟', answer: 'نعم، يعمل بالكامل في العراق على Windows وMac وiOS وAndroid.' },
        { question: 'ما الفرق بين Microsoft 365 وOffice 2024 الدائم؟', answer: '365 يتضمن تحديثات مستمرة + OneDrive 1TB + Copilot AI. Office الدائم لا تحديثات بعد الشراء.' },
        { question: 'هل يمكن تفعيله على MacBook؟', answer: 'نعم، Microsoft 365 يدعم Mac بالكامل مع تطبيقات مخصصة لـ macOS.' },
      ],
    },

    // ════════════════════════════════════════════════════════════════
    // GAMING ACCOUNTS
    // ════════════════════════════════════════════════════════════════
    {
      name:           'حساب Steam — باقة مبتدئ',
      slug:           'steam-starter',
      categoryId:     catGaming.id,
      price:          22,
      comparePrice:   32,
      stock:          50,
      isFeatured:     false,
      images:         ['https://placehold.co/600x600/1b2838/ffffff?text=Steam+Starter'],
      imageAlts:      ['حساب Steam مبتدئ في العراق — Quvenza'],
      description:    'حساب Steam جاهز بـ 10 ألعاب شائعة. مثالي للمبتدئين في عالم الألعاب PC بالعراق.',
      metaTitle:      'حساب Steam مبتدئ — 10 ألعاب PC | العراق',
      metaDescription:'حساب Steam مبتدئ بـ 35,000 د.ع. 10 ألعاب شائعة جاهزة للتشغيل. تسليم فوري في العراق.',
      metaKeywords:   'حساب Steam العراق,Steam Iraq,شراء حساب Steam,ألعاب PC العراق,Steam مبتدئ',
      longDescription: `## حساب Steam مبتدئ في العراق

احصل على حساب **Steam** جاهز مع 10 ألعاب شائعة جاهزة للتشغيل فوراً.

### ما يشمله الحساب

- 10 ألعاب PC شائعة مثبتة مسبقاً
- حساب Steam بمستوى لائق
- بريد إلكتروني مرتبط يُسلَّم مع الحساب
- ضمان عمل الحساب لمدة 30 يوماً

### ملاحظة هامة

هذا حساب جاهز وليس اشتراكاً. تحصل على بيانات دخول كاملة.`,
      features: [
        { title: '10 ألعاب شائعة', description: 'ألعاب PC شهيرة جاهزة للتحميل والتشغيل', icon: '🎮' },
        { title: 'تسليم فوري', description: 'بيانات الحساب تصل لبريدك خلال 30 دقيقة', icon: '⚡' },
        { title: 'ضمان 30 يوم', description: 'إذا واجهت مشكلة نحلها أو نستبدل الحساب', icon: '🛡️' },
        { title: 'بريد إلكتروني', description: 'بريد مرتبط بالحساب يُسلَّم معه', icon: '📧' },
        { title: 'يعمل في العراق', description: 'حساب مفعل ويعمل بالكامل من العراق', icon: '🇮🇶' },
        { title: 'دعم كامل', description: 'فريقنا يساعدك في أي مشكلة تقنية', icon: '🎧' },
      ],
      faqs: [
        { question: 'هل يمكنني تغيير اسم المستخدم؟', answer: 'يمكنك تغيير الاسم المعروض (Display Name) لكن Username الأساسي لا يتغير.' },
        { question: 'هل الحسابات آمنة؟', answer: 'نوفر حسابات بضمان 30 يوماً. نصيحتنا: غيّر كلمة المرور فور الاستلام.' },
        { question: 'ما الألعاب الموجودة في الحساب؟', answer: 'قائمة الألعاب تختلف حسب التوافر. نخبرك بالألعاب الموجودة قبل إتمام الطلب.' },
      ],
    },

    {
      name:           'حساب Steam — باقة بريميوم',
      slug:           'steam-premium',
      categoryId:     catGaming.id,
      price:          42,
      comparePrice:   60,
      stock:          30,
      isFeatured:     false,
      images:         ['https://placehold.co/600x600/1b2838/c7d5e0?text=Steam+Premium'],
      imageAlts:      ['حساب Steam بريميوم في العراق — Quvenza'],
      description:    'حساب Steam بريميوم بـ 25+ لعبة شهيرة. مستوى Steam عالي، ساعات لعب، شارات.',
      metaTitle:      'حساب Steam بريميوم — 25+ لعبة | العراق',
      metaDescription:'حساب Steam بريميوم بـ 65,000 د.ع. 25+ لعبة شهيرة + مستوى عالي + شارات. تسليم فوري.',
      metaKeywords:   'حساب Steam بريميوم العراق,Steam premium Iraq,ألعاب Steam شهيرة عراق,حسابات steam',
      longDescription: `## حساب Steam بريميوم في العراق

حساب **Steam بريميوم** يمنحك مكتبة ألعاب ضخمة مع تاريخ لعب حقيقي ومستوى Steam مرتفع.

### ما يميز الحساب البريميوم

- **25+ لعبة شهيرة** — ألعاب AAA وإندي مشهورة
- **مستوى Steam مرتفع** — يعكس تاريخ لعب حقيقي
- **ساعات لعب** — حساب نشط وموثوق
- **شارات وإنجازات** — تاريخ لعب حقيقي
- **ضمان 30 يوماً** — استبدال أو حل المشاكل

### ملاحظة

هذا حساب جاهز. تحصل على بيانات الدخول الكاملة.`,
      features: [
        { title: '25+ لعبة شهيرة', description: 'مكتبة ضخمة من ألعاب AAA والإندي', icon: '🎮' },
        { title: 'مستوى Steam عالي', description: 'حساب بتاريخ لعب حقيقي وشارات', icon: '⭐' },
        { title: 'ساعات لعب حقيقية', description: 'تاريخ لعب يعكس نشاطاً حقيقياً', icon: '⏱️' },
        { title: 'ضمان 30 يوم', description: 'نضمن عمل الحساب لمدة 30 يوماً', icon: '🛡️' },
        { title: 'تسليم فوري', description: 'بيانات الدخول خلال 30 دقيقة من الدفع', icon: '⚡' },
        { title: 'دعم تقني', description: 'مساعدة في أي مشكلة تقنية', icon: '🎧' },
      ],
      faqs: [
        { question: 'هل يمكنني إضافة ألعاب جديدة للحساب؟', answer: 'نعم، يمكنك شراء ألعاب جديدة وإضافتها للحساب بشكل طبيعي.' },
        { question: 'هل ساعات اللعب حقيقية؟', answer: 'نعم، جميع ساعات اللعب حقيقية ومكتسبة بشكل طبيعي.' },
        { question: 'هل الألعاب مرتبطة بمنطقة معينة؟', answer: 'معظم الألعاب تعمل من العراق بدون قيود. نخبرك إذا كان هناك قيد على لعبة معينة.' },
      ],
    },

    // ════════════════════════════════════════════════════════════════
    // GAMING COINS
    // ════════════════════════════════════════════════════════════════
    {
      name:           'EA FC 26 — نسخة Standard',
      slug:           'ea-fc-26-standard',
      categoryId:     catGaming.id,
      price:          49,
      comparePrice:   65,
      stock:          100,
      isFeatured:     false,
      images:         ['https://placehold.co/600x600/ff6a2b/000000?text=EA+FC+26'],
      imageAlts:      ['EA FC 26 Standard في العراق — Quvenza'],
      description:    'EA FC 26 نسخة Standard للـ PC أو PlayStation أو Xbox. أحدث لعبة كرة قدم من EA Sports.',
      metaTitle:      'EA FC 26 Standard — شراء في العراق | Quvenza',
      metaDescription:'EA FC 26 Standard بـ 75,000 د.ع في العراق. PC/PS/Xbox. تسليم الكود فورياً بعد الدفع.',
      metaKeywords:   'EA FC 26 العراق,FIFA 26 Iraq,شراء EA FC عراق,كرة قدم PS5 عراق,FC 26 Iraq',
      longDescription: `## EA FC 26 في العراق — أحدث لعبة كرة قدم

**EA FC 26** (المعروفة سابقاً بـ FIFA) هي أحدث لعبة كرة قدم من EA Sports تجمع كل الدوريات والأندية العالمية.

### ما يشمله EA FC 26 Standard

- وصول كامل لكل أوضاع اللعبة
- Ultimate Team (FUT) ابدأ بناء فريق الأحلام
- Career Mode — قد ناديك للبطولة
- Pro Clubs — العب مع أصدقائك
- Volta Football — كرة قدم شارع
- محدّث بأحدث التشكيلات والإحصائيات

### المنصات المتاحة

PC (EA App/Steam) — PlayStation 4/5 — Xbox One/Series X|S`,
      features: [
        { title: 'كل أوضاع اللعبة', description: 'FUT + Career Mode + Pro Clubs + Volta Football', icon: '⚽' },
        { title: 'كل الدوريات', description: 'Premier League + La Liga + Serie A + Saudi Pro League', icon: '🏆' },
        { title: 'Ultimate Team', description: 'ابنِ فريق أحلامك من أفضل اللاعبين', icon: '⭐' },
        { title: 'PC وPlayStation وXbox', description: 'متاح لكل المنصات الرئيسية', icon: '🎮' },
        { title: 'تحديثات موسمية', description: 'تحديثات مستمرة طوال الموسم', icon: '🔄' },
        { title: 'تسليم كود فوري', description: 'كود التفعيل يصل لبريدك خلال 30 دقيقة', icon: '⚡' },
      ],
      faqs: [
        { question: 'هل EA FC 26 يعمل في العراق؟', answer: 'نعم، اللعبة تعمل بالكامل في العراق على كل المنصات.' },
        { question: 'ما المنصات المتاحة؟', answer: 'PC (EA App) + PS4/PS5 + Xbox One/Series X|S. حدد منصتك عند الطلب.' },
        { question: 'كيف يصلني الكود؟', answer: 'كود التفعيل يُرسل لبريدك الإلكتروني خلال 30 دقيقة من إتمام الدفع.' },
        { question: 'هل يشمل Ultimate Team Points؟', answer: 'النسخة Standard لا تشمل FUT Points. للعروض المتضمنة للنقاط تواصل معنا.' },
      ],
    },

    {
      name:           'EA FC 26 — عملات Ultimate Team 500K',
      slug:           'ea-fc-26-coins-500k',
      categoryId:     catCoins.id,
      price:          16,
      comparePrice:   22,
      stock:          999,
      isFeatured:     false,
      images:         ['https://placehold.co/600x600/ffd700/000000?text=FUT+Coins+500K'],
      imageAlts:      ['عملات EA FC 26 Ultimate Team 500K في العراق — Quvenza'],
      description:    'عملات EA FC Ultimate Team 500,000. ابنِ فريق أحلامك بسرعة. تسليم آمن خلال 30 دقيقة.',
      metaTitle:      'عملات EA FC 26 Ultimate Team 500K | العراق',
      metaDescription:'عملات EA FC 26 FUT 500K بـ 25,000 د.ع في العراق. تسليم آمن وسريع خلال 30 دقيقة.',
      metaKeywords:   'عملات EA FC 26 عراق,FUT Coins Iraq,FIFA Coins عراق,Ultimate Team عملات,FC 26 Coins',
      longDescription: `## عملات EA FC 26 Ultimate Team في العراق

احصل على **500,000 عملة FUT** لبناء فريق Ultimate Team من أفضل اللاعبين في العالم.

### طريقة التسليم الآمنة

نستخدم طريقة التسليم الأكثر أماناً لحماية حسابك:
1. تتواصل معنا عبر الواتساب بعد الدفع
2. نرشدك خطوة بخطوة لاستلام العملات بأمان
3. العملات تصل لحسابك خلال 30 دقيقة

### لماذا تشتري عملات FUT؟

بدلاً من إنفاق أسابيع في تجميع العملات، احصل عليها فوراً وابنِ الفريق الذي تحلم به.`,
      features: [
        { title: '500,000 عملة FUT', description: 'كافية لشراء لاعبين نجوم عالميين', icon: '💰' },
        { title: 'تسليم آمن', description: 'طريقة تسليم مضمونة لحماية حسابك', icon: '🛡️' },
        { title: 'خلال 30 دقيقة', description: 'العملات تصل سريعاً بعد التواصل معنا', icon: '⚡' },
        { title: 'PC وPS وXbox', description: 'متاح لكل المنصات', icon: '🎮' },
        { title: 'دعم واتساب', description: 'نرشدك خطوة بخطوة أثناء التسليم', icon: '📱' },
        { title: 'ضمان الاستلام', description: 'إذا لم تصل العملات نعيد لك المبلغ', icon: '✅' },
      ],
      faqs: [
        { question: 'هل شراء العملات آمن؟', answer: 'نستخدم طريقة تسليم آمنة تحمي حسابك. اتبع تعليماتنا بالضبط وستكون بأمان.' },
        { question: 'ما المنصة المتاحة؟', answer: 'متاح لـ PC وPlayStation وXbox. حدد منصتك عند الطلب.' },
        { question: 'كيف تصلني العملات؟', answer: 'بعد الدفع، تواصل معنا على الواتساب وسنرشدك خلال عملية التسليم الآمنة.' },
        { question: 'هل هناك ضمان؟', answer: 'نعم، إذا لم تصل العملات كاملة لأي سبب نعيد لك المبلغ بالكامل.' },
      ],
    },

  ]; // end products array

  for (const p of products) {
    await prisma.product.create({
      data: {
        name:           p.name,
        slug:           p.slug,
        description:    p.description,
        price:          p.price,
        comparePrice:   p.comparePrice ?? null,
        stock:          p.stock,
        images:         p.images,
        imageAlts:      p.imageAlts,
        isActive:       true,
        isFeatured:     p.isFeatured,
        categoryId:     p.categoryId,
        metaTitle:      p.metaTitle,
        metaDescription:p.metaDescription,
        metaKeywords:   p.metaKeywords,
        longDescription:p.longDescription,
        features:       p.features,
        faqs:           p.faqs,
        viewCount:      Math.floor(Math.random() * 500),
        salesCount:     Math.floor(Math.random() * 100),
      },
    });
    process.stdout.write(`   ✓ ${p.name}\n`);
  }

  // ── Sample order ─────────────────────────────────────────────────
  const chatgpt = await prisma.product.findUnique({ where: { slug: 'chatgpt-plus-4months' } });
  if (chatgpt) {
    await prisma.order.create({
      data: {
        userId:        customer.id,
        status:        'DELIVERED',
        total:         65,
        paymentMethod: 'zaincash',
        paymentStatus: 'PAID',
        shippingAddress: {
          fullName: 'عميل تجريبي',
          phone:    '+964 770 000 0000',
          city:     'بغداد',
          address:  'شارع المتنبي، بغداد',
          country:  'Iraq',
        },
        items: {
          create: [{ productId: chatgpt.id, quantity: 1, price: 95000 }],
        },
      },
    });
  }

  console.log('\n✅ Seed complete:');
  console.log('   Admin    → admin@quvenzaiq.com / Admin@2026!');
  console.log('   Customer → customer@quvenzaiq.com / Customer@2026!');
  console.log('   Categories: 8');
  console.log(`   Products:   ${products.length}`);
  console.log('   Orders:     1');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
