import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../services/i18n';
import { AppStoreBadgeComponent } from './appstore-badge';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-footer',
  imports: [RouterLink, AppStoreBadgeComponent],
  template: `
    <footer class="footer">
      <div class="container footer__top">
        <div class="footer__brandcol">
          <div class="brand"><span class="brand__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path transform="translate(12.8 14.2) scale(1.097) translate(-12 -8.6)" d="M12 2.4c.55 4.35 1.85 5.65 6.2 6.2-4.35.55-5.65 1.85-6.2 6.2-.55-4.35-1.85-5.65-6.2-6.2 4.35-.55 5.65-1.85 6.2-6.2Z"/>
              <path transform="translate(7.3 8.8) scale(0.597) translate(-12 -8.6)" d="M12 2.4c.55 4.35 1.85 5.65 6.2 6.2-4.35.55-5.65 1.85-6.2 6.2-.55-4.35-1.85-5.65-6.2-6.2 4.35-.55 5.65-1.85 6.2-6.2Z"/>
              <path transform="translate(14.8 5.2) scale(0.387) translate(-12 -8.6)" d="M12 2.4c.55 4.35 1.85 5.65 6.2 6.2-4.35.55-5.65 1.85-6.2 6.2-.55-4.35-1.85-5.65-6.2-6.2 4.35-.55 5.65-1.85 6.2-6.2Z"/>
            </svg>
          </span> CleanSpace</div>
          <p class="footer__tagline">
            {{ i18n.t('منظّف ذكي وخاص لجهازك — كل المعالجة على جهازك.',
                      'A smart, private cleaner for your device — all processing stays on-device.') }}
          </p>
          <app-appstore-badge placement="footer" />
        </div>
        <nav class="footer__col">
          <h4>{{ i18n.t('المنتج', 'Product') }}</h4>
          <a routerLink="/download">{{ i18n.t('تحميل التطبيق', 'Download the app') }}</a>
          <a routerLink="/" fragment="features">{{ i18n.t('الميزات', 'Features') }}</a>
          <a routerLink="/" fragment="compare">{{ i18n.t('المقارنة', 'Compare') }}</a>
          <a routerLink="/" fragment="plans">{{ i18n.t('الأسعار', 'Plans') }}</a>
          <a routerLink="/" fragment="faq">{{ i18n.t('الأسئلة الشائعة', 'FAQ') }}</a>
        </nav>
        <nav class="footer__col">
          <h4>{{ i18n.t('قانوني', 'Legal') }}</h4>
          <a routerLink="/terms">{{ i18n.t('الشروط والأحكام', 'Terms & Conditions') }}</a>
          <a routerLink="/privacy">{{ i18n.t('سياسة الخصوصية', 'Privacy Policy') }}</a>
          <a routerLink="/" fragment="plans">{{ i18n.t('الاشتراكات', 'Subscriptions') }}</a>
        </nav>
        <nav class="footer__col">
          <h4>{{ i18n.t('تواصل', 'Contact') }}</h4>
          <a routerLink="/support">{{ i18n.t('راسلنا', 'Contact us') }}</a>
          <a href="mailto:support@cleaningspace.app">{{ i18n.t('الدعم', 'Support') }}</a>
        </nav>
      </div>
      <div class="container footer__bottom">
        <span class="footer__copy">© {{ year }} CleanSpace. {{ i18n.t('كل الحقوق محفوظة.', 'All rights reserved.') }}</span>
        <span class="footer__made">{{ i18n.t('صُنع بعناية لخصوصيتك.', 'Made with care for your privacy.') }}</span>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  i18n = inject(I18n);
  year = new Date().getFullYear();
}
