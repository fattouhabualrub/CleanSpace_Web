import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { I18n } from '../services/i18n';

/**
 * Google Play badge in a coming-soon state — the Android build isn't published.
 *
 * Official Google artwork, localized, but deliberately NOT a link: there is no
 * listing to point at yet. It stays a non-interactive image with the status said
 * in words above it, so the meaning survives for screen readers and for anyone
 * who can't read the dimmed styling as "not yet".
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-googleplay-badge',
  standalone: true,
  template: `
    <span class="gplay">
      <span class="gplay__soon">{{ shortLabel() }}</span>
      <span class="gplay__badge" role="img" [attr.aria-label]="ariaLabel()">
        <img class="gplay__img" [src]="src()" alt="" width="646" height="192" loading="lazy">
      </span>
    </span>
  `,
})
export class GooglePlayBadgeComponent {
  private readonly i18n = inject(I18n);

  /** Keep a valid official English badge where localized artwork is not bundled. */
  readonly src = computed(() => {
    const lang = this.i18n.lang();
    const badgeLang = ['ckb', 'ko', 'pl', 'vi', 'zh-Hant'].includes(lang) ? 'en' : lang;
    return `badges/gplay-${badgeLang}.png`;
  });

  /** Kept short: a longer line makes this column wider than the badge, which
   *  shoves the pair of badges off-centre in the row. The badge itself already
   *  says "Google Play". */
  shortLabel(): string {
    return this.i18n.t('قريبًا', 'Coming soon');
  }

  /** The image is decorative, so this spells the whole thing out for a reader
   *  that never sees the badge art. */
  ariaLabel(): string {
    return this.i18n.t('قريبًا على Google Play', 'Coming soon to Google Play');
  }
}
