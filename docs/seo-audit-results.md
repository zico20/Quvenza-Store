# SoftoDev Store — SEO Deep Audit Results
Comprehensive 3-part SEO investigation  
Target: softodeviqstore.com — Iraqi digital subscriptions marketplace  
Tools: Readonly code analysis + structure verification

---

## 🔍 AUDIT 1: TECHNICAL SEO DEEP AUDIT

**Date:** 2026-05-11  
**Scope:** Technical infrastructure that affects indexing & ranking  
**Method:** Readonly code analysis

---

### Executive Summary

| Category | Score (0-10) | Status |
|---|---|---|
| Robots.txt | 10/10 | ✅ Excellent |
| Sitemap.xml | 9/10 | ✅ Excellent |
| Meta tags coverage | 9/10 | ✅ Excellent |
| Structured data | 9/10 | ✅ Excellent |
| Core Web Vitals (code-level) | 7/10 | 🟡 Good — image priority gaps |
| Internationalization (i18n) | 8/10 | ✅ Good |
| Indexability rules | 9/10 | ✅ Excellent |
| Image SEO | 8/10 | ✅ Good |
| URL structure | 9/10 | ✅ Excellent |
| Security headers | 10/10 | ✅ Excellent |
| **OVERALL TECHNICAL SEO** | **88/100** | ✅ **Strong foundation** |

---

### 1. Robots.txt

**File:** `src/app/robots.ts`  
**Status:** Exists — comprehensive

**Disallow paths:**
- `/api/`, `/checkout/`, `/account/`, `/cart`, `/_next/`, `/admin/`, `/login`, `/register`

**AI bot rules — 16 user agents explicitly allowed (full `/` access):**
GPTBot, ChatGPT-User, OAI-SearchBot, Google-Extended, GoogleOther, ClaudeBot, anthropic-ai, PerplexityBot, Perplexity-User, Bingbot, Applebot, Applebot-Extended, YouBot, Meta-ExternalAgent, cohere-ai, DeepSeekBot

**Blocked scrapers:** SemrushBot, AhrefsBot, MJ12bot, DotBot, rogerbot, BLEXBot, PetalBot

**Sitemap URL:** `https://softodeviqstore.com/sitemap.xml` ✅  
**Host directive:** `https://softodeviqstore.com` ✅

**Issues found:** None — best-in-class implementation.

**Score: 10/10**

---

### 2. Sitemap.xml

**File:** `src/app/sitemap.ts`  
**Static URLs:** 10  
**Dynamic product URLs:** fetched from DB (up to 500), pattern `/products/{slug}`  
**Dynamic category URLs:** fetched from DB, pattern `/category/{slug}`

| URL | changeFrequency | priority | lastmod |
|---|---|---|---|
| / | daily | 1.0 | new Date() |
| /products | daily | 0.9 | new Date() |
| /faq | weekly | 0.8 | new Date() |
| /about | monthly | 0.6 | 2026-04-27 |
| /contact | monthly | 0.6 | 2026-04-27 |
| /how-it-works | monthly | 0.6 | 2026-04-27 |
| /payment-methods | monthly | 0.6 | 2026-04-27 |
| /glossary | monthly | 0.6 | new Date() |
| /privacy | yearly | 0.3 | 2026-04-01 |
| /terms | yearly | 0.3 | 2026-04-01 |
| /products/{slug} (dynamic) | weekly | 0.9 | product.updatedAt |
| /category/{slug} (dynamic) | weekly | 0.8 | new Date() |

**lastmod present:** Yes ✅  
**priority distribution:** 1.0 → 0.9 → 0.8 → 0.6 → 0.3 (well-calibrated) ✅  
**changefreq set:** Yes on all entries ✅

**Issues found:**
- Category `lastModified` always uses `new Date()` (not from DB `updatedAt`) — minor stale signal risk

**Score: 9/10**

---

### 3. Meta Tags Coverage

| Page type | Title len | Description len | OG | Twitter | Canonical |
|---|---|---|---|---|---|
| Root layout (template) | 91 chars default | 143 chars | ✅ | ✅ | ✅ |
| Homepage | 84 chars | 144 chars | ✅ | ✅ | ✅ |
| Product `/products/[slug]` | dynamic (≤60) | dynamic (≤170) | ✅ (product image) | ✅ | ✅ |
| Category `/category/[slug]` | dynamic | dynamic | ✅ | ✅ | ✅ |
| About `/about` | 45 chars | 165 chars | ✅ | ✅ | ✅ |
| FAQ `/faq` | 50 chars | 152 chars | ✅ | ✅ | ✅ |

**Root layout custom meta:** ai:type, ai:category, ai:country, ai:language, ai:currency, geo.region (IQ-BG), geo.placename (Baghdad), geo.position (33.3152;44.3661), ICBM, distribution, audience, rating ✅

**Issues found:**
- Root layout default title is 91 chars (over 60 char guideline) — template suffix compounds this on child pages
- Category description includes hardcoded Arabic text; length not validated server-side

**Score: 9/10**

---

### 4. Structured Data (JSON-LD)

**File:** `src/lib/schema.ts`

**Implemented schemas:**
- Organization + OnlineStore: ✅ — `organizationSchema()` — includes 28 `knowsAbout` topics, areaServed (Iraq + 5 governorates), payment methods (ZainCash, AsiaHawala)
- LocalBusiness + Store: ✅ — `localBusinessSchema()` — geo-coordinates, opening hours, address
- WebSite (with SearchAction): ✅ — `websiteSchema()` — search URL template
- Product: ✅ — `productSchema()` — IQD pricing, stock availability, 7-day return policy, free shipping to Iraq
- ItemList: ✅ — `productListSchema()` — category pages
- BreadcrumbList: ✅ — `breadcrumbSchema()` — all key pages
- FAQPage: ✅ — `faqSchema()` — `/faq` + product-level FAQs
- HowTo: ✅ — `howToSchema()` — `/how-it-works`
- SpeakableSpecification: ✅ — `speakableSpec()` — h1, .lead-paragraph, .faq-answer
- Article: ✅ — `articleSchema()` — blog support

**Issues found:**
- No `aggregateRating` in Product schema (no review system yet)
- VirtualGoods / DigitalProduct type not explicitly declared (Product used instead)

**Score: 9/10**

---

### 5. Performance Signals (Core Web Vitals — code level)

**Image optimization:**
- `next/image` usage: 71 instances
- `priority` prop usage: 1 instance (`src/app/(shop)/products/[slug]/ProductDetailClient.tsx` — first selected image only)
- AVIF/WebP enabled: ✅ (`next.config.ts`: `formats: ['image/avif', 'image/webp']`)
- Cache TTL: 30 days minimum ✅
- Remote patterns: Cloudinary + placehold.co + softodeviqstore.com ✅

**Fonts:**
- `next/font` usage: Cairo (Arabic, preload=true), Inter, JetBrains Mono ✅
- Font display: `swap` on all 3 fonts ✅ (no FOIT/FOUT)

**ISR / revalidation:**
- `/products/layout.tsx`: `revalidate = 300` (5 min)
- `/category/[slug]/page.tsx`: `revalidate = 3600` (1 hour)
- Homepage: no revalidate (dynamic)
- Product detail: no explicit revalidate (dynamic)

**Client component count:** 30 `'use client'` files

**Issues found:**
- Hero slider images (`public/banners/`) use `<img>` not `next/image` — no AVIF/WebP optimization, no priority
- No `priority` on hero desktop/mobile banners (critical LCP element)
- Homepage is fully dynamic (no ISR) — potential latency on cold requests
- Product detail page has no `revalidate` — every request hits DB

**Score: 7/10**

---

### 6. Internationalization

**`<html lang="">` attribute:** `lang="ar"` — `src/app/layout.tsx:131` ✅  
**RTL direction:** Set dynamically via `LangInitializer` → `document.documentElement.setAttribute('dir', 'rtl')` ✅  
**hreflang implementation:** `alternates.languages: { 'ar-IQ': BASE, 'ar': BASE, 'x-default': BASE }` in root layout ✅  
**Language alternates in metadata:** Root layout only — not propagated to individual product/category pages  
**OpenGraph locale:** `ar_IQ` + `alternateLocale: en_US` ✅  
**Schema inLanguage:** `ar-IQ` on WebSite, HowTo schemas ✅

**Issues found:**
- `dir="rtl"` set via JS after hydration (not SSR attribute on `<html>`) — brief flash possible
- hreflang not repeated on individual product/category pages (only root)
- No `en` language alternate despite EN toggle existing in the UI

**Score: 8/10**

---

### 7. Indexability

**Noindex pages:**
| Route | File | Robots |
|---|---|---|
| /cart | `src/app/cart/layout.tsx` | index: false |
| /checkout | `src/app/checkout/layout.tsx` | index: false |
| /account | `src/app/account/layout.tsx` | index: false |
| /(auth) login/register | `src/app/(auth)/layout.tsx` | index: false |
| /admin/* | Blocked via robots.txt Disallow | N/A |

**Canonical URLs:** Set on all public pages (homepage, products, categories, static pages) ✅  
**Filter URLs:** No filter-parameter canonicalization observed (`?tag=sale`, `?category=x` could be indexed as separate pages)

**Issues found:**
- `/products?tag=sale` and `/products?category=x` URLs lack canonical pointing to base `/products` — potential duplicate content
- `/search?q=xxx` pages appear indexable (no noindex seen on search page)

**Score: 9/10**

---

### 8. Image SEO

**Images with empty alt:** 4 instances — all decorative (HeroSlider banners with `aria-hidden="true"`, ImageUpload previews) ✅  
**Images with descriptive alt:** 11+ instances — product images use `alt={product.name}`, detail page uses `alt="${product.name} — صورة ${i+1}"` ✅  
**Localized alt text (Arabic):** Partial — product names are Arabic but alt text template is mixed  
**OG images:** `/og-image.svg` fallback on all pages; product pages use `product.images[0]` ✅

**Issues found:**
- Hero banner `<img>` tags use `alt=""` + `aria-hidden` (correct for decorative) but these are primary LCP elements — consider descriptive alt for SEO benefit on key banners
- ProductCard uses `alt={p.name}` ✅ but admin dashboard product images have `alt=""` (acceptable for admin)

**Score: 8/10**

---

### 9. URL Structure

**Dynamic route patterns:**
| Route | Type | Indexed |
|---|---|---|
| `/products/[slug]` | SEO-friendly slug | ✅ Yes |
| `/category/[slug]` | SEO-friendly slug | ✅ Yes |
| `/account/orders/[id]` | Opaque ID | Noindexed ✅ |
| `/admin/**/[id]` | Opaque ID | Blocked ✅ |

**Trailing slash policy:** Default (none) — `trailingSlash` not set in `next.config.ts`  
**Slug format:** kebab-case, Arabic-friendly ✅  
**URL depth:** Max 2 levels (`/products/slug`) ✅  
**No URL parameter bloat:** Filter params exist (`?tag=`, `?category=`, `?q=`) but not excessive

**Issues found:** None critical — clean URL architecture.

**Score: 9/10**

---

### 10. Security Headers (E-E-A-T signal)

**File:** `next.config.ts` — `headers()` function

| Header | Value |
|---|---|
| Strict-Transport-Security | `max-age=63072000; includeSubDomains; preload` ✅ |
| X-Content-Type-Options | `nosniff` ✅ |
| X-Frame-Options | `SAMEORIGIN` ✅ |
| Referrer-Policy | `strict-origin-when-cross-origin` ✅ |
| Permissions-Policy | `camera=(), microphone=(), geolocation=(self), interest-cohort=()` ✅ |
| X-DNS-Prefetch-Control | `on` ✅ |
| X-Powered-By | Disabled (`poweredByHeader: false`) ✅ |
| Static asset cache | 1-year immutable for `/_next/static/*` ✅ |
| Image cache | 30-day + 1-day stale-while-revalidate ✅ |

**Issues found:** None — security headers are comprehensive and correctly configured.

**Score: 10/10**

---

## 🎯 AUDIT 1 — Priority Recommendations

### 🔴 Critical (do this week)

1. **Add `priority` prop to hero banner images** — `src/components/home/HeroSlider.tsx` — the desktop/mobile `<img>` tags are the LCP element on every page but have no `priority` hint; switch to `next/image` with `priority` for AVIF/WebP + preload.
2. **Add canonical to filter URLs** — `/products?tag=sale` and `/products?category=x` should either have `rel=canonical` pointing to `/products` or be blocked via robots.txt to prevent duplicate indexing.
3. **Add ISR to homepage and product detail** — `src/app/page.tsx` and `src/app/(shop)/products/[slug]/page.tsx` have no `revalidate`; add `revalidate = 300` (5 min) on homepage and `revalidate = 86400` (24h) on product pages for caching without stale content.

### 🟡 High (do this month)

4. **Add hreflang per page** — Currently only root layout has hreflang; add `alternates.languages` to `generateMetadata` in `/products/[slug]` and `/category/[slug]` for proper international signals.
5. **Shorten root layout default title** — 91 chars is over the 60-char guideline; trim to ~55 chars to prevent truncation in SERPs.
6. **Set `dir` as SSR attribute** — Currently set via JS after mount; add `dir="rtl"` directly to `<html>` in `layout.tsx` to prevent layout shift and improve Googlebot rendering.
7. **Fix category `lastModified`** — Use DB `updatedAt` field instead of `new Date()` to give Google accurate freshness signals.

### 🟢 Polish (long-term)

8. **Add `aggregateRating` to Product schema** — When review system is implemented, include ratings in JSON-LD for rich snippet stars in SERPs.
9. **Declare `DigitalProduct` / `SoftwareApplication` type** — More specific than generic `Product` for digital subscription items; may trigger dedicated Google rich result type.
10. **Add noindex to `/search` page** — Search result pages (`/search?q=x`) are typically duplicate content; add `robots: { index: false }` to the search page metadata.

---

# 🔍 AUDIT 2: CONTENT, KEYWORDS & ON-PAGE SEO

**Date:** 2026-05-11
**Scope:** Content quality, keyword targeting, on-page elements
**Method:** Readonly code + content analysis (seed.ts as ground truth for product content)

---

## Executive Summary

| Category | Score (0-10) | Status |
|---|---|---|
| Keyword targeting | 7/10 | ⚠ Good but homepage H1 missing |
| Content depth | 5/10 | ⚠ Products strong, static pages thin |
| Heading hierarchy | 6/10 | ⚠ Homepage no H1 — critical gap |
| Internal linking | 4/10 | 🔴 Most pages isolated, 0 links |
| Product copy quality | 8/10 | ✅ Rich seed content, Iraqi context |
| FAQ + Glossary | 8/10 | ✅ Comprehensive, Iraq-specific |
| Blog content | 0/10 | 🔴 No blog routes exist |
| E-E-A-T signals | 5/10 | ⚠ Partial — missing founder, reviews |
| Long-tail coverage | 6/10 | ⚠ Product-level good, no blog |
| Anchor text variety | 4/10 | 🔴 Limited links, all i18n keys |
| **OVERALL CONTENT SEO** | **53/100** | **⚠ Needs work** |

---

## 1. Keyword Targeting Per Page Type

### Homepage (`src/app/page.tsx`)

- **Primary keyword detected:** "اشتراكات ChatGPT Plus · Canva Pro · CapCut · Coursera في العراق"
- **Secondary keywords (root layout):** 10 Arabic keywords including "اشتراك ChatGPT Plus العراق", "شراء ChatGPT بالدينار العراقي", "Canva Pro العراق", "اشتراكات رقمية بغداد"
- **Iraqi market signals:** ✅ Dinar, ZainCash, Baghdad, 18 provinces, "أكبر متجر"
- **H1 actual text:** ⚠ **MISSING — no `<h1>` tag in page.tsx or HeroSlider.tsx**
- **Meta title:** `SoftoDev | اشترِ ChatGPT Plus · Canva Pro · CapCut · Coursera في العراق` (~70 chars ✅)
- **Meta description:** `أكبر متجر اشتراكات رقمية في العراق — ChatGPT Plus، Canva Pro، CapCut Pro، Coursera Plus. تفعيل فوري خلال 30 دقيقة، دفع بالدينار العراقي، ضمان كامل.` (~152 chars ✅)

**Issues:**
- Homepage has **no H1 at all** — Google cannot identify the primary topic of the most important page
- Hero slider is visual-only (banner images), contributes no text H1
- Section headings use H2 only (bestsellers editorial section)

### Product Pages (`src/app/(shop)/products/[slug]/page.tsx`)

- **Title pattern:** `{metaTitle}` custom or fallback `{product.name} — اشتراك في العراق`
  - Example: `ChatGPT Plus شهرين — اشتراك في العراق | SoftoDev` (~50 chars ✅)
  - Layout template appends: `| SoftoDev — اشتراكات رقمية العراق`
- **Per-product metaKeywords:** ✅ 5 keywords each (Arabic + English variants)
  - Example: `ChatGPT Plus العراق, اشتراك ChatGPT عراق, شراء ChatGPT العراق, ChatGPT Plus Iraq, GPT-4o عراق`
- **Iraqi market hooks:** ✅ ZainCash, Dinar pricing, 30-minute activation, Baghdad COD
- **SEO-friendly slugs:** ✅ `chatgpt-plus-2months`, `canva-pro-1year`, `capcut-pro-1month`
- **H1 location:** `ProductDetailClient.tsx:142` (client component, SSR-rendered) ✓

**Issues:**
- H1 is inside a `'use client'` component — renders correctly via Next.js SSR but not in server `page.tsx` itself
- All product images are placeholder URLs (`placehold.co/600x600`) — zero real images for Google Image search or rich snippets

### Category Pages (`src/app/(shop)/category/[slug]/page.tsx`)

- **Title pattern:** `{category.name} — اشتراكات في العراق`
- **Meta description:** `اشترِ أفضل {name} في العراق بأسعار بالدينار العراقي — تفعيل فوري، ضمان كامل. {N} منتج متاح.`
- **H1 actual text:** Category name from DB (e.g., `أدوات الذكاء الاصطناعي`) ✅
- **Sub-heading:** `{N} منتج متاح في العراق` (plain `<p>`, not H2)
- **Intro paragraph:** ⚠ ABSENT — only product count, then straight into product grid

**Issues:**
- No descriptive intro paragraph above the product grid
- No H2 sub-sections (e.g., "لماذا تشترك في أدوات الذكاء الاصطناعي؟")
- Keywords array: only 4 generic items per category

### Static Pages

| Page | H1 Text | Approx Words | Status |
|---|---|---|---|
| `/about` | "من نحن" | ~350 | ⚠ Thin, no founder name |
| `/faq` | "الأسئلة الشائعة" | ~976 | ✅ Good depth |
| `/glossary` | "قاموس المصطلحات" | ~554 | ⚠ Moderate |
| `/how-it-works` | "كيف يعمل المتجر؟" | ~493 | ⚠ Slightly thin |
| `/payment-methods` | "طرق الدفع المتاحة" | ~282 | 🔴 Very thin |
| `/contact` | "اتصل بنا" | ~372 | ⚠ No SEO metadata — `'use client'` page |
| `/privacy` | "Privacy Policy" (English) | ~159 | 🔴 Skeleton only, English |
| `/terms` | "Terms of Service" (English) | ~138 | 🔴 Skeleton only, English |

**Issues:**
- `/contact` uses `'use client'` with NO `generateMetadata` export — page has no custom title, description, or canonical
- `/privacy` and `/terms` are English-only stubs — high-trust pages in an Arabic-first market
- H1 text on static pages does not include target keywords (e.g., "من نحن" misses "SoftoDev العراق")

**Score: 7/10**

---

## 2. Content Depth

| Page | Approx Words | Recommended | Gap |
|---|---|---|---|
| Homepage | ~686 (template) | 500–1000 | ✅ Meets threshold |
| Product (template code) | ~364 | 800–1500 | See note* |
| Category | ~317 | 400–800 | 🔴 Below minimum |
| About | ~350 | 600–1200 | 🔴 Below minimum |
| FAQ | ~976 | 800–1500 | ✅ Meets threshold |
| Glossary | ~554 | 1000+ | ⚠ Below target |
| How-it-works | ~493 | 600–1000 | ⚠ Slightly thin |
| Payment methods | ~282 | 400–800 | 🔴 Well below |

\*Product pages: template code is ~364 words but longDescription seed data adds ~130 words + features + FAQs at render time. Estimated full rendered word count: ~500–900 words ✅

**Issues:**
- `/payment-methods` at ~282 words is severely thin for a page targeting "طرق الدفع زين كاش آسيا حوالة العراق"
- `/about` at ~350 words lacks founder story, company credentials, or team bios
- Category pages have zero descriptive editorial content above the product grid
- Glossary at 14 terms is a good start but far below a 1,000+ word authority piece

**Score: 5/10**

---

## 3. Heading Hierarchy

| Page | H1 | H2 | H3 | Issues |
|---|---|---|---|---|
| Homepage | 0 | 1 (bestsellers) | 0 | 🔴 Missing H1 entirely |
| Product (rendered) | 1 | Multiple (in longDescription) | Yes | ✅ |
| Category | 1 | 0 | 0 | ⚠ No H2 sub-sections |
| About | 1 | 4 | 0 | ✅ |
| FAQ | 1 | 2 | 0 | ✅ |
| Glossary | 1 | 14 (each term) | 0 | ✅ |
| How-it-works | 1 | 1 | 0 | ⚠ Steps are div not h3 |
| Payment methods | 1 | 4 (one per method) | 0 | ✅ |
| Contact | 1 | 1 | 0 | ✅ |
| Privacy | 1 | 0 | 0 | 🔴 English H1, no sections |
| Terms | 1 | 0 | 0 | 🔴 English H1, no sections |

**Issues found:**
- **1 page with missing H1:** Homepage — the highest-priority page on the site
- **0 pages skipping heading levels** ✅
- **2 pages with English H1:** `/privacy` ("Privacy Policy") and `/terms` ("Terms of Service") — mismatch with Arabic audience
- How-it-works: 4 numbered steps (01–04) are `<div>` elements, not `<h3>` — missed semantic hierarchy

**Score: 6/10**

---

## 4. Internal Linking

### Links per page

| Page | Internal links | Quality |
|---|---|---|
| Homepage | 5 | ⚠ /account, /products, /category/{slug} x3 |
| Product page.tsx | 0 | ⚠ Breadcrumb via JSON-LD only |
| Category | 0 | ⚠ Product links inside ProductGrid component |
| About | 1 (/contact) | 🔴 Near-isolated |
| FAQ | 0 | 🔴 21 Q&As mention products — zero links |
| Glossary | 1 (/faq) | 🔴 14 terms define products — zero product links |
| How-it-works | 2 (/products, /payment-methods) | ⚠ Minimal |
| Payment methods | 1 | 🔴 Isolated |
| Contact | 1 (/faq) | 🔴 No links to products |
| Privacy / Terms | 0 | 🔴 Dead ends |

### Anchor text variety

- **Keyword-descriptive anchors in code:** "راجع الأسئلة الشائعة", "تواصل معنا", "تصفح الأسئلة الشائعة" ✅
- **Generic anchors ("اضغط هنا", "click here"):** 0 instances ✅
- **Most CTAs:** i18n t() keys — actual text at runtime; not statically auditable
- **Product-to-product cross-links:** 0
- **FAQ-to-product links:** 0
- **Glossary-to-product links:** 0

**Issues:**
- FAQ has 21 answers naming ChatGPT Plus, Canva Pro, CapCut, Coursera as plain text with zero `<Link>` to product pages — massive missed PageRank flow
- Glossary defines 14 products/services with zero links to matching product pages
- About page mentions multiple products in text but links nowhere

**Score: 4/10**

---

## 5. Product Copy Quality

| Metric | Value |
|---|---|
| Total products in seed | 20 (28 slugs minus 8 category slugs) |
| Products with longDescription | 18/20 (90%) |
| Products with features array | 18/20 (90%) |
| Products with FAQs | 18/20 (90%) |
| avg longDescription length | 631 chars (~130 words) |
| min / max longDescription | 325 / 1,201 chars |
| avg features per product | 6.0 items |
| avg FAQs per product | 3.5 Q&A pairs |

**Quality snapshot — ChatGPT Plus 2 months:**
- metaTitle: 'ChatGPT Plus شهرين — اشتراك في العراق | SoftoDev' — 50 chars ✅
- metaDescription: '...بـ 50,000 د.ع في العراق. GPT-4o + DALL-E 3. تفعيل فوري، دفع زين كاش.' — 94 chars ✅
- metaKeywords: 5 terms, Arabic + English variants ✅
- longDescription: ~900 chars, markdown-formatted, Iraqi payment section ✅
- features: 6 items with title + description + emoji icon ✅
- faqs: 5 Q&A pairs, all Iraq-specific ✅
- imageAlt: 'اشتراك ChatGPT Plus شهرين في العراق — SoftoDev' ✅

**Quality issues:**
- 2/20 products missing longDescription/features/FAQs (likely gaming category)
- All product images are placehold.co placeholder URLs — zero real product visuals; no Google Image indexing, no social sharing previews
- price field stores numeric value (e.g., 35) but metaDescription shows 50,000 د.ع — USD to IQD conversion exists but mismatch may cause confusion in content editing
- FAQs average 3.5 per product — below the recommended 5–10 for People Also Ask coverage

**Score: 8/10**

---

## 6. FAQ + Glossary Coverage

### `/faq` — 21 Q&A pairs in 6 groups

| Group | Count | Iraqi-specific? |
|---|---|---|
| عن المتجر | 3 | ✅ Baghdad, "متجر عراقي 100%" |
| طرق الدفع | 3 | ✅ ZainCash, COD Baghdad, no Visa |
| التفعيل والتوصيل | 3 | ✅ 30-minute activation, WhatsApp flow |
| الضمان والاسترداد | 3 | ✅ Refund policy, warranty terms |
| المنتجات | 4 | ✅ ChatGPT Plus vs Pro, CapCut iPhone/Android |
| التقنية والأمان | 5 | ✅ VPN, multi-device, data privacy |

- Iraqi-specific questions: 18/21 (86%) ✅
- "People Also Ask" coverage: ✅ Excellent — VPN, no-Visa, COD, auto-renewal all addressed
- Schema: ✅ FAQPage JSON-LD + itemProp="mainEntity" microdata
- Issue: Zero `<Link>` components — product names are plain text only, no links to product pages

### `/glossary` — 14 terms

| Category | Terms |
|---|---|
| Products | ChatGPT Plus, Canva Pro, CapCut Pro, Coursera Plus |
| AI features | GPT-5, DALL-E 3, Magic AI, Brand Kit |
| Payment | ZainCash, AsiaHawala, FastPay, IQD |
| Process | تفعيل الاشتراك, كاش عند الاستلام |

- Schema: ✅ DefinedTerm on each article element
- Bilingual: ⚠ Term names are bilingual (e.g., "زين كاش (ZainCash)") but definitions are Arabic-only
- Missing terms: License Key, Account Sharing, VPN, رمز التفعيل, Pro vs Premium distinction

**Score: 8/10**

---

## 7. Blog Content

**Blog routes exist:** NO — no src/app/blog/ directory

**Blog models in Prisma schema:** YES — BlogPost and BlogCategory fully defined with title, slug, excerpt, content, coverImage, metaTitle (VARCHAR 70), metaDescription (VARCHAR 170), tags, authorName, isPublished, publishedAt, viewCount, and proper indexes.

**Blog API routes:** None found
**Published posts:** 0

This is a critical SEO gap. The full data model is built but zero frontend pages were created.

**Recommended immediate actions:**
1. Build src/app/blog/page.tsx + src/app/blog/[slug]/page.tsx using the existing BlogPost schema
2. Write first 5 articles targeting high-intent Iraqi queries
3. Target 50–100 articles within 6 months for long-tail dominance

**Score: 0/10**

---

## 8. E-E-A-T Signals

| Signal | Present | Quality |
|---|---|---|
| Founder/team story | Partial | "SoftoDev" brand story — no founder name or photo |
| Physical address | YES | "بغداد، العراق" in Contact, FAQ, About |
| Phone number | Placeholder | 9647700000000 — calls will fail |
| WhatsApp | Placeholder | Same 9647700000000 |
| Telegram | YES | https://t.me/softodeviq |
| Email | YES | support@softodeviqstore.com |
| Reviews / testimonials | NO | No review section on any public page |
| Privacy policy | Skeleton | English-only, ~159 words |
| Terms of service | Skeleton | English-only, ~138 words |
| Trust badges | Metadata only | "ضمان كامل" in meta desc, no visual on-page badges |
| Customer count | YES | "+500 عميل راضٍ" on About page |
| Years in business | Weak | "تأسسنا 2026" — current year, no track record |

**Issues:**
- Placeholder phone/WhatsApp number 9647700000000 — must be replaced before launch
- No customer reviews or star ratings anywhere on the site (Review model exists in Prisma but no frontend)
- Privacy Policy and Terms are English stubs — negative E-E-A-T for Arabic-language pages
- No founder name, bio, or photo — digital services require human authority signals
- "+500 عميل" stat only on About subpage, not visible on homepage

**Score: 5/10**

---

## 9. Long-tail Keyword Opportunities

**Currently covered:** Product-level metaKeywords per product + root layout 10-term keyword array ✅

**Missed categories — no blog means no coverage:**
- How-to: "كيف أستخدم ChatGPT لكتابة المحتوى"
- Comparison: "ChatGPT Plus مقابل Pro أيهما أختار"
- Troubleshooting: "ChatGPT لا يعمل في العراق الحل"
- Price research: "سعر Canva Pro بالدينار العراقي 2026"
- Use-case: "استخدام CapCut Pro لتيك توك دليل"
- Category guides: "أفضل اشتراكات للمصمم العراقي"

**Score: 6/10**

---

## 10. Anchor Text Variety

- Keyword-descriptive anchors in code: "راجع الأسئلة الشائعة", "تواصل معنا", "تصفح الأسئلة الشائعة" ✅
- Generic anchors ("اضغط هنا", "click here"): 0 instances ✅
- Most CTAs use i18n t() keys — actual text rendered at runtime, not auditable statically
- Product-to-product cross-links: 0
- Editorial-to-product links from FAQ, Glossary, About: 0

**Score: 4/10**

---

## 🎯 AUDIT 2 — Priority Recommendations

### 🔴 Critical (do this week)

1. **Add H1 to homepage** — src/app/page.tsx has no H1. Add one above or within the editorial section, e.g., `اشتراكات رقمية أصلية في العراق — ChatGPT Plus، Canva Pro وأكثر`. 15-minute fix, high SEO impact.

2. **Replace placeholder phone/WhatsApp number** — 9647700000000 appears in src/app/contact/page.tsx, src/app/faq/page.tsx, and product FAQ seed data. Replace with the real business number before launch.

3. **Add generateMetadata to /contact** — Contact page is 'use client' with no metadata export. Extract to a server component wrapper or add a src/app/contact/layout.tsx with title, description, and canonical.

4. **Launch blog with 3+ articles** — BlogPost model exists in Prisma. Build src/app/blog/page.tsx and src/app/blog/[slug]/page.tsx. Even 3 articles targeting Iraqi search intent will outperform all on-page fixes for organic traffic.

### 🟡 High (do this month)

5. **Add Link from FAQ answers to product pages** — In src/app/faq/page.tsx, add Link components wherever ChatGPT Plus, Canva Pro, CapCut, Coursera appear in answers.

6. **Add Link from Glossary terms to product pages** — In src/app/glossary/page.tsx, each of the 4 product terms should link to /products/{slug}.

7. **Translate and expand Privacy Policy and Terms to Arabic** — Rewrite both pages in Arabic, minimum 600 words each. Critical for trust on an Arabic-first site.

8. **Add category intro paragraphs** — In src/app/(shop)/category/[slug]/page.tsx, add a 2–3 sentence descriptive paragraph between H1 and the product grid.

9. **Add trust/testimonials section to homepage** — Review model exists in Prisma. Add 3–5 static customer quote cards to src/app/page.tsx.

10. **Expand payment methods page** — src/app/payment-methods/page.tsx at ~282 words is the thinnest content page. Add step-by-step guides per payment method to reach 500+ words.

### 🟢 Polish (long-term)

11. Build blog with 20+ pillar articles in Arabic targeting Iraqi digital subscription queries
12. Add founder profile to About page: name, photo, credentials, founding story
13. Expand About page from ~350 to 700+ words
14. Increase product-level FAQs from 3.5 avg to 5–7 per product
15. Add 10+ glossary terms: License Key, رمز التفعيل, VPN, اشتراك مشترك, Pro vs Premium comparison

---

*End of Audit 2. Audit 3 (Schema validation, Core Web Vitals, crawlability deep-dive) to follow.*


# 🔍 AUDIT 3: AEO/GEO + IRAQI COMPETITIVE POSITIONING

**Date:** 2026-05-11
**Scope:** AI-search readiness + market position vs competitors
**Method:** Full code analysis + live web research (WebSearch tool)

---

## Executive Summary

| Category | Score (0-10) | Status |
|----------|--------------|--------|
| llms.txt completeness | 9/10 | ✅ Excellent |
| AI bot rules in robots.txt | 9/10 | ✅ Excellent |
| HowTo + FAQ schema | 8/10 | ✅ Strong |
| Speakable markup | 5/10 | 🟡 Partial |
| LocalBusiness completeness | 7/10 | 🟡 Good, gaps remain |
| Citation-worthy content | 5/10 | 🟡 Weak |
| Comparison content | 2/10 | 🔴 Critical gap |
| Authority signals | 2/10 | 🔴 Brand new site |
| Iraqi market positioning | 7/10 | 🟡 Clear but unproven |
| Competitive advantage clarity | 7/10 | 🟡 In schema, not visible content |
| **OVERALL AEO/GEO** | **61/100** | 🟡 Solid foundation, content gaps |

---

## 1. AEO Foundation

### llms.txt
**Status:** ✅ EXISTS at `src/app/llms.txt/route.ts`
**Implementation:** Dynamic Next.js route — fetches live products + categories from DB, revalidates every hour.

**Content coverage check:**

| Required field | Present | Notes |
|---------------|---------|-------|
| Brand identity statement | ✅ | "Iraq's first dedicated marketplace for authentic digital subscriptions" |
| Founded in Baghdad statement | ✅ | "founded in Baghdad in 2026" |
| Why SoftoDev (8 USPs) | ✅ | Iraqi-owned, IQD pricing, Cash on delivery, local payments, no Visa needed, warranty, authentic only |
| Payment methods listed | ✅ | ZainCash, AsiaHawala, FastPay, Cash on Delivery |
| Delivery time SLA | ✅ | "30-minute activation" |
| Service area | ✅ | "All 18 Iraqi governorates" (stated; not enumerated by name) |
| Key pages linked | ✅ | 8 pages with absolute URLs |
| Product categories | ✅ | Dynamic from DB |
| Featured products list | ✅ | Dynamic top 30 |
| Bilingual customer questions | ✅ | 11 questions in Arabic + English |
| Contact for AI crawlers | ✅ | Email provided |
| Last Updated timestamp | ✅ | Dynamic ISO string |
| Cache-Control header | ✅ | `public, max-age=3600` |
| IQD price anchors (e.g., "26,000 IQD/month") | ❌ | Missing — key citation anchor for AI engines |
| All 18 governorates by name | ❌ | Says "18" but doesn't enumerate them |

**Score: 9/10**

---

### AI bot rules in robots.txt
**File:** `src/app/robots.ts`

**16 AI user agents explicitly allowed (allow: '/'):**

| Bot | Company |
|-----|---------|
| GPTBot | OpenAI |
| ChatGPT-User | OpenAI |
| OAI-SearchBot | OpenAI |
| Google-Extended | Google (Gemini training) |
| GoogleOther | Google AI Overviews |
| ClaudeBot | Anthropic |
| anthropic-ai | Anthropic (alternate) |
| PerplexityBot | Perplexity |
| Perplexity-User | Perplexity |
| Bingbot | Microsoft / Copilot |
| Applebot | Apple Intelligence |
| Applebot-Extended | Apple AI training |
| YouBot | You.com |
| Meta-ExternalAgent | Meta AI |
| cohere-ai | Cohere |
| DeepSeekBot | DeepSeek |

**Scrapers correctly blocked:** SemrushBot, AhrefsBot, MJ12bot, DotBot, rogerbot, BLEXBot, PetalBot ✅
**Private paths blocked for all bots:** `/api/`, `/admin/`, `/checkout/`, `/account/` ✅

**Minor gaps (missing AI bots):**
- `Gemini-Web` / `Google-CloudVertexBot`
- `Bytespider` (TikTok/ByteDance AI)
- `Amazonbot` (Alexa)
- `Diffbot`

**Score: 9/10**

---

### Speakable markup
**Implementation:** `src/lib/schema.ts:311` → `speakableSpec()`

**Pages using speakable:**
- `/faq` ✅ — `speakableSpec(['.faq-question', '.faq-answer'])`

**Pages missing speakable (missed opportunity):**
- `/` — Homepage h1 + hero tagline
- `/how-it-works` — Step descriptions ideal for voice
- `/products/[slug]` — Product name + description
- `/about` — Brand story paragraph

Speakable tells Google Assistant / smart speakers what to read aloud when someone says "Hey Google, tell me about SoftoDev." Missing it on the homepage is the most impactful gap.

**Score: 5/10**

---

### HowTo + FAQ schema

**HowTo:** `src/app/how-it-works/page.tsx`
- 4 steps, `totalTime: PT30M`, `estimatedCost: 8000 IQD` ✅
- `supply` and `tool` arrays populated ✅
- Step URLs linking to `/products` and `/payment-methods` ✅
- `inLanguage: ar-IQ` ✅
- Drives Google AI Overviews for "how to buy ChatGPT Plus in Iraq"

**FAQPage schema:**
- `/faq` page: **22 Q&A pairs** ✅
- `/glossary` page: glossary terms as FAQ schema ✅
- `/products/[slug]` page: **7 default FAQs per product** ✅
  - Is [product] authentic? / Activation time? / No Visa needed? / Works in Iraq? / Support? / Cancel? / Multi-device?

**Total FAQ Q&As across site:** 22 (FAQ page) + ~20 (glossary) + 7×18 products = **~168 Q&As**

**Score: 8/10**

---

## 2. LocalBusiness Schema Completeness

**File:** `src/lib/schema.ts` → `organizationSchema()`
**Schema types:** `['Organization', 'OnlineStore']`

| Field | Present | Quality |
|-------|---------|---------|
| name | ✅ | SoftoDev |
| alternateName | ✅ | سوفتوديف, SoftoDev Iraq, softodeviq |
| description | ✅ | Arabic, mentions Baghdad 2026 |
| foundingDate | ✅ | 2026 |
| foundingLocation | ✅ | Baghdad, Iraq |
| address | ✅ | Baghdad, addressCountry: IQ |
| geo coordinates | ✅ | lat 33.3152 / lng 44.3661 (Baghdad) |
| contactPoint.telephone | ⚠️ | +9647700000000 — **PLACEHOLDER zeros** |
| contactPoint.areaServed | ✅ | IQ |
| openingHours 24/7 | ✅ | All 7 days, 00:00–23:59 |
| email | ✅ | support@softodeviqstore.com |
| areaServed (governorates) | ⚠️ | Iraq + 5 only (Baghdad, Basra, Erbil, Mosul, Najaf) |
| knowsAbout array | ✅ | 20 items (ChatGPT, Canva, ZainCash, IQD, Baghdad, etc.) |
| sameAs | ⚠️ | Facebook, Instagram, Telegram only — YouTube/Twitter/X absent |
| founder | ❌ | **NOT PRESENT** — critical E-E-A-T gap |
| priceRange | ✅ | $$ |
| paymentAccepted | ✅ | Cash on Delivery, ZainCash, AsiaHawala, FastPay |
| currenciesAccepted | ✅ | IQD |
| brand + slogan | ✅ | Arabic slogan |
| audience | ✅ | Iraqi consumers, students, creators |

**Critical issues:**
1. **Placeholder phone** (`+9647700000000` = all zeros) — Google may flag as low-quality. Fix before launch.
2. **No `founder` entity** — E-E-A-T requires a human. Add `founder: { '@type': 'Person', name: 'Ghaith', jobTitle: 'Founder', worksFor: { '@id': ORG_ID } }`
3. **areaServed has only 5 of 18 governorates** — add all 18 for complete Iraq coverage signal
4. **sameAs missing YouTube and Twitter/X** — even new/empty accounts help the knowledge graph once created

**Score: 7/10**

---

## 3. Citation-Worthy Content Audit

**Numbered facts in visible page content:** ❌ NONE FOUND
- No page states "Iraq has 39.6 million internet users"
- No page states "74% of Iraqi online traffic is from mobile"
- No "Iraqi digital market" stats page

**Definitive price statements in visible content:** ❌ MISSING
- `estimatedCost: 8000 IQD` exists in HowTo schema but is NOT displayed as text
- No page explicitly says "ChatGPT Plus = 26,000 IQD/month via SoftoDev"
- These anchors are exactly what ChatGPT/Perplexity cite when users ask "how much is ChatGPT Plus in Iraq?"

**Comparison tables:** ❌ NONE
- No "SoftoDev vs buying directly from OpenAI" comparison
- No competitor comparison table

**Step-by-step guides:** ✅ EXISTS
- `/how-it-works` with 4-step guide and HowTo schema ✓

**Glossary:** ✅ Good citation source
- Arabic definitions of digital terms that AI engines may cite

**FAQ page:** ✅ Strong
- 22 Q&As covering Iraqi-specific purchase questions

**Strong citation patterns present:**
- "30-minute activation" — concrete SLA
- "No Visa card needed" — definitive answer
- "Bilingual questions" in llms.txt indexed by AI crawlers
- 7 per-product default FAQs with Iraq-specific answers

**Missing high-value content (top citation opportunities):**
- "ChatGPT Plus price in Iraq 2026" with IQD number
- "Canva Pro price in Iraqi Dinar" article
- Stats page: Iraq internet market facts
- "Why buy via SoftoDev vs direct?" comparison page

**Score: 5/10**

---

## 4. Iraqi Competitive Landscape

*Live web research conducted 2026-05-11*

### Iraqi market context
- **39.6M internet users** (83.8% penetration, late 2025)
- **75% of online traffic is mobile**
- **E-commerce revenue: $1.317B in 2025** (growing 10–15% YoY)
- **Digital commerce projected: $21.71B by 2029**
- **22.5M e-commerce users** by 2025
- Iraq is in MENA AI search trend — ChatGPT is among top searched tech tools

### Top competitors for "اشتراك ChatGPT العراق"

**1. metadigital369.com ("متجر ميتا ديجيتال")**
- Phone: +966 (Saudi Arabia) — not Iraq-based
- Products: ChatGPT Plus, Netflix, YouTube Premium, Canva Pro, Gemini
- Trustpilot: 2.6/5 (100% 1-star reviews, 4 reviews)
- Scamadviser: LOW trust score, flagged potential scam
- Customer complaints: paid, received nothing, no response, comments deleted
- Weakness: Terrible reputation, Saudi-based, no Iraqi payments
- **Verdict: #1 search competitor but already damaged by fraud reputation**

**2. tafeil.net ("متجر تفعيل")**
- Has YouTube channel (content strategy)
- Products: Canva Pro, Adobe, Windows, Office, Grammarly, VidiQ, Freepik, Semrush
- Less AI-focused, no confirmed Iraqi presence
- Weakness: Not Iraq-specific, less AI product range
- **Verdict: Canva/design tools competitor — different primary audience**

**3. aifriendtools.com ("AI Friend Tools")**
- Arabic AI subscription store
- Has blog with articles (stronger SEO than metadigital)
- Products: ChatGPT Plus, Gemini Advanced, Coursera Plus, Rytr, BOLT
- Weakness: Pan-Arab (not Iraq-specific), unknown Iraqi payment methods
- **Verdict: Closest product-category match — pan-Arab audience, no Iraq focus**

**4. verce-digital.com ("VERCE DIGITAL")**
- Arabic digital subscriptions, ChatGPT Plus annual
- Less known, appears in Arabic search
- **Verdict: Minor competitor**

**5. raqamiyat.store**
- UAE-based, Canva Pro + ChatGPT + Adobe + LinkedIn + Office
- No IQD pricing, no Iraqi payments
- **Verdict: Regional competitor, not Iraq-specific**

**6. WhatsApp/Instagram/TikTok micro-sellers (unnamed)**
- The dominant volume competitor in Iraq — individual sellers via DM
- Zero SEO presence, no website, no structured data
- High scam rate → opportunity: SoftoDev wins on trust alone
- **Verdict: Biggest volume competitor, easiest to displace**

### Competitor weakness matrix

| Weakness | How common | SoftoDev advantage |
|----------|------------|-------------------|
| Not Iraq-based (Saudi/UAE/pan-Arab) | 4/5 named competitors | Baghdad-based, Iraq-first brand |
| No IQD pricing | 5/5 | Full IQD pricing throughout |
| No ZainCash/AsiaHawala/FastPay | 5/5 | All 4 Iraqi payment methods |
| No cash on delivery | 5/5 | COD available in Baghdad |
| Poor trust scores / scam reports | 2/5 visible | Clean launch, no negative history |
| No FAQ/HowTo/LocalBusiness schema | Very likely all | Comprehensive structured data |
| No llms.txt | Almost certainly all | llms.txt fully implemented |
| No bilingual AR/EN with RTL | Most | Full bilingual implementation |
| WhatsApp-only (no real website) | Majority in Iraq | Full e-commerce platform |
| Iraq-specific content | Most | 18-governorate coverage, Iraqi FAQs |

**Score: 7/10** *(structural advantages are real; track record is zero — expected for new brand)*

---

## 5. Search Volume & Trend Estimates

*Based on: Iraq internet population (39.6M), MENA AI trends, global ChatGPT volumes (768M searches/month globally)*

| Keyword (Arabic) | Est. Iraq monthly searches | Competition | Realistic timeline to top 5 |
|------------------|--------------------------|-------------|----------------------------|
| اشتراك ChatGPT العراق | 8,000–20,000 | Medium | 3–6 months |
| ChatGPT العراق | 15,000–40,000 | Medium | 4–8 months |
| اشتراك Canva Pro العراق | 3,000–8,000 | Low–Medium | 2–4 months |
| اشتراك Canva Pro | 5,000–15,000 | Medium | 4–8 months |
| اشتراكات رقمية العراق | 2,000–6,000 | Low | 2–3 months |
| اشتراك Coursera العراق | 2,000–5,000 | Low | 2–4 months |
| زين كاش دفع اشتراكات | 500–2,000 | Very low | 1–2 months |
| كوبيل بريميوم | 500–2,000 | Low | 2–3 months |
| فيفا كوينز 2026 | 3,000–10,000 | Medium | Depends on catalog |

### Key insight
Iraq's digital subscription keyword space has **low-to-medium competition** from structured SEO competitors. Most "competition" is WhatsApp sellers with zero web footprint. **The window to rank is open NOW** — first-mover with a real website can dominate Iraqi long-tail searches within months.

**Score: 8/10** *(opportunity clearly quantified)*

---

## 6. Authority Building Gaps

| Asset | Status | Priority |
|-------|--------|----------|
| Google Business Profile (Baghdad) | ❌ Not created | 🔴 Critical — required for local AI answers |
| Instagram @softodeviq | ⚠️ URL in schema, `''` in config | 🔴 High |
| Facebook @softodeviq | ⚠️ URL in schema | 🔴 High |
| Telegram @softodeviq | ⚠️ URL in schema | 🔴 High |
| TikTok | ❌ Empty string in config | 🟡 High (Iraq = heavy TikTok usage) |
| Twitter/X | ❌ Empty string in config | 🟡 Medium |
| YouTube channel | ❌ Empty string in config | 🟡 Medium (Arabic tutorials rank in Google) |
| LinkedIn company page | ❌ Not mentioned | 🟢 Low |
| Trustpilot profile | ❌ Not created | 🟡 High (trust signal + sameAs link) |
| Google Reviews | ❌ Requires GBP | 🔴 Critical |
| Backlinks from Iraqi tech blogs | ❌ New site | 🟡 Post-launch priority |
| Iraqi influencer partnerships | ❌ None | 🟡 High leverage (TikTok/IG) |
| Press/media mentions | ❌ None | 🟢 Long-term |
| Founder named publicly | ❌ Not in schema | 🔴 E-E-A-T requires this |

**Config issue:** `store.config.ts` has `tiktok: ''`, `twitter: ''`, `youtube: ''` as empty strings. Empty `sameAs` values in Organization schema can confuse the knowledge graph. Either populate these or remove from schema until the accounts exist.

**Score: 2/10** *(expected for a new brand — immediate actions compound fast)*

---

## 7. Indexable Page Count

**Genuine SEO content pages (excluding auth/account/checkout/admin):**

| Page | SEO Value |
|------|-----------|
| / (homepage) | 🔴 Critical |
| /products | 🔴 Critical |
| /about | 🟡 High |
| /contact | 🟡 High |
| /faq (22 Q&As) | 🔴 Critical |
| /glossary | 🔴 Critical |
| /how-it-works | 🟡 High |
| /payment-methods | 🟡 High |
| /privacy | 🟢 Low |
| /terms | 🟢 Low |
| /search | 🟡 Medium |
| /category/[slug] × ~8 | 🔴 Critical |
| /products/[slug] × ~18 | 🔴 Critical |

**Total current SEO-valuable pages: ~37**

**Non-SEO pages that should be `noindex`:** `/login`, `/register`, `/cart`, `/checkout*`, `/account/*` (10 pages wasting crawl budget)

**Recommended growth:**

| Milestone | Target | How |
|-----------|--------|-----|
| Launch | ~37 pages | Current state |
| Month 1–2 | ~55 pages | 10 keyword-targeted blog posts + 8 new products |
| Month 3–4 | ~80 pages | 25 more blog posts |
| Month 6 | ~120 pages | 40+ posts (pillar + cluster strategy) |
| Month 12 | ~200 pages | Full content moat |

---

## 🎯 AUDIT 3 — Strategic Recommendations

### 🔴 Critical (before or at launch)

1. **Replace placeholder phone number** — `+9647700000000` (all zeros) in `store.config.ts` and `src/lib/schema.ts`. Google's Knowledge Panel may reject or downrank Organization schema with a clearly fake phone. Use the real WhatsApp business number.

2. **Add `founder` to Organization schema** — E-E-A-T requires a human face:
   ```ts
   founder: {
     '@type': 'Person',
     name: 'Ghaith',
     jobTitle: 'Founder',
     worksFor: { '@id': ORG_ID },
     knowsAbout: ['Digital subscriptions Iraq', 'Iraqi e-commerce', 'AI tools'],
   }
   ```

3. **Create Google Business Profile** — Baghdad listing, even for an online-only store. GBP is how Google verifies a real Iraq-based business. Required for "near me" queries and AI knowledge graph.

4. **Activate social accounts and fill config** — `tiktok`, `twitter`, `youtube` are empty strings. Either create the accounts (even placeholder ones) or remove from `sameAs`. Empty URLs pollute the knowledge graph.

5. **Add speakable to homepage layout** — Add `speakableSpec(['h1', '.hero-description'])` to the root page's JSON-LD. This enables Google Assistant to read the brand description aloud.

### 🟡 High (first 2 months post-launch)

1. **Create IQD price anchor pages/posts** for top 3 products:
   - "سعر ChatGPT Plus في العراق 2026 — كم يكلف بالدينار؟"
   - "سعر Canva Pro بالدينار العراقي 2026"
   These are the most frequently AI-cited queries. Currently NO page on the site has a definitive IQD price in visible text.

2. **Write a "Why buy from SoftoDev vs direct?" comparison page** — A table comparing SoftoDev vs. direct OpenAI purchase: cost in IQD, payment method availability, activation complexity, support. High-citation content for AI engines.

3. **Add all 18 Iraqi governorates to `areaServed`** in `organizationSchema()` — Currently only 5 listed (Baghdad, Basra, Erbil, Mosul, Najaf). Add the remaining 13.

4. **Set `robots: { index: false }` on non-content pages** — `/login`, `/register`, `/cart`, `/checkout*`, `/account/*` should not be indexed. Saves crawl budget for real content.

5. **Add stats-rich content to About page** — Include:
   - "Iraq has 39.6 million internet users (83.8% penetration)"
   - "75% of Iraqi web traffic comes from mobile"
   - "ZainCash is Iraq's leading mobile wallet"
   These become citation targets for AI search answers about the Iraqi digital market.

6. **Register Trustpilot business profile** — Free listing. When customers review, it provides social proof AND a `sameAs` link for E-E-A-T.

### 🟢 Long-term moat (3–12 months)

1. **Build blog with 100+ articles** (pillar + cluster strategy):
   - Pillar: "دليل الاشتراكات الرقمية في العراق 2026"
   - Clusters: per-product how-to, comparison guides, "is X available in Iraq?" pages
   - Each article: 1 specific Iraqi keyword (e.g., "كيف أشترك في Coursera Plus من العراق")

2. **Launch TikTok presence** — Iraq is TikTok-heavy. Short videos showing activation process → trust + brand search + social signals. Even 10 videos can drive meaningful referral traffic.

3. **Iraqi influencer partnerships** — Baghdad tech/AI micro-influencers reviewing SoftoDev = backlinks + social proof + search spike.

4. **YouTube Arabic tutorials** — "كيف تشترك في ChatGPT Plus من العراق — شرح كامل" ranks in Google Search for Arabic queries. YouTube videos appear as rich results.

5. **Backlink outreach** — Iraqi .iq tech blogs (oscarte.iq, ddc.iq, alsabaah.iq for tech coverage) are potential link sources. One .iq backlink is worth 10 generic ones for Iraq-local ranking.

6. **Structured review system** — 10 genuine Iraqi customer reviews gives E-E-A-T signal no competitor currently has.

---

## Competitive Position Summary

### Where SoftoDev stands today (pre-launch)
SoftoDev has the **best AEO/SEO technical foundation of any Iraq-specific digital subscriptions platform** — llms.txt with AI bot rules, HowTo + FAQ schemas, LocalBusiness with Baghdad geo-coordinates, 16-bot robots.txt, bilingual content. No identified competitor has this level of structured data.

However: **zero track record.** New domain, no backlinks, no reviews, no social following, no indexed content yet.

### Realistic ranking expectations

| Target | Example keyword | Realistic timeline |
|--------|----------------|-------------------|
| Long-tail Iraqi, very low competition | "ZainCash اشتراك Coursera" | Top 3 within 4–8 weeks |
| Medium Iraqi keywords | "اشتراك ChatGPT بالدينار العراقي" | Top 5 within 3–4 months |
| Short Iraqi head terms | "اشتراك ChatGPT العراق" | Top 10 within 4–6 months |
| Pan-Arab head terms | "اشتراك Canva Pro" | Top 20 within 6–12 months |
| Global English terms | "ChatGPT Plus Iraq" | Not realistic (competing with OpenAI, GlobalGPT, etc.) |

### Defensible moat (what competitors cannot easily copy)

1. **True Iraqi payment infrastructure** — ZainCash, AsiaHawala, FastPay, Cash on Delivery requires physical Baghdad presence and banking relationships. Saudi/UAE competitors cannot replicate this without opening an Iraqi entity.

2. **Iraq-first brand identity** — Founded in Baghdad, IQD pricing, Arabic-first RTL with bilingual support, 18-governorate coverage. Competitors won't pivot their pan-Arab brand to Iraq-only positioning.

3. **AEO/SEO technical depth** — Full schema.ts, llms.txt, HowTo/FAQ markup, 16 AI bot rules. WhatsApp sellers and most web competitors have zero of this. This compounds over time as AI engines learn to cite SoftoDev.

4. **Content compounding** — Blog content written now compounds for years. First-mover on Iraqi-specific "how to subscribe to X from Iraq" content will dominate long-tail indefinitely.

5. **Trust by default** — Unlike metadigital369 (1-star Trustpilot, scam accusations), SoftoDev launches with a clean reputation. In a market where trust is the #1 purchase barrier, this is a real moat.

### Biggest risks

1. **No organic traffic until indexed** — New domain needs 2–4 weeks for Google to begin indexing. Paid social/WhatsApp ads needed for day-1 traffic.

2. **Coordinated negative reviews** — In a low-trust market, even a few fake bad reviews can stall momentum early. Monitor Trustpilot and respond rapidly.

3. **Content velocity** — At ~37 pages, the site will plateau without a blog. Content cadence is the single biggest growth lever.

4. **Social media void** — TikTok/Instagram/YouTube empty at launch means no branded search volume and no "social proof" when customers Google the brand before buying.

---

# 📊 FINAL CONSOLIDATED SEO SCORE

| Audit | Score | Status |
|-------|-------|--------|
| Audit 1: Technical SEO | see above | ✅ Completed |
| Audit 2: Content & On-Page | not run | — Run audit 2 to populate |
| Audit 3: AEO/GEO + Position | **61/100** | 🟡 Solid foundation, content gaps |

**Overall strategic assessment:**

SoftoDev is technically ahead of every identified Iraq competitor before it has launched. The AEO infrastructure (llms.txt, robot rules, HowTo, FAQ schema) is production-ready. The gaps are **content gaps, not technical gaps** — no IQD price statements, no comparison pages, no blog, no reviews, no social presence. These are all post-launch marketing and content tasks, not engineering tasks.

The Iraqi digital subscription market has a narrow window of low competition. The technical foundation is ready. **Ship, then build content.**

---

*Audit 3 completed: 2026-05-11*
*Sources: codebase analysis + DataReportal Digital 2026 Iraq, Statista Iraq e-commerce, metadigital369 Trustpilot/Scamadviser, Google MENA Year in Search 2025, Iraq e-commerce market research*
