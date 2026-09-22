import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../services/i18n';
import { APP_STORE_URL } from '../services/app-links';
import { GoogleAnalyticsService } from '../core/services/google-analytics.service';
import { RevealDirective } from '../directives/reveal';
import { SpotlightDirective } from '../directives/spotlight';
import { AppStoreBadgeComponent } from '../components/appstore-badge';
import { GooglePlayBadgeComponent } from '../components/googleplay-badge';

interface Feature { icon: string; arT: string; enT: string; arD: string; enD: string; }
interface Plan {
  arName: string; enName: string;
  /** What the customer pays today. */
  price: string;
  /** Pre-discount price, struck through beside `price` when present. */
  wasPrice?: string;
  arPer: string; enPer: string; featured: boolean; arTag?: string; enTag?: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-home',
  imports: [RouterLink, RevealDirective, SpotlightDirective, AppStoreBadgeComponent, GooglePlayBadgeComponent],
  template: `
    <!-- impeccable-disable broken-image -- every <img> below uses an Angular [src] binding
         to a real, lazy-loaded screenshot resolved at runtime; the static scan reads the
         binding as a non-literal src and false-flags it. -->
    <!-- Icon sprite: one coherent outline family (24px, 1.8 stroke, currentColor) -->
    <svg class="icon-sprite" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <symbol id="i-dup" viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></symbol>
      <symbol id="i-video" viewBox="0 0 24 24"><rect x="3" y="6" width="13" height="12" rx="2.5"/><path d="M16 10l5-3v10l-5-3"/></symbol>
      <symbol id="i-swipe" viewBox="0 0 24 24"><path d="M8 12H3m0 0 3-3m-3 3 3 3"/><path d="M16 12h5m0 0-3-3m3 3-3 3"/><circle cx="12" cy="12" r="1.3"/></symbol>
      <symbol id="i-contacts" viewBox="0 0 24 24"><circle cx="9" cy="9" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M16 6.2a3 3 0 0 1 0 5.6"/><path d="M17 13.4A5.5 5.5 0 0 1 20.5 18.5"/></symbol>
      <symbol id="i-files" viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h5"/></symbol>
      <symbol id="i-screenshot" viewBox="0 0 24 24"><path d="M7 3v13a1 1 0 0 0 1 1h13"/><path d="M17 21V8a1 1 0 0 0-1-1H3"/></symbol>
      <symbol id="i-vault" viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.4" r="1.3"/></symbol>
      <symbol id="i-widget" viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.6"/></symbol>
      <symbol id="i-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.4 3.9 5.6 3.9 9s-1.4 6.6-3.9 9c-2.5-2.4-3.9-5.6-3.9-9S9.5 5.4 12 3Z"/></symbol>
      <symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 3 5 6v5.5c0 4.3 3 7.3 7 9 4-1.7 7-4.7 7-9V6l-7-3Z"/><path d="M9.2 12.2l1.9 1.9 3.8-3.9"/></symbol>
      <symbol id="i-scan" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></symbol>
      <symbol id="i-review" viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></symbol>
      <symbol id="i-sparkle" viewBox="0 0 24 24"><path d="M12 4l1.7 4.6L18.3 10l-4.6 1.7L12 16l-1.7-4.3L5.7 10l4.6-1.4Z"/><path d="M19 4v3M20.5 5.5h-3"/></symbol>
      <symbol id="i-offline" viewBox="0 0 24 24"><path d="M3 3l18 18"/><path d="M5 12.6a10 10 0 0 1 4-2.4"/><path d="M8.7 16.3a5 5 0 0 1 3-1.4"/><path d="M12 20h.01"/><path d="M19 12.6a10 10 0 0 0-3.3-2.2"/></symbol>
      <symbol id="i-noaccount" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.2"/><path d="M6 20a6 6 0 0 1 10.5-4"/><path d="M4 4l16 16"/></symbol>
      <symbol id="i-notrack" viewBox="0 0 24 24"><path d="M3 3l18 18"/><path d="M10.6 10.6a3 3 0 0 0 4.2 4.2"/><path d="M9.8 5.2A9.6 9.6 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-2.4 3.3M6.2 6.2A17.4 17.4 0 0 0 2 12s3.5 7 10 7a9.5 9.5 0 0 0 4-.9"/></symbol>
      <symbol id="i-lock" viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></symbol>
    </svg>

    <!-- Hero -->
    <section class="hero">
      <div class="container hero__grid">
        <div class="hero__copy">
          <span class="eyebrow">{{ i18n.t('منظّف ذكي وآمن', 'Smart, private cleaner') }}</span>
          <h1 class="h-title">{{ i18n.t('حرّر مساحة جهازك في ثوانٍ', 'Free up your space in seconds') }}</h1>
          <p class="h-sub">
            {{ i18n.t(
              'CleanSpace يكتشف الصور المكررة والمتشابهة، يضغط الفيديو، ويرتّب مكتبتك — وكل المعالجة تتم على جهازك بالكامل.',
              'CleanSpace finds duplicate & similar photos, compresses videos, and tidies your library — all processed entirely on your device.') }}
          </p>
          <div class="hero__cta">
            <a class="btn btn--primary" routerLink="/" fragment="plans">{{ i18n.t('ابدأ الآن', 'Get started') }}</a>
            <a class="btn btn--ghost" routerLink="/" fragment="features">{{ i18n.t('اعرف أكثر', 'Learn more') }}</a>
          </div>
        </div>
        <div class="hero__art">
          <img class="hero__device" [src]="'screens/home_' + shotLang() + '.png'"
               [alt]="i18n.t('شاشة CleanSpace الرئيسية', 'CleanSpace home screen')">
          <div class="float-card float-card--a">
            <svg class="float-card__ic float-card__ic--up" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 19V5M12 5l-6 6M12 5l6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div class="float-card__body">
              <b>12.4 GB</b>
              <span>{{ i18n.t('حرّر المساحة', 'Free up space') }}</span>
            </div>
          </div>
          <div class="float-card float-card--b">
            <svg class="float-card__ic float-card__ic--ok" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="float-card__label">{{ i18n.t('بدون إنترنت', 'Works offline') }}</span>
          </div>
        </div>
      </div>
      <!-- trust band (below the hero, per editorial discipline) -->
      <div class="container">
        <ul class="trust-strip" [attr.aria-label]="i18n.t('لماذا تثق بنا', 'Why trust us')">
          @for (t of trust; track t.en) {
            <li class="trust-chip">
              <svg class="trust-chip__ic" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3 5 6v5.5c0 4.3 3 7.3 7 9 4-1.7 7-4.7 7-9V6l-7-3Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
                <path d="M9.2 12.2l1.9 1.9 3.8-3.9" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ i18n.t(t.ar, t.en) }}
            </li>
          }
        </ul>
      </div>
    </section>

    <!-- Features -->
    <section class="section" id="features">
      <div class="container">
        <div class="section-head" appReveal>
          <span class="eyebrow">{{ i18n.t('المميزات', 'Features') }}</span>
          <h2>{{ i18n.t('كل ما تحتاجه لتنظيف جهازك', 'Everything you need to clean up') }}</h2>
          <p>{{ i18n.t('أدوات قوية، بواجهة بسيطة، وخصوصية كاملة.', 'Powerful tools, a simple interface, and full privacy.') }}</p>
        </div>
        <div class="features__grid">
          <!-- Real-screenshot anchor cell grounds the grid in the actual app -->
          <figure class="feature-media" [appReveal]="0">
            <img [src]="'screens/home_' + shotLang() + '.png'"
                 [alt]="i18n.t('واجهة CleanSpace الرئيسية', 'The CleanSpace home screen')" loading="lazy">
            <figcaption>{{ i18n.t('لوحة واحدة تدير مساحتك كلها', 'One dashboard for all your space') }}</figcaption>
          </figure>
          @for (f of features; track f.enT) {
            <div class="feature" [appReveal]="($index + 1) * 60" appSpotlight>
              <span class="feature__icon"><svg class="ico" aria-hidden="true"><use [attr.href]="'#i-' + f.icon"/></svg></span>
              <h3>{{ i18n.t(f.arT, f.enT) }}</h3>
              <p>{{ i18n.t(f.arD, f.enD) }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="section section--alt" id="how">
      <div class="container">
        <div class="section-head" appReveal>
          <span class="eyebrow">{{ i18n.t('كيف يعمل', 'How it works') }}</span>
          <h2>{{ i18n.t('ثلاث خطوات فقط', 'Just three steps') }}</h2>
          <p>{{ i18n.t('من الفوضى إلى مساحة نظيفة في دقيقة.', 'From clutter to clean space in a minute.') }}</p>
        </div>
        <div class="steps">
          @for (s of steps; track s.enT; let i = $index) {
            <div class="step rv-scale" [appReveal]="i * 110">
              <span class="step__ghost" aria-hidden="true">{{ '0' + (i + 1) }}</span>
              <div class="step__badge">
                <svg class="ico" aria-hidden="true"><use [attr.href]="'#i-' + s.icon"/></svg>
              </div>
              <h3>{{ i18n.t(s.arT, s.enT) }}</h3>
              <p>{{ i18n.t(s.arD, s.enD) }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Screenshot showcase -->
    <section class="section" id="screens">
      <div class="container">
        <div class="section-head" appReveal>
          <span class="eyebrow">{{ i18n.t('من داخل التطبيق', 'Inside the app') }}</span>
          <h2>{{ i18n.t('تصميم بسيط، نتائج واضحة', 'Simple design, clear results') }}</h2>
          <p>{{ i18n.t('لقطات حقيقية من CleanSpace.', 'Real screenshots from CleanSpace.') }}</p>
        </div>
        <div class="showcase">
          @for (s of shots; track s.name; let i = $index) {
            <figure class="shot rv-scale" [class.shot--featured]="i === 1" [appReveal]="i * 120">
              <div class="shot__device">
                <img [src]="'screens/' + s.name + '_' + shotLang() + '.png'" [alt]="i18n.t(s.ar, s.en)" loading="lazy">
              </div>
              <figcaption class="shot__cap">{{ i18n.t(s.ar, s.en) }}</figcaption>
            </figure>
          }
        </div>
      </div>
    </section>

    <!-- Privacy -->
    <section class="section section--alt privacy" id="privacy-highlight">
      <div class="container">
        <div class="privacy__grid">
          <div class="privacy__lead" appReveal>
            <span class="privacy__shield"><svg class="ico" aria-hidden="true"><use href="#i-shield"/></svg></span>
            <span class="eyebrow">{{ i18n.t('الخصوصية أولاً', 'Privacy first') }}</span>
            <h2>{{ i18n.t('صورك لا تغادر جهازك — أبداً', 'Your photos never leave your device — ever') }}</h2>
            <p>{{ i18n.t(
              'كل الفحص والمقارنة والحذف يتم محلياً على الـ iPhone بقوة الشريحة نفسها. لا خوادم، لا رفع، لا تتبّع.',
              'All scanning, matching and deleting happen locally on your iPhone, powered by the chip itself. No servers, no uploads, no tracking.') }}</p>
            <div class="privacy__links">
              <a class="btn btn--ghost" routerLink="/privacy">{{ i18n.t('سياسة الخصوصية', 'Privacy Policy') }}</a>
            </div>
          </div>
          <ul class="privacy__pillars">
            @for (p of privacy; track p.enT) {
              <li class="privacy__pillar" [appReveal]="$index * 80" appSpotlight>
                <span class="privacy__icon"><svg class="ico" aria-hidden="true"><use [attr.href]="'#i-' + p.icon"/></svg></span>
                <div>
                  <h3>{{ i18n.t(p.arT, p.enT) }}</h3>
                  <p>{{ i18n.t(p.arD, p.enD) }}</p>
                </div>
              </li>
            }
          </ul>
        </div>
      </div>
    </section>

    <!-- Plans -->
    <section class="section" id="plans">
      <div class="container">
        <div class="section-head" appReveal>
          <span class="eyebrow">{{ i18n.t('الأسعار', 'Pricing') }}</span>
          <h2>{{ i18n.t('اختر خطتك', 'Choose your plan') }}</h2>
          <p>{{ i18n.t('افحص مجاناً، واشترك للتنظيف. ألغِ في أي وقت.', 'Scan for free, subscribe to clean. Cancel anytime.') }}</p>
        </div>
        <div class="plans__grid">
          @for (p of plans; track p.enName) {
            <div class="plan" [class.plan--featured]="p.featured" [appReveal]="$index * 90" appSpotlight>
              @if (p.featured) { <div class="plan__badge">{{ i18n.t('الأكثر شيوعًا', 'Most popular') }}</div> }
              <div class="plan__name">{{ i18n.t(p.arName, p.enName) }}</div>
              <div class="plan__price">
                @if (p.wasPrice) {
                  <s class="plan__was" [attr.aria-label]="i18n.t('السعر قبل الخصم', 'Regular price')">{{ p.wasPrice }}</s>
                }
                <b>{{ p.price }}</b><span>{{ i18n.t(p.arPer, p.enPer) }}</span>
              </div>
              @if (p.arTag) { <span class="eyebrow">{{ i18n.t(p.arTag, p.enTag!) }}</span> }
              <ul class="plan__list">
                @for (feat of proFeatures; track feat.en) {
                  <li>{{ i18n.t(feat.ar, feat.en) }}</li>
                }
              </ul>
              <a class="btn btn--primary btn--block plan__cta"
                 [href]="APP_STORE_URL"
                 target="_blank"
                 rel="noopener noreferrer"
                 (click)="analytics.downloadClick('plans_' + p.enName.toLowerCase().replace(' ', '_'))">
                {{ i18n.t('اشترك', 'Subscribe') }}
              </a>
            </div>
          }
        </div>
        <p class="plans__legal">
          {{ i18n.t(
            'الأسعار توضيحية وتُعرض بعملتك داخل التطبيق. خطتا الأسبوع والسنة اشتراكان يتجدّدان تلقائياً ما لم يتم إيقاف التجديد قبل ٢٤ ساعة من نهاية الفترة، أما «مدى الحياة» فهي عملية شراء واحدة بلا تجديد. يُحصَّل المبلغ من حساب Apple، ويمكن إدارة الاشتراك أو إلغاؤه من إعدادات الـ App Store.',
            'Prices are illustrative and shown in your currency inside the app. The weekly and yearly plans are subscriptions that renew automatically unless auto-renew is turned off at least 24 hours before the period ends; Lifetime is a one-time purchase with no renewal. Payment is charged to your Apple account, and you can manage or cancel from your App Store settings.') }}
        </p>
      </div>
    </section>

    <!-- Free vs Pro comparison -->
    <section class="section section--alt" id="compare">
      <div class="container">
        <div class="section-head" appReveal>
          <span class="eyebrow">{{ i18n.t('المقارنة', 'Compare') }}</span>
          <h2>{{ i18n.t('المجاني مقابل Pro', 'Free vs Pro') }}</h2>
          <p>{{ i18n.t('افحص وحلّل مجاناً. افتح التنظيف الكامل مع Pro.', 'Scan and analyze for free. Unlock full cleaning with Pro.') }}</p>
        </div>
        <div class="compare" appReveal>
          <div class="compare__head">
            <span>{{ i18n.t('الميزة', 'Feature') }}</span>
            <span>{{ i18n.t('مجاني', 'Free') }}</span>
            <span class="compare__pro">Pro</span>
          </div>
          @for (row of compare; track row.en) {
            <div class="compare__row">
              <span class="compare__label">{{ i18n.t(row.ar, row.en) }}</span>
              <span class="compare__cell" [class.compare__cell--no]="!row.free">
                <span aria-hidden="true">{{ row.free ? '✓' : '—' }}</span>
                <span class="sr-only">{{ row.free ? i18n.t('نعم', 'Yes') : i18n.t('لا', 'No') }}</span>
              </span>
              <span class="compare__cell compare__cell--yes">
                <span aria-hidden="true">✓</span>
                <span class="sr-only">{{ i18n.t('نعم', 'Yes') }}</span>
              </span>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section" id="faq">
      <div class="container container--narrow">
        <div class="section-head" appReveal>
          <span class="eyebrow">{{ i18n.t('الأسئلة الشائعة', 'FAQ') }}</span>
          <h2>{{ i18n.t('أسئلة يطرحها الجميع', 'Questions people ask') }}</h2>
        </div>
        <div class="faq">
          @for (item of faq; track item.enQ; let i = $index) {
            <details class="faq__item" [appReveal]="i * 60" [open]="i === 0">
              <summary class="faq__q">
                <span>{{ i18n.t(item.arQ, item.enQ) }}</span>
                <span class="faq__mark" aria-hidden="true">+</span>
              </summary>
              <div class="faq__a">{{ i18n.t(item.arA, item.enA) }}</div>
            </details>
          }
        </div>
      </div>
    </section>

    <!-- CTA band -->
    <section class="section--tight">
      <div class="container">
        <div class="cta-band" appReveal>
          <!-- Storage-gauge motif (echoes the app's home ring); fills in on reveal -->
          <svg class="cta-band__gauge" viewBox="0 0 240 240" aria-hidden="true">
            <circle class="cta-band__gauge-track" cx="120" cy="120" r="104"/>
            <circle class="cta-band__gauge-arc" cx="120" cy="120" r="104" transform="rotate(-90 120 120)"/>
          </svg>
          <h2>{{ i18n.t('جاهز تستعيد مساحتك؟', 'Ready to reclaim your space?') }}</h2>
          <p>{{ i18n.t('نزّل CleanSpace وابدأ التنظيف اليوم.', 'Download CleanSpace and start cleaning today.') }}</p>
          <div class="cta-band__actions">
            <div class="cta-band__badges">
              <app-appstore-badge placement="home_cta_band" />
              <app-googleplay-badge />
            </div>
            <span class="cta-band__note">{{ i18n.t('لـ iPhone • iOS 16 وأحدث', 'For iPhone • iOS 16 and later') }}</span>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HomeComponent {
  i18n = inject(I18n);
  readonly analytics = inject(GoogleAnalyticsService);
  readonly APP_STORE_URL = APP_STORE_URL;
  lang = this.i18n.lang;
  shotLang = this.i18n.shotLang;

  // Honest trust signals — reuses strings already in the translation catalog, so all
  // 21 languages are covered with no new translation work. (No fabricated reviews:
  // a real ratings/testimonials section belongs post-launch with genuine App Store data.)
  trust = [
    { ar: 'خصوصية كاملة', en: 'Full privacy' },
    { ar: 'بدون إنترنت', en: 'Works offline' },
    { ar: 'بلا حساب', en: 'No account' },
    { ar: 'بـ 21 لغة', en: 'In 21 languages' },
  ];

  features: Feature[] = [
    { icon: 'dup', arT: 'صور مكررة ومتشابهة', enT: 'Duplicates & look-alikes', arD: 'نعثر على النسخ المتطابقة والمتشابهة ونحذفها بضغطة.', enD: 'We find identical and similar photos and remove them in a tap.' },
    { icon: 'video', arT: 'ضغط الفيديو', enT: 'Video compression', arD: 'صغّر الفيديوهات وحوّل الصور الحية لصور ثابتة لتوفير مساحة.', enD: 'Shrink videos and convert Live Photos to stills to save space.' },
    { icon: 'swipe', arT: 'وضع السحب', enT: 'Swipe mode', arD: 'راجع صورك بسرعة — اسحب للاحتفاظ أو الحذف.', enD: 'Review fast — swipe to keep or delete.' },
    { icon: 'contacts', arT: 'جهات الاتصال المكررة', enT: 'Duplicate contacts', arD: 'ادمج جهات الاتصال المكررة مع الاحتفاظ بكل الأرقام والتفاصيل.', enD: 'Merge duplicate contacts while keeping every number and detail.' },
    { icon: 'files', arT: 'الملفات والوثائق', enT: 'Files & documents', arD: 'اعثر على أكبر الملفات وملفات PDF والفيديو ونظّفها.', enD: 'Find your largest files, PDFs and videos, and clear them.' },
    { icon: 'screenshot', arT: 'منظّف السكرينشوت', enT: 'Screenshot cleaner', arD: 'اكتشف السكرينشوت القديمة واحذفها دفعة واحدة.', enD: 'Spot old screenshots and clear them in bulk.' },
    { icon: 'vault', arT: 'الخزنة الخاصة', enT: 'Private vault', arD: 'صور محمية برمز PIN أو Face ID ومشفّرة على جهازك.', enD: 'Photos locked with a PIN or Face ID, encrypted on-device.' },
    { icon: 'widget', arT: 'ويدجت الشاشة الرئيسية', enT: 'Home Screen widgets', arD: 'شاهد المساحة والبطارية بنظرة من شاشتك الرئيسية.', enD: 'See storage and battery at a glance from your Home Screen.' },
    { icon: 'globe', arT: 'بـ 21 لغة', enT: 'In 21 languages', arD: 'واجهة كاملة بلغتك — بما فيها الكردية والعربية والفارسية.', enD: 'A fully localized interface in your language — including Kurdish, Arabic and Persian.' },
    { icon: 'shield', arT: 'خصوصية كاملة', enT: 'Full privacy', arD: 'كل المعالجة على جهازك — لا يُرفع أي شيء إلى أي خادم.', enD: 'Everything runs on-device — nothing is uploaded anywhere.' },
  ];

  steps = [
    { icon: 'scan', arT: 'افحص', enT: 'Scan', arD: 'يحلّل CleanSpace مكتبتك بالكامل على جهازك — بدون إنترنت.', enD: 'CleanSpace analyzes your whole library on-device — no internet needed.' },
    { icon: 'review', arT: 'راجع', enT: 'Review', arD: 'شاهد المكرر والمتشابه والفيديوهات الكبيرة، وكم مساحة يمكنك تحريرها.', enD: 'See duplicates, look-alikes and large videos — and how much you can reclaim.' },
    { icon: 'sparkle', arT: 'حرّر المساحة', enT: 'Free up space', arD: 'احذف ما لا تحتاجه بضغطة — احتفظ بالأفضل واحذف الباقي.', enD: 'Delete what you don’t need in a tap — keep the best, remove the rest.' },
  ];

  privacy = [
    { icon: 'offline', arT: 'بدون إنترنت', enT: 'Works offline', arD: 'يعمل بالكامل بدون اتصال — لا حاجة لشبكة إطلاقاً.', enD: 'Runs entirely offline — no connection ever required.' },
    { icon: 'noaccount', arT: 'بلا حساب', enT: 'No account', arD: 'لا تسجيل ولا بريد ولا رقم هاتف. حمّل وابدأ فوراً.', enD: 'No sign-up, email or phone number. Just download and go.' },
    { icon: 'notrack', arT: 'بلا تتبّع ولا إعلانات', enT: 'No tracking, no ads', arD: 'لا نجمع بياناتك ولا نبيعها ولا نعرض إعلانات.', enD: 'We don’t collect, sell your data, or show ads.' },
    { icon: 'lock', arT: 'خزنة مشفّرة', enT: 'Encrypted vault', arD: 'صورك الخاصة محمية بـ Face ID ومشفّرة على جهازك.', enD: 'Private photos are locked with Face ID and encrypted on-device.' },
  ];

  compare = [
    { ar: 'فحص التخزين وتحليل المكتبة', en: 'Storage scan & library analysis', free: true },
    { ar: 'اكتشاف المكرر والمتشابه', en: 'Find duplicates & look-alikes', free: true },
    { ar: 'حذف المكرر والمتشابه', en: 'Delete duplicates & look-alikes', free: false },
    { ar: 'ضغط الفيديو وتحويل الصور الحية', en: 'Video compression & Live→Still', free: false },
    { ar: 'الخزنة الخاصة المشفّرة', en: 'Encrypted private vault', free: false },
    { ar: 'دمج جهات الاتصال المكررة', en: 'Merge duplicate contacts', free: false },
    { ar: 'بدون إعلانات', en: 'No ads', free: false },
    { ar: 'دعم بأولوية', en: 'Priority support', free: false },
  ];

  faq = [
    {
      arQ: 'هل تُرفع صوري إلى الإنترنت؟',
      enQ: 'Are my photos uploaded to the internet?',
      arA: 'لا. كل الفحص والحذف يتم على جهازك بالكامل، ويعمل التطبيق حتى بدون اتصال. لا نرفع صورك ولا نراها إطلاقاً.',
      enA: 'No. All scanning and deleting happen entirely on your device, and the app works even offline. We never upload or see your photos.',
    },
    {
      arQ: 'ماذا أحصل عليه مجاناً؟',
      enQ: 'What do I get for free?',
      arA: 'الفحص الكامل وتحليل المكتبة واكتشاف المكرر والمتشابه مجاني. أما الحذف بالجملة وضغط الفيديو والخزنة فتُفتح مع Pro.',
      enA: 'A full scan, library analysis, and finding duplicates & look-alikes are free. Bulk deleting, video compression and the vault unlock with Pro.',
    },
    {
      arQ: 'ما الفرق بين الأسبوعي والسنوي ومدى الحياة؟',
      enQ: 'What’s the difference between Weekly, Yearly and Lifetime?',
      arA: 'الأسبوعي والسنوي اشتراكان يتجدّدان تلقائياً، والسنوي أوفر بكثير. «مدى الحياة» عملية شراء واحدة بلا تجديد.',
      enA: 'Weekly and Yearly are auto-renewing subscriptions, with Yearly far cheaper over time. Lifetime is a single one-time purchase with no renewal.',
    },
    {
      arQ: 'هل هناك تجربة مجانية؟',
      enQ: 'Is there a free trial?',
      arA: 'لا توجد فترة تجريبية، لكن يمكنك الفحص والتحليل مجاناً قبل الاشتراك لترى كم مساحة يمكنك تحريرها.',
      enA: 'There’s no trial period, but you can scan and analyze for free before subscribing to see exactly how much space you can reclaim.',
    },
    {
      arQ: 'هل يمكنني الإلغاء في أي وقت؟',
      enQ: 'Can I cancel anytime?',
      arA: 'نعم. تُدار الاشتراكات من إعدادات الـ App Store، ويمكنك إيقاف التجديد في أي وقت.',
      enA: 'Yes. Subscriptions are managed from your App Store settings, and you can turn off renewal at any time.',
    },
    {
      arQ: 'هل الحذف آمن؟ ماذا لو حذفت شيئاً بالخطأ؟',
      enQ: 'Is deleting safe? What if I remove something by mistake?',
      arA: 'يمرّ المحذوف عبر ألبوم «المحذوفة مؤخراً» في تطبيق الصور لمدة ٣٠ يوماً، فيمكنك الاستعادة بسهولة.',
      enA: 'Deleted items pass through the Photos app’s “Recently Deleted” album for 30 days, so you can restore them easily.',
    },
  ];

  proFeatures = [
    { ar: 'إزالة غير محدودة للمكرر والمتشابه', en: 'Unlimited duplicate & similar removal' },
    { ar: 'ضغط الفيديو وتحويل الصور الحية', en: 'Video compression & Live→Still' },
    { ar: 'الخزنة الخاصة بلا حدود', en: 'Unlimited private vault' },
    { ar: 'بدون إعلانات', en: 'No ads' },
    { ar: 'دعم بأولوية', en: 'Priority support' },
  ];

  // Matches the app's actual StoreKit products: weekly / yearly / lifetime (NO monthly,
  // NO free trial). Prices are illustrative (shown per-currency in the App Store).
  plans: Plan[] = [
    { arName: 'أسبوعي', enName: 'Weekly', price: '$6.99', arPer: '/ أسبوع', enPer: '/ week', featured: true },
    { arName: 'سنوي', enName: 'Yearly', price: '$19.99', wasPrice: '$39.99', arPer: '/ سنة', enPer: '/ year', featured: false, arTag: 'خصم ٥٠٪', enTag: '50% off' },
    { arName: 'مدى الحياة', enName: 'Lifetime', price: '$39.99', arPer: 'دفعة واحدة', enPer: 'one-time', featured: false, arTag: 'أفضل قيمة', enTag: 'Best value' },
  ];

  shots = [
    { name: 'settings', ar: 'الإعدادات', en: 'Settings' },
    { name: 'video', ar: 'ضغط الفيديو', en: 'Video compression' },
    { name: 'widgets', ar: 'الويدجت', en: 'Widgets' },
  ];
}
