import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18n } from '../services/i18n';
import { RevealDirective } from '../directives/reveal';

/**
 * Before / after storage illustration.
 *
 * Mirrors the Settings ▸ iPhone Storage bar people already recognise. The
 * "after" row's segments start at the "before" widths and shrink once the block
 * scrolls in, so the point lands without a caption having to make it.
 *
 * Explicitly labelled as an example: the split is a plausible 128 GB phone, not
 * a measured result, and **only the Photos band moves** — showing apps or system
 * shrinking would claim something the app does not do.
 *
 * Lives on /download, below the pitch and above the store badge.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-storage-bar',
  imports: [RevealDirective],
  host: { class: 'stobar-host' },
  template: `
    <div class="stobar" appReveal>
      <div class="stobar__card">
        <div class="stobar__head">
          <span class="stobar__when">{{ i18n.t('اليوم', 'Today') }}</span>
          <b class="stobar__used">{{ USED_BEFORE }} GB <span>{{ i18n.t('من', 'of') }}</span> {{ CAPACITY }} GB</b>
        </div>
        <div class="stobar__track">
          @for (seg of before; track seg.key) {
            <span class="stobar__seg" [style.--w.%]="seg.pct" [style.background]="seg.color"></span>
          }
        </div>
      </div>

      <!-- The delta is derived from the two figures above it, not a new claim. -->
      <p class="stobar__delta">
        <b>−{{ USED_BEFORE - USED_AFTER }} GB</b>
        <span>{{ i18n.t('يمكن تحريرها', 'Can be freed') }}</span>
      </p>

      <div class="stobar__card stobar__card--after">
        <div class="stobar__head">
          <span class="stobar__when">{{ i18n.t('بعد CleanSpace', 'After CleanSpace') }}</span>
          <b class="stobar__used">{{ USED_AFTER }} GB <span>{{ i18n.t('من', 'of') }}</span> {{ CAPACITY }} GB</b>
        </div>
        <div class="stobar__track">
          @for (seg of after; track seg.key) {
            <span class="stobar__seg" [style.--w.%]="seg.pct" [style.--w0.%]="seg.from"
                  [style.background]="seg.color"></span>
          }
        </div>
        <ul class="stobar__legend">
          @for (seg of after; track seg.key) {
            <li><i [style.background]="seg.color"></i>{{ i18n.t(seg.ar, seg.en) }}</li>
          }
        </ul>
      </div>

      <p class="stobar__claim">
        <span class="stobar__dot" aria-hidden="true"></span>
        {{ i18n.t('١٠٠٪ على جهازك — بلا رفع ولا حساب', '100% on-device — no uploads, no account') }}
      </p>
      <p class="stobar__note">
        {{ i18n.t('مثال توضيحي على آيفون ١٢٨ غيغابايت؛ النتيجة تختلف حسب مكتبتك.',
                  'Illustrative example on a 128 GB iPhone; your result depends on your own library.') }}
      </p>
    </div>
  `,
})
export class StorageBarComponent {
  readonly i18n = inject(I18n);

  readonly CAPACITY = 128;
  readonly USED_BEFORE = 118;
  readonly USED_AFTER = 94;

  /**
   * The split as percentages of the device. Only `photos` differs between the
   * two rows, and the two `pct` columns sum to USED_BEFORE and USED_AFTER.
   */
  private static readonly SPLIT = [
    { key: 'photos', ar: 'الصور', en: 'Photos', color: '#E5533D', pct: 48.4, after: 29.7 },
    { key: 'apps', ar: 'التطبيقات', en: 'Apps', color: '#F0A32B', pct: 21.9, after: 21.9 },
    { key: 'media', ar: 'الوسائط', en: 'Media', color: '#2DBE7E', pct: 12.5, after: 12.5 },
    { key: 'cloud', ar: 'السحابة', en: 'Cloud', color: '#35A7E8', pct: 4.7, after: 4.7 },
    { key: 'system', ar: 'النظام', en: 'System', color: '#9AA3AF', pct: 4.7, after: 4.7 },
  ];

  readonly before = StorageBarComponent.SPLIT;
  /** `from` seeds the width the bar animates *out of* when it scrolls into view. */
  readonly after = StorageBarComponent.SPLIT.map((s) => ({ ...s, from: s.pct, pct: s.after }));
}
