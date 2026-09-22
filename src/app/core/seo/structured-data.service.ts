import { DOCUMENT, Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { I18n, LANGUAGES, type Lang } from '../../services/i18n';
import { APP_NAME, APP_SHORT_NAME, OG_IMAGE_PATH } from '../brand';
import { SEO_COPY } from './seo-copy';

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

    const faq = FAQ[lang];
    if (faq) {
      this.emit('faq', {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map((q) => ({
          '@type': 'Question',
          name: q.q,
          acceptedAnswer: { '@type': 'Answer', text: q.a },
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
    'Duplicate & similar photo detection',
    'Video compression and Live-to-Still conversion',
    'Swipe-to-clean review mode',
    'Encrypted private vault',
    'Duplicate contact merging',
    'Home Screen widgets',
    '21 languages',
    'Fully on-device — no uploads',
  ],
  ar: [
    'اكتشاف الصور المكررة والمتشابهة',
    'ضغط الفيديو وتحويل Live إلى صورة ثابتة',
    'وضع المراجعة بالسحب',
    'خزنة خاصة مشفّرة',
    'دمج جهات الاتصال المكررة',
    'أدوات الشاشة الرئيسية',
    '21 لغة',
    'كل المعالجة على الجهاز — بدون رفع',
  ],
};

/**
 * FAQ schema must mirror the FAQ actually rendered in that language. Only ar and
 * en are authored inline in the app, so only those two are emitted; every other
 * locale gets no FAQPage block, which is correct — an absent block is fine, a
 * mismatched one is a violation.
 */
const FAQ: Partial<Record<Lang, ReadonlyArray<{ q: string; a: string }>>> = {
  en: [
    {
      q: 'Are my photos uploaded to the internet?',
      a: 'No. All scanning and deleting happen entirely on your device, and the app works even offline. We never upload or see your photos.',
    },
    {
      q: 'What do I get for free?',
      a: 'A full scan, library analysis, and finding duplicates and look-alikes are free. Bulk deleting, video compression and the vault unlock with Pro.',
    },
    {
      q: 'Is there a free trial?',
      a: 'There is no trial period, but you can scan and analyze for free before subscribing to see how much space you can reclaim.',
    },
    {
      q: 'Can I cancel anytime?',
      a: 'Yes. Subscriptions are managed from your App Store settings, and you can turn off renewal at any time.',
    },
    {
      q: 'Is deleting safe?',
      a: 'Deleted items pass through the Photos app Recently Deleted album for 30 days, so you can restore them easily.',
    },
  ],
  ar: [
    {
      q: 'هل يتم رفع صوري إلى الإنترنت؟',
      a: 'لا. كل الفحص والحذف يتم بالكامل على جهازك، والتطبيق يعمل حتى بدون إنترنت. لا نرفع صورك ولا نطّلع عليها أبدًا.',
    },
    {
      q: 'ما الذي أحصل عليه مجانًا؟',
      a: 'الفحص الكامل وتحليل المكتبة والعثور على الصور المكررة والمتشابهة كلها مجانية. الحذف الجماعي وضغط الفيديو والخزنة تُفتح مع Pro.',
    },
    {
      q: 'هل توجد فترة تجريبية؟',
      a: 'لا توجد فترة تجريبية، لكن يمكنك الفحص والتحليل مجانًا قبل الاشتراك لترى كم مساحة يمكنك استعادتها.',
    },
    {
      q: 'هل يمكنني الإلغاء في أي وقت؟',
      a: 'نعم. تُدار الاشتراكات من إعدادات App Store، ويمكنك إيقاف التجديد في أي وقت.',
    },
    {
      q: 'هل الحذف آمن؟',
      a: 'العناصر المحذوفة تمر عبر ألبوم «المحذوفة مؤخرًا» في تطبيق الصور لمدة 30 يومًا، فيمكنك استعادتها بسهولة.',
    },
  ],
};
