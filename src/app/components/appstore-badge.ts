import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { I18n } from '../services/i18n';
import { APP_STORE_URL } from '../services/app-links';
import { GoogleAnalyticsService } from '../core/services/google-analytics.service';

/**
 * Official "Download on the App Store" badge, localized.
 *
 * The artwork is Apple's own SVG from their Marketing Resources — their identity
 * guidelines don't permit redrawing it, which the previous hand-built pill did.
 * One file per UI language lives in public/badges, plus a white variant of each:
 * Apple's black badge is for light backgrounds and the white one for dark, and
 * both are shipped so the theme toggle can swap them in CSS. A `<picture>` would
 * only follow the OS media query and would ignore a manual theme choice.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-appstore-badge',
  standalone: true,
  template: `
    <a class="appstore-badge"
       [href]="APP_STORE_URL"
       target="_blank"
       rel="noopener noreferrer"
       (click)="onClick()"
       [attr.aria-label]="alt()">
      <img class="appstore-badge__img appstore-badge__img--black"
           [src]="src()" [alt]="alt()" width="120" height="40" loading="lazy">
      <img class="appstore-badge__img appstore-badge__img--white"
           [src]="srcWhite()" [alt]="alt()" width="120" height="40" loading="lazy" aria-hidden="true">
    </a>
  `,
})
export class AppStoreBadgeComponent {
  private readonly i18n = inject(I18n);
  private readonly analytics = inject(GoogleAnalyticsService);

  /** Where on the site this badge sits — becomes the GA `placement` param. */
  readonly placement = input<string>('unknown');

  readonly APP_STORE_URL = APP_STORE_URL;

  /** Apple badge artwork is not bundled yet for the four new locales. Keep a
   *  valid official English badge instead of requesting a missing image. */
  private readonly badgeLang = computed(() =>
    ['ko', 'pl', 'vi', 'zh-Hant'].includes(this.i18n.lang()) ? 'en' : this.i18n.lang()
  );

  readonly src = computed(() => `badges/appstore-${this.badgeLang()}.svg`);
  readonly srcWhite = computed(() => `badges/appstore-${this.badgeLang()}-white.svg`);

  /** Apple's required wording; the badge art itself carries the localized text. */
  alt(): string {
    return this.i18n.t('حمّله على App Store', 'Download on the App Store');
  }

  onClick(): void {
    this.analytics.downloadClick(this.placement());
  }
}
