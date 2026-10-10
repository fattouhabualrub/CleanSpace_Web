import { Component, inject, signal, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../services/i18n';
import { APP_STORE_URL } from '../services/app-links';
import { APP_NAME, APP_SHORT_NAME } from '../core/brand';
import { GoogleAnalyticsService } from '../core/services/google-analytics.service';
import { LanguagePickerComponent } from './language-picker';
import { ThemeToggleComponent } from './theme-toggle';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header',
  imports: [RouterLink, LanguagePickerComponent, ThemeToggleComponent],
  template: `
    <a class="skip-link" href="#main-content">{{ i18n.t('تخطَّ إلى المحتوى', 'Skip to content') }}</a>
    <nav class="nav" [class.nav--scrolled]="scrolled()">
      <div class="nav__inner">
        <a class="brand" routerLink="/" [attr.aria-label]="i18n.t('كلين سبيس — الصفحة الرئيسية', 'CleanSpace — home')">
          <span class="brand__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M11.26 6.95 A5.68 5.68 0 1 0 16.94 12.63" fill="none" stroke="currentColor" stroke-width="2.39"/>
              <path fill="currentColor" transform="translate(15.84 8.17) scale(0.605) translate(-12 -8.6)" d="M12 2.4c.55 4.35 1.85 5.65 6.2 6.2-4.35.55-5.65 1.85-6.2 6.2-.55-4.35-1.85-5.65-6.2-6.2 4.35-.55 5.65-1.85 6.2-6.2Z"/>
            </svg>
          </span><span class="brand__name">{{ APP_SHORT_NAME }}<span class="brand__suffix">{{ APP_NAME_SUFFIX }}</span></span>
        </a>
        <div class="nav__links">
          <a routerLink="/" fragment="try">{{ i18n.t('وضع السحب', 'Swipe mode') }}</a>
          <a routerLink="/" fragment="features">{{ i18n.t('الميزات', 'Features') }}</a>
          <a routerLink="/" fragment="plans">{{ i18n.t('الأسعار', 'Plans') }}</a>
          <a routerLink="/support">{{ i18n.t('الدعم', 'Support') }}</a>
          <a routerLink="/privacy">{{ i18n.t('الخصوصية', 'Privacy') }}</a>
        </div>
        <div class="nav__actions">
          <app-theme-toggle />
          <app-language-picker />
          <a class="btn btn--primary"
             [href]="APP_STORE_URL"
             target="_blank"
             rel="noopener noreferrer"
             (click)="analytics.downloadClick('header')">
            {{ i18n.t('حمّل الآن', 'Get the App') }}
          </a>
        </div>
        <span class="nav__progress" aria-hidden="true"></span>
      </div>
    </nav>
  `,
})
export class HeaderComponent {
  i18n = inject(I18n);
  readonly analytics = inject(GoogleAnalyticsService);
  readonly APP_SHORT_NAME = APP_SHORT_NAME;
  /** The ": Photo Cleaner" tail, split off so CSS can drop it on narrow screens
   *  where the full name would wrap and double the navbar's height. */
  readonly APP_NAME_SUFFIX = APP_NAME.slice(APP_SHORT_NAME.length);
  readonly APP_STORE_URL = APP_STORE_URL;
  readonly scrolled = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 12);
  }
}
