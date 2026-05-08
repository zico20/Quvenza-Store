import type { MetadataRoute } from 'next';
import { storeConfig } from '@/config/store.config';

const BASE = storeConfig.seo.siteUrl;
const PRIVATE = ['/api/', '/admin/', '/checkout/', '/account/'];

type RobotsRule = { userAgent: string; allow: string; disallow: string[] };
const aiBot = (userAgent: string): RobotsRule => ({
  userAgent,
  allow: '/',
  disallow: PRIVATE,
});

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ── General crawlers ──────────────────────────────────────────
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/checkout/', '/account/', '/cart', '/_next/', '/admin/', '/login', '/register'],
      },

      // ── OpenAI ────────────────────────────────────────────────────
      aiBot('GPTBot'),           // ChatGPT web crawling
      aiBot('ChatGPT-User'),     // ChatGPT browsing on user behalf
      aiBot('OAI-SearchBot'),    // OpenAI search

      // ── Google ────────────────────────────────────────────────────
      aiBot('Google-Extended'),  // Gemini / Bard training
      aiBot('GoogleOther'),      // Google AI Overviews

      // ── Anthropic ─────────────────────────────────────────────────
      aiBot('ClaudeBot'),        // Claude web crawling
      aiBot('anthropic-ai'),     // Anthropic alternate name

      // ── Perplexity ────────────────────────────────────────────────
      aiBot('PerplexityBot'),    // Perplexity AI
      aiBot('Perplexity-User'),  // Perplexity user-initiated

      // ── Microsoft / Bing ──────────────────────────────────────────
      aiBot('Bingbot'),          // Bing / Copilot

      // ── Apple ─────────────────────────────────────────────────────
      aiBot('Applebot'),         // Apple Intelligence / Siri
      aiBot('Applebot-Extended'),// Apple AI training

      // ── Other AI ──────────────────────────────────────────────────
      aiBot('YouBot'),           // You.com AI search
      aiBot('Meta-ExternalAgent'), // Meta AI
      aiBot('cohere-ai'),        // Cohere
      aiBot('DeepSeekBot'),      // DeepSeek

      // ── Scrapers — block completely ───────────────────────────────
      {
        userAgent: ['SemrushBot', 'AhrefsBot', 'MJ12bot', 'DotBot', 'rogerbot', 'BLEXBot', 'PetalBot'],
        disallow: '/',
      },
    ],
    sitemap: [`${BASE}/sitemap.xml`],
    host: BASE,
  };
}
