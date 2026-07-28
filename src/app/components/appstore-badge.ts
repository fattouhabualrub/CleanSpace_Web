import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { I18n } from '../services/i18n';
import { APP_STORE_URL } from '../services/app-links';

/** Self-contained "Download on the App Store" badge (inline Apple-logo SVG). */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-appstore-badge',
  standalone: true,
  template: `
    <a class="store-badge"
       [href]="APP_STORE_URL"
       target="_blank"
       rel="noopener noreferrer"
       [attr.aria-label]="i18n.t('حمّل من App Store', 'Download on the App Store')">
      <svg class="store-badge__logo" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.51 4.09l-.02-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
      </svg>
      <span class="store-badge__text">
        <small>{{ i18n.t('حمّله على', 'Download on the') }}</small>
        <strong>App&nbsp;Store</strong>
      </span>
    </a>
  `,
})
export class AppStoreBadgeComponent {
  i18n = inject(I18n);
  readonly APP_STORE_URL = APP_STORE_URL;
}
