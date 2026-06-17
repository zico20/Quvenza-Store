const BASE = 'https://quvenzaiq.com';
const ORG_ID = `${BASE}/#organization`;

export interface ProductSchemaInput {
  name: string;
  slug: string;
  description: string;
  price: number | string;
  comparePrice?: number | string | null;
  images: string[];
  stock: number;
  category?: { name: string; slug: string } | null;
  rating?: { value: number; count: number } | null;
  brandName?: string;
}

export interface FAQItem { question: string; answer: string }
export interface BreadcrumbItem { name: string; url: string }

// ── 1. Organization (enriched for AI knowledge graph) ────────────
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'OnlineStore'],
    '@id': ORG_ID,
    name: 'Quvenza',
    alternateName: ['كوفينزا', 'Quvenza Iraq', 'quvenza'],
    url: BASE,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE}/logo.png`,
      width: 512,
      height: 512,
    },
    image: `${BASE}/og-image.svg`,
    description: 'متجر عراقي متخصص ببيع الإلكترونيات الأصلية في العراق — هواتف، لابتوبات، أجهزة لوحية وسماعات من أشهر الماركات العالمية. تأسس في بغداد عام 2026.',
    foundingDate: '2026',
    founder: {
      '@type': 'Organization',
      '@id': 'https://quvenzaiq.com/#organization',
      name: 'QuvenzaIq',
      alternateName: 'quvenza',
      url: 'https://quvenzaiq.com',
      logo: 'https://quvenzaiq.com/logo.jpeg',
      description: 'شركة برمجة عراقية متخصصة في تطوير المواقع والمتاجر الإلكترونية وأنظمة ERP/CRM',
      foundingDate: '2013',
      foundingLocation: {
        '@type': 'Place',
        name: 'Baghdad, Iraq',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Baghdad',
          addressCountry: 'IQ',
        },
      },
      knowsAbout: [
        'Web Development Iraq',
        'E-Commerce Development Baghdad',
        'ERP Systems Iraq',
        'Mobile App Development Iraq',
        'Custom Admin Systems Iraq',
        'Software Development Baghdad',
      ],
      sameAs: [
        'https://www.facebook.com/profile.php?id=61577521469419',
        'https://www.instagram.com/quvenza/',
        'https://www.linkedin.com/company/quvenza/',
        'https://www.wikidata.org/wiki/Q139558058',
      ],
    },
    parentOrganization: {
      '@type': 'Organization',
      '@id': 'https://quvenzaiq.com/#organization',
      name: 'QuvenzaIq',
      url: 'https://quvenzaiq.com',
    },
    creator: {
      '@type': 'Organization',
      '@id': 'https://quvenzaiq.com/#organization',
      name: 'QuvenzaIq',
      url: 'https://quvenzaiq.com',
    },
    foundingLocation: {
      '@type': 'Place',
      name: 'Baghdad, Iraq',
      address: { '@type': 'PostalAddress', addressCountry: 'IQ', addressLocality: 'Baghdad' },
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IQ',
      addressLocality: 'Baghdad',
      addressRegion: 'Baghdad',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 33.3152, longitude: 44.3661 },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+9647700000000',
        contactType: 'customer service',
        areaServed: 'IQ',
        availableLanguage: ['Arabic', 'English'],
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday'],
          opens: '00:00', closes: '23:59',
        },
      },
    ],
    sameAs: [
      'https://www.facebook.com/quvenza',
      'https://www.instagram.com/quvenza',
      'https://t.me/quvenza',
    ],
    // E-E-A-T & knowledge graph hints
    knowsAbout: [
      'Smartphones in Iraq', 'Apple iPhone Iraq', 'Samsung Galaxy Iraq',
      'Laptops Iraq', 'MacBook Iraq', 'Gaming laptops Iraq',
      'Wireless headphones Iraq', 'AirPods Iraq', 'Tablets iPad Iraq',
      'Consumer electronics Baghdad', 'Original electronics warranty Iraq',
      'ZainCash payments', 'AsiaHawala payments', 'FastPay Iraq',
      'Cash on delivery', 'Iraqi Dinar pricing', 'Iraq e-commerce',
      'Baghdad online shopping',
    ],
    audience: {
      '@type': 'Audience',
      audienceType: 'Iraqi consumers, students, content creators, designers, professionals',
      geographicArea: { '@type': 'Country', name: 'Iraq' },
    },
    areaServed: [
      { '@type': 'Country', name: 'Iraq' },
      { '@type': 'AdministrativeArea', name: 'Baghdad Governorate' },
      { '@type': 'AdministrativeArea', name: 'Basra Governorate' },
      { '@type': 'AdministrativeArea', name: 'Erbil Governorate' },
      { '@type': 'AdministrativeArea', name: 'Mosul Governorate' },
      { '@type': 'AdministrativeArea', name: 'Najaf Governorate' },
    ],
    brand: { '@type': 'Brand', name: 'Quvenza', slogan: 'إلكترونيات أصلية بأسعار عراقية' },
    paymentAccepted: ['Cash on Delivery', 'ZainCash', 'AsiaHawala', 'FastPay'],
    currenciesAccepted: 'IQD',
    priceRange: '$$',
  };
}

// ── 2. WebSite + SearchAction ─────────────────────────────────────
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE}/#website`,
    url: BASE,
    name: 'Quvenza',
    description: 'متجر الإلكترونيات في العراق',
    inLanguage: 'ar-IQ',
    publisher: { '@id': ORG_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${BASE}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

// ── 3. Product ────────────────────────────────────────────────────
export function productSchema(p: ProductSchemaInput) {
  const price = Number(p.price).toFixed(2);
  const priceValidUntil = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    image: p.images.map(img => img.startsWith('http') ? img : `${BASE}${img}`),
    sku: p.slug,
    url: `${BASE}/products/${p.slug}`,
    brand: { '@type': 'Brand', name: p.brandName || 'Quvenza' },
    ...(p.category && { category: p.category.name }),
    offers: {
      '@type': 'Offer',
      url: `${BASE}/products/${p.slug}`,
      priceCurrency: 'IQD',
      price,
      priceValidUntil,
      availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': ORG_ID },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IQ',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: 0, currency: 'IQD' },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'IQ' },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'HUR' },
        },
      },
    },
  };

  if (p.rating && p.rating.count > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: p.rating.value,
      reviewCount: p.rating.count,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
}

// ── 4. BreadcrumbList ─────────────────────────────────────────────
export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ── 5. FAQPage ────────────────────────────────────────────────────
export function faqSchema(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

// ── 6. Article ────────────────────────────────────────────────────
export function articleSchema(a: {
  title: string; description: string; image: string;
  publishedAt: string; updatedAt: string; slug: string; authorName: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    image: a.image.startsWith('http') ? a.image : `${BASE}${a.image}`,
    datePublished: a.publishedAt,
    dateModified: a.updatedAt,
    author: { '@type': 'Person', name: a.authorName },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE}/blog/${a.slug}` },
  };
}

// ── 7. LocalBusiness (Iraq) ───────────────────────────────────────
export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Store'],
    '@id': `${BASE}/#localbusiness`,
    name: 'Quvenza',
    alternateName: 'كوفينزا',
    description: 'متجر عراقي متخصص ببيع الإلكترونيات الأصلية — هواتف، لابتوبات، أجهزة لوحية وسماعات من أشهر الماركات.',
    url: BASE,
    logo: `${BASE}/logo.png`,
    image: `${BASE}/og-image.svg`,
    telephone: '+9647700000000',
    email: 'support@quvenzaiq.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'بغداد',
      addressLocality: 'Baghdad',
      addressRegion: 'Baghdad',
      addressCountry: 'IQ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 33.3152,
      longitude: 44.3661,
    },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '09:00', closes: '24:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Friday', 'Saturday'], opens: '11:00', closes: '22:00' },
    ],
    paymentAccepted: 'Cash on Delivery, ZainCash, AsiaHawala, FastPay',
    currenciesAccepted: 'IQD',
    priceRange: '$$',
    areaServed: { '@type': 'Country', name: 'Iraq' },
    sameAs: [`${BASE}`],
  };
}

// ── 8. ItemList (product collection for category/listing pages) ────
// (kept in place — see below for HowTo/Speakable additions)

// ── 9. HowTo (for Google AI Overviews + voice search) ────────────
export interface HowToStep {
  name: string;
  text: string;
  image?: string;
  url?: string;
}

export function howToSchema(input: {
  name: string;
  description: string;
  totalTime?: string;
  estimatedCost?: { value: number; currency: string };
  supply?: string[];
  tool?: string[];
  steps: HowToStep[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: input.name,
    description: input.description,
    inLanguage: 'ar-IQ',
    ...(input.totalTime && { totalTime: input.totalTime }),
    ...(input.estimatedCost && {
      estimatedCost: {
        '@type': 'MonetaryAmount',
        currency: input.estimatedCost.currency,
        value: input.estimatedCost.value,
      },
    }),
    ...(input.supply && {
      supply: input.supply.map((s) => ({ '@type': 'HowToSupply', name: s })),
    }),
    ...(input.tool && {
      tool: input.tool.map((t) => ({ '@type': 'HowToTool', name: t })),
    }),
    step: input.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
      ...(step.url && { url: step.url }),
    })),
  };
}

// ── 10. Speakable (voice search / smart speakers) ─────────────────
export function speakableSpec(cssSelectors: string[] = ['h1', '.lead-paragraph', '.faq-answer']) {
  return {
    '@type': 'SpeakableSpecification',
    cssSelector: cssSelectors,
  };
}

// Older declaration moved here to preserve order ──────────────────
// ── 8. ItemList
export function productListSchema(
  products: Array<{ name: string; slug: string; price: number | string; images?: string[] }>,
  listName: string,
  listUrl: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    url: listUrl,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE}/products/${p.slug}`,
      name: p.name,
      image: p.images?.[0] ?? `${BASE}/og-image.svg`,
    })),
  };
}

// ── Default FAQs per product (Arabic) ────────────────────────────
export function getDefaultFAQs(productName: string): FAQItem[] {
  return [
    {
      question: `هل ${productName} أصلي 100%؟`,
      answer: `نعم، ${productName} أصلي 100% ومستورد من الوكيل الرسمي مع ضمان رسمي معتمد. جميع منتجات Quvenza جديدة وأصلية وليست مقلدة.`,
    },
    {
      question: `كم يستغرق توصيل ${productName}؟`,
      answer: `توصيل سريع لكل المحافظات العراقية — عادةً خلال 1 إلى 3 أيام عمل. التوصيل داخل بغداد قد يتم في نفس اليوم أو اليوم التالي.`,
    },
    {
      question: 'هل أحتاج فيزا أو بطاقة ائتمانية؟',
      answer: 'لا. نقبل الدفع بالدينار العراقي عبر زين كاش، آسيا حوالة، فاست باي، أو كاش عند الاستلام (الدفع عند الاستلام) في كل المحافظات.',
    },
    {
      question: `هل يأتي ${productName} مع ضمان رسمي؟`,
      answer: 'نعم، المنتج مشمول بضمان رسمي معتمد يغطي عيوب التصنيع. يتم تفعيل الضمان عند الاستلام، ويمكنك مراجعتنا في أي وقت خلال فترة الضمان.',
    },
    {
      question: 'هل يمكنني الإرجاع أو الاستبدال إذا واجهت مشكلة؟',
      answer: 'نعم، يمكنك الإرجاع أو الاستبدال خلال 7 أيام من الاستلام إذا كان المنتج بحالته الأصلية أو في حال وجود عيب مصنعي، مع استرجاع المبلغ أو استبدال المنتج.',
    },
    {
      question: `هل ${productName} جديد ومغلق بالكرتون الأصلي؟`,
      answer: 'نعم، المنتج جديد تماماً ومغلق بالكرتون الأصلي (Sealed) ولم يُفتح من قبل، ويأتي بكامل ملحقاته الأصلية من الشركة المصنّعة.',
    },
    {
      question: 'هل يوجد دعم وخدمة ما بعد البيع؟',
      answer: 'نعم، فريق دعمنا متاح عبر واتساب وتيليجرام لمساعدتك في الإعداد والاستخدام وأي استفسار بعد البيع، بالإضافة إلى متابعة طلبات الضمان والصيانة.',
    },
  ];
}
