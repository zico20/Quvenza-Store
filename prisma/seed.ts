/**
 * Quvenza — Premium Physical Electronics Store seed.
 *
 * Catalog: Apple, Samsung, Sony, Dell, HP, Lenovo, Asus, Bose, JBL, Sennheiser.
 * Each brand has one or more device-type categories (phones / laptops / tablets /
 * headphones), each category holds real device models, and each model has 2-4
 * variants (storage·color / RAM·storage / color). Bilingual (EN + AR) content.
 *
 * Run:
 *   npx tsx prisma/seed.ts
 */
import { PrismaClient, DeviceKind } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ── Types ──────────────────────────────────────────────────────────────────
type PhoneSpecs = { screen: string; chip: string; camera: string; battery: string; os: string };
type LaptopSpecs = { cpu: string; ram: string; storage: string; screen: string; gpu: string };
type TabletSpecs = { screen: string; chip: string; storage: string; battery: string; os: string };
type HeadphoneSpecs = { type: string; anc: string; batteryLife: string; connectivity: string };
type Specs = PhoneSpecs | LaptopSpecs | TabletSpecs | HeadphoneSpecs;

interface Feature {
  title: string;
  description: string;
  icon?: string;
}
interface Faq {
  question: string;
  answer: string;
}

interface VariantInput {
  name: string;
  nameAr?: string;
  sku: string;
  storage?: string;
  color?: string;
  colorHex?: string;
  ram?: string;
  price: number;
  comparePrice?: number;
  stock: number;
  isDefault?: boolean;
}

interface ProductInput {
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  descriptionAr: string;
  comparePrice?: number;
  rating: number;
  isFeatured?: boolean;
  specs: Specs;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  longDescription: string;
  features: Feature[];
  faqs: Faq[];
  variants: VariantInput[];
}

// ── Helpers ────────────────────────────────────────────────────────────────
const img = (model: string, i = 1) =>
  `https://placehold.co/800x800/EEE/111?text=${encodeURIComponent(`${model} ${i}`)}`;

const images = (model: string, count = 4) =>
  Array.from({ length: count }, (_, i) => img(model, i + 1));

const imageAlts = (modelEn: string, modelAr: string, count = 4) =>
  Array.from({ length: count }, (_, i) =>
    i === 0 ? `${modelEn} — ${modelAr} | Quvenza` : `${modelEn} — صورة ${i + 1}`,
  );

const kebab = (s: string) =>
  s
    .toLowerCase()
    .replace(/['’"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Builds Product create-data (with nested variants) from a ProductInput.
function buildProduct(p: ProductInput, brandId: string, categoryId: string) {
  const minPrice = Math.min(...p.variants.map((v) => v.price));
  const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
  const flagged = p.variants.filter((v) => v.isDefault);
  // Exactly one default — fall back to the first variant if none/many flagged.
  const defaultSku = flagged.length === 1 ? flagged[0].sku : p.variants[0].sku;

  return {
    name: p.name,
    nameAr: p.nameAr,
    slug: p.slug,
    description: p.description,
    descriptionAr: p.descriptionAr,
    price: minPrice,
    comparePrice: p.comparePrice,
    stock: totalStock,
    images: images(p.name),
    imageAlts: imageAlts(p.name, p.nameAr),
    isActive: true,
    isFeatured: p.isFeatured ?? false,
    rating: p.rating,
    brandId,
    categoryId,
    specs: p.specs as unknown as object,
    metaTitle: p.metaTitle.slice(0, 70),
    metaDescription: p.metaDescription.slice(0, 170),
    metaKeywords: p.metaKeywords,
    longDescription: p.longDescription,
    features: p.features as unknown as object,
    faqs: p.faqs as unknown as object,
    variants: {
      create: p.variants.map((v) => ({
        name: v.name,
        nameAr: v.nameAr,
        sku: v.sku,
        storage: v.storage,
        color: v.color,
        colorHex: v.colorHex,
        ram: v.ram,
        price: v.price,
        comparePrice: v.comparePrice,
        stock: v.stock,
        image: img(`${p.name} ${v.color ?? v.storage ?? v.ram ?? ''}`.trim()),
        isDefault: v.sku === defaultSku,
      })),
    },
  };
}

// ── Reusable bilingual content blocks ────────────────────────────────────────
const phoneFeatures = (modelAr: string): Feature[] => [
  { title: 'Brilliant Display', description: `شاشة مذهلة بألوان حية ودقة عالية على ${modelAr}.`, icon: 'phone' },
  { title: 'Pro Camera System', description: 'نظام كاميرا احترافي لصور وفيديو بجودة استثنائية.', icon: 'camera' },
  { title: 'All-Day Battery', description: 'بطارية تدوم طوال اليوم مع دعم الشحن السريع.', icon: 'battery' },
];

const phoneFaqs = (modelAr: string): Faq[] => [
  { question: `هل ${modelAr} أصلي وبضمان؟`, answer: 'نعم، جميع أجهزتنا أصلية 100% وتأتي بضمان رسمي.' },
  { question: 'هل التوصيل متاح لكل محافظات العراق؟', answer: 'نعم، نوصل لجميع المحافظات مع إمكانية الدفع عند الاستلام في بغداد.' },
  { question: 'هل يدعم الجهاز اللغة العربية؟', answer: 'نعم، يدعم العربية بالكامل مع لوحة مفاتيح عربية وواجهة RTL.' },
];

const laptopFeatures = (modelAr: string): Feature[] => [
  { title: 'Powerful Performance', description: `أداء قوي يلبي احتياجات العمل والإبداع على ${modelAr}.`, icon: 'laptop' },
  { title: 'Stunning Display', description: 'شاشة عالية الدقة بألوان دقيقة مثالية للتصميم والترفيه.', icon: 'monitor' },
  { title: 'Long Battery Life', description: 'بطارية تدوم لساعات طويلة من الإنتاجية المتنقلة.', icon: 'battery' },
];

const laptopFaqs = (modelAr: string): Faq[] => [
  { question: `هل ${modelAr} مناسب للألعاب والتصميم؟`, answer: 'يعتمد على الموديل، لكن جميع أجهزتنا مذكورة مواصفاتها بدقة لتختار الأنسب لك.' },
  { question: 'هل يأتي اللابتوب بضمان؟', answer: 'نعم، جميع اللابتوبات أصلية وبضمان رسمي.' },
  { question: 'هل النظام مثبّت مسبقاً؟', answer: 'نعم، يأتي الجهاز بنظام تشغيل أصلي مثبّت وجاهز للاستخدام.' },
];

const tabletFeatures = (modelAr: string): Feature[] => [
  { title: 'Immersive Display', description: `شاشة غامرة بألوان نابضة مثالية للمحتوى على ${modelAr}.`, icon: 'tablet' },
  { title: 'Powerful Chip', description: 'معالج قوي يتعامل مع تعدد المهام والتطبيقات الثقيلة بسلاسة.', icon: 'cpu' },
  { title: 'Portable & Light', description: 'تصميم نحيف وخفيف يرافقك أينما ذهبت.', icon: 'feather' },
];

const tabletFaqs = (modelAr: string): Faq[] => [
  { question: `هل يدعم ${modelAr} القلم الإلكتروني؟`, answer: 'معظم الأجهزة اللوحية المتقدمة لدينا تدعم القلم — راجع المواصفات لكل موديل.' },
  { question: 'هل الجهاز اللوحي يدعم شرائح الاتصال؟', answer: 'تتوفر إصدارات Wi-Fi وأخرى بدعم الشريحة (Cellular) حسب الموديل.' },
  { question: 'هل يأتي بضمان رسمي؟', answer: 'نعم، جميع الأجهزة أصلية وبضمان رسمي.' },
];

const headphoneFeatures = (modelAr: string): Feature[] => [
  { title: 'Premium Sound', description: `صوت نقي وغني بتفاصيل عالية على ${modelAr}.`, icon: 'headphones' },
  { title: 'Active Noise Cancelling', description: 'إلغاء ضوضاء نشط يعزلك عن العالم ويغمرك بالموسيقى.', icon: 'volume' },
  { title: 'Long Battery Life', description: 'ساعات طويلة من الاستماع المتواصل مع شحن سريع.', icon: 'battery' },
];

const headphoneFaqs = (modelAr: string): Faq[] => [
  { question: `هل ${modelAr} يدعم البلوتوث؟`, answer: 'نعم، جميع السماعات اللاسلكية لدينا تدعم بلوتوث مستقر مع اتصال متعدد الأجهزة.' },
  { question: 'هل تعمل السماعة مع الآيفون والأندرويد؟', answer: 'نعم، تعمل مع iOS وAndroid وأجهزة الكمبيوتر بسلاسة.' },
  { question: 'هل تأتي بضمان؟', answer: 'نعم، جميع السماعات أصلية وبضمان رسمي.' },
];

// SEO helper to keep meta strings consistent (truncated to schema limits later).
const meta = (en: string, ar: string, kind: string) => ({
  metaTitle: `${en} — ${kind} | Quvenza`,
  metaDescription: `اشترِ ${ar} (${en}) الأصلي في العراق من Quvenza. ضمان رسمي وتوصيل لكل المحافظات.`,
  metaKeywords: `${en} العراق,${ar} عراق,${en} Iraq,شراء ${ar},${en} price Iraq,Quvenza`,
});

const longDesc = (en: string, ar: string) =>
  `## ${ar} (${en})\n\n` +
  `**${en}** متوفر الآن في العراق من Quvenza بسعر منافس وضمان رسمي. ` +
  `جهاز أصلي 100% مع توصيل سريع لجميع المحافظات وإمكانية الدفع عند الاستلام في بغداد.\n\n` +
  `### لماذا تشتري من Quvenza؟\n\n` +
  `- منتجات أصلية بضمان رسمي\n- أسعار تنافسية بالدينار العراقي\n- توصيل لكل محافظات العراق\n- دعم فني ومتابعة بعد البيع`;

// ── Shared color swatches ────────────────────────────────────────────────────
const COLORS = {
  black: '#1C1C1E',
  white: '#F5F5F7',
  silver: '#D5D8DC',
  graphite: '#54524F',
  gold: '#F4E8CE',
  blue: '#3B5C92',
  green: '#3C5A4B',
  pink: '#F2C4CE',
  purple: '#6E5A8E',
  red: '#C1232A',
  titaniumNatural: '#C2BCB2',
  titaniumBlue: '#3D4C5C',
  titaniumDesert: '#BFA48F',
  spaceGray: '#4A4A4C',
  midnight: '#1F2430',
  starlight: '#EDE6D9',
} as const;

// ── Per-model factory helpers (cut boilerplate) ──────────────────────────────
function phone(opts: {
  name: string; nameAr: string; slug: string; rating: number; featured?: boolean;
  specs: PhoneSpecs; variants: VariantInput[]; comparePrice?: number;
}): ProductInput {
  return {
    name: opts.name, nameAr: opts.nameAr, slug: opts.slug,
    description: `${opts.name} — هاتف ذكي بمواصفات رائدة وأداء متميز.`,
    descriptionAr: `${opts.nameAr} هاتف ذكي بأداء رائد، كاميرا احترافية وشاشة مذهلة.`,
    comparePrice: opts.comparePrice, rating: opts.rating, isFeatured: opts.featured,
    specs: opts.specs, ...meta(opts.name, opts.nameAr, 'هاتف ذكي'),
    longDescription: longDesc(opts.name, opts.nameAr),
    features: phoneFeatures(opts.nameAr), faqs: phoneFaqs(opts.nameAr), variants: opts.variants,
  };
}

function laptop(opts: {
  name: string; nameAr: string; slug: string; rating: number; featured?: boolean;
  specs: LaptopSpecs; variants: VariantInput[]; comparePrice?: number;
}): ProductInput {
  return {
    name: opts.name, nameAr: opts.nameAr, slug: opts.slug,
    description: `${opts.name} — لابتوب بأداء قوي وتصميم أنيق للعمل والإبداع.`,
    descriptionAr: `${opts.nameAr} لابتوب بأداء قوي، شاشة عالية الدقة وبطارية تدوم طويلاً.`,
    comparePrice: opts.comparePrice, rating: opts.rating, isFeatured: opts.featured,
    specs: opts.specs, ...meta(opts.name, opts.nameAr, 'لابتوب'),
    longDescription: longDesc(opts.name, opts.nameAr),
    features: laptopFeatures(opts.nameAr), faqs: laptopFaqs(opts.nameAr), variants: opts.variants,
  };
}

function tablet(opts: {
  name: string; nameAr: string; slug: string; rating: number; featured?: boolean;
  specs: TabletSpecs; variants: VariantInput[]; comparePrice?: number;
}): ProductInput {
  return {
    name: opts.name, nameAr: opts.nameAr, slug: opts.slug,
    description: `${opts.name} — جهاز لوحي بشاشة غامرة ومعالج قوي.`,
    descriptionAr: `${opts.nameAr} جهاز لوحي بشاشة غامرة، أداء قوي وتصميم خفيف ومحمول.`,
    comparePrice: opts.comparePrice, rating: opts.rating, isFeatured: opts.featured,
    specs: opts.specs, ...meta(opts.name, opts.nameAr, 'جهاز لوحي'),
    longDescription: longDesc(opts.name, opts.nameAr),
    features: tabletFeatures(opts.nameAr), faqs: tabletFaqs(opts.nameAr), variants: opts.variants,
  };
}

function headphone(opts: {
  name: string; nameAr: string; slug: string; rating: number; featured?: boolean;
  specs: HeadphoneSpecs; variants: VariantInput[]; comparePrice?: number;
}): ProductInput {
  return {
    name: opts.name, nameAr: opts.nameAr, slug: opts.slug,
    description: `${opts.name} — سماعة بصوت نقي وإلغاء ضوضاء متقدم.`,
    descriptionAr: `${opts.nameAr} سماعة بصوت نقي، إلغاء ضوضاء متقدم وبطارية تدوم طويلاً.`,
    comparePrice: opts.comparePrice, rating: opts.rating, isFeatured: opts.featured,
    specs: opts.specs, ...meta(opts.name, opts.nameAr, 'سماعة'),
    longDescription: longDesc(opts.name, opts.nameAr),
    features: headphoneFeatures(opts.nameAr), faqs: headphoneFaqs(opts.nameAr), variants: opts.variants,
  };
}

// variant builders: storage+color (sv), ram+storage (rv), color only (cv)
const sv = (
  sku: string, storage: string, color: string, colorHex: string,
  price: number, stock: number, isDefault = false, comparePrice?: number,
): VariantInput => ({
  name: `${storage} · ${color}`, nameAr: `${storage} · ${color}`,
  sku, storage, color, colorHex, price, comparePrice, stock, isDefault,
});

const rv = (
  sku: string, ram: string, storage: string,
  price: number, stock: number, isDefault = false, comparePrice?: number,
): VariantInput => ({
  name: `${ram} · ${storage}`, nameAr: `${ram} · ${storage}`,
  sku, ram, storage, price, comparePrice, stock, isDefault,
});

const cv = (
  sku: string, color: string, colorHex: string,
  price: number, stock: number, isDefault = false, comparePrice?: number,
): VariantInput => ({
  name: color, nameAr: color, sku, color, colorHex, price, comparePrice, stock, isDefault,
});

// ── Catalog structure ────────────────────────────────────────────────────────
interface CatalogCategory {
  name: string; nameAr: string; kind: DeviceKind; icon: string; products: ProductInput[];
}
interface CatalogBrand {
  name: string; nameAr: string; description: string; isFeatured?: boolean; categories: CatalogCategory[];
}

const CATALOG: CatalogBrand[] = [
  // ════════════════════════════ APPLE ════════════════════════════
  {
    name: 'Apple', nameAr: 'آبل', isFeatured: true,
    description: 'Apple — أجهزة آيفون وآيباد وماك وإيربودز الأصلية بضمان رسمي في العراق.',
    categories: [
      {
        name: 'Apple iPhones', nameAr: 'آيفون آبل', kind: 'PHONE', icon: 'phone',
        products: [
          phone({
            name: 'iPhone 13', nameAr: 'آيفون 13', slug: 'apple-iphone-13', rating: 4.6,
            specs: { screen: '6.1" OLED 60Hz', chip: 'A15 Bionic', camera: '12MP Dual', battery: '3240mAh', os: 'iOS 18' },
            variants: [
              sv('APL-IP13-128-MID', '128GB', 'Midnight', COLORS.midnight, 549, 18, true),
              sv('APL-IP13-256-MID', '256GB', 'Midnight', COLORS.midnight, 629, 12),
              sv('APL-IP13-128-BLU', '128GB', 'Blue', COLORS.blue, 549, 9),
            ],
          }),
          phone({
            name: 'iPhone 14', nameAr: 'آيفون 14', slug: 'apple-iphone-14', rating: 4.7,
            specs: { screen: '6.1" OLED 60Hz', chip: 'A15 Bionic', camera: '12MP Dual', battery: '3279mAh', os: 'iOS 18' },
            variants: [
              sv('APL-IP14-128-MID', '128GB', 'Midnight', COLORS.midnight, 649, 16, true),
              sv('APL-IP14-256-PUR', '256GB', 'Purple', COLORS.purple, 729, 10),
              sv('APL-IP14-128-STR', '128GB', 'Starlight', COLORS.starlight, 649, 11),
            ],
          }),
          phone({
            name: 'iPhone 15', nameAr: 'آيفون 15', slug: 'apple-iphone-15', rating: 4.8, featured: true,
            specs: { screen: '6.1" OLED 60Hz', chip: 'A16 Bionic', camera: '48MP Main', battery: '3349mAh', os: 'iOS 18' },
            variants: [
              sv('APL-IP15-128-BLK', '128GB', 'Black', COLORS.black, 799, 20, true),
              sv('APL-IP15-256-PNK', '256GB', 'Pink', COLORS.pink, 899, 14),
              sv('APL-IP15-256-BLU', '256GB', 'Blue', COLORS.blue, 899, 9),
            ],
          }),
          phone({
            name: 'iPhone 15 Pro', nameAr: 'آيفون 15 برو', slug: 'apple-iphone-15-pro', rating: 4.9, featured: true, comparePrice: 1099,
            specs: { screen: '6.1" OLED 120Hz', chip: 'A17 Pro', camera: '48MP Pro', battery: '3274mAh', os: 'iOS 18' },
            variants: [
              sv('APL-IP15P-256-NAT', '256GB', 'Natural Titanium', COLORS.titaniumNatural, 999, 15, true, 1099),
              sv('APL-IP15P-512-BLU', '512GB', 'Blue Titanium', COLORS.titaniumBlue, 1199, 8),
              sv('APL-IP15P-1TB-BLK', '1TB', 'Black Titanium', COLORS.black, 1399, 5),
            ],
          }),
          phone({
            name: 'iPhone 16', nameAr: 'آيفون 16', slug: 'apple-iphone-16', rating: 4.8, featured: true,
            specs: { screen: '6.1" OLED 60Hz', chip: 'A18', camera: '48MP Fusion', battery: '3561mAh', os: 'iOS 18' },
            variants: [
              sv('APL-IP16-128-ULT', '128GB', 'Ultramarine', COLORS.blue, 899, 17, true),
              sv('APL-IP16-256-TEA', '256GB', 'Teal', COLORS.green, 999, 11),
              sv('APL-IP16-256-BLK', '256GB', 'Black', COLORS.black, 999, 8),
            ],
          }),
          phone({
            name: 'iPhone 16 Pro', nameAr: 'آيفون 16 برو', slug: 'apple-iphone-16-pro', rating: 4.9, featured: true, comparePrice: 1199,
            specs: { screen: '6.3" OLED 120Hz', chip: 'A18 Pro', camera: '48MP Pro Fusion', battery: '3582mAh', os: 'iOS 18' },
            variants: [
              sv('APL-IP16P-256-DES', '256GB', 'Desert Titanium', COLORS.titaniumDesert, 1099, 13, true, 1199),
              sv('APL-IP16P-512-NAT', '512GB', 'Natural Titanium', COLORS.titaniumNatural, 1299, 7),
              sv('APL-IP16P-1TB-BLK', '1TB', 'Black Titanium', COLORS.black, 1499, 4),
            ],
          }),
        ],
      },
      {
        name: 'Apple iPads', nameAr: 'آيباد آبل', kind: 'TABLET', icon: 'tablet',
        products: [
          tablet({
            name: 'iPad 10th Gen', nameAr: 'آيباد الجيل العاشر', slug: 'apple-ipad-10th-gen', rating: 4.6,
            specs: { screen: '10.9" Liquid Retina', chip: 'A14 Bionic', storage: '64GB–256GB', battery: 'Up to 10h', os: 'iPadOS 18' },
            variants: [
              sv('APL-IPAD10-64-BLU', '64GB', 'Blue', COLORS.blue, 349, 14, true),
              sv('APL-IPAD10-256-SLV', '256GB', 'Silver', COLORS.silver, 499, 9),
            ],
          }),
          tablet({
            name: 'iPad Air', nameAr: 'آيباد آير', slug: 'apple-ipad-air', rating: 4.8, featured: true,
            specs: { screen: '11" Liquid Retina', chip: 'M2', storage: '128GB–1TB', battery: 'Up to 10h', os: 'iPadOS 18' },
            variants: [
              sv('APL-IPADAIR-128-BLU', '128GB', 'Blue', COLORS.blue, 599, 12, true),
              sv('APL-IPADAIR-256-PUR', '256GB', 'Purple', COLORS.purple, 699, 8),
              sv('APL-IPADAIR-512-STR', '512GB', 'Starlight', COLORS.starlight, 899, 5),
            ],
          }),
          tablet({
            name: 'iPad Pro 11"', nameAr: 'آيباد برو 11', slug: 'apple-ipad-pro-11', rating: 4.9, featured: true,
            specs: { screen: '11" Ultra Retina XDR', chip: 'M4', storage: '256GB–2TB', battery: 'Up to 10h', os: 'iPadOS 18' },
            variants: [
              sv('APL-IPADP11-256-SLV', '256GB', 'Silver', COLORS.silver, 999, 9, true),
              sv('APL-IPADP11-512-BLK', '512GB', 'Space Black', COLORS.spaceGray, 1199, 6),
            ],
          }),
          tablet({
            name: 'iPad Pro 13"', nameAr: 'آيباد برو 13', slug: 'apple-ipad-pro-13', rating: 4.9,
            specs: { screen: '13" Ultra Retina XDR', chip: 'M4', storage: '256GB–2TB', battery: 'Up to 10h', os: 'iPadOS 18' },
            variants: [
              sv('APL-IPADP13-256-SLV', '256GB', 'Silver', COLORS.silver, 1299, 7, true),
              sv('APL-IPADP13-512-BLK', '512GB', 'Space Black', COLORS.spaceGray, 1499, 4),
            ],
          }),
          tablet({
            name: 'iPad mini', nameAr: 'آيباد ميني', slug: 'apple-ipad-mini', rating: 4.7,
            specs: { screen: '8.3" Liquid Retina', chip: 'A17 Pro', storage: '128GB–512GB', battery: 'Up to 10h', os: 'iPadOS 18' },
            variants: [
              sv('APL-IPADMINI-128-SPC', '128GB', 'Space Gray', COLORS.spaceGray, 499, 11, true),
              sv('APL-IPADMINI-256-PUR', '256GB', 'Purple', COLORS.purple, 599, 6),
            ],
          }),
        ],
      },
      {
        name: 'Apple MacBooks', nameAr: 'ماك بوك آبل', kind: 'LAPTOP', icon: 'laptop',
        products: [
          laptop({
            name: 'MacBook Air M2', nameAr: 'ماك بوك آير M2', slug: 'apple-macbook-air-m2', rating: 4.8, featured: true,
            specs: { cpu: 'Apple M2 8-core', ram: '8GB–24GB', storage: '256GB–2TB', screen: '13.6" Liquid Retina', gpu: 'M2 10-core GPU' },
            variants: [
              rv('APL-MBA-M2-8-256', '8GB', '256GB SSD', 999, 10, true, 1099),
              rv('APL-MBA-M2-16-512', '16GB', '512GB SSD', 1299, 6),
            ],
          }),
          laptop({
            name: 'MacBook Air M3', nameAr: 'ماك بوك آير M3', slug: 'apple-macbook-air-m3', rating: 4.9, featured: true,
            specs: { cpu: 'Apple M3 8-core', ram: '8GB–24GB', storage: '256GB–2TB', screen: '13.6" Liquid Retina', gpu: 'M3 10-core GPU' },
            variants: [
              rv('APL-MBA-M3-8-256', '8GB', '256GB SSD', 1099, 9, true),
              rv('APL-MBA-M3-16-512', '16GB', '512GB SSD', 1499, 5),
            ],
          }),
          laptop({
            name: 'MacBook Pro 14" M3', nameAr: 'ماك بوك برو 14 M3', slug: 'apple-macbook-pro-14-m3', rating: 4.9, featured: true,
            specs: { cpu: 'Apple M3 Pro', ram: '18GB–36GB', storage: '512GB–4TB', screen: '14.2" Liquid Retina XDR', gpu: 'M3 Pro 18-core GPU' },
            variants: [
              rv('APL-MBP14-M3-18-512', '18GB', '512GB SSD', 1999, 6, true),
              rv('APL-MBP14-M3-36-1TB', '36GB', '1TB SSD', 2499, 3),
            ],
          }),
          laptop({
            name: 'MacBook Pro 16" M3', nameAr: 'ماك بوك برو 16 M3', slug: 'apple-macbook-pro-16-m3', rating: 4.9,
            specs: { cpu: 'Apple M3 Max', ram: '36GB–128GB', storage: '1TB–8TB', screen: '16.2" Liquid Retina XDR', gpu: 'M3 Max 40-core GPU' },
            variants: [
              rv('APL-MBP16-M3-36-1TB', '36GB', '1TB SSD', 3499, 4, true),
              rv('APL-MBP16-M3-48-1TB', '48GB', '1TB SSD', 3999, 2),
            ],
          }),
          laptop({
            name: 'MacBook Pro 14" M4', nameAr: 'ماك بوك برو 14 M4', slug: 'apple-macbook-pro-14-m4', rating: 4.9, featured: true,
            specs: { cpu: 'Apple M4 Pro', ram: '24GB–48GB', storage: '512GB–4TB', screen: '14.2" Liquid Retina XDR', gpu: 'M4 Pro 20-core GPU' },
            variants: [
              rv('APL-MBP14-M4-24-512', '24GB', '512GB SSD', 1999, 7, true),
              rv('APL-MBP14-M4-48-1TB', '48GB', '1TB SSD', 2799, 3),
            ],
          }),
        ],
      },
      {
        name: 'Apple AirPods', nameAr: 'إيربودز آبل', kind: 'HEADPHONE', icon: 'headphones',
        products: [
          headphone({
            name: 'AirPods 3', nameAr: 'إيربودز 3', slug: 'apple-airpods-3', rating: 4.6,
            specs: { type: 'In-ear (open-fit)', anc: 'No', batteryLife: 'Up to 30h (with case)', connectivity: 'Bluetooth 5.0' },
            variants: [cv('APL-APODS3-WHT', 'White', COLORS.white, 169, 20, true, 199)],
          }),
          headphone({
            name: 'AirPods 4', nameAr: 'إيربودز 4', slug: 'apple-airpods-4', rating: 4.7, featured: true,
            specs: { type: 'In-ear (open-fit)', anc: 'Optional ANC model', batteryLife: 'Up to 30h (with case)', connectivity: 'Bluetooth 5.3' },
            variants: [cv('APL-APODS4-WHT', 'White', COLORS.white, 179, 18, true)],
          }),
          headphone({
            name: 'AirPods Pro 2', nameAr: 'إيربودز برو 2', slug: 'apple-airpods-pro-2', rating: 4.9, featured: true, comparePrice: 279,
            specs: { type: 'In-ear', anc: 'Active Noise Cancellation', batteryLife: 'Up to 30h (with case)', connectivity: 'Bluetooth 5.3' },
            variants: [cv('APL-APODSP2-WHT', 'White', COLORS.white, 249, 22, true, 279)],
          }),
          headphone({
            name: 'AirPods Max', nameAr: 'إيربودز ماكس', slug: 'apple-airpods-max', rating: 4.7,
            specs: { type: 'Over-ear', anc: 'Active Noise Cancellation', batteryLife: 'Up to 20h', connectivity: 'Bluetooth 5.0' },
            variants: [
              cv('APL-APODSMAX-SLV', 'Silver', COLORS.silver, 549, 8, true),
              cv('APL-APODSMAX-MID', 'Midnight', COLORS.midnight, 549, 6),
            ],
          }),
        ],
      },
    ],
  },

  // ════════════════════════════ SAMSUNG ════════════════════════════
  {
    name: 'Samsung', nameAr: 'سامسونج', isFeatured: true,
    description: 'Samsung — هواتف Galaxy وأجهزة لوحية وسماعات بمواصفات رائدة وضمان رسمي.',
    categories: [
      {
        name: 'Samsung Phones', nameAr: 'هواتف سامسونج', kind: 'PHONE', icon: 'phone',
        products: [
          phone({
            name: 'Galaxy S23', nameAr: 'جالاكسي S23', slug: 'samsung-galaxy-s23', rating: 4.6,
            specs: { screen: '6.1" AMOLED 120Hz', chip: 'Snapdragon 8 Gen 2', camera: '50MP Triple', battery: '3900mAh', os: 'Android 14' },
            variants: [
              sv('SAM-S23-128-PHM', '128GB', 'Phantom Black', COLORS.black, 699, 14, true),
              sv('SAM-S23-256-GRN', '256GB', 'Green', COLORS.green, 759, 9),
            ],
          }),
          phone({
            name: 'Galaxy S24', nameAr: 'جالاكسي S24', slug: 'samsung-galaxy-s24', rating: 4.7, featured: true,
            specs: { screen: '6.2" AMOLED 120Hz', chip: 'Snapdragon 8 Gen 3', camera: '50MP Triple', battery: '4000mAh', os: 'Android 14' },
            variants: [
              sv('SAM-S24-128-ONX', '128GB', 'Onyx Black', COLORS.black, 799, 15, true),
              sv('SAM-S24-256-MAR', '256GB', 'Marble Gray', COLORS.silver, 859, 10),
              sv('SAM-S24-256-VIO', '256GB', 'Cobalt Violet', COLORS.purple, 859, 7),
            ],
          }),
          phone({
            name: 'Galaxy S24 Ultra', nameAr: 'جالاكسي S24 ألترا', slug: 'samsung-galaxy-s24-ultra', rating: 4.9, featured: true, comparePrice: 1399,
            specs: { screen: '6.8" AMOLED 120Hz', chip: 'Snapdragon 8 Gen 3', camera: '200MP Quad', battery: '5000mAh', os: 'Android 14' },
            variants: [
              sv('SAM-S24U-256-TBK', '256GB', 'Titanium Black', COLORS.black, 1299, 12, true, 1399),
              sv('SAM-S24U-512-TGR', '512GB', 'Titanium Gray', COLORS.graphite, 1419, 6),
              sv('SAM-S24U-1TB-TVI', '1TB', 'Titanium Violet', COLORS.purple, 1659, 3),
            ],
          }),
          phone({
            name: 'Galaxy S25', nameAr: 'جالاكسي S25', slug: 'samsung-galaxy-s25', rating: 4.8, featured: true,
            specs: { screen: '6.2" AMOLED 120Hz', chip: 'Snapdragon 8 Elite', camera: '50MP Triple', battery: '4000mAh', os: 'Android 15' },
            variants: [
              sv('SAM-S25-128-SLB', '128GB', 'Silver Shadow', COLORS.silver, 849, 13, true),
              sv('SAM-S25-256-NAV', '256GB', 'Navy', COLORS.blue, 909, 8),
            ],
          }),
          phone({
            name: 'Galaxy S25 Ultra', nameAr: 'جالاكسي S25 ألترا', slug: 'samsung-galaxy-s25-ultra', rating: 4.9, featured: true, comparePrice: 1499,
            specs: { screen: '6.9" AMOLED 120Hz', chip: 'Snapdragon 8 Elite', camera: '200MP Quad', battery: '5000mAh', os: 'Android 15' },
            variants: [
              sv('SAM-S25U-256-TSB', '256GB', 'Titanium Silverblue', COLORS.titaniumBlue, 1399, 10, true, 1499),
              sv('SAM-S25U-512-TBK', '512GB', 'Titanium Black', COLORS.black, 1519, 5),
            ],
          }),
          phone({
            name: 'Galaxy A55', nameAr: 'جالاكسي A55', slug: 'samsung-galaxy-a55', rating: 4.4,
            specs: { screen: '6.6" AMOLED 120Hz', chip: 'Exynos 1480', camera: '50MP Triple', battery: '5000mAh', os: 'Android 14' },
            variants: [
              sv('SAM-A55-128-NVY', '128GB', 'Awesome Navy', COLORS.blue, 399, 22, true),
              sv('SAM-A55-256-ICE', '256GB', 'Awesome Iceblue', COLORS.silver, 449, 14),
            ],
          }),
        ],
      },
      {
        name: 'Samsung Tablets', nameAr: 'أجهزة سامسونج اللوحية', kind: 'TABLET', icon: 'tablet',
        products: [
          tablet({
            name: 'Galaxy Tab S9', nameAr: 'جالاكسي تاب S9', slug: 'samsung-galaxy-tab-s9', rating: 4.7, featured: true,
            specs: { screen: '11" Dynamic AMOLED 2X', chip: 'Snapdragon 8 Gen 2', storage: '128GB–256GB', battery: '8400mAh', os: 'Android 14' },
            variants: [
              sv('SAM-TABS9-128-GPH', '128GB', 'Graphite', COLORS.graphite, 799, 9, true),
              sv('SAM-TABS9-256-BGE', '256GB', 'Beige', COLORS.gold, 899, 5),
            ],
          }),
          tablet({
            name: 'Galaxy Tab S9 Ultra', nameAr: 'جالاكسي تاب S9 ألترا', slug: 'samsung-galaxy-tab-s9-ultra', rating: 4.8,
            specs: { screen: '14.6" Dynamic AMOLED 2X', chip: 'Snapdragon 8 Gen 2', storage: '256GB–1TB', battery: '11200mAh', os: 'Android 14' },
            variants: [
              sv('SAM-TABS9U-256-GPH', '256GB', 'Graphite', COLORS.graphite, 1199, 6, true),
              sv('SAM-TABS9U-512-BGE', '512GB', 'Beige', COLORS.gold, 1399, 3),
            ],
          }),
          tablet({
            name: 'Galaxy Tab S10', nameAr: 'جالاكسي تاب S10', slug: 'samsung-galaxy-tab-s10', rating: 4.8, featured: true,
            specs: { screen: '12.4" Dynamic AMOLED 2X', chip: 'Dimensity 9300+', storage: '256GB–512GB', battery: '10090mAh', os: 'Android 14' },
            variants: [
              sv('SAM-TABS10-256-GRY', '256GB', 'Moonstone Gray', COLORS.silver, 999, 7, true),
              sv('SAM-TABS10-512-SLV', '512GB', 'Platinum Silver', COLORS.silver, 1149, 4),
            ],
          }),
          tablet({
            name: 'Galaxy Tab A9', nameAr: 'جالاكسي تاب A9', slug: 'samsung-galaxy-tab-a9', rating: 4.3,
            specs: { screen: '8.7" TFT LCD', chip: 'Helio G99', storage: '64GB–128GB', battery: '5100mAh', os: 'Android 13' },
            variants: [
              sv('SAM-TABA9-64-GRY', '64GB', 'Graphite', COLORS.graphite, 149, 24, true),
              sv('SAM-TABA9-128-SLV', '128GB', 'Silver', COLORS.silver, 189, 16),
            ],
          }),
        ],
      },
      {
        name: 'Samsung Headphones', nameAr: 'سماعات سامسونج', kind: 'HEADPHONE', icon: 'headphones',
        products: [
          headphone({
            name: 'Galaxy Buds2 Pro', nameAr: 'جالاكسي بدز2 برو', slug: 'samsung-galaxy-buds2-pro', rating: 4.6,
            specs: { type: 'In-ear', anc: 'Intelligent ANC', batteryLife: 'Up to 29h (with case)', connectivity: 'Bluetooth 5.3' },
            variants: [
              cv('SAM-BUDS2P-GPH', 'Graphite', COLORS.graphite, 199, 16, true, 229),
              cv('SAM-BUDS2P-WHT', 'White', COLORS.white, 199, 12),
            ],
          }),
          headphone({
            name: 'Galaxy Buds3', nameAr: 'جالاكسي بدز3', slug: 'samsung-galaxy-buds3', rating: 4.5,
            specs: { type: 'In-ear (stem)', anc: 'Active Noise Cancellation', batteryLife: 'Up to 24h (with case)', connectivity: 'Bluetooth 5.4' },
            variants: [cv('SAM-BUDS3-SLV', 'Silver', COLORS.silver, 179, 14, true)],
          }),
          headphone({
            name: 'Galaxy Buds3 Pro', nameAr: 'جالاكسي بدز3 برو', slug: 'samsung-galaxy-buds3-pro', rating: 4.7, featured: true,
            specs: { type: 'In-ear (stem)', anc: 'Adaptive ANC', batteryLife: 'Up to 26h (with case)', connectivity: 'Bluetooth 5.4' },
            variants: [cv('SAM-BUDS3P-SLV', 'Silver', COLORS.silver, 249, 11, true, 279)],
          }),
        ],
      },
    ],
  },

  // ════════════════════════════ SONY ════════════════════════════
  {
    name: 'Sony', nameAr: 'سوني', isFeatured: true,
    description: 'Sony — سماعات إلغاء ضوضاء رائدة وهواتف Xperia بجودة تصوير سينمائية.',
    categories: [
      {
        name: 'Sony Headphones', nameAr: 'سماعات سوني', kind: 'HEADPHONE', icon: 'headphones',
        products: [
          headphone({
            name: 'Sony WH-1000XM4', nameAr: 'سوني WH-1000XM4', slug: 'sony-wh-1000xm4', rating: 4.7,
            specs: { type: 'Over-ear', anc: 'Industry-leading ANC', batteryLife: 'Up to 30h', connectivity: 'Bluetooth 5.0' },
            variants: [
              cv('SNY-XM4-BLK', 'Black', COLORS.black, 279, 14, true, 349),
              cv('SNY-XM4-SLV', 'Silver', COLORS.silver, 279, 9),
            ],
          }),
          headphone({
            name: 'Sony WH-1000XM5', nameAr: 'سوني WH-1000XM5', slug: 'sony-wh-1000xm5', rating: 4.9, featured: true, comparePrice: 399,
            specs: { type: 'Over-ear', anc: 'Industry-leading ANC', batteryLife: 'Up to 30h', connectivity: 'Bluetooth 5.2' },
            variants: [
              cv('SNY-XM5-BLK', 'Black', COLORS.black, 349, 18, true, 399),
              cv('SNY-XM5-SLV', 'Silver', COLORS.silver, 349, 11),
              cv('SNY-XM5-MID', 'Midnight Blue', COLORS.blue, 349, 7),
            ],
          }),
          headphone({
            name: 'Sony WF-1000XM5', nameAr: 'سوني WF-1000XM5', slug: 'sony-wf-1000xm5', rating: 4.8, featured: true,
            specs: { type: 'In-ear', anc: 'Industry-leading ANC', batteryLife: 'Up to 24h (with case)', connectivity: 'Bluetooth 5.3' },
            variants: [
              cv('SNY-WF5-BLK', 'Black', COLORS.black, 279, 13, true),
              cv('SNY-WF5-SLV', 'Silver', COLORS.silver, 279, 8),
            ],
          }),
          headphone({
            name: 'Sony WH-CH720N', nameAr: 'سوني WH-CH720N', slug: 'sony-wh-ch720n', rating: 4.4,
            specs: { type: 'Over-ear', anc: 'Active Noise Cancellation', batteryLife: 'Up to 35h', connectivity: 'Bluetooth 5.2' },
            variants: [
              cv('SNY-CH720-BLK', 'Black', COLORS.black, 129, 20, true, 149),
              cv('SNY-CH720-WHT', 'White', COLORS.white, 129, 12),
            ],
          }),
          headphone({
            name: 'Sony ULT Wear', nameAr: 'سوني ULT وير', slug: 'sony-ult-wear', rating: 4.5,
            specs: { type: 'Over-ear', anc: 'Active Noise Cancellation', batteryLife: 'Up to 30h', connectivity: 'Bluetooth 5.2' },
            variants: [
              cv('SNY-ULT-BLK', 'Black', COLORS.black, 179, 15, true),
              cv('SNY-ULT-FOR', 'Forest Gray', COLORS.graphite, 179, 9),
            ],
          }),
        ],
      },
      {
        name: 'Sony Phones', nameAr: 'هواتف سوني', kind: 'PHONE', icon: 'phone',
        products: [
          phone({
            name: 'Xperia 1 V', nameAr: 'إكسبيريا 1 V', slug: 'sony-xperia-1-v', rating: 4.5,
            specs: { screen: '6.5" OLED 120Hz 4K', chip: 'Snapdragon 8 Gen 2', camera: '48MP Triple', battery: '5000mAh', os: 'Android 14' },
            variants: [
              sv('SNY-XP1V-256-BLK', '256GB', 'Black', COLORS.black, 1099, 6, true),
              sv('SNY-XP1V-512-PLT', '512GB', 'Platinum Silver', COLORS.silver, 1299, 3),
            ],
          }),
          phone({
            name: 'Xperia 5 V', nameAr: 'إكسبيريا 5 V', slug: 'sony-xperia-5-v', rating: 4.5,
            specs: { screen: '6.1" OLED 120Hz', chip: 'Snapdragon 8 Gen 2', camera: '48MP Dual', battery: '5000mAh', os: 'Android 14' },
            variants: [
              sv('SNY-XP5V-128-BLU', '128GB', 'Blue', COLORS.blue, 899, 7, true),
              sv('SNY-XP5V-256-BLK', '256GB', 'Black', COLORS.black, 999, 4),
            ],
          }),
          phone({
            name: 'Xperia 10 VI', nameAr: 'إكسبيريا 10 VI', slug: 'sony-xperia-10-vi', rating: 4.3,
            specs: { screen: '6.1" OLED 60Hz', chip: 'Snapdragon 6 Gen 1', camera: '48MP Dual', battery: '5000mAh', os: 'Android 14' },
            variants: [
              sv('SNY-XP10VI-128-BLK', '128GB', 'Black', COLORS.black, 449, 12, true),
              sv('SNY-XP10VI-128-BLU', '128GB', 'Blue', COLORS.blue, 449, 8),
            ],
          }),
        ],
      },
    ],
  },

  // ════════════════════════════ DELL ════════════════════════════
  {
    name: 'Dell', nameAr: 'ديل',
    description: 'Dell — لابتوبات XPS وInspiron وAlienware للأعمال والألعاب بأداء موثوق.',
    categories: [
      {
        name: 'Dell Laptops', nameAr: 'لابتوبات ديل', kind: 'LAPTOP', icon: 'laptop',
        products: [
          laptop({
            name: 'Dell XPS 13', nameAr: 'ديل XPS 13', slug: 'dell-xps-13', rating: 4.7, featured: true,
            specs: { cpu: 'Intel Core Ultra 7', ram: '16GB–32GB', storage: '512GB–1TB', screen: '13.4" FHD+', gpu: 'Intel Arc Graphics' },
            variants: [
              rv('DEL-XPS13-16-512', '16GB', '512GB SSD', 1199, 8, true, 1399),
              rv('DEL-XPS13-32-1TB', '32GB', '1TB SSD', 1599, 4),
            ],
          }),
          laptop({
            name: 'Dell XPS 15', nameAr: 'ديل XPS 15', slug: 'dell-xps-15', rating: 4.8,
            specs: { cpu: 'Intel Core Ultra 9', ram: '16GB–64GB', storage: '512GB–2TB', screen: '15.6" OLED 3.5K', gpu: 'NVIDIA RTX 4060' },
            variants: [
              rv('DEL-XPS15-16-512', '16GB', '512GB SSD', 1899, 5, true),
              rv('DEL-XPS15-32-1TB', '32GB', '1TB SSD', 2299, 3),
            ],
          }),
          laptop({
            name: 'Dell Inspiron 14', nameAr: 'ديل إنسبايرون 14', slug: 'dell-inspiron-14', rating: 4.3,
            specs: { cpu: 'Intel Core i5-1334U', ram: '8GB–16GB', storage: '512GB SSD', screen: '14" FHD+', gpu: 'Intel Iris Xe' },
            variants: [
              rv('DEL-INS14-8-512', '8GB', '512GB SSD', 649, 14, true),
              rv('DEL-INS14-16-512', '16GB', '512GB SSD', 749, 9),
            ],
          }),
          laptop({
            name: 'Dell Latitude 7440', nameAr: 'ديل لاتيتيود 7440', slug: 'dell-latitude-7440', rating: 4.5,
            specs: { cpu: 'Intel Core i7-1365U', ram: '16GB–32GB', storage: '512GB–1TB', screen: '14" FHD+', gpu: 'Intel Iris Xe' },
            variants: [
              rv('DEL-LAT7440-16-512', '16GB', '512GB SSD', 1299, 7, true),
              rv('DEL-LAT7440-32-1TB', '32GB', '1TB SSD', 1599, 4),
            ],
          }),
          laptop({
            name: 'Dell Alienware m16', nameAr: 'ديل ايلين وير m16', slug: 'dell-alienware-m16', rating: 4.7, featured: true,
            specs: { cpu: 'Intel Core i9-14900HX', ram: '32GB–64GB', storage: '1TB–2TB', screen: '16" QHD+ 240Hz', gpu: 'NVIDIA RTX 4080' },
            variants: [
              rv('DEL-AWM16-32-1TB', '32GB', '1TB SSD', 2599, 5, true),
              rv('DEL-AWM16-64-2TB', '64GB', '2TB SSD', 3299, 2),
            ],
          }),
          laptop({
            name: 'Dell G16', nameAr: 'ديل G16', slug: 'dell-g16', rating: 4.4,
            specs: { cpu: 'Intel Core i7-13650HX', ram: '16GB–32GB', storage: '1TB SSD', screen: '16" QHD+ 165Hz', gpu: 'NVIDIA RTX 4060' },
            variants: [
              rv('DEL-G16-16-1TB', '16GB', '1TB SSD', 1399, 9, true),
              rv('DEL-G16-32-1TB', '32GB', '1TB SSD', 1599, 5),
            ],
          }),
        ],
      },
    ],
  },

  // ════════════════════════════ HP ════════════════════════════
  {
    name: 'HP', nameAr: 'إتش بي',
    description: 'HP — لابتوبات Spectre وEnvy وOmen للأعمال والإبداع والألعاب.',
    categories: [
      {
        name: 'HP Laptops', nameAr: 'لابتوبات إتش بي', kind: 'LAPTOP', icon: 'laptop',
        products: [
          laptop({
            name: 'HP Spectre x360', nameAr: 'إتش بي سبيكتر x360', slug: 'hp-spectre-x360', rating: 4.7, featured: true,
            specs: { cpu: 'Intel Core Ultra 7', ram: '16GB–32GB', storage: '512GB–2TB', screen: '14" 2.8K OLED Touch', gpu: 'Intel Arc Graphics' },
            variants: [
              rv('HP-SPCX360-16-512', '16GB', '512GB SSD', 1449, 7, true),
              rv('HP-SPCX360-32-1TB', '32GB', '1TB SSD', 1799, 4),
            ],
          }),
          laptop({
            name: 'HP Envy 14', nameAr: 'إتش بي إنفي 14', slug: 'hp-envy-14', rating: 4.5,
            specs: { cpu: 'Intel Core Ultra 5', ram: '16GB', storage: '512GB–1TB', screen: '14" 2.2K Touch', gpu: 'Intel Arc Graphics' },
            variants: [
              rv('HP-ENVY14-16-512', '16GB', '512GB SSD', 999, 10, true),
              rv('HP-ENVY14-16-1TB', '16GB', '1TB SSD', 1149, 6),
            ],
          }),
          laptop({
            name: 'HP Pavilion 15', nameAr: 'إتش بي بافيليون 15', slug: 'hp-pavilion-15', rating: 4.3,
            specs: { cpu: 'Intel Core i5-1335U', ram: '8GB–16GB', storage: '512GB SSD', screen: '15.6" FHD', gpu: 'Intel Iris Xe' },
            variants: [
              rv('HP-PAV15-8-512', '8GB', '512GB SSD', 599, 16, true),
              rv('HP-PAV15-16-512', '16GB', '512GB SSD', 699, 11),
            ],
          }),
          laptop({
            name: 'HP Omen 16', nameAr: 'إتش بي أومن 16', slug: 'hp-omen-16', rating: 4.6, featured: true,
            specs: { cpu: 'AMD Ryzen 7 8845HS', ram: '16GB–32GB', storage: '1TB SSD', screen: '16.1" QHD 240Hz', gpu: 'NVIDIA RTX 4070' },
            variants: [
              rv('HP-OMEN16-16-1TB', '16GB', '1TB SSD', 1699, 7, true),
              rv('HP-OMEN16-32-1TB', '32GB', '1TB SSD', 1949, 4),
            ],
          }),
          laptop({
            name: 'HP EliteBook 840', nameAr: 'إتش بي إليت بوك 840', slug: 'hp-elitebook-840', rating: 4.5,
            specs: { cpu: 'Intel Core Ultra 7', ram: '16GB–32GB', storage: '512GB–1TB', screen: '14" WUXGA', gpu: 'Intel Arc Graphics' },
            variants: [
              rv('HP-ELITE840-16-512', '16GB', '512GB SSD', 1349, 8, true),
              rv('HP-ELITE840-32-1TB', '32GB', '1TB SSD', 1649, 4),
            ],
          }),
          laptop({
            name: 'HP Victus 15', nameAr: 'إتش بي فيكتوس 15', slug: 'hp-victus-15', rating: 4.3,
            specs: { cpu: 'AMD Ryzen 5 7535HS', ram: '8GB–16GB', storage: '512GB SSD', screen: '15.6" FHD 144Hz', gpu: 'NVIDIA RTX 4050' },
            variants: [
              rv('HP-VIC15-8-512', '8GB', '512GB SSD', 799, 13, true),
              rv('HP-VIC15-16-512', '16GB', '512GB SSD', 899, 8),
            ],
          }),
        ],
      },
    ],
  },

  // ════════════════════════════ LENOVO ════════════════════════════
  {
    name: 'Lenovo', nameAr: 'لينوفو',
    description: 'Lenovo — لابتوبات ThinkPad وLegion وYoga بأداء احترافي وموثوقية عالية.',
    categories: [
      {
        name: 'Lenovo Laptops', nameAr: 'لابتوبات لينوفو', kind: 'LAPTOP', icon: 'laptop',
        products: [
          laptop({
            name: 'ThinkPad X1 Carbon', nameAr: 'ثينك باد X1 كاربون', slug: 'lenovo-thinkpad-x1-carbon', rating: 4.8, featured: true,
            specs: { cpu: 'Intel Core Ultra 7', ram: '16GB–32GB', storage: '512GB–1TB', screen: '14" 2.8K OLED', gpu: 'Intel Arc Graphics' },
            variants: [
              rv('LEN-X1C-16-512', '16GB', '512GB SSD', 1599, 7, true),
              rv('LEN-X1C-32-1TB', '32GB', '1TB SSD', 1999, 4),
            ],
          }),
          laptop({
            name: 'ThinkPad T14', nameAr: 'ثينك باد T14', slug: 'lenovo-thinkpad-t14', rating: 4.6,
            specs: { cpu: 'AMD Ryzen 7 PRO 8840U', ram: '16GB–32GB', storage: '512GB SSD', screen: '14" WUXGA', gpu: 'AMD Radeon 780M' },
            variants: [
              rv('LEN-T14-16-512', '16GB', '512GB SSD', 1199, 9, true),
              rv('LEN-T14-32-512', '32GB', '512GB SSD', 1399, 5),
            ],
          }),
          laptop({
            name: 'Legion Pro 5', nameAr: 'ليجن برو 5', slug: 'lenovo-legion-pro-5', rating: 4.7, featured: true,
            specs: { cpu: 'AMD Ryzen 7 7745HX', ram: '16GB–32GB', storage: '1TB SSD', screen: '16" WQXGA 240Hz', gpu: 'NVIDIA RTX 4070' },
            variants: [
              rv('LEN-LGP5-16-1TB', '16GB', '1TB SSD', 1649, 8, true),
              rv('LEN-LGP5-32-1TB', '32GB', '1TB SSD', 1899, 4),
            ],
          }),
          laptop({
            name: 'IdeaPad Slim 5', nameAr: 'آيديا باد سليم 5', slug: 'lenovo-ideapad-slim-5', rating: 4.3,
            specs: { cpu: 'AMD Ryzen 5 8645HS', ram: '8GB–16GB', storage: '512GB SSD', screen: '14" WUXGA OLED', gpu: 'AMD Radeon 760M' },
            variants: [
              rv('LEN-IPS5-8-512', '8GB', '512GB SSD', 649, 15, true),
              rv('LEN-IPS5-16-512', '16GB', '512GB SSD', 749, 10),
            ],
          }),
          laptop({
            name: 'Yoga 9i', nameAr: 'يوغا 9i', slug: 'lenovo-yoga-9i', rating: 4.6,
            specs: { cpu: 'Intel Core Ultra 7', ram: '16GB–32GB', storage: '512GB–1TB', screen: '14" 4K OLED Touch', gpu: 'Intel Arc Graphics' },
            variants: [
              rv('LEN-YOGA9I-16-512', '16GB', '512GB SSD', 1399, 7, true),
              rv('LEN-YOGA9I-32-1TB', '32GB', '1TB SSD', 1699, 4),
            ],
          }),
          laptop({
            name: 'Lenovo LOQ 15', nameAr: 'لينوفو LOQ 15', slug: 'lenovo-loq-15', rating: 4.4,
            specs: { cpu: 'Intel Core i5-12450HX', ram: '8GB–16GB', storage: '512GB–1TB', screen: '15.6" FHD 144Hz', gpu: 'NVIDIA RTX 4050' },
            variants: [
              rv('LEN-LOQ15-8-512', '8GB', '512GB SSD', 749, 14, true),
              rv('LEN-LOQ15-16-1TB', '16GB', '1TB SSD', 949, 8),
            ],
          }),
        ],
      },
    ],
  },

  // ════════════════════════════ ASUS ════════════════════════════
  {
    name: 'Asus', nameAr: 'أسوس',
    description: 'Asus — لابتوبات ROG للألعاب وZenBook للإنتاجية وProArt للمبدعين.',
    categories: [
      {
        name: 'Asus Laptops', nameAr: 'لابتوبات أسوس', kind: 'LAPTOP', icon: 'laptop',
        products: [
          laptop({
            name: 'ROG Zephyrus G14', nameAr: 'روج زفيروس G14', slug: 'asus-rog-zephyrus-g14', rating: 4.8, featured: true,
            specs: { cpu: 'AMD Ryzen 9 8945HS', ram: '16GB–32GB', storage: '1TB SSD', screen: '14" 3K OLED 120Hz', gpu: 'NVIDIA RTX 4070' },
            variants: [
              rv('ASU-G14-16-1TB', '16GB', '1TB SSD', 1799, 6, true),
              rv('ASU-G14-32-1TB', '32GB', '1TB SSD', 2099, 3),
            ],
          }),
          laptop({
            name: 'ROG Strix G16', nameAr: 'روج ستريكس G16', slug: 'asus-rog-strix-g16', rating: 4.6,
            specs: { cpu: 'Intel Core i9-14900HX', ram: '16GB–32GB', storage: '1TB SSD', screen: '16" QHD+ 240Hz', gpu: 'NVIDIA RTX 4070' },
            variants: [
              rv('ASU-STRIX16-16-1TB', '16GB', '1TB SSD', 1899, 7, true),
              rv('ASU-STRIX16-32-1TB', '32GB', '1TB SSD', 2199, 4),
            ],
          }),
          laptop({
            name: 'ZenBook 14', nameAr: 'زن بوك 14', slug: 'asus-zenbook-14', rating: 4.6, featured: true,
            specs: { cpu: 'Intel Core Ultra 7', ram: '16GB–32GB', storage: '512GB–1TB', screen: '14" 3K OLED', gpu: 'Intel Arc Graphics' },
            variants: [
              rv('ASU-ZEN14-16-512', '16GB', '512GB SSD', 1099, 10, true),
              rv('ASU-ZEN14-32-1TB', '32GB', '1TB SSD', 1399, 5),
            ],
          }),
          laptop({
            name: 'VivoBook 15', nameAr: 'فيفو بوك 15', slug: 'asus-vivobook-15', rating: 4.2,
            specs: { cpu: 'Intel Core i5-1334U', ram: '8GB–16GB', storage: '512GB SSD', screen: '15.6" FHD', gpu: 'Intel Iris Xe' },
            variants: [
              rv('ASU-VIVO15-8-512', '8GB', '512GB SSD', 549, 18, true),
              rv('ASU-VIVO15-16-512', '16GB', '512GB SSD', 649, 12),
            ],
          }),
          laptop({
            name: 'TUF Gaming A15', nameAr: 'تاف جيمنج A15', slug: 'asus-tuf-gaming-a15', rating: 4.4,
            specs: { cpu: 'AMD Ryzen 7 7735HS', ram: '16GB', storage: '512GB–1TB', screen: '15.6" FHD 144Hz', gpu: 'NVIDIA RTX 4060' },
            variants: [
              rv('ASU-TUFA15-16-512', '16GB', '512GB SSD', 1099, 11, true),
              rv('ASU-TUFA15-16-1TB', '16GB', '1TB SSD', 1249, 6),
            ],
          }),
          laptop({
            name: 'ProArt P16', nameAr: 'برو آرت P16', slug: 'asus-proart-p16', rating: 4.7,
            specs: { cpu: 'AMD Ryzen AI 9 HX 370', ram: '32GB–64GB', storage: '1TB–2TB', screen: '16" 4K OLED Touch', gpu: 'NVIDIA RTX 4070' },
            variants: [
              rv('ASU-PROART16-32-1TB', '32GB', '1TB SSD', 2299, 5, true),
              rv('ASU-PROART16-64-2TB', '64GB', '2TB SSD', 2899, 2),
            ],
          }),
        ],
      },
    ],
  },

  // ════════════════════════════ BOSE ════════════════════════════
  {
    name: 'Bose', nameAr: 'بوز',
    description: 'Bose — سماعات QuietComfort الرائدة بإلغاء ضوضاء وصوت فاخر.',
    categories: [
      {
        name: 'Bose Headphones', nameAr: 'سماعات بوز', kind: 'HEADPHONE', icon: 'headphones',
        products: [
          headphone({
            name: 'Bose QuietComfort Ultra', nameAr: 'بوز كوايت كومفورت ألترا', slug: 'bose-quietcomfort-ultra', rating: 4.8, featured: true, comparePrice: 429,
            specs: { type: 'Over-ear', anc: 'World-class ANC + Immersive Audio', batteryLife: 'Up to 24h', connectivity: 'Bluetooth 5.3' },
            variants: [
              cv('BOS-QCU-BLK', 'Black', COLORS.black, 379, 12, true, 429),
              cv('BOS-QCU-WHT', 'White Smoke', COLORS.white, 379, 7),
            ],
          }),
          headphone({
            name: 'Bose QuietComfort 45', nameAr: 'بوز كوايت كومفورت 45', slug: 'bose-quietcomfort-45', rating: 4.7,
            specs: { type: 'Over-ear', anc: 'Active Noise Cancellation', batteryLife: 'Up to 24h', connectivity: 'Bluetooth 5.1' },
            variants: [
              cv('BOS-QC45-BLK', 'Black', COLORS.black, 279, 15, true, 329),
              cv('BOS-QC45-WHT', 'White Smoke', COLORS.white, 279, 9),
            ],
          }),
          headphone({
            name: 'Bose QC Ultra Earbuds', nameAr: 'بوز كيو سي ألترا إيربودز', slug: 'bose-qc-ultra-earbuds', rating: 4.7, featured: true,
            specs: { type: 'In-ear', anc: 'World-class ANC + Immersive Audio', batteryLife: 'Up to 24h (with case)', connectivity: 'Bluetooth 5.3' },
            variants: [
              cv('BOS-QCUE-BLK', 'Black', COLORS.black, 299, 11, true),
              cv('BOS-QCUE-WHT', 'White Smoke', COLORS.white, 299, 6),
            ],
          }),
          headphone({
            name: 'Bose SoundLink Flex', nameAr: 'بوز ساوند لينك فليكس', slug: 'bose-soundlink-flex', rating: 4.6,
            specs: { type: 'Portable speaker', anc: 'No', batteryLife: 'Up to 12h', connectivity: 'Bluetooth 5.3' },
            variants: [
              cv('BOS-SLF-BLK', 'Black', COLORS.black, 149, 18, true),
              cv('BOS-SLF-BLU', 'Blue', COLORS.blue, 149, 11),
            ],
          }),
          headphone({
            name: 'Bose 700', nameAr: 'بوز 700', slug: 'bose-700', rating: 4.6,
            specs: { type: 'Over-ear', anc: 'Active Noise Cancellation (11 levels)', batteryLife: 'Up to 20h', connectivity: 'Bluetooth 5.0' },
            variants: [
              cv('BOS-700-BLK', 'Black', COLORS.black, 299, 10, true, 379),
              cv('BOS-700-SLV', 'Silver', COLORS.silver, 299, 6),
            ],
          }),
        ],
      },
    ],
  },

  // ════════════════════════════ JBL ════════════════════════════
  {
    name: 'JBL', nameAr: 'جي بي إل',
    description: 'JBL — سماعات بصوت قوي نابض ومكبرات محمولة لكل المناسبات.',
    categories: [
      {
        name: 'JBL Headphones', nameAr: 'سماعات جي بي إل', kind: 'HEADPHONE', icon: 'headphones',
        products: [
          headphone({
            name: 'JBL Tour One M2', nameAr: 'جي بي إل تور وان M2', slug: 'jbl-tour-one-m2', rating: 4.6, featured: true,
            specs: { type: 'Over-ear', anc: 'True Adaptive ANC', batteryLife: 'Up to 50h', connectivity: 'Bluetooth 5.3' },
            variants: [
              cv('JBL-TOUR1M2-BLK', 'Black', COLORS.black, 249, 12, true, 299),
              cv('JBL-TOUR1M2-CHM', 'Champagne', COLORS.gold, 249, 7),
            ],
          }),
          headphone({
            name: 'JBL Live 660NC', nameAr: 'جي بي إل لايف 660NC', slug: 'jbl-live-660nc', rating: 4.4,
            specs: { type: 'Over-ear', anc: 'Adaptive Noise Cancelling', batteryLife: 'Up to 50h', connectivity: 'Bluetooth 5.0' },
            variants: [
              cv('JBL-L660NC-BLK', 'Black', COLORS.black, 149, 16, true),
              cv('JBL-L660NC-BLU', 'Blue', COLORS.blue, 149, 9),
            ],
          }),
          headphone({
            name: 'JBL Tune 770NC', nameAr: 'جي بي إل تيون 770NC', slug: 'jbl-tune-770nc', rating: 4.5,
            specs: { type: 'Over-ear', anc: 'Adaptive Noise Cancelling', batteryLife: 'Up to 70h', connectivity: 'Bluetooth 5.3' },
            variants: [
              cv('JBL-T770NC-BLK', 'Black', COLORS.black, 99, 22, true, 129),
              cv('JBL-T770NC-WHT', 'White', COLORS.white, 99, 14),
            ],
          }),
          headphone({
            name: 'JBL Quantum 910', nameAr: 'جي بي إل كوانتم 910', slug: 'jbl-quantum-910', rating: 4.5,
            specs: { type: 'Over-ear (gaming)', anc: 'Active Noise Cancelling', batteryLife: 'Up to 39h', connectivity: 'Wireless 2.4GHz + Bluetooth' },
            variants: [cv('JBL-Q910-BLK', 'Black', COLORS.black, 199, 10, true, 249)],
          }),
          headphone({
            name: 'JBL Charge 5', nameAr: 'جي بي إل تشارج 5', slug: 'jbl-charge-5', rating: 4.7, featured: true,
            specs: { type: 'Portable speaker', anc: 'No', batteryLife: 'Up to 20h', connectivity: 'Bluetooth 5.1' },
            variants: [
              cv('JBL-CHRG5-BLK', 'Black', COLORS.black, 149, 20, true, 179),
              cv('JBL-CHRG5-BLU', 'Blue', COLORS.blue, 149, 13),
              cv('JBL-CHRG5-RED', 'Red', COLORS.red, 149, 9),
            ],
          }),
        ],
      },
    ],
  },

  // ════════════════════════════ SENNHEISER ════════════════════════════
  {
    name: 'Sennheiser', nameAr: 'سينهايزر',
    description: 'Sennheiser — سماعات بصوت أوديوفايل فاخر ودقة استثنائية.',
    categories: [
      {
        name: 'Sennheiser Headphones', nameAr: 'سماعات سينهايزر', kind: 'HEADPHONE', icon: 'headphones',
        products: [
          headphone({
            name: 'Momentum 4 Wireless', nameAr: 'مومينتم 4 وايرلس', slug: 'sennheiser-momentum-4-wireless', rating: 4.8, featured: true, comparePrice: 379,
            specs: { type: 'Over-ear', anc: 'Adaptive Noise Cancellation', batteryLife: 'Up to 60h', connectivity: 'Bluetooth 5.2' },
            variants: [
              cv('SEN-MOM4-BLK', 'Black', COLORS.black, 299, 12, true, 379),
              cv('SEN-MOM4-WHT', 'White', COLORS.white, 299, 7),
            ],
          }),
          headphone({
            name: 'Momentum True Wireless 3', nameAr: 'مومينتم ترو وايرلس 3', slug: 'sennheiser-momentum-true-wireless-3', rating: 4.6,
            specs: { type: 'In-ear', anc: 'Adaptive Noise Cancellation', batteryLife: 'Up to 28h (with case)', connectivity: 'Bluetooth 5.2' },
            variants: [
              cv('SEN-MTW3-BLK', 'Black', COLORS.black, 199, 13, true, 249),
              cv('SEN-MTW3-GRA', 'Graphite', COLORS.graphite, 199, 8),
            ],
          }),
          headphone({
            name: 'Sennheiser HD 660S2', nameAr: 'سينهايزر HD 660S2', slug: 'sennheiser-hd-660s2', rating: 4.8,
            specs: { type: 'Over-ear (open-back wired)', anc: 'No', batteryLife: 'Wired (no battery)', connectivity: '3.5mm / 6.35mm / 4.4mm balanced' },
            variants: [cv('SEN-HD660S2-BLK', 'Black', COLORS.black, 499, 6, true)],
          }),
          headphone({
            name: 'Sennheiser Accentum Plus', nameAr: 'سينهايزر أكسنتم بلس', slug: 'sennheiser-accentum-plus', rating: 4.5,
            specs: { type: 'Over-ear', anc: 'Hybrid Adaptive ANC', batteryLife: 'Up to 50h', connectivity: 'Bluetooth 5.2' },
            variants: [
              cv('SEN-ACCP-BLK', 'Black', COLORS.black, 229, 11, true),
              cv('SEN-ACCP-WHT', 'White', COLORS.white, 229, 6),
            ],
          }),
          headphone({
            name: 'Sennheiser CX Plus', nameAr: 'سينهايزر CX بلس', slug: 'sennheiser-cx-plus', rating: 4.4,
            specs: { type: 'In-ear', anc: 'Active Noise Cancellation', batteryLife: 'Up to 24h (with case)', connectivity: 'Bluetooth 5.2' },
            variants: [
              cv('SEN-CXP-BLK', 'Black', COLORS.black, 129, 17, true, 159),
              cv('SEN-CXP-WHT', 'White', COLORS.white, 129, 10),
            ],
          }),
        ],
      },
    ],
  },
];

// ── Review pool (applied to several featured products) ───────────────────────
const REVIEW_POOL: Array<{ customerName: string; rating: number; comment: string }> = [
  { customerName: 'أحمد العبيدي', rating: 5, comment: 'منتج أصلي ووصل بسرعة لبغداد. التغليف ممتاز والجهاز يعمل بشكل رائع. أنصح بالشراء من Quvenza.' },
  { customerName: 'مريم الجبوري', rating: 5, comment: 'تجربة شراء ممتازة، الجهاز أصلي 100% والسعر منافس. شكراً للفريق على المتابعة.' },
  { customerName: 'علي الكناني', rating: 4, comment: 'الجهاز ممتاز والأداء قوي. التوصيل تأخر يوم واحد بس بشكل عام راضٍ جداً.' },
  { customerName: 'زينب الموسوي', rating: 5, comment: 'أفضل سعر لقيته في العراق، والجودة عالية. خدمة العملاء محترمة وسريعة بالرد.' },
  { customerName: 'حسين الدليمي', rating: 5, comment: 'الجهاز فاق توقعاتي، أصلي وبضمان. دفعت كاش عند الاستلام وكلشي تمام.' },
  { customerName: 'نور الحسيني', rating: 4, comment: 'منتج رائع وجودة عالية. أتمنى لو يتوفر المزيد من الألوان مستقبلاً.' },
];

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱 Seeding Quvenza electronics store…\n');

  // Cleanup (FK-safe order)
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.order.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.address.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.user.deleteMany();
  console.log('🧹 Cleared existing data.\n');

  // Users
  const [adminPassword, customerPassword] = await Promise.all([
    bcrypt.hash('Admin@2026!', 12),
    bcrypt.hash('Customer@2026!', 12),
  ]);

  const admin = await prisma.user.create({
    data: { name: 'Quvenza Admin', email: 'admin@quvenzaiq.com', password: adminPassword, role: 'ADMIN' },
  });
  const customer = await prisma.user.create({
    data: { name: 'أحمد العراقي', email: 'customer@quvenzaiq.com', password: customerPassword, role: 'USER' },
  });
  console.log(`✅ Users: ${admin.email} / ${customer.email}`);

  // Brands → Categories → Products → Variants
  let brandCount = 0;
  let categoryCount = 0;
  let productCount = 0;
  let variantCount = 0;

  for (const b of CATALOG) {
    const brandSlug = kebab(b.name);
    const brand = await prisma.brand.create({
      data: {
        name: b.name,
        nameAr: b.nameAr,
        slug: brandSlug,
        description: b.description,
        isActive: true,
        isFeatured: b.isFeatured ?? false,
        // Real monochrome brand mark shipped in public/brands/<slug>.svg
        // (Simple Icons, open). Falls back to a text placeholder if missing.
        logo: `/brands/${brandSlug}.svg`,
      },
    });
    brandCount++;

    for (const c of b.categories) {
      const category = await prisma.category.create({
        data: {
          name: c.name,
          nameAr: c.nameAr,
          slug: kebab(c.name),
          kind: c.kind,
          icon: c.icon,
          image: img(c.name),
          isActive: true,
          brandId: brand.id,
        },
      });
      categoryCount++;

      for (const p of c.products) {
        await prisma.product.create({ data: buildProduct(p, brand.id, category.id) });
        productCount++;
        variantCount += p.variants.length;
      }
    }
  }
  console.log(`✅ Brands: ${brandCount}`);
  console.log(`✅ Categories: ${categoryCount}`);
  console.log(`✅ Products: ${productCount}`);
  console.log(`✅ Variants: ${variantCount}`);

  // Reviews — attach 2 each to a selection of featured products
  const featured = await prisma.product.findMany({
    where: { isFeatured: true },
    select: { id: true },
    take: 12,
  });

  let reviewCount = 0;
  for (let i = 0; i < featured.length; i++) {
    const r1 = REVIEW_POOL[i % REVIEW_POOL.length];
    const r2 = REVIEW_POOL[(i + 3) % REVIEW_POOL.length];
    await prisma.review.createMany({
      data: [
        { productId: featured[i].id, customerName: r1.customerName, rating: r1.rating, comment: r1.comment, isVerified: true, isApproved: true },
        { productId: featured[i].id, customerName: r2.customerName, rating: r2.rating, comment: r2.comment, isVerified: true, isApproved: true },
      ],
    });
    reviewCount += 2;
  }
  console.log(`✅ Reviews: ${reviewCount}`);

  // Sample DELIVERED order with a real product + variant
  const sampleProduct = await prisma.product.findUnique({
    where: { slug: 'apple-iphone-15-pro' },
    include: { variants: true },
  });

  if (sampleProduct) {
    const chosenVariant =
      sampleProduct.variants.find((v) => v.isDefault) ?? sampleProduct.variants[0];
    const unitPrice = Number(chosenVariant?.price ?? sampleProduct.price);
    const quantity = 1;

    const order = await prisma.order.create({
      data: {
        userId: customer.id,
        status: 'DELIVERED',
        total: unitPrice * quantity,
        paymentMethod: 'CASH_ON_DELIVERY',
        paymentStatus: 'PAID',
        shippingAddress: {
          fullName: 'أحمد العراقي',
          phone: '07701234567',
          governorate: 'Baghdad',
          city: 'Karrada',
          address: 'شارع الكرادة الداخلية، قرب ساحة كهرمانة، بناية 12',
          country: 'Iraq',
        },
        items: {
          create: [
            {
              productId: sampleProduct.id,
              variantId: chosenVariant?.id,
              variantName: chosenVariant?.name,
              quantity,
              price: unitPrice,
            },
          ],
        },
        statusHistory: {
          create: [
            { fromStatus: null, toStatus: 'PENDING', note: 'تم إنشاء الطلب', changedBy: 'system' },
            { fromStatus: 'PENDING', toStatus: 'PROCESSING', note: 'قيد التجهيز', changedBy: admin.id },
            { fromStatus: 'PROCESSING', toStatus: 'SHIPPED', note: 'تم الشحن', changedBy: admin.id },
            { fromStatus: 'SHIPPED', toStatus: 'DELIVERED', note: 'تم التسليم بنجاح', changedBy: admin.id },
          ],
        },
      },
    });
    console.log(`✅ Sample order: ${order.id} (DELIVERED, ${chosenVariant?.name})`);
  }

  // Summary
  console.log('\n────────────────────────────────────────');
  console.log('🎉 Seed complete — Quvenza electronics store');
  console.log('────────────────────────────────────────');
  console.log(`   Brands:     ${brandCount}`);
  console.log(`   Categories: ${categoryCount}`);
  console.log(`   Products:   ${productCount}`);
  console.log(`   Variants:   ${variantCount}`);
  console.log(`   Reviews:    ${reviewCount}`);
  console.log('   Users:      2 (admin + customer)');
  console.log('   Orders:     1 (sample DELIVERED)');
  console.log('────────────────────────────────────────');
  console.log('   Admin:    admin@quvenzaiq.com / Admin@2026!');
  console.log('   Customer: customer@quvenzaiq.com / Customer@2026!');
  console.log('────────────────────────────────────────\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
