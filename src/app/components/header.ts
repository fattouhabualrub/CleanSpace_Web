import { Component, inject, signal, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18n } from '../services/i18n';
import { LanguagePickerComponent } from './language-picker';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header',
  imports: [RouterLink, LanguagePickerComponent],
  template: `
    <a class="skip-link" href="#main-content">{{ i18n.t('تخطَّ إلى المحتوى', 'Skip to content') }}</a>
    <nav class="nav" [class.nav--scrolled]="scrolled()">
      <div class="container nav__inner">
        <a class="brand" routerLink="/" [attr.aria-label]="i18n.t('كلين سبيس — الصفحة الرئيسية', 'CleanSpace — home')">
          <span class="brand__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path transform="translate(12.8 14.2) scale(1.097) translate(-12 -8.6)" d="M12 2.4c.55 4.35 1.85 5.65 6.2 6.2-4.35.55-5.65 1.85-6.2 6.2-.55-4.35-1.85-5.65-6.2-6.2 4.35-.55 5.65-1.85 6.2-6.2Z"/>
              <path transform="translate(7.3 8.8) scale(0.597) translate(-12 -8.6)" d="M12 2.4c.55 4.35 1.85 5.65 6.2 6.2-4.35.55-5.65 1.85-6.2 6.2-.55-4.35-1.85-5.65-6.2-6.2 4.35-.55 5.65-1.85 6.2-6.2Z"/>
              <path transform="translate(14.8 5.2) scale(0.387) translate(-12 -8.6)" d="M12 2.4c.55 4.35 1.85 5.65 6.2 6.2-4.35.55-5.65 1.85-6.2 6.2-.55-4.35-1.85-5.65-6.2-6.2 4.35-.55 5.65-1.85 6.2-6.2Z"/>
            </svg>
          </span> CleanSpace
        </a>
        <div class="nav__links">
          <a routerLink="/" fragment="features">{{ i18n.t('الميزات', 'Features') }}</a>
          <a routerLink="/" fragment="plans">{{ i18n.t('الأسعار', 'Plans') }}</a>
          <a routerLink="/support">{{ i18n.t('الدعم', 'Support') }}</a>
          <a routerLink="/privacy">{{ i18n.t('الخصوصية', 'Privacy') }}</a>
          <a routerLink="/terms">{{ i18n.t('الشروط', 'Terms') }}</a>
        </div>
        <div class="nav__actions">
          <app-language-picker />
          <a class="btn btn--primary"
             href="https://apps.apple.com/jo/app/cleanspace-storage-photos/id6790139624"
             target="_blank"
             rel="noopener noreferrer">
            {{ i18n.t('حمّل الآن', 'Get the App') }}
          </a>
        </div>
      </div>
    </nav>
  `,
})
export class HeaderComponent {
  i18n = inject(I18n);
  readonly scrolled = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 12);
  }
}
