import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { I18n } from '../services/i18n';
import { APP_STORE_URL } from '../services/app-links';
import { GoogleAnalyticsService, type GtagParams } from '../core/services/google-analytics.service';

/**
 * Official "Download on the App Store" badge, localized.
 *
 * The artwork is Apple's own SVG from their Marketing Resources — their identity
 * guidelines don't permit redrawing it, which the previous hand-built pill did.
 * One file per UI language lives in public/badges, plus a white variant of each.
 *
 * Apple's rules (developer.apple.com/app-store/marketing/guidelines):
 * - The black badge is the preferred one. The white "alternative" badge may be used
 *   only when it is the single badge in the layout — never next to another
 *   platform's badge. `tone="black"` pins the preferred badge for those layouts;
 *   the default lets the theme toggle swap in the white one on dark pages.
 * - Clear space is a quarter of the badge height; minimum height is 40 px.
 * - The badge must not be modified, angled or animated (no hover lift/shadow).
 *
 * A `<picture>` would only follow the OS media query and would ignore a manual
 * theme choice, so both images are shipped and CSS shows one.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-appstore-badge',
  standalone: true,
  host: { '[class.appstore-badge-host--lg]': "size() === 'lg'" },
  template: `
    <a class="appstore-badge"
       [class.appstore-badge--black]="tone() === 'black'"
       [href]="link()"
       [attr.target]="newTab() ? '_blank' : null"
       [attr.rel]="newTab() ? 'noopener noreferrer' : 'noopener'"
       (click)="onClick()"
       [attr.aria-label]="alt()">
      <img class="appstore-badge__img appstore-badge__img--black"
           [src]="src()" [alt]="alt()" width="120" height="40" [attr.loading]="eager() ? null : 'lazy'">
      <img class="appstore-badge__img appstore-badge__img--white"
           [src]="srcWhite()" [alt]="alt()" width="120" height="40" [attr.loading]="eager() ? null : 'lazy'" aria-hidden="true">
    </a>
  `,
})
export class AppStoreBadgeComponent {
  private readonly i18n = inject(I18n);
  private readonly analytics = inject(GoogleAnalyticsService);

  /** Where on the site this badge sits — becomes the GA `placement` param. */
  readonly placement = input<string>('unknown');
  /** Store link to use instead of the plain one (e.g. an App Store Connect campaign link). */
  readonly href = input<string | null>(null);
  /** Open in a new tab. Off on /download, where the visitor should go straight to the store. */
  readonly newTab = input(true);
  /** 'auto' follows the page theme; 'black' pins Apple's preferred badge. */
  readonly tone = input<'auto' | 'black'>('auto');
  /** 'md' = the site's standard 52 px; 'lg' = 60 px for the page whose whole job is this tap. */
  readonly size = input<'md' | 'lg'>('md');
  /** Load the artwork right away (above-the-fold badges). */
  readonly eager = input(false);
  /** Extra GA4 params for the click, e.g. campaign token and in-app browser. */
  readonly extra = input<GtagParams | undefined>(undefined);

  readonly link = computed(() => this.href() || APP_STORE_URL);

  /** Every UI language has its own artwork; zh-Hant uses Apple's Traditional
   *  Chinese (Taiwan) badge. */
  readonly src = computed(() => `badges/appstore-${this.i18n.lang()}.svg`);
  readonly srcWhite = computed(() => `badges/appstore-${this.i18n.lang()}-white.svg`);

  /** Apple's required wording; the badge art itself carries the localized text. */
  alt(): string {
    return this.i18n.t('حمّله على App Store', 'Download on the App Store');
  }

  onClick(): void {
    this.analytics.downloadClick(this.placement(), 'click', this.extra());
  }
}
