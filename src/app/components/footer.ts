import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../services/i18n';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="container footer__grid">
        <div class="brand">
          <span class="brand__mark">✦</span> CleanSpace
        </div>
        <div class="footer__links">
          <a routerLink="/terms">{{ i18n.t('الشروط والأحكام', 'Terms & Conditions') }}</a>
          <a routerLink="/privacy">{{ i18n.t('سياسة الخصوصية', 'Privacy Policy') }}</a>
          <a routerLink="/" fragment="plans">{{ i18n.t('الاشتراكات', 'Subscriptions') }}</a>
          <a href="mailto:ai-platforms@fattouh.me">{{ i18n.t('تواصل معنا', 'Contact') }}</a>
        </div>
        <div class="footer__copy">© {{ year }} CleanSpace. {{ i18n.t('كل الحقوق محفوظة.', 'All rights reserved.') }}</div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  i18n = inject(I18n);
  year = new Date().getFullYear();
}
