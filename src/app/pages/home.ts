import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../services/i18n';
import { RevealDirective } from '../directives/reveal';

interface Feature { icon: string; arT: string; enT: string; arD: string; enD: string; }
interface Plan { arName: string; enName: string; price: string; arPer: string; enPer: string; featured: boolean; arTag?: string; enTag?: string; }

@Component({
  selector: 'app-home',
  imports: [RouterLink, RevealDirective],
  template: `
    <!-- Hero -->
    <section class="hero">
      <div class="orbs" aria-hidden="true">
        <span class="orb orb--1"></span><span class="orb orb--2"></span><span class="orb orb--3"></span>
      </div>
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
          <span class="hero__note">{{ i18n.t('لا يُرفع أي شيء • يعمل بدون إنترنت', 'Nothing is uploaded • Works offline') }}</span>
        </div>
        <div class="hero__art">
          <img class="hero__device" [src]="'screens/home_' + lang() + '.png'"
               [alt]="i18n.t('شاشة CleanSpace الرئيسية', 'CleanSpace home screen')">
        </div>
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
          @for (f of features; track f.enT) {
            <div class="feature" [appReveal]="$index * 70">
              <div class="feature__icon">{{ f.icon }}</div>
              <h3>{{ i18n.t(f.arT, f.enT) }}</h3>
              <p>{{ i18n.t(f.arD, f.enD) }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Screenshot showcase -->
    <section class="section" id="screens" style="background:var(--bg-2)">
      <div class="container">
        <div class="section-head" appReveal>
          <span class="eyebrow">{{ i18n.t('من داخل التطبيق', 'Inside the app') }}</span>
          <h2>{{ i18n.t('تصميم بسيط، نتائج واضحة', 'Simple design, clear results') }}</h2>
          <p>{{ i18n.t('لقطات حقيقية من CleanSpace.', 'Real screenshots from CleanSpace.') }}</p>
        </div>
        <div class="showcase__row">
          @for (s of shots; track s.name) {
            <figure class="shot" [appReveal]="$index * 110">
              <img [src]="'screens/' + s.name + '_' + lang() + '.png'" [alt]="i18n.t(s.ar, s.en)" loading="lazy">
              <figcaption>{{ i18n.t(s.ar, s.en) }}</figcaption>
            </figure>
          }
        </div>
      </div>
    </section>

    <!-- Plans -->
    <section class="section" id="plans" style="background:var(--bg)">
      <div class="container">
        <div class="section-head" appReveal>
          <span class="eyebrow">{{ i18n.t('الأسعار', 'Pricing') }}</span>
          <h2>{{ i18n.t('اختر خطتك', 'Choose your plan') }}</h2>
          <p>{{ i18n.t('جرّب مجاناً، وألغِ في أي وقت. كل الخطط تفتح كل المميزات.', 'Try free, cancel anytime. Every plan unlocks all features.') }}</p>
        </div>
        <div class="plans__grid">
          @for (p of plans; track p.enName) {
            <div class="plan" [class.plan--featured]="p.featured" [appReveal]="$index * 90">
              @if (p.featured) { <div class="plan__badge">{{ i18n.t('الأكثر شيوعًا', 'Most popular') }}</div> }
              <div class="plan__name">{{ i18n.t(p.arName, p.enName) }}</div>
              <div class="plan__price"><b>{{ p.price }}</b><span>{{ i18n.t(p.arPer, p.enPer) }}</span></div>
              @if (p.arTag) { <span class="eyebrow">{{ i18n.t(p.arTag, p.enTag!) }}</span> }
              <ul class="plan__list">
                @for (feat of proFeatures; track feat.en) {
                  <li>{{ i18n.t(feat.ar, feat.en) }}</li>
                }
              </ul>
              <a class="btn btn--primary btn--block plan__cta" routerLink="/" fragment="plans">
                {{ i18n.t('اشترك', 'Subscribe') }}
              </a>
            </div>
          }
        </div>
        <p class="plans__legal">
          {{ i18n.t(
            'الأسعار توضيحية وتُعرض بعملتك داخل التطبيق. الاشتراكات تتجدّد تلقائياً ما لم يتم إيقاف التجديد قبل ٢٤ ساعة من نهاية الفترة. يُحصَّل المبلغ من حساب Apple، ويمكن إدارة الاشتراك أو إلغاؤه من إعدادات الـ App Store. أي جزء غير مستخدم من فترة تجريبية مجانية يسقط عند شراء اشتراك.',
            'Prices are illustrative and shown in your currency inside the app. Subscriptions renew automatically unless auto-renew is turned off at least 24 hours before the period ends. Payment is charged to your Apple account, and you can manage or cancel from your App Store settings. Any unused portion of a free trial is forfeited when you buy a subscription.') }}
        </p>
      </div>
    </section>

    <!-- CTA band -->
    <section class="section--tight">
      <div class="container">
        <div class="cta-band" appReveal>
          <h2>{{ i18n.t('جاهز تستعيد مساحتك؟', 'Ready to reclaim your space?') }}</h2>
          <p>{{ i18n.t('نزّل CleanSpace وابدأ التنظيف اليوم.', 'Download CleanSpace and start cleaning today.') }}</p>
          <a class="btn btn--primary" routerLink="/" fragment="plans">{{ i18n.t('حمّل الآن', 'Get the App') }}</a>
        </div>
      </div>
    </section>
  `,
})
export class HomeComponent {
  i18n = inject(I18n);
  lang = this.i18n.lang;

  features: Feature[] = [
    { icon: '🗂️', arT: 'صور مكررة ومتشابهة', enT: 'Duplicates & look-alikes', arD: 'نعثر على النسخ المتطابقة والمتشابهة ونحذفها بضغطة.', enD: 'We find identical and similar photos and remove them in a tap.' },
    { icon: '🎞️', arT: 'ضغط الفيديو', enT: 'Video compression', arD: 'صغّر الفيديوهات وحوّل الصور الحية لصور ثابتة لتوفير مساحة.', enD: 'Shrink videos and convert Live Photos to stills to save space.' },
    { icon: '👆', arT: 'وضع السحب', enT: 'Swipe mode', arD: 'راجع صورك بسرعة — اسحب للاحتفاظ أو الحذف.', enD: 'Review fast — swipe to keep or delete.' },
    { icon: '🔒', arT: 'الخزنة الخاصة', enT: 'Private vault', arD: 'صور محمية برمز PIN أو Face ID ومشفّرة على جهازك.', enD: 'Photos locked with a PIN or Face ID, encrypted on-device.' },
    { icon: '🧱', arT: 'ويدجت الشاشة الرئيسية', enT: 'Home Screen widgets', arD: 'شاهد المساحة والبطارية بنظرة من شاشتك الرئيسية.', enD: 'See storage and battery at a glance from your Home Screen.' },
    { icon: '🛡️', arT: 'خصوصية كاملة', enT: 'Full privacy', arD: 'كل المعالجة على جهازك — لا يُرفع أي شيء إلى أي خادم.', enD: 'Everything runs on-device — nothing is uploaded anywhere.' },
  ];

  proFeatures = [
    { ar: 'إزالة غير محدودة للمكرر والمتشابه', en: 'Unlimited duplicate & similar removal' },
    { ar: 'ضغط الفيديو وتحويل الصور الحية', en: 'Video compression & Live→Still' },
    { ar: 'الخزنة الخاصة بلا حدود', en: 'Unlimited private vault' },
    { ar: 'بدون إعلانات', en: 'No ads' },
    { ar: 'دعم بأولوية', en: 'Priority support' },
  ];

  plans: Plan[] = [
    { arName: 'أسبوعي', enName: 'Weekly', price: '$2.99', arPer: '/ أسبوع', enPer: '/ week', featured: false },
    { arName: 'شهري', enName: 'Monthly', price: '$6.99', arPer: '/ شهر', enPer: '/ month', featured: false },
    { arName: 'سنوي', enName: 'Yearly', price: '$29.99', arPer: '/ سنة', enPer: '/ year', featured: true, arTag: 'أوفر ٨٠٪', enTag: 'Save 80%' },
  ];

  shots = [
    { name: 'settings', ar: 'الإعدادات', en: 'Settings' },
    { name: 'video', ar: 'ضغط الفيديو', en: 'Video compression' },
    { name: 'widgets', ar: 'الويدجت', en: 'Widgets' },
  ];
}
