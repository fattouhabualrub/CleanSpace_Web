import { DOCUMENT, Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { I18n, LANGUAGES, type Lang } from '../../services/i18n';
import { APP_NAME, APP_SHORT_NAME, OG_IMAGE_PATH } from '../brand';
import { SEO_COPY } from './seo-copy';
import { FAQ } from '../content/faq';

/** Marks the nodes this service owns, so it can replace exactly its own. */
const OWNED = 'data-jsonld';

/**
 * Developer of record. Taken from the published privacy policy and terms, which
 * both name "Animi-soft" as the developer of CleanSpace — confirm the exact
 * registered legal form (Ltd / LLC / est.) before this is treated as final.
 */
const PUBLISHER = { '@type': 'Organization', name: 'Animi-soft' } as const;

/**
 * Emits JSON-LD per locale at render time.
 *
 * Previously both blocks were hardcoded English in index.html, which meant an
 * Arabic page shipped English FAQ schema — a structured-data mismatch that can
 * earn a manual action. The FAQ block is only emitted for locales whose FAQ we
 * can actually state in that language.
 */
@Injectable({ providedIn: 'root' })
export class StructuredDataService {
  private readonly doc = inject(DOCUMENT);
  private readonly i18n = inject(I18n);

  private readonly site = environment.siteUrl;

  /** Rewrites all owned JSON-LD blocks for the active locale and given path. */
  update(path: string): void {
    const lang = this.i18n.lang();
    const clean = path.replace(/^\/+|\/+$/g, '');
    const url = clean ? `${this.site}/${lang}/${clean}` : `${this.site}/${lang}`;

    this.doc.head.querySelectorAll(`script[${OWNED}]`).forEach((n) => n.remove());

    this.emit('website', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: APP_SHORT_NAME,
      url: `${this.site}/${lang}`,
      inLanguage: LANGUAGES.map((l) => l.code),
      publisher: PUBLISHER,
    });

    this.emit('app', {
      '@context': 'https://schema.org',
      '@type': 'MobileApplication',
      name: APP_NAME,
      alternateName: APP_SHORT_NAME,
      operatingSystem: 'iOS 16.0 or later',
      applicationCategory: 'UtilitiesApplication',
      description: SEO_COPY[lang].description,
      url,
      author: PUBLISHER,
      installUrl: environment.appStoreUrl,
      image: `${this.site}${OG_IMAGE_PATH}`,
      inLanguage: LANGUAGES.map((l) => l.code),
      offers: [
        { '@type': 'Offer', price: '0', priceCurrency: 'USD', name: 'Free — scan & analyze' },
        { '@type': 'Offer', price: '6.99', priceCurrency: 'USD', name: 'Pro Weekly' },
        { '@type': 'Offer', price: '19.99', priceCurrency: 'USD', name: 'Pro Yearly' },
        { '@type': 'Offer', price: '39.99', priceCurrency: 'USD', name: 'Pro Lifetime' },
      ],
      featureList: FEATURE_LIST[lang] ?? FEATURE_LIST['en'],
      // NOTE (owner): no aggregateRating here on purpose — inventing rating or
      // review counts is a policy violation. Supply real App Store figures to add it.
    });

    // Only ar and en are authored, and the schema must mirror the copy the page
    // actually renders — an absent FAQPage block is fine, a mismatched one is not.
    if (lang === 'ar' || lang === 'en') {
      this.emit('faq', {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQ.map((q) => ({
          '@type': 'Question',
          name: lang === 'ar' ? q.arQ : q.enQ,
          acceptedAnswer: { '@type': 'Answer', text: lang === 'ar' ? q.arA : q.enA },
        })),
      });
    }
  }

  private emit(id: string, data: unknown): void {
    const script = this.doc.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute(OWNED, id);
    script.textContent = JSON.stringify(data);
    this.doc.head.appendChild(script);
  }
}

/** Localized only where the page itself is localized; others fall back to English. */
const FEATURE_LIST: Partial<Record<Lang, string[]>> = {
  en: [
    'Duplicate, similar, burst and blurry photo detection',
    'Screenshot, large-video and similar-video cleanup',
    'Video compression and Live-to-Still conversion',
    'Swipe-to-clean review mode with an undo bin',
    'Encrypted Secret Vault',
    'Duplicate contact merging and contact backup',
    'Files & Documents folder scanning',
    'Albums and smart collections',
    'On This Day memories',
    'Cleaning history',
    'Home Screen widgets',
    '21 languages',
    'Fully on-device — no uploads',
  ],
  ar: [
    'اكتشاف الصور المكررة والمتشابهة واللقطات المتتابعة وغير الواضحة',
    'تنظيف السكرينشوت والفيديوهات الكبيرة والمتشابهة',
    'ضغط الفيديو وتحويل Live إلى صورة ثابتة',
    'وضع المراجعة بالسحب مع سلة للتراجع',
    'الخزنة السرية المشفّرة',
    'دمج جهات الاتصال المكررة والنسخ الاحتياطي لها',
    'فحص مجلدات الملفات والوثائق',
    'الألبومات والمجموعات الذكية',
    'ذكريات «في مثل هذا اليوم»',
    'سجلّ التنظيف',
    'أدوات الشاشة الرئيسية',
    '21 لغة',
    'كل المعالجة على الجهاز — بدون رفع',
  ],
};
