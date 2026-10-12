import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { I18n } from '../services/i18n';
import { prefersReducedMotion } from '../directives/motion';

type Phase = 'idle' | 'scan' | 'clean' | 'done';

/**
 * Before / after storage illustration, played as a short clean-up.
 *
 * Mirrors the Settings ▸ iPhone Storage bar people already recognise. When the
 * block scrolls into view the "after" bar starts identical to "today" and:
 *  1. scan  — a light sweeps the Photos band ("Scanning…")
 *  2. clean — the Photos band shrinks while little squares lift off it, the
 *             used figure counts 118 → 94 GB and the delta counts up to 24 GB;
 *             the space it gives back lights up green inside the track
 *  3. done  — a check by the label, and a replay button
 *
 * Explicitly an example: the split is a plausible 128 GB phone, not a measured
 * result, and **only the Photos band moves** — showing apps or system shrinking
 * would claim something the app does not do.
 *
 * Lives on /download, below the pitch.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-storage-bar',
  host: { class: 'stobar-host' },
  template: `
    <div class="stobar" #root [attr.data-phase]="phase()">
      <div class="stobar__card">
        <div class="stobar__head">
          <span class="stobar__when">{{ i18n.t('اليوم', 'Today') }}</span>
          <b class="stobar__used"><bdi dir="ltr">{{ USED_BEFORE }} GB</bdi> <span>{{ i18n.t('من', 'of') }}</span> <bdi dir="ltr">{{ CAPACITY }} GB</bdi></b>
        </div>
        <div class="stobar__track">
          @for (seg of before; track seg.key) {
            <span class="stobar__seg" [style.--w.%]="seg.pct" [style.background]="seg.color"></span>
          }
        </div>
      </div>

      <!-- The delta is derived from the two figures around it, not a new claim. -->
      <p class="stobar__delta">
        <b>{{ deltaShown() ? '−' + deltaShown() : 0 }} GB</b>
        <span>{{ i18n.t('يمكن تحريرها', 'Can be freed') }}</span>
      </p>

      <div class="stobar__card stobar__card--after">
        <div class="stobar__head">
          <span class="stobar__when">
            @if (phase() === 'done') {
              <span class="stobar__check" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M20 6.5 9.4 17 4 11.6" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>
            }
            {{ i18n.t('بعد CleanSpace', 'After CleanSpace') }}
          </span>
          <b class="stobar__used"><bdi dir="ltr">{{ usedShown() }} GB</bdi> <span>{{ i18n.t('من', 'of') }}</span> <bdi dir="ltr">{{ CAPACITY }} GB</bdi></b>
        </div>
        <!-- The bar is wrapped so the lifting squares can leave the track
             while the bands themselves stay clipped to its rounded ends. -->
        <div class="stobar__bar">
          <div class="stobar__track stobar__track--after">
            @for (seg of after; track seg.key) {
              <span class="stobar__seg" [class.stobar__seg--photos]="seg.key === 'photos'"
                    [style.--w.%]="seg.pct" [style.--w0.%]="seg.from" [style.background]="seg.color"></span>
            }
            <!-- The space the clean-up hands back, lit green where it now sits. -->
            <span class="stobar__freed" [style.--start.%]="freeBefore" [style.--size.%]="freedPct" aria-hidden="true"></span>
            <span class="stobar__sweep" aria-hidden="true"></span>
          </div>
          <span class="stobar__bits" aria-hidden="true">
            @for (b of bits; track $index) { <i [style.--x.%]="b.x" [style.--d.ms]="b.d" [style.--r.deg]="b.r"></i> }
          </span>
        </div>
        <div class="stobar__foot">
          <ul class="stobar__legend">
            @for (seg of after; track seg.key) {
              <li><i [style.background]="seg.color"></i>{{ i18n.t(seg.ar, seg.en) }}</li>
            }
          </ul>
          <span class="stobar__status" aria-live="polite">
            @switch (phase()) {
              @case ('scan') { {{ i18n.t('جارٍ الفحص…', 'Scanning…') }} }
              @case ('clean') { {{ i18n.t('جارٍ التنظيف…', 'Cleaning…') }} }
              @case ('done') {
                <button type="button" class="stobar__replay" (click)="play()">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.6-5.9" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M20 4v4.6h-4.6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  {{ i18n.t('أعد التشغيل', 'Replay') }}
                </button>
              }
            }
          </span>
        </div>
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
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

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
  /** `from` seeds the width the bar animates *out of*. */
  readonly after = StorageBarComponent.SPLIT.map((s) => ({ ...s, from: s.pct, pct: s.after }));

  /** Where the newly freed space sits in the track once the bands have closed up. */
  readonly freeBefore = Math.round(((this.CAPACITY - this.USED_BEFORE) / this.CAPACITY) * 1000) / 10;
  readonly freedPct = Math.round(((this.USED_BEFORE - this.USED_AFTER) / this.CAPACITY) * 1000) / 10;

  /** Little squares that lift off the Photos band while it shrinks. */
  readonly bits = Array.from({ length: 12 }, (_, i) => ({
    x: 4 + ((i * 37) % 40),          // spread across the Photos band
    d: (i * 97) % 900,               // staggered over the clean phase
    r: ((i * 53) % 60) - 30,
  }));

  /** Rendered (and prerendered) as the finished state; the browser rewinds and plays it. */
  readonly phase = signal<Phase>('done');
  readonly usedShown = signal(this.USED_AFTER);
  readonly deltaShown = signal(this.USED_BEFORE - this.USED_AFTER);

  private timers: number[] = [];
  private raf = 0;

  constructor() {
    afterNextRender(() => {
      const win = this.doc.defaultView;
      if (!win || prefersReducedMotion(this.doc) || typeof IntersectionObserver === 'undefined') return;
      // Rewind before the block is ever seen, then play once it is.
      this.rewind();
      const io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          io.disconnect();
          this.play();
        },
        { threshold: 0.45 },
      );
      io.observe(this.root().nativeElement);
      this.destroyRef.onDestroy(() => {
        io.disconnect();
        this.clear();
      });
    });
  }

  private rewind(): void {
    this.clear();
    this.phase.set('idle');
    this.usedShown.set(this.USED_BEFORE);
    this.deltaShown.set(0);
  }

  play(): void {
    const win = this.doc.defaultView;
    if (!win) return;
    this.rewind();
    // Let the rewound widths paint before the next phase transitions them.
    this.later(60, () => this.phase.set('scan'));
    this.later(1300, () => {
      this.phase.set('clean');
      this.countUp(1400);
    });
    this.later(2900, () => this.phase.set('done'));
  }

  /** Counts used 118 → 94 and the delta 0 → 24 together, over `ms`. */
  private countUp(ms: number): void {
    const win = this.doc.defaultView!;
    const total = this.USED_BEFORE - this.USED_AFTER;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / ms);
      const done = Math.round(total * (1 - Math.pow(1 - t, 3)));
      this.deltaShown.set(done);
      this.usedShown.set(this.USED_BEFORE - done);
      if (t < 1) this.raf = win.requestAnimationFrame(tick);
    };
    this.raf = win.requestAnimationFrame(tick);
  }

  private later(ms: number, fn: () => void): void {
    this.timers.push(this.doc.defaultView!.setTimeout(fn, ms));
  }

  private clear(): void {
    const win = this.doc.defaultView;
    this.timers.forEach((t) => win?.clearTimeout(t));
    this.timers = [];
    if (this.raf) win?.cancelAnimationFrame(this.raf);
  }
}
