import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { I18n } from '../services/i18n';

/**
 * "Get it on Google Play" badge in a coming-soon state (the Android build isn't
 * live yet). Non-interactive by design — it's a status marker, not a link — with
 * an inline Google-Play SVG (no external asset, CSP-safe) and a "Soon" chip.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-googleplay-badge',
  standalone: true,
  template: `
    <span class="store-badge store-badge--soon" role="img"
          [attr.aria-label]="i18n.t('قريبًا على Google Play', 'Coming soon to Google Play')">
      <svg class="store-badge__logo" viewBox="0 0 512 512" aria-hidden="true">
        <path fill="#00C3FF" d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0z"/>
        <path fill="#FF3D44" d="M325.3 234.3 104.6 13l280.8 161.2-60.1 60.1z"/>
        <path fill="#FFCE00" d="M472.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8z"/>
        <path fill="#00E676" d="M104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
      </svg>
      <span class="store-badge__text">
        <small>{{ i18n.t('احصل عليه من', 'Get it on') }}</small>
        <strong>Google&nbsp;Play</strong>
      </span>
      <span class="store-badge__soon">{{ i18n.t('قريبًا', 'Soon') }}</span>
    </span>
  `,
})
export class GooglePlayBadgeComponent {
  i18n = inject(I18n);
}
